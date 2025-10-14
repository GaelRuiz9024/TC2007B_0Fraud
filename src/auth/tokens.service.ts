/* eslint-disable prettier/prettier */

import { Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"

export type UserProfile ={
    id:string, 
    correo:string,
    nombre:string
    idRol: number; 
}

export type AccessPayload={
    sub:string,
    type:"access",
    profile: UserProfile
}

export type RefreshPayload={
    sub:string,
    type:"refresh",
}
const JWT_SECRET= process.env.JWT_SECRET;
@Injectable()
export class TokenService{
    constructor (private readonly jwtService: JwtService) {}
    async generateAccess(profile:UserProfile): Promise<string>{
        return this.jwtService.signAsync({
            sub: profile.id,
            type: "access",
            profile: profile
        },{
            expiresIn: "1m",
            secret: JWT_SECRET
        })
    }

    async generateRefresh(userId:string):Promise<string>{
        return this.jwtService.signAsync({
            sub: userId,
            type: "refresh"
        },{
            expiresIn: "7d",
            secret: JWT_SECRET 
        })
    }

    async verifyAccess(token:string):Promise<AccessPayload>{
        const payload=await this.jwtService.verifyAsync<AccessPayload>(token,{
            secret: JWT_SECRET
        });
        if(payload.type!=="access"){
            throw new Error("Invalid token type");
        }
        return payload;
    }
    async verifyRefresh(token:string):Promise<RefreshPayload>{
        const payload=await this.jwtService.verifyAsync<RefreshPayload>(token,{
            secret: JWT_SECRET
        });
        if(payload.type!=="refresh"){
            throw new Error("Invalid token type");
        }
        return payload;
    }
}