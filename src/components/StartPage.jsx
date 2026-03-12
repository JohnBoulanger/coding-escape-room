// ── StartPage ─────────────────────────────────────────────────────────────────
// The landing screen. Timer does not start until the student clicks Begin.
//
// Props:
//   onStart – called when the Begin Mission button is clicked

export default function StartPage({ onStart }) {
  return (
    <div className="app">
      <div className="app__inner">
        <div className="start-page">

          <h1 className="start-page__title">The Heist</h1>
          <p className="start-page__subtitle">Harrington Federal Vault</p>

          <div className="start-page__story">
            <p>
              You're inside. The job went sideways.
            </p>
            <p>
              Security activated the moment you touched the outer door.
              The vault has 10 layers — each one locked behind a code puzzle.
              Crack them all to reach the safe and get out.
            </p>
            <p>
              Each layer you crack reveals one digit of the master vault code.
              Collect all 10. Open the safe. Walk out clean.
            </p>
            <p className="start-page__warning">
              The silent alarm trips in <strong>30 minutes</strong>.
            </p>
          </div>

          <button className="start-page__begin-btn" onClick={onStart}>
            Begin
          </button>

        </div>
      </div>
    </div>
  )
}
