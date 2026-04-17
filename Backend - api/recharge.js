import connectDB from './db';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send("Method Not Allowed");

    const { user, amount } = req.body;
    const db = await connectDB();
    const usersColl = db.collection("users");

    const userData = await usersColl.findOne({ username: user });
    
    let finalAmount = parseInt(amount);
    
    // अगर यूज़र का पहला डिपॉजिट है और ₹100 या उससे ज्यादा है
    if (userData.isFirstDeposit && finalAmount >= 100) {
        finalAmount += 100; // ₹100 बोनस जोड़ दिया
        await usersColl.updateOne(
            { username: user },
            { $set: { isFirstDeposit: false }, $inc: { balance: finalAmount } }
        );
    } else {
        await usersColl.updateOne(
            { username: user },
            { $inc: { balance: finalAmount } }
        );
    }

    res.status(200).json({ success: true, message: "Recharge Successful with Bonus if applicable" });
}

