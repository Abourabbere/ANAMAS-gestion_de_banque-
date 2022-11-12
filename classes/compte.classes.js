const fs = require('fs')
const crypt = require('../utils/crypt');
const decrypt = require('../utils/decrypt');
const Action = require('./action.classes')
const generator = require('generate-serial-number');

module.exports = class Compte {
    constructor(id, userId, sold) {
        this.id = id;
        this.userId = userId;
        this.sold = sold;
    }

    create(response, compteFile) {
        try {
            // client filename
            // const clientFile = `./banque/clients.txt`

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
                const existingCompte = dataArray?.filter(user => user?.id === compteData?.id)[0]

                if (existingCompte) {
                    return response.status(404).send("this compte exist")
                }

                const newDataArray = [...dataArray, compteData]

                // data stringified
                const dataStringified = newDataArray.map(data => {
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
                const existingCompte = dataArray?.filter(user => user?.id === request.params.id)[0]

                if (!existingCompte) {
                    return response.status(404).send("this compte does not exist")
                }

                const createADepot = dataArray.map(compt => compt.id === request.params.id ? { ...compt, sold: compt.sold + request.body.value } : compt)

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

                    const newAction = new Action(generator.generate(20), request.params.id, request.body.value, "depot")
                    newAction.create(request, response, { actionFile: "./banque/actions.txt" })

                    response.send("depot successfully")
                });
            })

        } catch (error) {
            res.status(400).send(error)
        }
    }

    retrait(request, response, { compteFile }) {

        try {

            fs.readFile(compteFile, 'utf8', (err, data) => {
                if (err) throw err;
                // decrypt data
                const dataDecrypted = decrypt(data)

                // transforme data string to array
                const dataArray = dataDecrypted.split('\n').map(res => JSON.parse(res))

                // verify if compt exist
                const existingCompte = dataArray?.filter(compt => compt?.id === request.params.id)[0]

                if (!existingCompte) {
                    return response.status(404).send("this compte does not exist")
                }

                // verify if debit sold less than the current sold
                if (existingCompte.sold < request.body.value) {
                    return response.status(400).send("le montant demander n'existe pas")
                }

                const createADepot = dataArray.map(compt => compt.id === request.params.id ? { ...compt, sold: compt.sold - request.body.value } : compt)

                // data stringified
                const dataStringified = createADepot.map(data => {
                    return JSON.stringify(data)
                }).join('\n')

                // data crypted
                const dataCrypted = crypt(dataStringified)

                // write new data to the clientFile
                fs.writeFile(compteFile, dataCrypted, 'utf8', (err) => {
                    if (err) throw err;

                    const newAction = new Action(generator.generate(20), request.params.id, request.body.value, "retrait")
                    newAction.create(request, response, { actionFile: "./banque/actions.txt" })

                    response.send("retrait successfully")
                });
            })

        } catch (error) {
            res.status(400).send(error)
        }
    }

    virement(request, response, { compteFile }) {
        try {

            fs.readFile(compteFile, 'utf8', (err, data) => {
                if (err) throw err;
                // decrypt data
                const dataDecrypted = decrypt(data)

                // transforme data string to array
                const dataArray = dataDecrypted.split('\n').map(res => JSON.parse(res))

                // get compt sender and receiver
                const existingSenderCompte = dataArray?.filter(compt => compt?.id === request.params.senderId)[0]
                const existingReceiverCompte = dataArray?.filter(compt => compt?.id === request.params.receiverId)[0]

                // verify if compts exist
                if (!existingSenderCompte || !existingReceiverCompte) {
                    return response.status(404).send("this compte does not exist")
                }

                // verify if debit sold less than the current sold
                if (existingSenderCompte.sold < request.body.value) {
                    return response.status(400).send("le montant demander n'existe pas")
                }

                const sender = {
                    ...existingSenderCompte,
                    sold: existingSenderCompte.sold - request.body.value
                }

                const receiver = {
                    ...existingReceiverCompte,
                    sold: existingReceiverCompte.sold + request.body.value
                }

                const createADepot = dataArray.map(compt => compt.id === request.params.senderId ? sender : compt.id === request.params.receiverId ? receiver : compt)

                // data stringified
                const dataStringified = createADepot.map(data => {
                    return JSON.stringify(data)
                }).join('\n')

                // data crypted
                const dataCrypted = crypt(dataStringified)

                // write new data to the clientFile
                fs.writeFile(compteFile, dataCrypted, 'utf8', (err) => {
                    if (err) throw err;

                    const newAction = new Action(generator.generate(20), request.params.senderId + '-' + request.params.receiverId, request.body.value, "virement")
                    newAction.create(request, response, { actionFile: "./banque/actions.txt" })

                    response.send("virement successfully")
                });
            })

        } catch (error) {
            res.status(400).send(error)
        }
    }
}
