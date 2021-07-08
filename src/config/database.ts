import mongoose from 'mongoose';
const db = mongoose.connection;

mongoose.connect(process.env.URL_DATABASE!, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});

db.once('connected', () => {
    console.log(`Connected to MongoDB ${db.name} at ${db.host}:${db.port}`);
});
