let numbers=[]
let drawn=[]
let bingoScores=[]


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


initNumbers()



function initNumbers(){

numbers=[]

for(let i=1;i<=20;i++){

numbers.push(i)

}

}



function showHost(){

hideAll()

document.getElementById("hostScreen").classList.remove("hidden")

}



function showPlayer(){

hideAll()

document.getElementById("playerScreen").classList.remove("hidden")

}



function backTop(){

hideAll()

document.getElementById("topScreen").classList.remove("hidden")

}



function hideAll(){

document.getElementById("topScreen").classList.add("hidden")

document.getElementById("hostScreen").classList.add("hidden")

document.getElementById("playerScreen").classList.add("hidden")

}



function weightedRandom(){

let pool=numbers.filter(n=>!drawn.includes(n))

let total=pool.reduce((a,b)=>a+b,0)

let r=Math.random()*total

let sum=0

for(let n of pool){

sum+=n

if(r<=sum)return n

}

}



function draw(){

if(drawn.length===20)return

let n=weightedRandom()

drawn.push(n)

document.getElementById("result").textContent=n

let log=document.getElementById("log")

let div=document.createElement("div")

div.textContent=n

log.prepend(div)

}



function generateCard(){

let nums=[]

while(nums.length<9){

let n=Math.floor(Math.random()*20)+1

if(!nums.includes(n))nums.push(n)

}

let card=document.getElementById("card")

card.innerHTML=""

nums.forEach(n=>{

let cell=document.createElement("div")

cell.className="cell"

cell.textContent=n

cell.dataset.num=n

card.appendChild(cell)

})

}



function startPlay(){

let card=document.getElementById("card")

let playCard=document.getElementById("playCard")

playCard.innerHTML=card.innerHTML

document.getElementById("createScreen").classList.add("hidden")

document.getElementById("playScreen").classList.remove("hidden")

document.querySelectorAll("#playCard .cell").forEach(c=>{

c.onclick=()=>toggleCell(c)

})

}



function toggleCell(el){

el.classList.toggle("hit")

updateReach()

checkBingo()

}



function updateReach(){

let cells=document.querySelectorAll("#playCard .cell")

cells.forEach(c=>{

c.classList.remove("reachNumber")

c.classList.remove("reachLine")

})

let reachCount=0

lines.forEach(line=>{

let hits=line.filter(i=>cells[i].classList.contains("hit"))

if(hits.length===2){

reachCount++

line.forEach(i=>{

if(!cells[i].classList.contains("hit")){

cells[i].classList.add("reachNumber")

}

else{

cells[i].classList.add("reachLine")

}

})

}

})

let text=""

if(reachCount>0){

text=reachCount+" リーチ"

}

document.getElementById("reachCount").textContent=text

}



function checkBingo(){

let cells=document.querySelectorAll("#playCard .cell")

let nums=[...cells].map(c=>parseInt(c.dataset.num))

let bingoLines=[]

lines.forEach(line=>{

if(line.every(i=>cells[i].classList.contains("hit")))

bingoLines.push(line)

})

if(bingoLines.length===0)return

let score

if(bingoLines.length===1){

score=bingoLines[0].reduce((a,i)=>a+nums[i],0)

}

else{

let set=new Set()

bingoLines.forEach(l=>{

l.forEach(i=>set.add(nums[i]))

})

score=[...set].reduce((a,b)=>a+b,0)

}

document.getElementById("bingoResult").textContent="BINGO : "+score

}



function addScore(){

let input=document.getElementById("bingoInput")

let n=parseInt(input.value)

if(!n)return

let base=Math.ceil(n/10)

let bonus=bingoScores

.map(v=>Math.ceil(v/10))

.reduce((a,b)=>a+b,0)

let score=base+bonus

bingoScores.push(n)

let div=document.createElement("div")

div.textContent="入力:"+n+" → "+score

document.getElementById("scoreList").appendChild(div)

input.value=""

}



if("serviceWorker" in navigator){

navigator.serviceWorker.register("sw.js")

}
