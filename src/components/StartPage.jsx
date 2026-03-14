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

          <h1 className="start-page__title">The Bank Heist</h1>
          <p className="start-page__subtitle">TD Bank – Toronto Main Vault</p>

          <div className="start-page__story">
            <p>
              You and your team were positioned outside the main TD Bank vault in Toronto,
              preparing to break in during a short maintenance window. Once inside, a silent
              alarm would trigger and give you exactly 30 minutes before the system locked
              the entire building down. Red lights would flash across the control panels,
              security doors would begin sealing floor by floor, and your team would be
              trapped unless you disabled the vault from the inside. While they handled
              the physical entry, you were connected remotely to the vault’s digital core.
            </p>
            <p>
              The vault itself was locked behind layers of software protection. Ten separate
              security systems stood between your team and the central lock mechanism.
              Each layer required you to understand the code controlling it and disable
              the safeguard before the next one would unlock. Every solved layer revealed
              part of a hidden master override sequence.
            </p>
            <p className="start-page__warning">
              The full lockdown activates in <strong>30 minutes</strong>.
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