const fs = require('fs')
const Buffer = require('buffer')
const crypto = require('crypto');
var path = "./test/message.txt"
const path2 = "./banque/clients.txt"
const path3 = "./banque/actions.txt"

module.exports.create = (req, res) => {
    fs.readFile(path2, 'utf8', (err, data) => {
        if (err) throw err;

        //necessary item to decrypt the file
        const algorithm = 'aes256';
        const password = 'l5JmP+G0/1zB%;r8B8?2?2pcqGcL^3';

        const decipher = crypto.createDecipher(algorithm, password);
        let dec = decipher.update(data, 'hex', 'utf8');
        dec += decipher.final('utf8');

        // transforme data strimg to array
        const arr = dec.split('\n').map(res => JSON.parse(res))

        res.status(200).send(arr)
    })

    // const arr = [
    //     {
    //         doc_id: "ty23j423-562tyt23-d332255-et643y23-kj4hhj53"
    //     }
    // ]

    // const arr2 = arr.map(data => {
    //     return JSON.stringify(data)
    // })

    // // const data = new Uint8Array(Buffer.Buffer.from('Hello Node.js'));

    // const data = arr2.join('\n')

    // // cryptage du fichier
    // const algorithm = 'aes256';
    // const password = 'l5JmP+G0/1zB%;r8B8?2?2pcqGcL^3';
    // const cipher = crypto.createCipher(algorithm, password);
    // let crypted = cipher.update(data, 'utf8', 'hex');
    // crypted += cipher.final('hex');
    // fs.writeFile(path2, crypted, 'utf8', (err) => {
    //     if (err) throw err;
    //     console.log('The file has been saved!');
    //     res.send("data saved successfully")
    // });
}