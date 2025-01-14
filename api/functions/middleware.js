const secretKey = "google key"
const request = require('request');

async function googleRecapcha(req, res) {
    if (req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) return res.send({
        msg: "เหะยืนยันพลาด ร.. หรือว่านายเป็นหุ่นยนต์!?", code: 0
    });
    const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;

    request(verificationURL, (error, x, body) => {
        try {
            body = JSON.parse(body);
        } catch (e) {
            return res.send({ msg: "เกิดข้อผิดพลาดบางอย่างโปรดลองใหม่อีกครั้ง", code: 0 });
        }
        if (body.success !== undefined && body.success === false) {
            return res.send({ msg: "เหะยืนยันพลาด ร.. หรือว่านายเป็นหุ่นยนต์!?", code: 0 });
        }
    });
}

module.exports = { googleRecapcha }