import { BadRequestException, Injectable } from '@nestjs/common';
import { BcryptService } from 'src/common/bcrypt.service';
import { JwtService } from 'src/common/jwt.service';
import { PrismaService } from 'src/common/prisma.service';
import { GenerateCode } from 'src/utils/utils';
import { ResetPasswordDto, SigninDto, SignupDto, VerifyEmailDto } from './auth.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly bcryptService: BcryptService,
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

        if (user) {
            throw new BadRequestException('User already exists');
        }

        await this.prismaService.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    firstName,
                    lastName,
                    email,
                    password: await this.bcryptService.hashPassword(password),
                    role,
                },
            });

            const code = await tx.code.create({
                data: {
                    userId: user.id,
                    email,
                    code: GenerateCode(),
                    purpose: 'VERIFY_EMAIL',
                    expiresAt: new Date(Date.now() + 60 * 60 * 1000),
                },
            });

            return { user, code };
        });
    }

    async signin(signinDto: SigninDto) {}

    async verifyEmail(verifyEmailDto: VerifyEmailDto) {}

    async resetPassword(resetPasswordDto: ResetPasswordDto) {}
}
