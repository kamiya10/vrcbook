export interface Require2FA {
  requiresTwoFactorAuth: ('totp' | 'otp' | 'emailotp')[];
};
