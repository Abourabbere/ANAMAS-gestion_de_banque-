const fs = require('fs')
const crypt = require('../utils/crypt');
const decrypt = require('../utils/decrypt');
const Compte = require('./compte.classes')
const generator = require('generate-serial-number');

module.exports = class Client {

    constructor(id, username, tel, password) {
        this.id = id;
        this.username = username;
        this.tel = tel;
        this.password = password;
    }

    create(response, clientFile, compteFile) {
        try {
            // client filename
            // const clientFile = `./banque/clients.txt`

            fs.readFile(clientFile, 'utf8', (err, data) => {
                if (err) throw err;

                // decrypt data
                const dataDecrypted = decrypt(data)

                // transforme data string to array
                const dataArray = dataDecrypted.split('\n').map(res => JSON.parse(res))

                const userData = {
                    id: this.id,
                    username: this.username,
                    tel: this.tel,
                    password: this.password
                }

                // verify if user exist
                const existingUser = dataArray?.filter(user => user?.tel === userData?.tel)[0]

                if (existingUser) {
                    return response.status(404).send("this user exist")
                }

                const newDataArray = [...dataArray, userData]

                // data stringified
                const dataStringified = newDataArray.map(data => {
                    return JSON.stringify(data)
                }).join('\n')

                // data crypted
                const dataCrypted = crypt(dataStringified)

                // write new data to the clientFile
                fs.writeFile(clientFile, dataCrypted, 'utf8', (err) => {
                    if (err) throw err;

                    const compte = new Compte(generator.generate(20), this.id, 0)
                    compte.create(response, compteFile)
                    response.send("data saved successfully")
                });
            })

        } catch (error) {
            res.status(400).send(error)
        }
    }
}
