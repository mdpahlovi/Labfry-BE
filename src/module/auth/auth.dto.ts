/* eslint-disable @typescript-eslint/no-unsafe-call */
import { CodePurpose, UserRole } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignupDto {
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    role: UserRole;
}

export class SigninDto {
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}

export class SignupComplete {
    @IsString()
    @IsNotEmpty()
    email: string;
}
export class VerifyEmailDto {
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    code: string;

    @IsString()
    @IsNotEmpty()
    purpose: CodePurpose;
}

export class ForgotPasswordDto {
    @IsString()
    @IsNotEmpty()
    email: string;
}

export class ResetPasswordDto {
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
