const mongoose = require('mongoose');
const config = require('../index')
const db_url = config.MONGODB

const connectDB = async () => {
    try {
        await mongoose.connect(db_url, { useNewUrlParser: true }).then(() => {
            console.log(`Database connected successfully in --> ${mongoose.connection.db.databaseName}`);
        })
        // mongoose.connection.on('connected', () => {
        //     console.log(`Database connected successfully ${mongoose.connection.db.databaseName}`);
        // });

        // mongoose.connection.on('error', (err) => {
        //     console.error(`Database connection error: ${err}`);
        //     process.exit(1);
        // });
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}
module.exports = connectDB