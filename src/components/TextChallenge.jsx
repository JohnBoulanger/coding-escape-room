import { useState } from 'react'

// ── TextChallenge ─────────────────────────────────────────────────────────────
// Used for rooms with type: 'text'. The student types a short answer and it is
// validated against room.answer (exact match after trim).
//
// When initialSolved is true the room was already completed — inputs are
// disabled and the success state is pre-shown.
//
// Props:
//   room          – room data object ({ answer, hint })
//   onSolved      – (answer: string) => void, called once after correct answer
//   initialInput  – pre-fill value when navigating back to a solved room
//   initialSolved – true when viewing a room that was already completed

export default function TextChallenge({ room, onSolved, initialInput = '', initialSolved = false }) {
  const [userInput, setUserInput] = useState(initialInput)
  const [feedback, setFeedback]   = useState(
    initialSolved ? { type: 'success', message: 'Correct — key fragment retrieved.' } : null
  )
  const [solved, setSolved]       = useState(initialSolved)
  const [showHint, setShowHint]   = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (solved) return   // guard against double-submit

    const trimmed = userInput.trim()
    const normalize = s => room.normalizeWhitespace ? s.replace(/\s+/g, '') : s

    if (normalize(trimmed) === normalize(room.answer)) {
      setFeedback({ type: 'success', message: 'Correct — key fragment retrieved. Advancing...' })
      setSolved(true)
      setTimeout(() => onSolved(trimmed), 900)
    } else {
      setFeedback({ type: 'error', message: 'Incorrect — check your answer and try again.' })
      setShowHint(true)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label className="challenge__label" htmlFor="text-answer">
        Your answer
      </label>
      <input
        id="text-answer"
        className="challenge__input"
        type="text"
        value={userInput}
        onChange={e => setUserInput(e.target.value)}
        disabled={solved}
        placeholder="Type your answer here..."
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
      />

      {!solved && (
        <button className="challenge__submit-btn" type="submit">
          Submit
        </button>
      )}

      {feedback && (
        <div className={`challenge__feedback challenge__feedback--${feedback.type}`}>
          {feedback.message}
        </div>
      )}

      {showHint && !solved && (
        <p className="challenge__hint">Hint: {room.hint}</p>
      )}
    </form>
  )
}
