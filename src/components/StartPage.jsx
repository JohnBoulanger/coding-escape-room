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
              You and your team were positioned outside the flagship TD Bank vault in Toronto,
              preparing to break in during a short maintenance window. Once inside, a silent
              alarm would trigger and give you exactly 30 minutes before the system locked
              the entire building down. Your team would be
              trapped unless you disabled the alarms from inside the vault. While your team
              handled the break-in, you and and a partner were positioned outside, tapped into
              the banks security system.
            </p>
            <p>
              The vault itself was locked behind many layers of software protection. Ten separate
              security systems stood between your team and the vault doors.
              Each layer requires you to understand the code, and disable
              each system before the next one would unlock.
            </p>
            <p className="start-page__warning">
              Once your team enters, lockdown activates in <strong>30 minutes</strong>. Are you ready?
            </p>
          </div>

          <button className="start-page__begin-btn" onClick={onStart}>
            Break In
          </button>

        </div>
      </div>
    </div>
  )
}