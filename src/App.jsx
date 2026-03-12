import { useState, useEffect } from 'react'
import { ROOMS } from './data/rooms'
import StartPage from './components/StartPage'
import NavBar from './components/NavBar'
import MasterKey from './components/MasterKey'
import Room from './components/Room'

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
  const [keyDigits, setKeyDigits]               = useState(Array(ROOMS.length).fill(null))
  const [timeLeft, setTimeLeft]                 = useState(30 * 60)

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
  // Stores the answer and key digit, then advances to the next room.
  function handleRoomSolved(roomIndex, answer) {
    setSolvedAnswers(prev => prev.map((a, i) => i === roomIndex ? answer : a))
    setKeyDigits(prev => prev.map((d, i) => i === roomIndex ? answer.slice(-1) : d))

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

  // ── Derived values ─────────────────────────────────────────────────────────
  const roomsSolved = solvedAnswers.filter(a => a !== null).length
  const isWarning   = timeLeft < 5 * 60   // < 5 minutes

  // ── Screens ────────────────────────────────────────────────────────────────

  if (gameState === 'start') {
    return <StartPage onStart={handleStart} />
  }

  if (gameState === 'complete') {
    return (
      <div className="app">
        <div className="app__inner">
          <div className="end-screen end-screen--success">
            <p className="end-screen__heading">Vault Cracked</p>
            <p className="end-screen__body">
              All 10 layers cleared. The safe is open. Walk out clean.
            </p>
            <p className="end-screen__body" style={{ marginTop: '0.5rem' }}>
              Time remaining: <strong>{formatTime(timeLeft)}</strong>
            </p>
            <div className="end-screen__code-label">Master Vault Code</div>
            <div className="end-screen__code">
              {keyDigits.map((d, i) => (
                <span key={i} className="end-screen__code-digit">{d}</span>
              ))}
            </div>
          </div>
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
            {roomsSolved > 0 && (
              <>
                <div className="end-screen__code-label">Partial Code Retrieved</div>
                <div className="end-screen__code">
                  {keyDigits.map((d, i) => (
                    <span
                      key={i}
                      className={`end-screen__code-digit ${d === null ? 'end-screen__code-digit--hidden' : ''}`}
                    >
                      {d ?? '_'}
                    </span>
                  ))}
                </div>
              </>
            )}
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
          <h1 className="app__title">The Heist</h1>
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

        {/* Partial master key */}
        <MasterKey keyDigits={keyDigits} />

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
