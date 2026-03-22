const express = require('express');
const QRCode = require('qrcode');
const { authenticator } = require('otplib');

const router = express.Router();

// Middleware for error handling
function errorHandler(err, req, res, next) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
}

// Initialize backup codes array
let backupCodes = [];

// Endpoint to setup MFA and generate TOTP secret
router.post('/auth/mfa/setup', async (req, res) => {
    try {
        const secret = authenticator.generateSecret();
        const otpauth = authenticator.keyuri(req.body.username, 'YourAppName', secret);

        // Generate QR code
        const qrCode = await QRCode.toDataURL(otpauth);
        res.status(200).json({ secret, qrCode });
    } catch (err) {
        next(err);
    }
});

// Endpoint to verify TOTP token
router.post('/auth/mfa/verify', (req, res) => {
    const { token, secret } = req.body;
    const valid = authenticator.check(token, secret);

    if (valid) {
        res.status(200).json({ message: 'Token is valid' });
    } else {
        res.status(401).json({ error: 'Invalid token' });
    }
});

// Endpoint to retrieve backup codes
router.get('/auth/backup-codes', (req, res) => {
    if (backupCodes.length === 0) {
        // Generate 10 backup codes
        backupCodes = Array.from({ length: 10 }, () => Math.floor(100000 + Math.random() * 900000).toString());
    }
    res.status(200).json({ backupCodes });
});

router.use(errorHandler);

module.exports = router;