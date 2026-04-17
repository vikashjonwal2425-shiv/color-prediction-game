import connectDB from './db';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

    const { user, amount, choice } = req.body;
    const db = await connectDB();
    const usersColl = db.collection("users");
    const betsColl = db.collection("bets");

    // 1. यूज़र का बैलेंस चेक करना
    const userData = await usersColl.findOne({ username: user });
    if (!userData || userData.balance < amount) {
        return res.status(400).json({ success: false, message: "Balance कम है!" });
    }

    // 2. बैलेंस काटना और बेट सेव करना
    await usersColl.updateOne({ username: user }, { $inc: { balance: -parseInt(amount) } });
    await betsColl.insertOne({
        username: user,
        choice: choice,
        amount: parseInt(amount),
        time: new Date(),
        status: "pending"
    });

    res.status(200).json({ success: true, newBalance: userData.balance - amount });
}
