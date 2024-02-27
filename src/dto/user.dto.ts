import { IsEmail, IsNotEmpty, Length } from "class-validator";
import { BaseResponse } from "./base.dto";

export class UserDto{
    @IsNotEmpty()
    @IsEmail()
    email: string;
    @IsNotEmpty()
    @Length(8)
    password: string;
}

export class MailSentDto{
    to: string;
    mailContext: any;
}