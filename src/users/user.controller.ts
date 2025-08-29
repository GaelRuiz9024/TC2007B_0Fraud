/* eslint-disable prettier/prettier */

import { Body, Controller, Post } from "@nestjs/common";
import { UserDto, UserService } from "./user.service";

export type CreateUserDto={
    email: string;
    name: string;
    password: string;
}

@Controller("users")
export class UserController{
    constructor(private readonly userService: UserService) {}

    @Post()
    async registerUser(@Body() userDto: CreateUserDto): Promise<UserDto|void> {
        return this.userService.registerUser(userDto.email, userDto.name, userDto.password);
    }

}
