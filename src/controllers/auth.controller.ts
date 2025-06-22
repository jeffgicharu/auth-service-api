import { Request, Response } from "express";
import { LoginSchema, loginUser, RegisterSchema, registerUser } from "../services/auth.service.js";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { signAccessToken, verifyToken } from "../utils/jwt.utils.js";
import { DecodedJwtPayload } from "../types/jwt.types.js";
import argon2 from 'argon2';

export async function registerHandler(req: Request, res: Response): Promise<void> {
    try {
        // Validate request body
        const validatedData = RegisterSchema.parse(req.body);

        // Call the service
        const user = await registerUser(validatedData);

        // Send success response
        res.status(201).json({
            message: 'User created successfully',
            user,
        });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ message: 'Invalid input', errors: error.errors });
            return;
        }
        if (error.message === 'User with this email already exists') {
            res.status(409).json({ message: error.message });
            return;
        }
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export async function loginHandler(req: Request, res: Response): Promise<void> {
    try {
        const validatedData = LoginSchema.parse(req.body);
        const { accessToken, refreshToken } = await loginUser(validatedData);

        // Set the refresh token as a secure, httpOnly cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true, // The cookie is not accessible via client side Javascript
            secure: process.env.NODE_ENV === 'production', //Only send over HTTPS in production
            path: '/', // Make the cookie available on all pages
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        });

        // Send the access token in the response body
        res.status(200).json({
            message: "Login successful",
            accessToken,
        });
        return;
    } catch (error: any) {
        if (error.message === "Invalid email or password") {
            res.status(401).json({ message: error.message });
            return;
        }
        if (error instanceof z.ZodError) {
            res.status(400).json({ message: "Invalid input", errors: error.errors });
            return;
        }
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
}

export async function getMeHandler(req: Request, res: Response): Promise<void> {
    // The user object is attached by the authenticateToken middleware
    const user = (req as any).user;
    res.status(200).json({ user });
    return;
}

const prisma = new PrismaClient();

export async function refreshHandler(req: Request, res: Response): Promise<void> {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        res.status(401).json({ message: 'Refresh token not found' });
        return;
    }

    // Verify the refresh token
    const { decoded } = verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET!);

    if (!decoded || !(decoded as DecodedJwtPayload).userId) {
        res.status(403.).json({message:'Inavlid refresh token'});
        return;
    }

    // Find all active sessions for the user
    const userSessions = await prisma.session.findMany({
        where: {userId:(decoded as DecodedJwtPayload).userId},
    });

    if(!userSessions.length){
        res.status(403).json({message:'Session not found. Please log in again'});
        return;
    }

    // Loop through the sessions and find the one that matches the token
    let validSession:{id:string,tokenHash:string} | null = null;
    for(const session of userSessions){
        const isTokenValid = await argon2.verify(session.tokenHash,refreshToken);
        if(isTokenValid){
            validSession = session;
            break;
        }
    }

    if(!validSession){
        res.status(403).json({message: 'Invalid session. Please log in again'});
        return;
    }

    // Issue a new access token
    const newAccessToken = signAccessToken({userId:(decoded as DecodedJwtPayload).userId});

    res.status(200).json({accessToken:newAccessToken});
    return;
}