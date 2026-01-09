
export const HowToPlay = () => {
  return (
    <div className="space-y-4">
      <p>
        Royal Cards is a trick-taking game played with a standard 52-card deck. 
        The game consists of 7 tricks (rounds).
      </p>

      <h3 className="text-white font-bold text-lg mt-4">Goal</h3>
      <p>Win more tricks than your opponents. The player with the most points after 7 tricks wins.</p>

      <h3 className="text-white font-bold text-lg mt-4">Game Flow</h3>
      <ol className="list-decimal list-inside space-y-2">
        <li>Players are dealt 7 cards each.</li>
        <li>One player leads the trick by playing a card.</li>
        <li>Other players take turns playing one card each.</li>
        <li>The trick is won based on the active rule set.</li>
        <li>The winner scores 1 point and leads the next trick.</li>
      </ol>

      <h3 className="text-white font-bold text-lg mt-4">Rulesets</h3>
      
      <div className="grid gap-4 md:grid-cols-3 mt-2">
        <div className="bg-gray-700/50 p-3 rounded-lg">
          <div className="font-bold text-casino-gold mb-1">Suit Follows</div>
          <div className="text-sm">You must play the same suit as the leader if possible. The highest card of the led suit wins.</div>
        </div>
        <div className="bg-gray-700/50 p-3 rounded-lg">
          <div className="font-bold text-casino-gold mb-1">Highest Card</div>
          <div className="text-sm">Suits don't matter. The card with the highest numeric rank wins.</div>
        </div>
        <div className="bg-gray-700/50 p-3 rounded-lg">
          <div className="font-bold text-casino-gold mb-1">Spades Trump</div>
          <div className="text-sm">Spades always beat other suits. High spade wins. If no spades, high card of led suit wins.</div>
        </div>
      </div>

      <h3 className="text-white font-bold text-lg mt-4">Card Ranks</h3>
      <p>
        A (High) &gt; K &gt; Q &gt; J &gt; 10 &gt; 9 &gt; 8 &gt; 7 &gt; 6 &gt; 5 &gt; 4 &gt; 3 &gt; 2 (Low)
      </p>
    </div>
  );
};

