import { Module } from "@nestjs/common";
import { AuthController } from "src/controllers/auth.controller";
import { AuthProvider } from "src/providers/auth.provider";
import { AuthRepository } from "src/repositories/auth.repository";
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MailService } from "src/providers/email.provider";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module(
    {
        imports: [
            JwtModule.registerAsync
            ({
                useFactory: (config: ConfigService) => {
                    return {
                      secret: config.get<string>('JWT_SECRET'),
                      signOptions: {
                        expiresIn: config.get<string | number>('JWT_EXPIRATION_TIME'),
                      },
                    };
                  },
                  inject: [ConfigService],
              },
              ),
        ],
        controllers: [AuthController],
        providers: [AuthProvider,AuthRepository,MailService ],
        exports: []
    }
)
export class AuthModule{}