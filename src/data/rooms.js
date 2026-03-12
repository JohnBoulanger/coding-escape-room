// ── rooms.js ──────────────────────────────────────────────────────────────────
// All 10 room definitions for The Heist.
//
// Theme: You're locked inside Harrington Federal Vault. The job went sideways.
// Crack 10 security layers in 30 minutes to assemble the master code and escape.
//
// Master override code: 2743916850
// Key digit per room = answer.slice(-1) (last character of the correct answer)
//
// Room types:
//   'text'   — Python code shown as <pre>; student traces it and types the output
//   'python' — Python code shown in editor; student completes/fixes it, run via Wandbox
//
// For 'python' rooms, `answer` is the expected stdout (trimmed).

export const ROOMS = [
  // ── Room 1: The Access Log ────────────────────────────────────────────────
  // Type: text trace
  // Even-indexed elements: codes[0,2,4,6] = 14+31+58+79 = 182
  // key digit: 2
  {
    id: 1,
    title: 'Layer 1 — The Entry Turnstile',
    description:
      'The outer lobby doors are sealed. The rotating badge carousel is misreading access cards ' +
      'and only checking every other swipe. If the total doesn\'t match the expected audit number, ' +
      'the turnstile stays locked.',
    type: 'text',
    challenge:
`codes = [14, 23, 31, 42, 58, 67, 79]
total = 0
for i in range(0, len(codes), 2):
    total += codes[i]
print(total)`,
    answer: '182',
    hint: 'range(0, len(codes), 2) visits indices 0, 2, 4, 6. Only those elements are added to total.',
  },

  // ── Room 2: The Cipher Fragment ───────────────────────────────────────────
  // Type: text trace
  // "WBVMU": each char shifted -1 → V(86), A(65), U(85), L(76), T(84) → "VAULT"
  // key digit: T
  {
    id: 2,
    title: 'Layer 2 — The Radio Intercept',
    description:
      'A garbled transmission from inside the vault repeats a five-letter word. ' +
      'Someone shifted it to hide the message. Restore the original signal before the guards rotate frequencies.',
    type: 'text',
    challenge:
`word = "WBVMU"
decoded = ""
for ch in word:
    decoded += chr(ord(ch) - 1)
print(decoded)`,
    answer: 'VAULT',
    hint: 'ord(ch) gives the ASCII value of a character. chr() converts a number back to a character. Work through each letter.',
  },

  // ── Room 3: The Pattern Check ─────────────────────────────────────────────
  // Type: text trace
  // levels[2]=7 > levels[3]=6 → valid becomes False, loop continues but never resets
  // output: False   key digit: e
  {
    id: 3,
    title: 'Layer 3 — The Hallway Stabilizer',
    description:
      'The pressure plates in Corridor B are supposed to rise steadily as you move forward. ' +
      'A sudden drop triggers lockdown. Determine whether the system considers this sequence safe — or compromised.',
    type: 'text',
    challenge:
`levels = [3, 5, 7, 6, 9]
valid = True
for i in range(len(levels)-1):
    if levels[i] > levels[i+1]:
        valid = False
print(valid)`,
    answer: 'False',
    hint: 'The loop checks each adjacent pair. If any element is not strictly greater than the one before it, valid changes. Does that ever happen here?',
  },

  // ── Room 4: The Sort Gate ─────────────────────────────────────────────────
  // Type: text trace — one bubble-sort pass, print resulting array
  // [7, 3, 5, 2]:
  //   i=0: 7>3 → swap → [3, 7, 5, 2]
  //   i=1: 7>5 → swap → [3, 5, 7, 2]
  //   i=2: 7>2 → swap → [3, 5, 2, 7]
  // output: [3, 5, 2, 7]   key digit: ]
  {
    id: 4,
    title: 'Layer 4 — The Queue Regulator',
    description:
      'The internal access queue corrects itself with a single sweep before admitting personnel. ' +
      'After one adjustment cycle, the order stabilizes — at least partially. What does the line look like now?',
    type: 'text',
    challenge:
`arr = [7, 3, 5, 2]
for i in range(len(arr)-1):
    if arr[i] > arr[i+1]:
        arr[i], arr[i+1] = arr[i+1], arr[i]
print(arr)`,
    answer: '[3, 5, 2, 7]',
    normalizeWhitespace: true,
    hint: 'Step through each adjacent pair. When a swap happens, the array changes — and later comparisons use the updated array.',
  },

  // ── Room 5: The Guard Count ───────────────────────────────────────────────
  // Type: python debug — off-by-one: range(len-1) skips the last corridor
  // guards = [3, 1, 4, 2, 5]: correct sum = 15, buggy sum = 10
  // key digit: 5
  {
    id: 5,
    title: 'Layer 5 — The Patrol Ledger',
    description:
      'A digital ledger tracks how many guards are posted across each corridor. ' +
      'The current tally is off, and the system won\'t clear the alert until the count reflects every single hallway.',
    type: 'python',
    challenge:
`guards = [3, 1, 4, 2, 5]
total = 0
for i in range(len(guards) - 1):
    total += guards[i]
print(total)`,
    answer: '15',
    hint: 'Think carefully about which indices range() is actually visiting. Are all corridors being counted?',
  },

  // ── Room 6: The Max Detector ──────────────────────────────────────────────
  // Type: python — complete find_max(nums)
  // max([8, 14, 11, 5, 21]) = 21   key digit: 1
  {
    id: 6,
    title: 'Layer 6 — The Voltage Spike Detector',
    description:
      'The vault\'s internal power grid monitors its highest surge to prevent overload. ' +
      'It scans the recent readings and locks onto the peak value. Identify the spike before the breakers trip.',
    type: 'python',
    challenge:
`def find_max(nums):
    # Complete this function.
    # Return the largest number in the list.
    m = nums[0]
    for n in nums:
        pass  # add your logic
    return m

print(find_max([8, 14, 11, 5, 21]))`,
    answer: '21',
    hint: 'Compare each element n to the current best m. Update m whenever a larger value is found.',
  },

  // ── Room 7: The Grid Counter ──────────────────────────────────────────────
  // Type: text trace
  // Outer loop: 3 iterations × inner loop: 2 iterations = 6 total increments
  // key digit: 6
  {
    id: 7,
    title: 'Layer 7 — The Security Sweep Matrix',
    description:
      'A sweeping algorithm checks every zone intersection inside the core chamber. ' +
      'Each sweep increments a counter. The final number determines how many zones are armed.',
    type: 'text',
    challenge:
`count = 0
for i in range(3):
    for j in range(2):
        count += 1
print(count)`,
    answer: '6',
    hint: 'Every time the inner loop body runs, count increases by 1. Work out how many times that happens in total.',
  },

  // ── Room 8: The Threshold Filter ──────────────────────────────────────────
  // Type: python — complete sum_above(nums, threshold)
  // Elements > 9: 12, 16, 10 → sum = 38   key digit: 8
  // Chained: references Room 5 answer (solvedAnswers[4] = "9")
  {
    id: 8,
    title: 'Layer 8 — The Threshold Filter',
    description:
      'Inside the vault\'s inner chamber, the communication feed is full of background interference. ' +
      'The system only tallies signals that rise above the noise floor. Isolate the meaningful transmissions.',
    type: 'python',
    challenge:
`def sum_above(nums, threshold):
    # Complete this function.
    # Return the sum of all elements strictly greater than threshold.
    total = 0
    for n in nums:
        pass  # add your logic
    return total

print(sum_above([5, 12, 3, 16, 7, 8, 10, 4], 9))`,
    answer: '38',
    hint: 'Only add n to total when n is strictly greater than threshold. Otherwise skip it.',
  },

  // ── Room 9: The Running Total ─────────────────────────────────────────────
  // Type: python — fix accumulator bug: `total = n` should be `total += n`
  // 5+10+15+20+25+30 = 105   key digit: 5
  {
    id: 9,
    title: 'Layer 9 — The Gold Counter',
    description:
      'The internal counter that tracks asset transfers is malfunctioning. ' +
      'Instead of accumulating weight, it keeps resetting. Fix the logic before the final chamber refuses access.',
    type: 'python',
    challenge:
`nums = [5, 10, 15, 20, 25, 30]
total = 0
for n in nums:
    total = n
print(total)`,
    answer: '105',
    hint: 'Trace what total holds after each iteration. Think about what operation should be happening each step.',
  },

  // ── Room 10: The Prime Gate ───────────────────────────────────────────────
  // Type: python — complete is_prime(n)
  // Primes in range(2, 30): 2,3,5,7,11,13,17,19,23,29 → count = 10
  // key digit: 0
  {
    id: 10,
    title: 'Layer 10 — The Master Override Console',
    description:
      'The final console accepts only prime-coded signals. Every other input is rejected instantly. ' +
      'Only once the correct number of valid signals is recognized will the vault release the override sequence.',
    type: 'python',
    challenge:
`def is_prime(n):
    # Complete this function.
    # Return True if n is prime, False otherwise.
    return False  # replace with correct logic

count = 0
for i in range(2, 30):
    if is_prime(i):
        count += 1
print(count)`,
    answer: '10',
    hint: 'A prime is divisible only by 1 and itself. Test every integer from 2 up to n-1 as a potential divisor. Return False immediately if any divides evenly.',
  },
]
