import { useState, useEffect } from 'react'
import { ROOMS } from './data/rooms'
import StartPage from './components/StartPage'
import NavBar from './components/NavBar'
import Room from './components/Room'

const CORRECT_CODE = '1407512837'

// ── helpers ───────────────────────────────────────────────────────────────────
function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

// ── App ───────────────────────────────────────────────────────────────────────
// Root component. All progression and timer state lives here.
//
//   gameState       – controls which screen is rendered
//   viewingRoom     – which room is currently displayed (student can navigate back)
//   highestUnlocked – furthest room the student is allowed to view
//   solvedAnswers   – the answer each room was solved with (null = not yet solved)
//   keyDigits       – one digit per room, revealed on solve (null = hidden)
//   timeLeft        – seconds remaining on the 30-minute countdown

export default function App() {
  const [gameState, setGameState]               = useState('start')
  const [viewingRoom, setViewingRoom]           = useState(0)
  const [highestUnlocked, setHighestUnlocked]   = useState(0)
  const [solvedAnswers, setSolvedAnswers]        = useState(Array(ROOMS.length).fill(null))
  const [timeLeft, setTimeLeft]                 = useState(30 * 60)
  const [masterInput, setMasterInput]           = useState(Array(10).fill(''))
  const [codeResult, setCodeResult]             = useState(null)

  // ── Timer ──────────────────────────────────────────────────────────────────
  // Starts when gameState becomes 'playing'. Counts down by 1 each second.
  // At zero, transitions to 'timeout'.
  useEffect(() => {
    if (gameState !== 'playing') return
    const tick = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(tick)
          setGameState('timeout')
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(tick)
  }, [gameState])

  // ── Handlers ──────────────────────────────────────────────────────────────
  function handleStart() {
    setGameState('playing')
  }

  // Called by a Room when the student submits the correct answer.
  // Stores the answer then advances to the next room.
  function handleRoomSolved(roomIndex, answer) {
    setSolvedAnswers(prev => prev.map((a, i) => i === roomIndex ? answer : a))

    if (roomIndex === ROOMS.length - 1) {
      setGameState('complete')
    } else {
      setHighestUnlocked(prev => Math.max(prev, roomIndex + 1))
      setViewingRoom(roomIndex + 1)   // auto-advance
    }
  }

  // Navigate back to any already-unlocked room.
  function handleNavigate(i) {
    if (i <= highestUnlocked) setViewingRoom(i)
  }

  function handleDigitChange(index, value) {
    const digit = value.replace(/\D/g, '').slice(-1)
    setMasterInput(prev => prev.map((d, i) => i === index ? digit : d))
    if (digit && index < 9) {
      document.getElementById(`code-digit-${index + 1}`)?.focus()
    }
  }

  function handleCodeSubmit(e) {
    e.preventDefault()
    setCodeResult(masterInput.join('') === CORRECT_CODE ? 'correct' : 'wrong')
  }

function handleExitReview() {
    setGameState('complete')
  }

  // ── Derived values ─────────────────────────────────────────────────────────
  const roomsSolved = solvedAnswers.filter(a => a !== null).length
  const isWarning   = timeLeft < 5 * 60   // < 5 minutes

  // ── Screens ────────────────────────────────────────────────────────────────

  if (gameState === 'start') {
    return <StartPage onStart={handleStart} />
  }

  if (gameState === 'complete') {
    const allFilled = masterInput.every(d => d !== '')
    return (
      <div className="app">
        <div className="app__inner">
          <div className="end-screen end-screen--success">
            <p className="end-screen__heading">Vault Unsealed</p>
            <p className="end-screen__body">
              All 10 layers cleared. Time remaining: <strong>{formatTime(timeLeft)}</strong>
            </p>
            <p className="end-screen__body" style={{ marginTop: '0.375rem' }}>
              Use the clues below to extract one digit from each layer. Enter them in order to open the master vault.
            </p>

            <form onSubmit={handleCodeSubmit}>
              <div className="code-entry">
                <div className="code-entry__label">Master Vault Code</div>
                <div className="code-entry__slots">
                  {masterInput.map((digit, i) => (
                    <input
                      key={i}
                      id={`code-digit-${i}`}
                      className={`code-entry__slot${codeResult === 'correct' ? ' code-entry__slot--correct' : ''}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleDigitChange(i, e.target.value)}
                      disabled={codeResult === 'correct'}
                      autoComplete="off"
                    />
                  ))}
                </div>
                {codeResult === 'wrong' && (
                  <p className="code-entry__feedback code-entry__feedback--wrong">
                    Incorrect — check your extractions and try again.
                  </p>
                )}
                {codeResult === 'correct' && (
                  <p className="code-entry__feedback code-entry__feedback--correct">
                    The code was  accepted and the vault is open. Take the money and get out!
                  </p>
                )}
                {codeResult !== 'correct' && (
                  <button
                    className="challenge__submit-btn"
                    type="submit"
                    disabled={!allFilled}
                  >
                    Unlock Vault
                  </button>
                )}
              </div>
            </form>

            <div className="clue-grid">
              {ROOMS.map((room, i) => (
                <div
                  key={i}
                  className="clue-card clue-card--clickable"
                  onClick={() => { setViewingRoom(i); setGameState('reviewing') }}
                >
                  <div className="clue-card__number">Layer {i + 1}</div>
                  <div className="clue-card__title">{room.clue.title}</div>
                  <div className="clue-card__hint">{room.clue.hint}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (gameState === 'reviewing') {
    return (
      <div className="app">
        <div className="app__inner">
          <header className="app__header">
            <h1 className="app__title">The Harrington Heist</h1>
            <button className="challenge__submit-btn" onClick={handleExitReview}>
              ← Back to Results
            </button>
          </header>

          <NavBar
            rooms={ROOMS}
            viewingRoom={viewingRoom}
            highestUnlocked={highestUnlocked}
            solvedAnswers={solvedAnswers}
            onNavigate={handleNavigate}
          />

          <Room
            key={viewingRoom}
            room={ROOMS[viewingRoom]}
            roomIndex={viewingRoom}
            onSolved={handleRoomSolved}
            solvedAnswers={solvedAnswers}
            savedAnswer={solvedAnswers[viewingRoom]}
          />
        </div>
      </div>
    )
  }

  if (gameState === 'timeout') {
    return (
      <div className="app">
        <div className="app__inner">
          <div className="end-screen end-screen--fail">
            <p className="end-screen__heading">Silent Alarm Tripped</p>
            <p className="end-screen__body">
              Time expired. {roomsSolved} of {ROOMS.length} layers cracked before the alarm hit.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // ── Playing ────────────────────────────────────────────────────────────────
  return (
    <div className="app">
      <div className="app__inner">

        {/* Header */}
        <header className="app__header">
          <h1 className="app__title">The Harrington Heist</h1>
          <span className={`timer${isWarning ? ' timer--warning' : ''}`}>
            {formatTime(timeLeft)}
          </span>
        </header>

        {/* Room navigation */}
        <NavBar
          rooms={ROOMS}
          viewingRoom={viewingRoom}
          highestUnlocked={highestUnlocked}
          solvedAnswers={solvedAnswers}
          onNavigate={handleNavigate}
        />

        {/* Active room — keyed by viewingRoom so it remounts on navigation,
            resetting all local challenge state cleanly */}
        <Room
          key={viewingRoom}
          room={ROOMS[viewingRoom]}
          roomIndex={viewingRoom}
          onSolved={handleRoomSolved}
          solvedAnswers={solvedAnswers}
          savedAnswer={solvedAnswers[viewingRoom]}
        />

      </div>
    </div>
  )
}
