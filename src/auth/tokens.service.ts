/* eslint-disable prettier/prettier */

import { Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"

export type UserProfile ={
    id:string, 
    correo:string,
    nombre:string
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
            secret: "supersecret"
        })
    }

    async generateRefresh(userId:string):Promise<string>{
        return this.jwtService.signAsync({
            sub: userId,
            type: "refresh"
        },{
            expiresIn: "7d",
            secret: "supersecret"
        })
    }

    async verifyAccess(token:string):Promise<AccessPayload>{
        const payload=await this.jwtService.verifyAsync<AccessPayload>(token,{
            secret: "supersecret"
        });
        if(payload.type!=="access"){
            throw new Error("Invalid token type");
        }
        return payload;
    }
    async verifyRefresh(token:string):Promise<RefreshPayload>{
        const payload=await this.jwtService.verifyAsync<RefreshPayload>(token,{
            secret: "supersecret"
        });
        if(payload.type!=="refresh"){
            throw new Error("Invalid token type");
        }
        return payload;
    }
}