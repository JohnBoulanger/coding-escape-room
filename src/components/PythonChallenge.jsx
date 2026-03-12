import { useState } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { python } from '@codemirror/lang-python'
import { runPython } from '../utils/piston'

// ── PythonChallenge ────────────────────────────────────────────────────────────
// Used for rooms with type: 'python'. Renders a Python editor pre-filled with
// the room's starter code (a function to complete or a bug to fix).
// On submit, the code is sent to Wandbox for execution.
// The trimmed stdout is compared against room.answer.
//
// When initialSolved is true the room was already completed — the editor and
// button are disabled, showing the success state.
//
// Props:
//   room          – room data object ({ challenge, hint, answer })
//   onSolved      – (answer: string) => void, called once after output matches
//   initialSolved – true when navigating back to an already-completed room

export default function PythonChallenge({ room, onSolved, initialSolved = false }) {
  const [userInput, setUserInput] = useState(room.challenge)
  const [feedback, setFeedback]   = useState(
    initialSolved ? { type: 'success', message: 'Output matched — key digit retrieved.' } : null
  )
  const [solved, setSolved]   = useState(initialSolved)
  const [loading, setLoading] = useState(false)
  const [showHint, setShowHint] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (solved || loading) return

    setLoading(true)
    setFeedback(null)

    let result
    try {
      result = await runPython(userInput)
    } catch (err) {
      setFeedback({ type: 'error', message: err.message })
      setLoading(false)
      setShowHint(true)
      return
    } finally {
      setLoading(false)
    }

    if (result.exitCode !== 0 || result.stderr) {
      const detail = result.stderr || `Process exited with code ${result.exitCode}`
      setFeedback({ type: 'error', message: `Runtime error:\n${detail}` })
      setShowHint(true)
      return
    }

    if (result.stdout === room.answer) {
      setFeedback({ type: 'success', message: `Output: ${result.stdout} — key digit retrieved. Advancing...` })
      setSolved(true)
      setTimeout(() => onSolved(room.answer), 900)
    } else {
      setFeedback({
        type: 'error',
        message: `Output was "${result.stdout}", expected "${room.answer}".`,
      })
      setShowHint(true)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="challenge__test-cases">
        <div className="challenge__test-cases-label">Expected output</div>
        <div className="challenge__test-case-row">{room.answer}</div>
      </div>

      <label className="challenge__label">Your code</label>
      <div className={`code-editor-wrap${solved ? ' code-editor-wrap--disabled' : ''}`}>
        <CodeMirror
          value={userInput}
          onChange={solved ? undefined : setUserInput}
          extensions={[python()]}
          editable={!solved}
          basicSetup={{
            lineNumbers: true,
            foldGutter: false,
            dropCursor: false,
            allowMultipleSelections: false,
            indentOnInput: true,
            highlightActiveLine: !solved,
          }}
        />
      </div>

      {!solved && (
        <button
          className="challenge__submit-btn"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Running…' : 'Run Code'}
        </button>
      )}

      {feedback && (
        <div
          className={`challenge__feedback challenge__feedback--${feedback.type}`}
          style={{ whiteSpace: 'pre-wrap' }}
        >
          {feedback.message}
        </div>
      )}

      {showHint && !solved && (
        <p className="challenge__hint">Hint: {room.hint}</p>
      )}
    </form>
  )
}
