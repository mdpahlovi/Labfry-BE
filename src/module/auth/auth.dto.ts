import { CodePurpose, UserRole } from '@prisma/client';

export class SignupDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: UserRole;
}

export class SigninDto {
    email: string;
    password: string;
}

export class SignupComplete {
    email: string;
}
export class VerifyEmailDto {
    email: string;
    code: string;
    purpose: CodePurpose;
}

export class ForgotPasswordDto {
    email: string;
}

export class ResetPasswordDto {
    email: string;
    password: string;
}
