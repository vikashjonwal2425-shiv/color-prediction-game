import connectDB from './db';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
    
    const { user, amount, choice } = req.body;
    const db = await connectDB();
    
    // बेट को डेटाबेस में सेव करना
    await db.collection("bets").insertOne({
        user,
        amount: parseInt(amount),
        choice,
        timestamp: new Date(),
        period: "20260417" // इसे आप डायनामिक बना सकते हैं
    });

    res.status(200).json({ success: true, message: "Bet Placed!" });
}

