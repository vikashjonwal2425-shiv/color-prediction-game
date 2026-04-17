export default async function handler(req, res) {
    // यह डेटा आपके डेटाबेस से आएगा, अभी डेमो के लिए यहाँ है
    const bets = {
        red: Math.floor(Math.random() * 5000), 
        green: Math.floor(Math.random() * 5000),
        violet: Math.floor(Math.random() * 1000)
    };

    // कम अमाउंट वाला लॉजिक
    const winner = Object.keys(bets).reduce((a, b) => bets[a] < bets[b] ? a : b);

    res.status(200).json({ 
        success: true, 
        winning_color: winner,
        all_bets: bets 
    });
}
