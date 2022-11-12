const fs = require('fs')
const crypt = require('../utils/crypt');
const decrypt = require('../utils/decrypt');


module.exports = class Compte {

    constructor(id, compteId, value, type) {
        this.id = id;
        this.compteId = compteId;
        this.value = value;
        this.type = type;
    }

    create(request, response, { actionFile }) {
        try {

            fs.readFile(actionFile, 'utf8', (err, data) => {
                if (err) throw err;
                // decrypt data
                const dataDecrypted = decrypt(data)

                // transforme data string to array
                const dataArray = dataDecrypted.split('\n').map(res => JSON.parse(res))

                // create a new compte
                const actionData = {
                    id: this.id,
                    compteId: this.compteId,
                    value: this.value,
                    type: this.type,
                    createdAt: new Date(),
                }

                const newDataArray = [...dataArray, actionData]

                // data stringified
                const dataStringified = newDataArray.map(data => {
                    return JSON.stringify(data)
                }).join('\n')

                // data crypted
                const dataCrypted = crypt(dataStringified)

                // write new data to the clientFile
                fs.writeFile(actionFile, dataCrypted, 'utf8', (err) => {
                    if (err) throw err;
                    // response.send("data saved successfully")
                    return console.log("action created successfully");
                });
            })

        } catch (error) {
            res.status(400).send(error)
        }
    }

    depot(request, response, { compteFile }) {
        try {

            fs.readFile(compteFile, 'utf8', (err, data) => {
                if (err) throw err;
                // decrypt data
                const dataDecrypted = decrypt(data)

                // transforme data string to array
                const dataArray = dataDecrypted.split('\n').map(res => JSON.parse(res))

                // create a new compte
                const compteData = {
                    id: this.id,
                    userId: this.userId,
                    sold: this.sold,
                    createdAt: new Date(),
                }

                // verify if user exist
                const existingCompte = dataArray?.filter(user => user?.id === request.id)[0]

                if (!existingCompte) {
                    return response.status(404).send("this compte does not exist")
                }

                const createADepot = dataArray.map(compt => compt.id === request.id ? { ...compt, sold: compt.sold + request.body.value } : compt)

                // const newDataArray = [...dataArray, compteData]

                // data stringified
                const dataStringified = createADepot.map(data => {
                    return JSON.stringify(data)
                }).join('\n')

                // data crypted
                const dataCrypted = crypt(dataStringified)

                // write new data to the clientFile
                fs.writeFile(compteFile, dataCrypted, 'utf8', (err) => {
                    if (err) throw err;
                    response.send("data saved successfully")
                });
            })

        } catch (error) {
            res.status(400).send(error)
        }
    }

    retrait(response, clientFile) {

    }
}
