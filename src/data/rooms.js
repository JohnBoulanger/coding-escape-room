export const ROOMS = [
  // ── Room 1: The Access Log ────────────────────────────────────────────────
  // Type: text trace
  // Even-indexed elements: codes[0,2,4,6] = 14+31+58+79 = 182
  {
    id: 1,
    title: 'Layer 1 — The Entry',
    description:
      'The outer lobby doors are sealed. The ID card reader is misreading your fake access cards ' +
      'and only checking every other swipe. If the total doesn\'t match the expected audit number, ' +
      'the doors stay locked. Which IDs are being read into the total?',
    type: 'text',
    challenge:
`ids = [14, 23, 31, 42, 58, 67, 79]
total = 0
for i in range(0, len(ids), 2):
    total += ids[i]
print(total)`,
    answer: '182',
    hint: 'range(0, len(ids), 2) visits indices 0, 2, 4, 6. Only those elements are added to total.',
    clue: {
      title: 'Factor Check',
      hint: 'The turnstile has a secondary filter: it only trusts IDs that are exact multiples of 7. How many of the IDs in the original list would pass this filter?',
    },
  },

  // ── Room 2: The Cipher Fragment ───────────────────────────────────────────
  // Type: text trace
  // "WBVMU": each char shifted -1 → V(86), A(65), U(85), L(76), T(84) → "VAULT"
  {
    id: 2,
    title: 'Layer 2 — Radio Chatter',
    description:
      'A garbled transmission from inside the vault repeats a five-letter word. ' +
      'Someone shifted its characters it to hide the message. The following code restores the original signal before the guards rotate frequencies. What did they say?',
    type: 'text',
    challenge:
`word = "WBVMU"
decoded = ""
for ch in word:
    decoded += chr(ord(ch) - 1)
print(decoded)`,
    answer: 'VAULT',
    hint: 'ord(ch) gives the ASCII value of a character. chr() converts a number back to a character. Work through each letter.',
    clue: {
      title: "Shifty Transmission",
      hint: 'As you traveled deeper into the vault, the transmission became garbled once more. The same message you resolved was now RWQHP. How far has it shifted?',
    },
  },

  // ── Room 3: The Pattern Check ─────────────────────────────────────────────
  // Type: text trace
  // levels[2]=7 > levels[3]=6 → valid becomes False, loop continues but never resets
  {
    id: 3,
    title: 'Layer 3 — Clearance Check',
    description:
      'The vault requires each stage of the entry sequence to increase in clearance level. Does the vault accept this sequence? ',
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
    clue: {
      title: 'Pair Audit',
      hint: 'The validator scanned every adjacent pair in the sequence. Count how many of those pairs were already in strictly increasing order.',
    },
  },

  // ── Room 4: The Sort Gate ─────────────────────────────────────────────────
  // Type: text trace — one bubble-sort pass, print resulting array
  // [7, 3, 5, 2]:
  //   i=0: 7>3 → swap → [3, 7, 5, 2]
  //   i=1: 7>5 → swap → [3, 5, 7, 2]
  //   i=2: 7>2 → swap → [3, 5, 2, 7]
  {
    id: 4,
    title: 'Layer 4 — The Clearance Buffer',
    description: 'Your team has bypassed the outer security and reached an internal staging system. ' +
      'Before moving deeper, the vault runs a quick reordering cycle on its clearance buffer. ' + 
      'After this single pass through the system, what order does the buffer hold?',
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
    clue: {
      title: 'The bubble sweep',
      hint: 'From the partially sorted gate, find the element that moved the farthest from where it began.',
    },
  },

  // ── Room 5: The Guard Count ───────────────────────────────────────────────
  // Type: python debug — off-by-one: range(len-1) skips the last corridor
  // guards = [3, 1, 4, 2, 5]: correct sum = 15, buggy sum = 10
  {
    id: 5,
    title: 'Layer 5 — The Patrol Ledger',
    description:
      'A digital ledger tracks how many guards are posted across each corridor. ' +
      'The current tally is off, and the system won\'t clear the alert until the count reads from every single hallway. Fix the code so it counts all the guards.',
    type: 'python',
    challenge:
`guards = [3, 1, 4, 2, 5]
total = 0
for i in range(len(guards) - 1):
    total += guards[i]
print(total)`,
    answer: '15',
    hint: 'Think carefully about which indices range() is actually visiting. Are all corridors being counted?',
    clue: {
      title: 'The Excluded Index',
      hint: 'The bug caused exactly one corridor to be skipped entirely. What is the 0-based index of the corridor that was never counted in the original buggy code?',
    },
  },

  // ── Room 6: The Max Detector ──────────────────────────────────────────────
  // Type: python — complete find_max(nums)
  // max([8, 14, 11, 5, 21]) = 21
  {
    id: 6,
    title: 'Layer 6 — The Voltage Spike Detector',
    description:
      'The vault\'s internal power grid monitors its highest surge to prevent overload. ' +
      'It scans the recent readings and locks onto the peak value. Identify the spike before the breakers trip and sound an alarm.',
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
    clue: {
      title: 'Tracker Updates',
      hint: 'As the detector scanned each reading from left to right, how many times did the tracked maximum actually change to a new, higher value?',
    },
  },

  // ── Room 7: The Grid Counter ──────────────────────────────────────────────
  // Type: text trace
  // Outer loop: 3 iterations × inner loop: 2 iterations = 6 total increments
  {
    id: 7,
    title: 'Layer 7 — The Vault Grid Scan',
    description: 'Before reaching the inner vault, the system runs a grid scan across its remaining defenses. ' +
    'Each intersection is checked in sequence, and every check increases the armed counter. ' +
    'After the scan completes, what number is displayed?',
    type: 'text',
    challenge:
`count = 0
for i in range(3):
    for j in range(2):
        count += 1
print(count)`,
    answer: '6',
    hint: 'Every time the inner loop body runs, count increases by 1. Work out how many times that happens in total.',
    clue: {
      title: 'Power scales faster than growth',
      hint: 'The grid sweep uses a nested loop. If its time complexity is written as O(n^k), what is k?',
    },
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
      'The system only reads signals that rise above the noise threshold. Isolate the meaningful transmissions and find their sum to decipher it.',
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
    clue: {
      title: 'Tightening the Filter',
      hint: 'Security hardens: the threshold rises from 9 to 10. Using the original list, how many values would now FAIL the filter?',
    },
  },

  // ── Room 9: The Running Total ─────────────────────────────────────────────
  // Type: python — fix accumulator bug: `total = n` should be `total += n`
  // 5+10+15+20+25+30 = 105
  {
    id: 9,
    title: 'Layer 9 — The Dual-Key Authorization',
    description:
      'Your team reaches the final security checkpoint before the vault core. ' +
      'The system requires both a valid override code and biometric confirmation before it will proceed. ' +
      'Right now, the authorization logic is flawed. Update the code so it achieves the correct behaviour.',
    type: 'python',
    challenge:
`code_verified = True
biometric_verified = False

if code_verified or biometric_verified:
    print("ACCESS GRANTED")
else:
    print("ACCESS DENIED")`,
    answer: 'ACCESS DENIED',
    hint: 'Think carefully about the difference between logical AND and OR. When should access truly be granted?',
    clue: {
      title: 'Operator Precedence',
      hint: "Python has three logical operators: `not`, `and`, and `or`. How many of them rank higher in Python's operator precedence table than `or`?",
    },
  },

  // ── Room 10: The Prime Gate ───────────────────────────────────────────────
  // Type: python — complete is_prime(n)
  // Primes in range(2, 30): 2,3,5,7,11,13,17,19,23,29 → count = 10
  {
    id: 10,
    title: 'Layer 10 — The Master Override Console',
    description:
      'The final console accepts only prime-coded signals. Every other input is rejected instantly. ' +
      'Complete the code determine which signals can be sent to gain access to the vault room.',
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
    clue: {
      title: 'Cracking the seal',
      hint: 'Your final algorithm brought you into the vault room. What is the sum of the prime factors of your result?',
    },
  },
]
