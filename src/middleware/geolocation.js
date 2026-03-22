const geoip = require('geoip-lite');

const geolocationAccessControl = (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const geo = geoip.lookup(ip);

    if (geo && geo.country === 'CA') {
        console.log(`Access granted for IP: ${ip} - Location: Canada`);
        next(); // Allow access
    } else {
        console.log(`Access denied for IP: ${ip} - Location: ${geo ? geo.country : 'Unknown'}`);
        res.status(403).send('Access denied. Only users from Canada are allowed.'); // Block access
    }
};

module.exports = geolocationAccessControl;