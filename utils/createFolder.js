const fs = require('fs')

// for (let i = 0; i < data.length; i++) {
//     if (!fs.existsSync('./users')) {
//         fs.mkdirSync('./users')
//     }

//     fs.writeFileSync(`./users/${data[i].name.toLowerCase()}.json`, JSON.stringify(data[i]))
// }

function createFolder(folder) {
    if (!fs.existsSync(`./${folder}`)) {
        return fs.mkdirSync(`./${folder}`)
    }
}

module.exports = createFolder