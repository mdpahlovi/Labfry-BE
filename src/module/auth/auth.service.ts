import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { BcryptService } from 'src/common/bcrypt.service';
import { EmailService } from 'src/common/email.service';
import { JwtService } from 'src/common/jwt.service';
import { PrismaService } from 'src/common/prisma.service';
import { GenerateCode } from 'src/utils/utils';
import { ForgotPasswordDto, ResetPasswordDto, SigninDto, SignupComplete, SignupDto, VerifyEmailDto } from './auth.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly bcryptService: BcryptService,
        private readonly emailService: EmailService,
        private readonly jwtService: JwtService,
        private readonly prismaService: PrismaService,
    ) {}

    async signup(signupDto: SignupDto) {
        const { firstName, lastName, email, password, role } = signupDto;

        const user = await this.prismaService.user.findUnique({
            where: {
                email,
            },
        });

        if (user && user.verified) {
            throw new BadRequestException('User already exists');
        }

        const hashedPassword = await this.bcryptService.hashPassword(password);

        const code = await this.prismaService.$transaction(async (tx) => {
            const user = await tx.user.upsert({
                where: { email },
                update: { firstName, lastName, password: hashedPassword, role },
                create: { firstName, lastName, email, password: hashedPassword, role },
            });

            const code = await tx.code.upsert({
                where: {
                    email_purpose: {
                        email,
                        purpose: 'VERIFY_EMAIL',
                    },
                },
                update: {
                    code: GenerateCode(),
                    expiresAt: new Date(Date.now() + 60 * 60 * 1000),
                },
                create: {
                    userId: user.id,
                    email,
                    code: GenerateCode(),
                    purpose: 'VERIFY_EMAIL',
                    expiresAt: new Date(Date.now() + 60 * 60 * 1000),
                },
            });

            return code;
        });

        await this.emailService.verifyEmail({ email, code: code.code });

        return {
            message: 'User created successfully',
        };
    }

    async signin(signinDto: SigninDto) {
        const { email, password } = signinDto;

        const user = await this.prismaService.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (!(await this.bcryptService.comparePassword(password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (!user.verified) {
            throw new BadRequestException('Please verify your email before login');
        }

        return {
            message: 'User signed in successfully',
            data: this.jwtService.generateToken(user),
        };
    }

    async verifyEmail(verifyEmailDto: VerifyEmailDto) {
        const { email, code, purpose } = verifyEmailDto;

        const verifyCode = await this.prismaService.code.findUnique({
            where: {
                email_purpose: {
                    email,
                    purpose,
                },
            },
        });

        if (!verifyCode) {
            throw new BadRequestException('Invalid verification code');
        }

        if (verifyCode.code !== code) {
            throw new BadRequestException('Invalid verification code');
        }

        if (verifyCode.expiresAt < new Date()) {
            throw new BadRequestException('Verification code has expired');
        }

        if (verifyCode.consumedAt) {
            throw new BadRequestException('Verification code has already been used');
        }

        await this.prismaService.$transaction(async (tx) => {
            await tx.user.update({
                where: {
                    email,
                },
                data: {
                    verified: true,
                },
            });

            await tx.code.update({
                where: {
                    id: verifyCode.id,
                },
                data: {
                    consumedAt: new Date(),
                },
            });
        });

        return {
            message: 'Email verified successfully',
        };
    }

    async signupComplete(signupCompleteDto: SignupComplete) {
        const { email } = signupCompleteDto;

        const code = await this.prismaService.code.findUnique({
            where: {
                email_purpose: {
                    email,
                    purpose: 'VERIFY_EMAIL',
                },
            },
        });

        if (!code || !code.consumedAt) {
            throw new BadRequestException('Please verify your email first');
        }

        const user = await this.prismaService.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            throw new BadRequestException('User not found!');
        }

        await this.prismaService.code.delete({
            where: {
                id: code.id,
            },
        });

        return {
            message: 'User signed in successfully',
            data: this.jwtService.generateToken(user),
        };
    }

    async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
        const { email } = forgotPasswordDto;

        const user = await this.prismaService.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            throw new BadRequestException('User not found');
        }

        const code = await this.prismaService.code.upsert({
            where: {
                email_purpose: {
                    email,
                    purpose: 'PASSWORD_RESET',
                },
            },
            update: {
                code: GenerateCode(),
                expiresAt: new Date(Date.now() + 60 * 60 * 1000),
            },
            create: {
                userId: user.id,
                email,
                code: GenerateCode(),
                purpose: 'PASSWORD_RESET',
                expiresAt: new Date(Date.now() + 60 * 60 * 1000),
            },
        });

        await this.emailService.resetPassword({ email, code: code.code });

        return {
            message: 'Password reset email sent successfully',
        };
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        const { email, password } = resetPasswordDto;

        const code = await this.prismaService.code.findUnique({
            where: {
                email_purpose: {
                    email,
                    purpose: 'PASSWORD_RESET',
                },
            },
        });

        if (!code || !code.consumedAt) {
            throw new BadRequestException('Please verify your email first!');
        }

        const user = await this.prismaService.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            throw new BadRequestException('User not found!');
        }

        await this.prismaService.$transaction(async (tx) => {
            await tx.user.update({
                where: {
                    email,
                },
                data: {
                    password: await this.bcryptService.hashPassword(password),
                },
            });

            await tx.code.delete({
                where: {
                    id: code.id,
                },
            });
        });

        return {
            message: 'Password reset successfully',
        };
    }
}
