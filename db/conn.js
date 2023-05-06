const mongoose = require('mongoose')

mongoose.connect(process.env.DB_URI).then(()=>{
    console.log('connection is successful')
}).catch(()=>{
    console.log('No connection');
})