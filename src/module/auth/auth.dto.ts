import { UserRole } from '@prisma/client';

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

export class VerifyEmailDto {
    email: string;
    code: string;
}

export class ResetPasswordDto {
    password: string;
}
