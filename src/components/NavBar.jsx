// ── NavBar ────────────────────────────────────────────────────────────────────
// Row of 10 numbered subsystem buttons. Students can navigate to any room
// they have already unlocked (index <= highestUnlocked). Locked rooms are
// disabled. The currently viewed room is highlighted.
//
// Props:
//   rooms           – ROOMS array (used for length and titles)
//   viewingRoom     – index of the room currently displayed
//   highestUnlocked – furthest accessible room index
//   solvedAnswers   – array of answers (null = unsolved)
//   onNavigate      – called with the room index when a button is clicked

export default function NavBar({ rooms, viewingRoom, highestUnlocked, solvedAnswers, onNavigate }) {
  return (
    <nav className="nav-bar" aria-label="Subsystem navigation">
      {rooms.map((room, i) => {
        const isSolved  = solvedAnswers[i] !== null
        const isCurrent = i === viewingRoom
        const isLocked  = i > highestUnlocked

        let modifier = 'nav-bar__btn--locked'
        if (isSolved)       modifier = 'nav-bar__btn--solved'
        else if (isCurrent) modifier = 'nav-bar__btn--current'
        else if (!isLocked) modifier = 'nav-bar__btn--unlocked'

        return (
          <button
            key={i}
            className={`nav-bar__btn ${modifier}`}
            onClick={() => onNavigate(i)}
            disabled={isLocked}
            aria-label={`Subsystem ${i + 1}${isSolved ? ' (solved)' : isLocked ? ' (locked)' : ''}`}
            aria-current={isCurrent ? 'page' : undefined}
            title={room.title}
          >
            {i + 1}
          </button>
        )
      })}
    </nav>
  )
}
