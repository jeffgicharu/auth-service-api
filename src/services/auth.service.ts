import { PrismaClient } from "@prisma/client";
import argon2 from 'argon2';
import { z } from "zod";
import { signAccessToken, signRefreshToken } from "../utils/jwt.utils.js";

const prisma = new PrismaClient();

// Define the shape of the data for registration
export const RegisterSchema=z.object({
    email: z.string().email(),
    password: z.string().min(8),
    firstName: z.preprocess(
        (val) => (val===""? undefined: val),
        z.string().min(2,{message: "First name must be at least 2 characters"}).optional()
    ),
    lastName: z.preprocess(
        (val)=>(val===""?undefined:val),
        z.string().min(2,{message: "Last name must be at least 2 characters"}).optional()
    ),
});


// Define a type for our registration input
type RegisterInput = z.infer<typeof RegisterSchema>;

export async function registerUser(input: RegisterInput){
    const {email,password,firstName,lastName} = input;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where:{email}
    });

    if(existingUser){
        throw new Error('User with this email already exists');
    }

    // Hash Password
    const hashedPassword = await argon2.hash(password);

    // Create user in the database
    const user=await prisma.user.create({
        data:{
            email,
            password: hashedPassword,
            firstName,
            lastName
        },
        // Never return the password
        select: {id:true,email:true,firstName:true,lastName:true,createdAt:true},
    });

    return user;
}

export const LoginSchema=z.object({
    email: z.string().email(),
    password: z.string(),
});

type LoginInput=z.infer<typeof LoginSchema>;

export async function loginUser(input: LoginInput){
    const {email,password}=input;

    // Find user by email
    const user=await prisma.user.findUnique({where:{email}});

    if(!user){
        throw new Error("Invalid email or password");
    }

    // Verify password
    const isPasswordValid=await argon2.verify(user.password,password);

    if(!isPasswordValid){
        throw new Error("Invalid email or password");
    }

    // Token Generation if a user is successfully authenticated
    const payload = {userId: user.id};

    // Create access and refresh tokens
    const accessToken=signAccessToken(payload);
    const refreshToken=signRefreshToken(payload);

    const refreshTokenHash= await argon2.hash(refreshToken);

    // Store the refresh token in the database
    await prisma.session.create({
        data:{
            userId: user.id,
            tokenHash:refreshTokenHash,
        },
    });

    return {accessToken,refreshToken};
}