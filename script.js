let numbers=[]
let drawn=[]
let bingoScores=[]

let selectedCell=null

const lines=[
[0,1,2],
[3,4,5],
[6,7,8],
[0,3,6],
[1,4,7],
[2,5,8],
[0,4,8],
[2,4,6]
]

createCardGrid()
createPad()

function showHost(){
  hideAll()
  hostScreen.classList.remove("hidden")
}

function showPlayer(){
  hideAll()
  playerScreen.classList.remove("hidden")
}

function backTop(){
  hideAll()
  topScreen.classList.remove("hidden")
}

function hideAll(){
  topScreen.classList.add("hidden")
  hostScreen.classList.add("hidden")
  playerScreen.classList.add("hidden")
}

function createCardGrid(){

  for(let i=0;i<9;i++){

    const cell=document.createElement("div")

    cell.className="cell"

    cell.onclick=()=>{
      document.querySelectorAll("#cardGrid .cell")
      .forEach(c=>c.classList.remove("selected"))

      cell.classList.add("selected")
      selectedCell=cell
    }

    cardGrid.appendChild(cell)

  }

}

function createPad(){

  for(let i=1;i<=20;i++){

    const btn=document.createElement("button")

    btn.textContent=i

    btn.onclick=()=>placeNumber(i)

    numberPad.appendChild(btn)

  }

}

function placeNumber(num){

  if(!selectedCell)return

  selectedCell.textContent=num
  selectedCell.dataset.num=num

  updatePad()
  checkCardComplete()

}

function updatePad(){

  const used=[...document.querySelectorAll("#cardGrid .cell")]
  .map(c=>c.dataset.num)

  document.querySelectorAll("#numberPad button")
  .forEach(btn=>{
    if(used.includes(btn.textContent)){
      btn.classList.add("used")
    }else{
      btn.classList.remove("used")
    }
  })

}

function generateCard(){

  const nums=[]

  while(nums.length<9){
    const n=Math.floor(Math.random()*20)+1
    if(!nums.includes(n))nums.push(n)
  }

  document.querySelectorAll("#cardGrid .cell")
  .forEach((c,i)=>{
    c.textContent=nums[i]
    c.dataset.num=nums[i]
  })

  updatePad()
  checkCardComplete()

}

function checkCardComplete(){

  const cells=[...document.querySelectorAll("#cardGrid .cell")]

  const filled=cells.every(c=>c.dataset.num)

  document.getElementById("startButton").disabled=!filled

}

function startPlay(){

  const nums=[...document.querySelectorAll("#cardGrid .cell")]
  .map(c=>parseInt(c.dataset.num))

  if(nums.includes(NaN)||nums.length!==new Set(nums).size){
    alert("数字を正しく入力")
    return
  }

  playCard.innerHTML=""

  nums.forEach(n=>{

    const cell=document.createElement("div")

    cell.className="cell"
    cell.textContent=n
    cell.dataset.num=n

    cell.onclick=()=>toggleCell(cell)

    playCard.appendChild(cell)

  })

  createScreen.classList.add("hidden")
  playScreen.classList.remove("hidden")

}

function toggleCell(el){
  el.classList.toggle("hit")
  updateReach()
  checkBingo()
}

function updateReach(){

  const cells=document.querySelectorAll("#playCard .cell")

  cells.forEach(c=>{
    c.classList.remove("reachNumber")
    c.classList.remove("reachLine")
  })

  let reach=0

  lines.forEach(line=>{

    const hits=line.filter(i=>cells[i].classList.contains("hit"))

    if(hits.length===2){

      reach++

      line.forEach(i=>{

        if(!cells[i].classList.contains("hit")){
          cells[i].classList.add("reachNumber")
        }else{
          cells[i].classList.add("reachLine")
        }

      })

    }

  })

  reachCount.textContent=reach>0?reach+" リーチ":""

}

function checkBingo(){

  const cells=document.querySelectorAll("#playCard .cell")
  const nums=[...cells].map(c=>parseInt(c.dataset.num))

  const bingoLines=[]

  lines.forEach(line=>{
    if(line.every(i=>cells[i].classList.contains("hit"))){
      bingoLines.push(line)
    }
  })

  if(bingoLines.length===0)return

  reachCount.textContent=""

  let score

  if(bingoLines.length===1){

    score=bingoLines[0].reduce((a,i)=>a+nums[i],0)

  }else{

    const set=new Set()

    bingoLines.forEach(l=>{
      l.forEach(i=>set.add(nums[i]))
    })

    score=[...set].reduce((a,b)=>a+b,0)

  }

  bingoResult.innerHTML = `
    <div class="bingoText">
      ✨ BINGO ✨
    </div>
    <div>
      ${score}
    </div>
  `

  document.body.classList.add("bingoFlash")

  setTimeout(()=>{
    document.body.classList.remove("bingoFlash")
  },800)

}

function weightedRandom(){

  const pool=[...Array(20).keys()].map(n=>n+1)
  .filter(n=>!drawn.includes(n))

  const total=pool.reduce((a,b)=>a+b,0)

  const r=Math.random()*total

  let sum=0

  for(const n of pool){
    sum+=n
    if(r<=sum)return n
  }

}

function draw(){

  if(drawn.length===20) return

  const rollSound = document.getElementById("rollSound")
  const endSound = document.getElementById("endSound")

  rollSound.currentTime = 0
  rollSound.play()

  let count = 0

  const interval = setInterval(()=>{

    const random = Math.floor(Math.random()*20)+1
    result.textContent = random

    count++

    if(count > 15){

      clearInterval(interval)

      const n = weightedRandom()

      drawn.push(n)

      rollSound.pause()
      endSound.currentTime = 0
      endSound.play()

      result.textContent = n

      const div = document.createElement("div")
      div.textContent = n
      log.prepend(div)

    }

  },60)

}

function addScore(){

  const n=parseInt(bingoInput.value)

  if(!n)return

  const base=Math.ceil(n/10)

  const bonus=bingoScores
  .map(v=>Math.ceil(v/10))
  .reduce((a,b)=>a+b,0)

  const score=base+bonus

  bingoScores.push(n)

  const rank=bingoScores.length

  const div=document.createElement("div")

  div.textContent=rank+"着 : "+n+" → "+score

  scoreList.appendChild(div)

  bingoInput.value=""

}

if("serviceWorker" in navigator){
  navigator.serviceWorker.register("sw.js")
}
