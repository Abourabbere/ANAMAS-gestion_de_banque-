const fs = require('fs')
const path = require('path')
const { uuid } = require('uuidv4');
const createFolder = require('../utils/createFolder');
const crypt = require('../utils/crypt');
const decrypt = require('../utils/decrypt');
const generator = require('generate-serial-number');
const Client = require('../classes/client.classes')
const Compte = require('../classes/compte.classes')
const Action = require('../classes/action.classes')


module.exports.list = (req, res) => {
    fs.readFile(`./banque/${req.params.file}.txt`, 'utf8', (err, data) => {
        if (err) throw err;

        //necessary item to decrypt the file
        const dec = decrypt(data)

        // transforme data strimg to array
        const arr = dec.split('\n').map(res => JSON.parse(res))

        res.status(200).send(arr)
    })
}

module.exports.create = (req, res) => {

    const { username, tel, password } = req.body

    try {

        // client filename
        const clientFile = `./banque/clients.txt`

        // compte filename
        const comptetFile = `./banque/comptes.txt`

        const client = new Client(generator.generate(20), username, tel, password)

        client.create(res, clientFile, comptetFile)

    } catch (error) {
        res.status(400).send(error)
    }

}

module.exports.depot = (req, res) => {

    // compte filename
    const comptetFile = `./banque/comptes.txt`

    const compte = new Compte()

    compte.depot(req, res, { compteFile: comptetFile })

}

module.exports.retrait = (req, res) => {
    // compte filename
    const comptetFile = `./banque/comptes.txt`

    const compte = new Compte()

    compte.retrait(req, res, { compteFile: comptetFile })
}

module.exports.virement = (req, res) => {
    // compte filename
    const comptetFile = `./banque/comptes.txt`

    const compte = new Compte()

    compte.virement(req, res, { compteFile: comptetFile })
}