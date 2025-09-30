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

    async verifyEmail({ email, code }: { email: string; code: string }) {
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f4f4f4;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    
                    <!-- Header -->
                    <div style="background-color: #EE3638; color: #ffffff; padding: 30px; text-align: center;">
                        <h1 style="margin: 0; font-size: 24px;">Verify Your Email</h1>
                    </div>
                    
                    <!-- Body -->
                    <div style="padding: 40px; color: #333333;">
                        <h2 style="color: #EE3638; margin-top: 0;">Welcome to LabFry!</h2>
                        <p style="line-height: 1.6;">Thank you for signing up. Please verify your email address using the code below:</p>
                        
                        <!-- Code Box -->
                        <div style="background-color: #f8f9fa; border: 2px dashed #EE3638; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
                            <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #EE3638; font-family: 'Courier New', monospace;">
                                ${code}
                            </div>
                        </div>
                        
                        <p style="line-height: 1.6;">Enter this code on the verification page to activate your account.</p>
                        
                        <!-- Security Notice -->
                        <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
                            <strong>⚠️ Security Notice:</strong> If you didn't create an account, please ignore this email.
                        </div>
                    </div>
                    
                    <!-- Footer -->
                    <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #666666; font-size: 14px;">
                        <p style="margin: 5px 0;">This is an automated message, please do not reply to this email.</p>
                        <p style="margin: 5px 0;">&copy; 2025 LabFry. All rights reserved.</p>
                    </div>
                    
                </div>
            </body>
            </html>
        `;

        return await this.transporter.sendMail({
            from: 'LabFry <mdpahlovi.se@gmail.com>',
            to: [email],
            subject: 'Verify Your Email - LabFry',
            html: html,
        });
    }

    async resetPassword({ email, code }: { email: string; code: string }) {
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f4f4f4;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    
                    <!-- Header -->
                    <div style="background-color: #EE3638; color: #ffffff; padding: 30px; text-align: center;">
                        <h1 style="margin: 0; font-size: 24px;">Reset Your Password</h1>
                    </div>
                    
                    <!-- Body -->
                    <div style="padding: 40px; color: #333333;">
                        <h2 style="color: #EE3638; margin-top: 0;">Password Reset Request</h2>
                        <p style="line-height: 1.6;">We received a request to reset your password. Use the verification code below to proceed:</p>
                        
                        <!-- Code Box -->
                        <div style="background-color: #f8f9fa; border: 2px dashed #EE3638; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
                            <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #EE3638; font-family: 'Courier New', monospace;">
                                ${code}
                            </div>
                        </div>
                        
                        <p style="line-height: 1.6;">Enter this code on the password reset page to create a new password.</p>
                        
                        <!-- Security Notice -->
                        <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
                            <strong>⚠️ Security Notice:</strong> If you didn't request a password reset, your account may be at risk. Please secure your account immediately.
                        </div>
                        
                        <p style="margin-top: 20px; line-height: 1.6;"><strong>For your security:</strong></p>
                        <ul style="line-height: 1.8;">
                            <li>Never share this code with anyone</li>
                            <li>Our team will never ask for this code</li>
                            <li>This code expires in 15 minutes</li>
                        </ul>
                    </div>
                    
                    <!-- Footer -->
                    <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #666666; font-size: 14px;">
                        <p style="margin: 5px 0;">This is an automated message, please do not reply to this email.</p>
                        <p style="margin: 5px 0;">&copy; 2025 LabFry. All rights reserved.</p>
                    </div>
                    
                </div>
            </body>
            </html>
        `;

        return await this.transporter.sendMail({
            from: 'LabFry <mdpahlovi.se@gmail.com>',
            to: [email],
            subject: 'Reset Your Password - LabFry',
            html: html,
        });
    }
}
