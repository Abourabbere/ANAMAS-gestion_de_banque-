// var crypto = require('crypto');

// var text = "Master of puppets I'm pulling your strings, twisting your mind and smashing your dreams."

// // On définit notre algorithme de cryptage
// var algorithm = 'aes256';

// // Notre clé de chiffrement, elle est souvent générée aléatoirement mais elle doit être la même pour le décryptage
// var password = 'l5JmP+G0/1zB%;r8B8?2?2pcqGcL^3';

// // On crypte notre texte
// var cipher = crypto.createCipher(algorithm, password);
// var crypted = cipher.update(text, 'utf8', 'hex');
// crypted += cipher.final('hex');

// console.log(crypted);


// console.log('****************************************************************');

// // On décrypte notre texte
// var decipher = crypto.createDecipher(algorithm, password);
// var dec = decipher.update(crypted, 'hex', 'utf8');
// dec += decipher.final('utf8');


// console.log(dec);

const express = require('express');
const app = express();

// Routes
const userRoutes = require('./routes/user.routes')

const port = 5000


// apis
app.use('/user', userRoutes)

app.listen(port, () => {
    console.log(' app running on localhost: ' + port);
})