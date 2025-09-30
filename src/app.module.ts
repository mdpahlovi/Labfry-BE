import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { BcryptService } from 'src/common/bcrypt.service';
import { EmailService } from 'src/common/email.service';
import { JwtService } from 'src/common/jwt.service';
import { PrismaService } from 'src/common/prisma.service';
import { AuthModule } from 'src/module/auth/auth.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService, BcryptService, EmailService, JwtService, PrismaService],
})
export class AppModule {}
