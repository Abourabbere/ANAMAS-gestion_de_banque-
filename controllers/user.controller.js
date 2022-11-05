const fs = require('fs')
const path = require('path')
const { uuid } = require('uuidv4');
const createFolder = require('../utils/createFolder')

module.exports.create = (req, res) => {

    // const { username, tel, password, montant, depot, retrait, virement } = req.body

    try {
        const data = {
            id: "11bf5b37-e0b8-42e0-8dcf-dc8c4yi88",
            username: "Alla Mbaye",
            tel: "77 855 55 99",
            password: "passer123",
            montant: 0,
            depot: [],
            retrait: [],
            virement: [],
        }

        const folder = 'banque'
        createFolder(folder)

        const filename = data.username.toLowerCase().split(' ').join('') + '_' + data.tel.split(' ').join('')

        fs.writeFileSync(`./${folder}/${filename}.json`, JSON.stringify(data))

        res.status(201).send('file created successfully :' + data.id)

    } catch (error) {
        res.status(400).send(error)
    }

}

module.exports.depot = (req, res) => {
    const { file } = req.params
    const folder = 'banque'

    try {


        fs.readFile(`./${folder}/${file}.json`, (err, data) => {
            if (err) {
                return res.status(404).send("this file does not exist")
            }

            const dataParser = JSON.parse(data)
            const date = new Date()
            const depot = {
                id: "1",
                value: 2000,
                date: date,
            }

            const newData = {
                ...dataParser,
                montant: dataParser.montant + depot.value,
                depot: [...dataParser.depot, depot]
            }

            console.log(newData);

            fs.writeFileSync(`./${folder}/${file}.json`, JSON.stringify(newData))

            res.status(200).send("depot successfully" + dataParser.id)
        })
    } catch (error) {
        res.status(400).send(error)
    }
}

module.exports.retrait = (req, res) => {
    const { file } = req.params
    const folder = 'banque'

    try {


        fs.readFile(`./${folder}/${file}.json`, (err, data) => {
            if (err) {
                return res.status(404).send("this file does not exist")
            }

            const dataParser = JSON.parse(data)
            const date = new Date()
            const retrait = {
                id: "1",
                value: 500,
                date: date,
            }

            if ((dataParser.montant - retrait.value) < 0) {
                return res.status(200).send("vous n'avez pas asser de font - " + dataParser.montant)
            }

            const newData = {
                ...dataParser,
                montant: dataParser.montant - retrait.value,
                retrait: [...dataParser.retrait, retrait]
            }

            console.log(newData);

            fs.writeFileSync(`./${folder}/${file}.json`, JSON.stringify(newData))

            res.status(200).send("retrait successfully - " + dataParser.id)
        })
    } catch (error) {
        res.status(400).send(error)
    }
}

module.exports.virement = (req, res) => {
    const { userFile, userVirementFile } = req.params
    const folder = 'banque'

    try {


        fs.readFile(`./${folder}/${userFile}.json`, (err, data) => {
            if (err) {
                return res.status(404).send("this file does not exist")
            }

            const dataParser = JSON.parse(data)
            const date = new Date()

            const virement = {
                id: "1",
                value: 1000,
                date: date,
            }

            if ((dataParser.montant - virement.value) < 0) {
                return res.status(200).send("vous n'avez pas asser de font - " + dataParser.montant)
            }

            fs.readFile(`./${folder}/${userVirementFile}.json`, (err_, data_) => {
                if (err_) {
                    return res.status(404).send("this file does not exist")
                }

                const dataParser_ = JSON.parse(data_)

                const newData_ = {
                    ...dataParser_,
                    montant: dataParser_.montant + virement.value,
                    virement: [...dataParser_.virement, {...virement, status: 'receiver'}]
                }
                console.log(newData_);
                fs.writeFileSync(`./${folder}/${userVirementFile}.json`, JSON.stringify(newData_))
            })


            const newData = {
                ...dataParser,
                montant: dataParser.montant - virement.value,
                virement: [...dataParser.virement, {...virement, status: 'sender'}]
            }

            console.log(newData);

            fs.writeFileSync(`./${folder}/${userFile}.json`, JSON.stringify(newData))

            res.status(200).send("virement successfully - " + dataParser.id)
        })
    } catch (error) {
        res.status(400).send(error)
    }
}