import { Global, Module } from '@nestjs/common';
import { BcryptService } from './bcrypt.service';
import { EmailService } from './email.service';
import { JwtService } from './jwt.service';
import { PrismaService } from './prisma.service';

@Global()
@Module({
    providers: [BcryptService, EmailService, JwtService, PrismaService],
    exports: [BcryptService, EmailService, JwtService, PrismaService],
})
export class CommonModule {}
