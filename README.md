#  Chess Vibe — Smart AI Chess with Power-Ups

**Chess Vibe** is a fun, locally playable web-based chess game featuring:
- Smart AI opponent
- Move suggestions
- Power-up squares 
- Castling, pawn promotion, and more!

Built in vanilla **HTML, CSS, and JavaScript**, this project focuses on chess mechanics, accessibility, and interactivity — ideal for vibe coding and game prototyping.

---

##  Features

###  Gameplay
- Full 8x8 chessboard with all pieces
- Legal moves for each piece (rook, bishop, knight, queen, king, pawn)
- Turn-based play (White = Player, Black = AI)

###  Smart AI (Black)
- Prioritizes capturing high-value pieces
- Selects best moves available
- Simple, fast, and non-blocking

###  Move Suggestions
- One-click `Suggest Move` button highlights the best White move
- Visual indicators for suggested origin & destination

###  Power-Up Squares
- Random squares gain bonuses each match:
  -  **Double Move**
  -  **Heal**
  -  **Teleport**
- Icons & background highlight effect when triggered

###  Advanced Rules
-  **Pawn Promotion** to queen on last rank
-  **Castling** (kingside & queenside for both players)
-  Coming soon: Check, Checkmate, En Passant

---

##  How to Play

1. **Download or clone this repo**
2. Open `index.html` in your browser
3. Play as White! AI plays Black
4. Use **Suggest Move** to get tips
5. Trigger power-ups by landing on marked squares

---

##  File Structure


chess-game/
├── index.html # Game board and UI
├── style.css # Theme, layout, accessibility, power-up visuals
└── script.js # Game logic, AI, move validation, power-ups


---

##  Accessibility

-  High-contrast board colors
-  Keyboard/tap-friendly buttons
- Icons and visual feedback for clarity

---

##  Future Ideas

-  Minimax AI with depth
-  Drag and drop movement
-  Move history log
-  Undo/redo support
- Themed chess pieces and boards 


