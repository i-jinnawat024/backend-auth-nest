export interface IMailService {
  sendEmailVerification(email: string, token: string): Promise<void>;
  sendPasswordReset(email: string, token: string): Promise<void>;
}

export const MAIL_SERVICE = Symbol('IMailService');