# The Harrington Heist — Coding Escape Room

A 10-room browser-based coding escape room for Grade 11 Computer Science (ICS3U).

Students have **30 minutes** to crack 10 security layers inside Harrington Federal Vault by tracing and fixing Python code. Each layer reveals a hidden digit; all 10 together form the master vault code.

---

## Stack

- **React 18 + Vite 5**
- **CodeMirror** (`@uiw/react-codemirror`, `@codemirror/lang-python`, `@uiw/codemirror-theme-vscode`) — syntax-highlighted editor for Python rooms; read-only display for trace rooms
- **Wandbox API** (`https://wandbox.org/api/compile.json`, `cpython-3.12.7`) — executes student Python code in the browser
- **Plain CSS** — dark heist theme, no Tailwind

## Running

```bash
npm install
npm run dev     # dev server at localhost:5173
npm run build   # production build
```

---

## The 10 Layers

| # | Title | Type | Task |
|---|-------|------|------|
| 1 | The Entry Turnstile | Text trace | Sum even-indexed elements of an access log |
| 2 | The Radio Intercept | Text trace | Decode a Caesar-shifted word via `ord`/`chr` |
| 3 | The Hallway Stabilizer | Text trace | Trace a strictly-increasing sequence check |
| 4 | The Queue Regulator | Text trace | Trace one bubble-sort pass on an array |
| 5 | The Patrol Ledger | Python debug | Fix an off-by-one error in a `range()` loop |
| 6 | The Voltage Spike Detector | Python fill | Complete `find_max` to return the largest element |
| 7 | The Security Sweep Matrix | Text trace | Count iterations of a nested loop |
| 8 | The Threshold Filter | Python fill | Complete `sum_above` to filter by threshold |
| 9 | The Gold Counter | Python debug | Fix accumulator bug (`=` → `+=`) |
| 10 | The Master Override Console | Python fill | Complete `is_prime`; count primes in range(2, 30) |

**Master vault code: 1407512837**

---

## Gameplay

1. Click **Begin** — 30-minute countdown starts
2. Solve each layer in order (back-navigation to solved layers allowed)
3. **Text rooms:** read the code, type what it prints
4. **Python rooms:** edit the code in the IDE, click **Run Code** — Wandbox executes it
5. On completion, use the **clue cards** (click any card to revisit that layer) to extract one digit per layer and enter the 10-digit master vault code

---

## Project Structure

```
src/
  App.jsx                 # game state, timer, screen routing
  index.css               # all styles (dark theme, CSS custom properties)
  utils/
    piston.js             # Wandbox API wrapper → { stdout, stderr, exitCode }
  data/
    rooms.js              # 10 room definitions (title, description, challenge, answer, clue)
  components/
    StartPage.jsx         # landing screen
    NavBar.jsx            # 10 numbered room buttons
    MasterKey.jsx         # 10-digit key strip (fills in as rooms are solved)
    Room.jsx              # layout shell, routes to challenge component
    TextChallenge.jsx     # text input + exact-match validation
    PythonChallenge.jsx   # CodeMirror editor + Wandbox execution
```

## Notes

- Requires internet access (Wandbox API for Python execution)
- Bundle size ~700kb minified — expected due to CodeMirror
