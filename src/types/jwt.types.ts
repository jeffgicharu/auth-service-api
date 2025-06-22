import { JwtPayload } from "jsonwebtoken";

export interface DecodedJwtPayload extends JwtPayload{
    userId: string;
}