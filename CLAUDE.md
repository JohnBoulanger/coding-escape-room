# JSC301 — Coding Escape Room

## Project Summary
React + Vite web app. A 10-room themed escape room for Grade 11 CS students (ICS3U).
Theme: **The Heist — TD Federal Vault** — vault job goes sideways, students have
30 minutes to crack 10 security layers and assemble the 10-digit master vault code.

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
    MasterKey.jsx              # 10-digit key strip, fills in as rooms are solved
    Room.jsx                   # layout shell, resolves description, delegates to challenge
    TextChallenge.jsx          # text input + exact-match validation
    PythonChallenge.jsx        # CodeMirror Python editor + Wandbox execution
```

## Game State (App.jsx)
```js
gameState        // 'start' | 'playing' | 'complete' | 'timeout'
viewingRoom      // 0-indexed room being displayed
highestUnlocked  // furthest room accessible (students can navigate back)
solvedAnswers    // string[10], null = unsolved
keyDigits        // string[10], null = unrevealed digit
timeLeft         // seconds remaining (30 * 60 on start)
```
- Timer starts on "Begin", not on page load
- No reset button during gameplay
- Students can navigate back to any solved room (read-only view)
- `room.description` can be `(solvedAnswers) => string` for chained rooms
- **Key digit = `answer.slice(-1)`** — last character of the correct answer

## The 10 Rooms

| # | Layer | Type | Problem | Answer | Key |
|---|-------|------|---------|--------|-----|
| 1 | The Access Log | text trace | Sum even-indexed elements of codes list | `182` | 2 |
| 2 | The Cipher Fragment | text trace | Shift each char of "WBVMU" by -1 via ord/chr | `VAULT` | T |
| 3 | The Pattern Check | text trace | Strictly-increasing check on [3,5,7,6,9] | `False` | e |
| 4 | The Sort Gate | text trace | One bubble-sort pass on [7,3,5,2]; print result | `[3, 5, 2, 7]` | ] |
| 5 | The Guard Count | python debug | Off-by-one: range(len-1) skips last corridor | `15` | 5 |
| 6 | The Max Detector | python fill | Complete find_max; return largest element | `21` | 1 |
| 7 | The Grid Counter | text trace | Nested loop 3×2; count total increments | `6` | 6 |
| 8 | The Threshold Filter | python fill | Complete sum_above; sum elements > threshold | `38` | 8 |
| 9 | The Running Total | python debug | Fix accumulator bug: `=` instead of `+=` | `105` | 5 |
| 10 | The Prime Gate | python fill | Complete is_prime; count primes in range(2,30) | `10` | 0 |

### Chained Rooms
- Room 5 description references `answers[0]` (Room 1 answer = `"182"`)

## rooms.js Data Shape
```js
{
  id,
  title,
  description,   // string OR (solvedAnswers) => string
  type,          // 'text' | 'python'
  challenge,     // shown as <pre> for text rooms; initial editor content for python rooms
  answer,        // expected stdout string (trimmed). keyDigit = answer.slice(-1)
  hint,
  // NO keyDigit field — derived as answer.slice(-1)
}
```

## PythonChallenge Execution Model
```js
// Code sent to Wandbox API (cpython-3.12.7)
// Returns { stdout, stderr, exitCode }
// stdout.trim() === room.answer → solved
```
- Student edits a complete Python program (with starter code / buggy code / stub to complete)
- "Expected output" box shows what the program should print when correct
- Runtime errors from stderr are shown verbatim
- On success: `onSolved(room.answer)` is called after 900ms delay

## Room Design Constraints
- **Only Room 10 uses modulo explicitly** — other rooms avoid `%`
- **Exactly one bubble-sort room** — Room 4
- **4 python rooms** (fill-in or debug): Rooms 6, 8, 9, 10
- **6 text trace rooms**: Rooms 1, 2, 3, 4, 5, 7
- Descriptions give narrative context, not implementation hints

## CSS Notes
- All custom properties in `:root` in `index.css`
- BEM-style class names: `.room-card__title`, `.nav-bar__btn--solved`, etc.
- CodeMirror overrides under `.code-editor-wrap .cm-*`
- Timer turns red (`--color-timer-warn: #dc2626`) when `timeLeft < 300` (5 min)
- Room card has `fadeIn` animation — fires on remount (keyed by `viewingRoom`)

## Known / Future Work
- Bundle size is ~677kb minified due to CodeMirror — expected, not a bug
- Piston API requires internet; offline use would need a local compiler
