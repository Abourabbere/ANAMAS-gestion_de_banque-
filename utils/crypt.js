const crypto = require('crypto');

function crypt(data) {
    //necessary item to decrypt the file
    const algorithm = 'aes256';
    const password = 'l5JmP+G0/1zB%;r8B8?2?2pcqGcL^3';

    const cipher = crypto.createCipher(algorithm, password);
    let crypted = cipher.update(data, 'utf8', 'hex');
    return crypted += cipher.final('hex');
}

module.exports = crypt