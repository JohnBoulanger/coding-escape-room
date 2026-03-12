// ── piston.js ─────────────────────────────────────────────────────────────────
// Thin wrapper around the Wandbox API (https://wandbox.org).
// Sends a complete Python 3 source file for execution.
// Returns { stdout, stderr, exitCode } — all strings, stdout/stderr trimmed.
//
// Wandbox is free, requires no API key, and supports CPython 3.12.
// Response fields: program_output, compiler_error, program_error, status

const WANDBOX_URL = 'https://wandbox.org/api/compile.json'

export async function runPython(code) {
  let res
  try {
    res = await fetch(WANDBOX_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        compiler: 'cpython-3.12.7',
      }),
    })
  } catch {
    throw new Error('Could not reach the compiler. Check your connection and try again.')
  }

  if (!res.ok) {
    throw new Error(`Compiler service returned an error (HTTP ${res.status}). Try again in a moment.`)
  }

  const data = await res.json()
  const stderr   = ((data.compiler_error ?? '') + (data.program_error ?? '')).trim()
  const stdout   = (data.program_output ?? '').trim()
  const exitCode = parseInt(data.status ?? '0', 10)

  return { stdout, stderr, exitCode }
}
