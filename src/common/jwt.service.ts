import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
    constructor(private readonly configService: ConfigService) {}

    generateToken(user: User) {
        const payload = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        };

        const accToken = jwt.sign(payload, this.configService.get('jwtSecret')!, {
            expiresIn: '1h',
        });

        const refToken = jwt.sign(payload, this.configService.get('jwtSecret')!, {
            expiresIn: '7d',
        });

        return { user: payload, accToken, refToken };
    }
}
