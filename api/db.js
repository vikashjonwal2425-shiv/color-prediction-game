import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);

export default async function connectDB() {
    try {
        await client.connect();
        return client.db("color_game");
    } catch (e) {
        console.error(e);
        return null;
    }
}
