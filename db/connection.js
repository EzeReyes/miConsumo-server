import mongoose  from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({path: "config.env"});


const db = async () => {
    try {
        await mongoose.connect(process.env.DB_MONGO);

        console.log('DB Conectada');
    } catch (error) {
        console.log(error)
        process.exit(1);
    }
}

export default db;