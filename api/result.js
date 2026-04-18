import connectDB from './db';

export default async function handler(req, res) {
    try {
        const db = await connectDB();
        const betsColl = db.collection("bets");
        const resultsColl = db.collection("results");

        // 1. कम पैसे वाला लॉजिक (Calculations)
        const allBets = await betsColl.find({ status: "pending" }).toArray();
        let totals = { red: 0, green: 0, violet: 0 };
        allBets.forEach(bet => { if(totals[bet.choice] !== undefined) totals[bet.choice] += bet.amount; });
        
        const winColor = Object.keys(totals).reduce((a, b) => totals[a] <= totals[b] ? a : b);
        const winNumber = Math.floor(Math.random() * 10); // अभी के लिए रैंडम नंबर

        // 2. नए रिजल्ट को डेटाबेस में सेव करना
        const newResult = {
            winning_color: winColor,
            winning_number: winNumber,
            period: new Date().getTime().toString().slice(-7),
            time: new Date()
        };
        await resultsColl.insertOne(newResult);

        // 3. पुरानी बेट्स को क्लियर करना
        await betsColl.updateMany({ status: "pending" }, { $set: { status: "completed" } });

        // 4. पिछले 30 रिकॉर्ड वापस भेजना
        const history = await resultsColl.find().sort({ time: -1 }).limit(30).toArray();

        res.status(200).json({ 
            latest: newResult,
            history: history 
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}
