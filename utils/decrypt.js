const crypto = require('crypto');

function decrypt(data) {
    //necessary item to decrypt the file
    const algorithm = 'aes256';
    const password = 'l5JmP+G0/1zB%;r8B8?2?2pcqGcL^3';

    const decipher = crypto.createDecipher(algorithm, password);
    let dec = decipher.update(data, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}

module.exports = decrypt