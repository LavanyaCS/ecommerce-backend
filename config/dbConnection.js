const mongoose = require("mongoose");

const dbConnection = async() => {
    try{
        await mongoose.connect(process.env.DBURI,{
            ssl:true,
            tlsAllowInvalidCertificates:false
        })
        console.log("Db connection established");

    }
    catch(error){
         console.log(`Error in MongoDB ${error}`);

    }
}
module.exports = dbConnection;