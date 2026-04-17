import connectDB from './db';

export default async function handler(req, res) {
    const db = await connectDB();
    const betsColl = db.collection("bets");

    // 1. डेटाबेस से इस राउंड की सभी बेट्स उठाना
    const allBets = await betsColl.find({ status: "pending" }).toArray();

    // 2. कलर वाइज टोटल कैलकुलेट करना
    let totals = { red: 0, green: 0, violet: 0 };
    let numTotals = { 0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0 };

    allBets.forEach(bet => {
        if (totals[bet.choice] !== undefined) totals[bet.choice] += bet.amount;
        if (numTotals[bet.choice] !== undefined) numTotals[bet.choice] += bet.amount;
    });

    // 3. सबसे कम पैसे वाला रंग ढूंढना (Winning Logic)
    const winColor = Object.keys(totals).reduce((a, b) => totals[a] <= totals[b] ? a : b);

    // 4. सबसे कम पैसे वाला नंबर ढूंढना
    const winNumber = Object.keys(numTotals).reduce((a, b) => numTotals[a] <= numTotals[b] ? a : b);

    // 5. पुरानी बेट्स को 'completed' मार्क करना ताकि अगले राउंड में न जुड़ें
    await betsColl.updateMany({ status: "pending" }, { $set: { status: "completed" } });

    // 6. रिजल्ट वापस भेजना
    res.status(200).json({
        winning_color: winColor,
        winning_number: winNumber,
        timestamp: new Date()
    });
}
