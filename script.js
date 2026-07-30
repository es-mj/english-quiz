let words = [];

let currentDay = null;
let quizWords = [];
let index = 0;


const dayScreen = document.getElementById("dayScreen");
const quizScreen = document.getElementById("quizScreen");

const dayList = document.getElementById("dayList");

const question = document.getElementById("question");
const answerInput = document.getElementById("answerInput");
const result = document.getElementById("result");
const info = document.getElementById("info");

const progress = document.getElementById("progress");


fetch("words.csv")
.then(res => res.text())
.then(data => {

  const parsed = Papa.parse(data,{
    header:true,
    skipEmptyLines:true
  });

  words = parsed.data;

  makeDays();

});



function makeDays(){

  const days = [...new Set(words.map(w=>w.DAY))];


  days.forEach(day=>{

    const btn=document.createElement("button");

    btn.textContent=`DAY ${day}`;

    btn.onclick=()=>startQuiz(day);

    dayList.appendChild(btn);

  });

}



function startQuiz(day){

  currentDay=day;

  quizWords=words.filter(
    w=>w.DAY==day
  );

  quizWords.sort(()=>Math.random()-0.5);


  index=0;


  dayScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");


  showQuestion();

}



function showQuestion(){

  const word=quizWords[index];


  progress.textContent=
  `${index+1}/${quizWords.length}`;


  question.textContent=
  word.영어;


  answerInput.value="";
  result.textContent="";

  info.textContent=
  `품사/뜻 : ${word.뜻}`;


}



document
.getElementById("checkBtn")
.onclick=function(){


const word=quizWords[index];


const answer=
answerInput.value.trim();


if(answer===word.뜻){

 result.textContent="⭕ 정답";

}else{

 result.textContent=
 `❌ 정답 : ${word.뜻}`;

}


setTimeout(()=>{

 index++;

 if(index>=quizWords.length){

   alert("DAY 완료!");

   quizScreen.classList.add("hidden");
   dayScreen.classList.remove("hidden");

 }else{

   showQuestion();

 }

},1200);



};



document
.getElementById("speakBtn")
.onclick=function(){

const text=quizWords[index].영어;

const speech=
new SpeechSynthesisUtterance(text);

speech.lang="en-US";

speechSynthesis.speak(speech);

};



document
.getElementById("backBtn")
.onclick=function(){

quizScreen.classList.add("hidden");
dayScreen.classList.remove("hidden");

};
