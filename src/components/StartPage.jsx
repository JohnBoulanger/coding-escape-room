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
              The plan to break into the Harrington Federal Vault had been in motion for months,
              but the window of opportunity was short. A scheduled system maintenance cycle would
              leave the vault vulnerable for only 30 minutes before the security network reset
              and locked everything down again.
            </p>
            <p>
              The upgraded protection system replaced traditional locks with a series of digital
              safeguards, each controlled by code that had to be solved in the correct order.
              To complete the heist before time ran out, the team would need to work through
              every puzzle, disable the security one layer at a time, and recover the master
              code required to open the Harrington Federal Vault.
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
