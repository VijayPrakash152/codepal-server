import { BadRequestException, Injectable } from "@nestjs/common";
import { User } from "src/models/user.entity";
import { AuthRepository } from "src/repositories/auth.repository";
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from "src/dto/user.dto";
import { BaseResponse } from "src/dto/base.dto";
import { MailService } from "./email.provider";

@Injectable()
export class AuthProvider {

    constructor(private readonly mailService: MailService,private readonly _authRepo: AuthRepository,private readonly jwtService: JwtService){}

    async registerUser(user: UserDto): Promise<BaseResponse>{
        const response = new BaseResponse();

        // Checking if user already exists
        const userLinkedToEmail = await this._authRepo.findUserByEmail(user.email);
        if(userLinkedToEmail){
            response.isSuccess = false;
            response.error = "User already exists!";
            return response;
        }

        // Create a new user

        const userToCreate = new User();
        userToCreate.email = user.email;
        userToCreate.password = await this.hashPassword(user.password);

        const registerUserRes =  await this._authRepo.registerUser(userToCreate);
        if(!registerUserRes || !registerUserRes.userId){
             response.isSuccess = false;
             response.error = "Unabe to register user!";
        }
        return await this.sendVerificationMail(user.email,registerUserRes.userId);
    }

    async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
      }

    createJwt(userId: number, email: string): string {
        const payload = { userId, email };
        return this.jwtService.sign(payload);
      }
      
     async verifyUser(verificationToken: string): Promise<BaseResponse> {
          const response = new BaseResponse();
          const isTokenValid = this.jwtService.verify(verificationToken);
          if(!isTokenValid){
            response.isSuccess = false;
            response.error = "Invalid token!"
            return response;
          }
         const decodedToken = this.jwtService.decode(verificationToken);
         const user = await this._authRepo.findUserById(decodedToken.userId);
         if(!user){
            response.error = "User doesn't exists!";
            response.isSuccess = false;
            return response;
         } 
          
        if(user.isVerified){
            response.isSuccess = true;
            response.message = "User already verified!";
            return response;
        }

        return await this._authRepo.updateUserById(user.userId);

     } 

     async sendVerificationMail(email:string,userId: number): Promise<BaseResponse>{
         const response = new BaseResponse();
     try {
        const verificationToken  = this.jwtService.sign({userId, email});
        const link = "http://localhost:5011/auth/verify/" + verificationToken;
  
        await this.mailService.sendMail({
          to: email,
          mailContext: {
            link
          },
        });
        response.isSuccess = true;
        return response;
      } catch (error) {
        response.isSuccess = false;
        return response;
      }
     }

    

}