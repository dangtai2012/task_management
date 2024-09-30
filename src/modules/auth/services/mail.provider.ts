import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { AuthConfig, authConfig } from 'src/config';

@Injectable()
export class MailProvider {
  private transporter: nodemailer.Transporter;

  constructor(
    /**
     * : Inject service
     */

    private readonly authConfigService: AuthConfig,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.authConfigService.getEmailUser(),
        pass: this.authConfigService.getEmailPassword(),
      },
    });
  }

  async sendEmail(url: string, email: string, subject: string, token: string) {
    const mailOptions = {
      from: this.authConfigService.getEmailUser(),
      to: email,
      subject: subject,
      html: `Click <a href="${url}">here</a> to confirm your account.`,
    };

    return await this.transporter.sendMail(mailOptions);
  }
}
