let numbers = []
let drawn = []
let bingoScores = []

const lines = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
]

initNumbers()
createInputs()

function initNumbers() {
  numbers = []
  for (let i = 1; i <= 20; i++) {
    numbers.push(i)
  }
}

function createInputs() {
  const grid = document.getElementById("inputGrid")
  for (let i = 0; i < 9; i++) {
    const input = document.createElement("input")
    input.type = "number"
    input.min = 1
    input.max = 20
    grid.appendChild(input)
  }
}

function showHost() {
  hideAll()
  document.getElementById("hostScreen").classList.remove("hidden")
}

function showPlayer() {
  hideAll()
  document.getElementById("playerScreen").classList.remove("hidden")
}

function backTop() {
  hideAll()
  document.getElementById("topScreen").classList.remove("hidden")
}

function hideAll() {
  document.getElementById("topScreen").classList.add("hidden")
  document.getElementById("hostScreen").classList.add("hidden")
  document.getElementById("playerScreen").classList.add("hidden")
}

function weightedRandom() {
  const pool = numbers.filter(n => !drawn.includes(n))
  const total = pool.reduce((a,b) => a + b, 0)
  const r = Math.random() * total
  let sum = 0

  for (const n of pool) {
    sum += n
    if (r <= sum) return n
  }
}

function draw() {
  if (drawn.length === 20) return

  const n = weightedRandom()
  drawn.push(n)

  document.getElementById("result").textContent = n

  const div = document.createElement("div")
  div.textContent = n
  document.getElementById("log").prepend(div)
}

function generateCard() {
  const inputs = document.querySelectorAll("#inputGrid input")
  const nums = []

  while (nums.length < 9) {
    const n = Math.floor(Math.random() * 20) + 1
    if (!nums.includes(n)) nums.push(n)
  }

  inputs.forEach((i, idx) => {
    i.value = nums[idx]
  })
}

function startPlay() {
  const inputs = document.querySelectorAll("#inputGrid input")
  const nums = []

  for (const i of inputs) {
    const v = parseInt(i.value)
    if (!v || v < 1 || v > 20) {
      alert("1〜20で入力")
      return
    }
    if (nums.includes(v)) {
      alert("数字が重複")
      return
    }
    nums.push(v)
  }

  const play = document.getElementById("playCard")
  play.innerHTML = ""

  nums.forEach(n => {
    const cell = document.createElement("div")
    cell.className = "cell"
    cell.textContent = n
    cell.dataset.num = n
    cell.onclick = () => toggleCell(cell)
    play.appendChild(cell)
  })

  document.getElementById("createScreen").classList.add("hidden")
  document.getElementById("playScreen").classList.remove("hidden")
}

function toggleCell(el) {
  el.classList.toggle("hit")
  updateReach()
  checkBingo()
}

function updateReach() {
  const cells = document.querySelectorAll("#playCard .cell")

  cells.forEach(c => {
    c.classList.remove("reachNumber")
    c.classList.remove("reachLine")
  })

  let reach = 0

  lines.forEach(line => {
    const hits = line.filter(i => cells[i].classList.contains("hit"))

    if (hits.length === 2) {
      reach++

      line.forEach(i => {
        if (!cells[i].classList.contains("hit")) {
          cells[i].classList.add("reachNumber")
        } else {
          cells[i].classList.add("reachLine")
        }
      })
    }
  })

  document.getElementById("reachCount").textContent =
    reach > 0 ? reach + " リーチ" : ""
}

function checkBingo() {
  const cells = document.querySelectorAll("#playCard .cell")
  const nums = [...cells].map(c => parseInt(c.dataset.num))
  const bingoLines = []

  lines.forEach(line => {
    if (line.every(i => cells[i].classList.contains("hit"))) {
      bingoLines.push(line)
    }
  })

  if (bingoLines.length === 0) return

  document.getElementById("reachCount").textContent = ""

  let score

  if (bingoLines.length === 1) {
    score = bingoLines[0].reduce((a,i) => a + nums[i], 0)
  } else {
    const set = new Set()
    bingoLines.forEach(l => {
      l.forEach(i => set.add(nums[i]))
    })
    score = [...set].reduce((a,b) => a + b, 0)
  }

  document.getElementById("bingoResult").textContent = "BINGO : " + score
}

function addScore() {
  const input = document.getElementById("bingoInput")
  const n = parseInt(input.value)
  if (!n) return

  const base = Math.ceil(n / 10)

  const bonus = bingoScores
    .map(v => Math.ceil(v / 10))
    .reduce((a,b) => a + b, 0)

  const score = base + bonus

  bingoScores.push(n)

  const div = document.createElement("div")
  div.textContent = "入力:" + n + " → " + score

  document.getElementById("scoreList").appendChild(div)
  input.value = ""
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js")
}
