const forge = require('node-forge');
const jwt = require('jsonwebtoken');
const crypto = require('crypto')
const config = require('../config')

var networkUtil = module.exports

const pki = forge.pki;

function getAesKey(privateKeyPem, data, label) {
    const privateKey = pki.privateKeyFromPem(privateKeyPem);
    const decrypted = privateKey.decrypt(forge.util.decode64(data), 'RSA-OAEP', {
        md: forge.md.sha256.create(),
        mgf1: {
            md: forge.md.sha256.create()
        },
        label: label
    })
    return forge.util.encode64(decrypted)
}

function getToken(method, url, body) {
    const iat = Math.floor(Date.now() / 1000);
    const exp = Math.floor(Date.now() / 1000) + 1800;

    let content = method + url
    if (body) {
        content = content + body
    }
    let payload = {
        uid: config.client_id,
        sid: config.session_id,
        iat: iat,
        exp: exp,
        jti: uuidv4(),
        sig: crypto.createHash('sha256').update(content).digest("hex")
    };
    return jwt.sign(payload, config.privateKey, {algorithm: 'RS512'});
}

uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

networkUtil.getAesKey = getAesKey
networkUtil.getToken = getToken

