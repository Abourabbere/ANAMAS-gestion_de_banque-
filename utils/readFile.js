const fs = require('fs');
const decrypt = require('./decrypt');

function readFile(path) {
    fs.readFile(`./banque/${path}`, 'utf8', (err, data) => {
        if (err) throw err;

        // crypt data
        const dataCrypted = decrypt(data)
        // transforme data strimg to array
        const dataArray = dataCrypted.split('\n').map(res => JSON.parse(res))
        
        return dataArray
    })
}

module.exports = readFile