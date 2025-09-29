/* eslint-disable */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor(private readonly config: ConfigService) {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: this.config.get('emailUser'),
                pass: this.config.get('emailPass'),
            },
        });
    }

    async verifyEmail({ email, verifyToken }: { email: string; verifyToken: string }) {
        const verifyUrl = `${this.config.get('origin')}/verify/${verifyToken}`;

        return await this.transporter.sendMail({
            from: 'Clicklio <mdpahlovi07@gmail.com>',
            to: [email],
            subject: 'Verify Your Clicklio Account',
            html: `
            <!doctype html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Verify Your Clicklio Account</title>
                    <style>
                        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

                        body {
                            margin: 0;
                            padding: 0;
                            font-family: "Inter", Arial, sans-serif;
                            background-color: #f4f4f4;
                        }
                        .email-container {
                            max-width: 600px;
                            margin: 0 auto;
                            background-color: #ffffff;
                        }
                        .header {
                            background-color: #4882ed;
                            padding: 30px 20px;
                            text-align: center;
                        }
                        .logo {
                            font-size: 32px;
                            font-weight: bold;
                            color: #ffffff;
                            text-decoration: none;
                            letter-spacing: 1px;
                        }
                        .content {
                            padding: 40px 30px;
                        }
                        .greeting {
                            font-size: 24px;
                            color: #333333;
                            margin-bottom: 20px;
                            font-weight: 600;
                        }
                        .message {
                            font-size: 16px;
                            color: #666666;
                            line-height: 1.6;
                            margin-bottom: 30px;
                        }
                        .verify-button {
                            display: inline-block;
                            background-color: #4882ed;
                            color: #ffffff !important;
                            text-decoration: none;
                            padding: 6px 32px;
                            border-radius: 99px;
                            font-size: 14px;
                            font-weight: bold;
                            line-height: 24px;
                            text-align: center;
                            transition: background-color 0.3s ease;
                        }
                        .verify-button:hover {
                            background-color: #3a6bc7;
                        }
                        .alternative-text {
                            font-size: 14px;
                            color: #888888;
                            margin-top: 30px;
                            padding-top: 20px;
                            border-top: 1px solid #eeeeee;
                        }
                    </style>
                </head>
                <body>
                    <table
                        role="presentation"
                        width="100%"
                        cellpadding="0"
                        cellspacing="0"
                        border="0"
                        style="background-color: #f4f4f4; padding: 20px 0"
                    >
                        <tr>
                            <td align="center">
                                <table class="email-container" role="presentation" width="600" cellpadding="0" cellspacing="0" border="0">
                                    <!-- Header -->
                                    <tr>
                                        <td class="header">
                                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                                <tr>
                                                    <td align="center">
                                                        <a href="#" class="logo">Clicklio</a>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>

                                    <!-- Main Content -->
                                    <tr>
                                        <td class="content">
                                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                                <tr>
                                                    <td>
                                                        <div class="greeting">Welcome to Clicklio! 🎨</div>
                                                        <div class="message">
                                                            Thank you for signing up for Clicklio, your new virtual collaborative whiteboard platform!
                                                            We're excited to have you join our creative community.
                                                            <br /><br />
                                                            To complete your registration and start collaborating on amazing projects, please verify
                                                            your email address by clicking the button below:
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td align="center" style="padding: 20px 0">
                                                        <a href="${verifyUrl}" class="verify-button"> Verify Email Address </a>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div class="alternative-text">
                                                            If the button above doesn't work, copy and paste the following link into your browser:
                                                            <br />
                                                            <span style="color: #4882ed; word-break: break-all">${verifyUrl}</span>
                                                            <br /><br />
                                                            This verification link will expire in 1 hour for security reasons.
                                                            <br /><br />
                                                            If you didn't create an account with Clicklio, you can safely ignore this email.
                                                        </div>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
            </html>
            `,
        });
    }
}
