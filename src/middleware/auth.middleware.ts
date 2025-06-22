import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const accessTokenSecret=process.env.ACCESS_TOKEN_SECRET!;

// This function will verify the access token and attach the user to the request
export function authenticateToken(req:Request,res:Response,next:NextFunction):void{
    const authHeader=req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if(!token){
        res.status(401).json({message:'Access token is required'});
        return;
    }

    jwt.verify(token,accessTokenSecret,(err:any,user:any)=>{
        if(err){
            // if token is expired or invalid
            res.status(403).json({message: 'Invalid or expired token'});
            return;
        }
        // Attach user to the request object
        (req as any).user=user;
        next(); // Proceed to the next middleware or route handler
    });
}