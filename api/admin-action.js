import { ObjectId } from 'mongodb';
import connectDB from './db';

export default async function handler(req, res) {
    const { id, type } = req.body;
    const db = await connectDB();
    const rechargeColl = db.collection("recharge_requests");
    const usersColl = db.collection("users");

    if (type === 'approve') {
        const request = await rechargeColl.findOne({ _id: new ObjectId(id) });
        const user = await usersColl.findOne({ username: request.username });

        let finalAmt = request.amount;
        // बोनस लॉजिक: अगर पहला रिचार्ज है और ₹100+ है
        if (user.isFirstDeposit && finalAmt >= 100) {
            finalAmt += 100;
            await usersColl.updateOne({ username: user.username }, { $set: { isFirstDeposit: false } });
        }

        await usersColl.updateOne({ username: user.username }, { $inc: { balance: finalAmt } });
        await rechargeColl.updateOne({ _id: new ObjectId(id) }, { $set: { status: "approved" } });
    } else {
        await rechargeColl.updateOne({ _id: new ObjectId(id) }, { $set: { status: "rejected" } });
    }

    res.status(200).json({ success: true });
}

