const mongoose = require('mongoose');


function connect(){
    mongoose.connect(process.env.MONGO_URL).then(() => {
        console.log('Connected to User DB');
    }).catch(err => {
        console.log(err);
    });
}

module.exports = connect;
