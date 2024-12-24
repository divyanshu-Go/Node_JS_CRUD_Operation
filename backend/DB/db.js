const mongoose = require('mongoose')

const MongoDB_URL = 'mongodb://localhost:27017/Project_1'


const ConnectDB = async () => {
    try {
        await mongoose.connect(MongoDB_URL)
        console.log('MongoDB connected')
    } catch (err) {
        console.error('MongoDB connection failed', err)
    }
}

module.exports = ConnectDB();