I want you to build a beautiful online card game. Picture a sleek poker table where you're playing against three AI opponents, trying to win tricks and outscore them. It should feel polished and professional, the kind of thing you'd actually want to play, not just a coding exercise.

The game is a trick-taking card game, similar to Spades or Hearts but simplified. Four players sit around a virtual table. Each round, everyone plays one card, and whoever plays the best card wins that trick and scores a point. After seven tricks, whoever has the most points wins the game.

I want three different ways to determine who wins each trick. The first mode is called Suit Follows, where you have to play the same suit as whoever went first, and the highest card in that suit wins. The second is just Highest Card Wins, where suits don't matter at all. The third is Spades Trump, where spades beat everything, like in the actual game of Spades. Players should be able to pick which rule set they want before starting.

The game flow should feel natural. You start in a lobby where you can enter your name, see your opponents (give them friendly names like Alex, Sam, and Jordan), and pick your rules. When you hit start, cards animate out to everyone, seven cards each from a standard 52-card deck. Then you take turns. When it's your turn, you tap a card to select it, then tap the table to play it. The AI players should pause for a moment before playing to feel more realistic, because nobody likes playing against an instant computer. After each trick, show who won, update the scores, pause briefly, then continue. When all seven tricks are done, celebrate the winner. If the human wins, throw some confetti!

I'm envisioning a casino aesthetic. The centerpiece is an oval poker table with that classic green felt look. The three AI opponents are positioned around the table, one at the top, one on the left, one on the right. Your hand of cards sits at the bottom, fanned out nicely with a slight arc.

The cards themselves should be clean and readable. White backgrounds, red for hearts and diamonds, black for clubs and spades. Show the rank and a little suit icon. When cards are in your hand, fan them out with each card slightly rotated. The middle card is straight, the ones on the edges angle outward. When you select a card, it should lift up and glow a little so you know it's selected.

I want two color themes. The default should be a dark theme with deep blues and greens and gold accents, like a fancy casino at night. The alternate should be a warmer, lighter theme for people who prefer that. Let users toggle between them, and remember their choice.

One fun touch is letting players customize their card backs. Give them a color picker to choose any color they want, and a few pattern options like solid, checkerboard, diagonal stripes, or polka dots. It's a small thing but it makes the game feel more personal.

Everything should animate smoothly. Cards slide in when dealt. Your selection lifts the card. Playing a card sends it to the center. The winning card glows gold. Theme changes transition smoothly. But also respect people who have motion sensitivity. If they've turned on reduced motion in their system settings, tone down or skip the animations.

This needs to work on phones, tablets, and desktops. Build it mobile-first, meaning design for a phone screen first, then scale up for bigger screens. On phones in landscape mode, give people a hamburger menu to access settings since there's less room. Make sure all the touch targets are big enough to tap easily, at least 44 pixels. For phones with notches or rounded corners, handle the safe areas properly so nothing gets cut off.

Add a turn timer. Give the player about 30 seconds to make their move. Show a visual countdown. If they run out of time, automatically play a random card for them and show a little toast message saying time's up.

First-time players need some guidance. When it's their turn for the first time, show a helpful overlay explaining what to do, select a card, then tap the table. Have a How to Play button in the header that opens a modal explaining the rules, the different game modes, and which cards beat which.

Use toast notifications for game events, but keep them brief and out of the way. Things like "Card played!" or "Sam wins the trick!" or "Congratulations, you won!"

There should be a leaderboard visible during the game showing everyone's current score and whose turn it is. Make it clear at a glance who's winning.

Accessibility is really important to me. The game should be playable by everyone, including people using screen readers or keyboards. Every interactive element needs proper ARIA labels. When it's someone's turn or when a trick is won, announce it to screen readers using live regions. People should be able to navigate entirely with the keyboard, tabbing through the cards and pressing enter to select and play. Show clear focus indicators so keyboard users know where they are. Don't rely on color alone to communicate information. Support high contrast mode for people who need it. And like I mentioned, respect the reduced motion preference.

Build this with React, use the latest version with hooks. Vite is great for the build tooling. Tailwind CSS for styling. For the UI pieces, you'll need react-icons for the suit symbols, react-colorful for the color picker, react-confetti for the celebration, and sonner for the toast notifications.

Keep the game state in a central place, probably a custom hook that manages everything like whose turn it is, what phase the game is in, what cards everyone has, and the scores. Use React Context for things lots of components need, like the current theme and card customization settings.

Be careful with timing. The game has lots of timeouts for AI turns, animations, and the turn timer. Make sure you clean all of those up properly when components unmount or when the game resets, otherwise you'll get weird bugs.

Wrap the whole app in an error boundary so if something crashes, users see a friendly error message instead of a blank screen.

Build the analytics and error tracking in a way that's ready to connect to real services. Create an analytics service that tracks game events like starts, completions, which rule sets people choose, and theme toggles. Make it respect Do Not Track and support consent for GDPR. For now it can just log to the console, but structure it so you could plug in Google Analytics or Mixpanel easily.

Same idea for error tracking. Build a service ready for Sentry. It should capture exceptions with context, track what the user was doing leading up to the error, and log the game state. Console logging for now, but ready for the real thing.

Performance matters too. Split the bundle so React loads separately from the UI libraries. Lazy load the confetti since it's only used at the end of a game. Keep the main bundle under 500KB gzipped. The game should feel snappy, aim for 60fps animations and a fast initial load.

Write tests, especially for the game logic. The rules for who wins each trick, the turn order, dealing cards, keeping score, those are the things where bugs really hurt. Test the components too, making sure they render correctly and respond to user interactions properly. Test the accessibility basics like ARIA attributes and keyboard navigation. Create some test utilities to make writing tests easier, functions to create mock cards, mock players, and mock game states at various phases.

Include a CloudFormation template for hosting on AWS. You'll need an S3 bucket for the static files with public access blocked, encryption enabled, and versioning for rollbacks. Put CloudFront in front of it for HTTPS, caching, and security headers. Set up the cache so HTML files aren't cached, so deploys go live immediately, but assets are cached for a year since they're fingerprinted. Handle SPA routing by returning index.html for 404s. For CI/CD, set up a GitHub OIDC provider so GitHub Actions can deploy without storing any AWS credentials. Create an IAM role with just the permissions needed to sync to S3 and invalidate the CloudFront cache.

When this is done, I want a game that's genuinely fun to play. Something with smooth animations and a polished feel. Something that works great whether you're on your phone during a commute or at your desk on a big monitor. Something accessible to everyone. Something with clean code that's easy to maintain and extend.

Build it like you're proud of it. Like you'd put it in your portfolio.