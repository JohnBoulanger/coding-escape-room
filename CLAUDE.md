# JSC301 — Coding Escape Room

## Project Summary
React + Vite web app. A 10-room themed escape room for Grade 11 CS students (ICS3U).
Theme: **The Bank Heist** — vault job goes sideways, students have 30 minutes to crack
10 security layers. After clearing all rooms, they use per-room clues to extract one digit
from each answer and manually assemble the 10-digit master vault code.

## Stack
- React 18, Vite 5
- CodeMirror (`@uiw/react-codemirror` + `@codemirror/lang-python`) for the Python editor
- Wandbox API (`https://wandbox.org/api/compile.json`, `cpython-3.12.7`) for Python execution
- Plain CSS (no Tailwind), all styles in `src/index.css`
- No backend for state — Python code rooms POST to Wandbox; text rooms validate in-browser

## Running the Project
```
npm install
npm run dev     # dev server at localhost:5173
npm run build   # production build
```

## File Structure
```
src/
  main.jsx
  App.jsx                      # all game state + timer + screen routing
  index.css                    # all styles, CSS custom properties at :root
  utils/
    piston.js                  # Wandbox API wrapper: runPython(code) → { stdout, stderr, exitCode }
  data/
    rooms.js                   # all 10 room definitions
  components/
    StartPage.jsx              # landing screen, "Begin" starts timer
    NavBar.jsx                 # 10 numbered room buttons (solved/current/locked states)
    MasterKey.jsx              # exists but currently unused by App.jsx
    Room.jsx                   # layout shell, resolves description, delegates to challenge
    TextChallenge.jsx          # text input + exact-match validation
    PythonChallenge.jsx        # CodeMirror Python editor + Wandbox execution
```

## Game State (App.jsx)
```js
gameState        // 'start' | 'playing' | 'complete' | 'reviewing' | 'timeout'
viewingRoom      // 0-indexed room being displayed
highestUnlocked  // furthest room accessible (students can navigate back)
solvedAnswers    // string[10], null = unsolved
masterInput      // string[10], one digit per slot for the final code entry
codeResult       // null | 'correct' | 'wrong' — result of the final code submission
timeLeft         // seconds remaining (30 * 60 on start)
```
- Timer starts on "Begin", not on page load
- No reset button during gameplay
- Students can navigate back to any solved room (read-only view)
- `room.description` can be `(solvedAnswers) => string` for chained rooms (not currently used)
- `'reviewing'` state: student clicked a clue card from the complete screen to re-examine a room

## Master Vault Code Mechanic
- `CORRECT_CODE = '1407512837'` (hardcoded in App.jsx)
- After all 10 rooms are solved, the complete screen shows a **clue card** per room
- Each clue card has a `title` and `hint` telling students how to extract one digit from their room answer
- Students manually type 10 digits into a code-entry form and click **Unlock Vault**

## The 10 Rooms

| # | Title | Type | Problem | Answer |
|---|-------|------|---------|--------|
| 1 | Layer 1 — The Entry Turnstile | text trace | Sum even-indexed elements of ids list | `182` |
| 2 | Layer 2 — The Radio Intercept | text trace | Shift each char of "WBVMU" by -1 via ord/chr | `VAULT` |
| 3 | Layer 3 — The Hallway Stabilizer | text trace | Strictly-increasing check on [3,5,7,6,9] | `False` |
| 4 | Layer 4 — The Queue Regulator | text trace | One bubble-sort pass on [7,3,5,2]; print result | `[3, 5, 2, 7]` |
| 5 | Layer 5 — The Patrol Ledger | python debug | Off-by-one: range(len-1) skips last corridor | `15` |
| 6 | Layer 6 — The Voltage Spike Detector | python fill | Complete find_max; return largest element | `21` |
| 7 | Layer 7 — The Security Sweep Matrix | text trace | Nested loop 3×2; count total increments | `6` |
| 8 | Layer 8 — The Threshold Filter | python fill | Complete sum_above; sum elements > threshold | `38` |
| 9 | Layer 9 — The Gold Counter | python debug | Fix accumulator bug: `=` instead of `+=` | `105` |
| 10 | Layer 10 — The Master Override Console | python fill | Complete is_prime; count primes in range(2,30) | `10` |

## rooms.js Data Shape
```js
{
  id,
  title,
  description,              // string OR (solvedAnswers) => string
  type,                     // 'text' | 'python'
  challenge,                // read-only CodeMirror snippet for text rooms; editable starter for python rooms
  answer,                   // expected stdout string (trimmed, exact match)
  hint,                     // shown after first wrong attempt
  normalizeWhitespace,      // optional bool — strips all whitespace before comparing (Room 4)
  clue: { title, hint },    // shown on complete screen; hint tells student how to extract their digit
}
```

## PythonChallenge Execution Model
```js
// Code sent to Wandbox API (cpython-3.12.7)
// Returns { stdout, stderr, exitCode }
// stdout.trim() === room.answer → solved
```
- Student edits a complete Python program (starter code / buggy code / stub to complete)
- Runtime errors from `stderr` are shown verbatim
- On success: `onSolved(room.answer)` is called after 900ms delay
- Hint shown after first wrong/error attempt

## TextChallenge Validation
- Exact string match after `trim()`
- If `room.normalizeWhitespace === true`, all whitespace is stripped before comparing (used for Room 4 list output)
- Hint shown after first wrong attempt

## Room.jsx — Text Room Code Display
- Text rooms render `room.challenge` in a **read-only CodeMirror editor** (vscode-dark theme, Python syntax)
- Python rooms render an editable CodeMirror editor in PythonChallenge

## Room Design Constraints
- **Only Room 10 uses modulo explicitly** — other rooms avoid `%`
- **Exactly one bubble-sort room** — Room 4
- **4 python rooms** (fill-in or debug): Rooms 5, 6, 8, 9, 10
- **6 text trace rooms**: Rooms 1, 2, 3, 4, 7
- Descriptions give narrative context, not implementation hints

## CSS Notes
- All custom properties in `:root` in `index.css`
- BEM-style class names: `.room-card__title`, `.nav-bar__btn--solved`, etc.
- CodeMirror overrides under `.code-editor-wrap .cm-*`
- Timer turns red when `timeLeft < 300` (5 min)
- Room card has `fadeIn` animation — fires on remount (keyed by `viewingRoom`)

## Known / Future Work
- Bundle size is ~677kb minified due to CodeMirror — expected, not a bug
- Wandbox API requires internet; offline use would need a local compiler
- `MasterKey.jsx` exists in components but is not currently imported or used
