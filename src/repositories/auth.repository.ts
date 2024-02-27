import { Injectable } from "@nestjs/common";
import { BaseResponse } from "src/dto/base.dto";
import { User } from "src/models/user.entity";

@Injectable()
export class AuthRepository {
   constructor(){}

   async registerUser(user: User): Promise<User| null>{  
      try {
           const registeredUser = await user.save();
           return registeredUser;
        } catch (error) {
                  
        }
        return null;

   }

   async findUserByEmail(email: string): Promise<User>{
     const user = await User.findOne({ where: { email}});
     return user;
   }

   async findUserById(userId: number): Promise<User>{
      const user = await User.findOne({ where: {userId}});
      return user;
   }

   async updateUserById(userId: number) : Promise<BaseResponse> {
      const response = new BaseResponse();
      try {
        await User.update(userId,
            { isVerified: true }
        );
        response.isSuccess = true;
        response.message = "User verified successfully!";
      } catch (error) {
         response.isSuccess = false;
         response.error = "User verification failed!";
      }
      
      return response;
   }
}