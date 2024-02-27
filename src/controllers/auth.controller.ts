import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { BaseResponse } from "src/dto/base.dto";
import { UserDto } from "src/dto/user.dto";
import { AuthProvider } from "src/providers/auth.provider";

@Controller('auth')
export class AuthController {
     
    constructor(
        private readonly _authPvd: AuthProvider
    ){}

    @Post('/signUp')
    @UsePipes(ValidationPipe)
    async registerUser(@Body() user: UserDto){
       return await this._authPvd.registerUser(user); 
    }

    @Post('login')
    async login(){
        return "Login Successfull!"
    }

    @Get('verify/:verificationToken')
    async verify(@Param('verificationToken') verificationToken : string): Promise<BaseResponse>{
        const response = new BaseResponse();
        if(!verificationToken){
          response.isSuccess = false;
          response.error = "Verification token can't be null!";
          return response;
        }

        return await this._authPvd.verifyUser(verificationToken);
    }

}