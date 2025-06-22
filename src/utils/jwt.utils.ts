import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET!;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET!;

// A function to sign a new Access Token
export function signAccessToken(payload: object){
    return jwt.sign(payload,accessTokenSecret,{expiresIn:'15m'});
}

// A function to sign a new Refresh Token
export function signRefreshToken(payload:object){
    return jwt.sign(payload,refreshTokenSecret,{expiresIn:'7d'});
}

// A function to verify a token
export function verifyToken(token: string,secret:string){
    try{
        const decoded = jwt.verify(token,secret);
        return {valid:true,expired:false,decoded};
    } catch(err: any){
        return{
            valid:false,
            expired: err.message==='jwt expired',
            decoded: null,
        };
    }
}