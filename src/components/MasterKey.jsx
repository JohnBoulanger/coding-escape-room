// ── MasterKey ─────────────────────────────────────────────────────────────────
// Displays the 10-digit master override code, filling in each digit as rooms
// are solved. Unrevealed positions show a blank slot.
//
// Props:
//   keyDigits – array of 10 values; null = not yet revealed, string = digit

export default function MasterKey({ keyDigits }) {
  const anyRevealed = keyDigits.some(d => d !== null)

  return (
    <div className="master-key">
      <span className="master-key__label">Override Code</span>
      <div className="master-key__slots">
        {keyDigits.map((digit, i) => (
          <span
            key={i}
            className={`master-key__slot ${digit !== null ? 'master-key__slot--revealed' : 'master-key__slot--hidden'}`}
            aria-label={digit !== null ? `Digit ${i + 1}: ${digit}` : `Digit ${i + 1}: not yet revealed`}
          >
            {digit ?? '_'}
          </span>
        ))}
      </div>
      {!anyRevealed && (
        <span className="master-key__hint">Solve each subsystem to reveal a digit.</span>
      )}
    </div>
  )
}
