import connectDB from './db';

export default async function handler(req, res) {
    const db = await connectDB();
    
    // डेटाबेस से आज की सारी बेट्स निकालना
    const allBets = await db.collection("bets").find({}).toArray();
    
    const totals = { red: 0, green: 0, violet: 0 };
    allBets.forEach(bet => {
        if(totals[bet.choice] !== undefined) totals[bet.choice] += bet.amount;
    });

    // सबसे कम अमाउंट वाला रंग चुनना (Winning Logic)
    const winner = Object.keys(totals).reduce((a, b) => totals[a] < totals[b] ? a : b);
    
    // नंबर के लिए रैंडम (या कम वाला लॉजिक यहाँ भी लगा सकते हैं)
    const winNum = Math.floor(Math.random() * 10);

    res.status(200).json({ winning_color: winner, winning_number: winNum });
}
