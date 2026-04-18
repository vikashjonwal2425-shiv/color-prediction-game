import connectDB from './db';

export default async function handler(req, res) {
    try {
        const db = await connectDB();
        if (!db) {
            return res.status(500).json({ error: "डेटाबेस कनेक्ट नहीं हुआ" });
        }
        // पेंडिंग रिक्वेस्ट ढूंढें
        const requests = await db.collection("recharge_requests").find({ status: "pending" }).toArray();
        res.status(200).json({ requests: requests || [] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
