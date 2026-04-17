import connectDB from './db';

export default async function handler(req, res) {
    const db = await connectDB();
    const requests = await db.collection("recharge_requests").find({ status: "pending" }).toArray();
    res.status(200).json({ requests });
}

