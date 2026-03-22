const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

/**
 * Generate a new TOTP secret for MFA
 */
async function generateTOTPSecret(userEmail) {
  const secret = speakeasy.generateSecret({
    name: `SevenLinkIT (${userEmail})`,
    issuer: 'SevenLinkIT',
    length: 32
  });

  // Generate QR code
  const qrCode = await QRCode.toDataURL(secret.otpauth_url);

  return {
    secret: secret.base32,
    qrCode: qrCode,
    backupCodes: generateBackupCodes()
  };
}

/**
 * Verify TOTP token
 */
function verifyTOTPToken(secret, token) {
  return speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token,
    window: 2
  });
}

/**
 * Generate backup codes for account recovery
 */
function generateBackupCodes(count = 10) {
  const codes = [];
  for (let i = 0; i < count; i++) {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    codes.push(code);
  }
  return codes;
}

module.exports = {
  generateTOTPSecret,
  verifyTOTPToken,
  generateBackupCodes
};