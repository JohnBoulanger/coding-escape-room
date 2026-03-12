import TextChallenge from './TextChallenge'
import PythonChallenge from './PythonChallenge'

// ── Room ──────────────────────────────────────────────────────────────────────
// Thin layout shell for one room. Resolves the room description (which
// may be a function for chained rooms), renders the code snippet if present,
// then delegates to the correct challenge component.
//
// When savedAnswer is non-null the room was already solved — the child
// components receive initialSolved=true and render in read-only mode.
//
// Props:
//   room         – room data object from rooms.js
//   roomIndex    – 0-indexed position in ROOMS (passed to onSolved)
//   onSolved     – (roomIndex, answer) => void
//   solvedAnswers – full array of answers, used for dynamic descriptions
//   savedAnswer  – the student's saved answer, or null if unsolved

export default function Room({ room, roomIndex, onSolved, solvedAnswers, savedAnswer }) {
  const isSolved = savedAnswer !== null

  // description can be a plain string or a function that takes solvedAnswers
  const descriptionText =
    typeof room.description === 'function'
      ? room.description(solvedAnswers)
      : room.description

  function handleSolved(answer) {
    onSolved(roomIndex, answer)
  }

  return (
    <div className="room-card">
      <h2 className="room-card__title">{room.title}</h2>
      <p className="room-card__description">{descriptionText}</p>

      {/* Code snippet — shown for text rooms only (python rooms use the editor) */}
      {room.type === 'text' && room.challenge !== null && (
        <pre className="code-block">{room.challenge}</pre>
      )}

      {/* Challenge component */}
      {room.type === 'text' ? (
        <TextChallenge
          room={room}
          onSolved={handleSolved}
          initialSolved={isSolved}
          initialInput={isSolved ? savedAnswer : ''}
        />
      ) : (
        <PythonChallenge
          room={room}
          onSolved={handleSolved}
          initialSolved={isSolved}
        />
      )}
    </div>
  )
}
