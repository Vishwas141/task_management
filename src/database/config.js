import mongoose from 'mongoose';

const Connection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Database connected');
    }
    catch (error) {
        console.log('Database connection failed');
        console.error(error);
    }
};

export default Connection;

