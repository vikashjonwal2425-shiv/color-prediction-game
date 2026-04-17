export default async function handler(req, res) {
    // यहाँ हम मान लेते हैं कि ये डेटाबेस से आ रहा है
    // असल ऐप में हम MongoDB से 'Total Bets' का सम (Sum) निकालेंगे
    const colorBets = { red: 500, green: 800, violet: 200 };
    const numberBets = { 0: 10, 1: 50, 2: 5, 3: 100, 4: 20, 5: 5, 6: 80, 7: 15, 8: 40, 9: 60 };

    // 1. सबसे कम पैसे वाला रंग चुनना
    const winColor = Object.keys(colorBets).reduce((a, b) => colorBets[a] < colorBets[b] ? a : b);

    // 2. सबसे कम पैसे वाला नंबर चुनना
    const winNumber = Object.keys(numberBets).reduce((a, b) => numberBets[a] < numberBets[b] ? a : b);

    res.status(200).json({
        success: true,
        winning_color: winColor,
        winning_number: winNumber,
        period: Date.now()
    });
}
