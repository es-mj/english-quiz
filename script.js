let words = [];

let currentDay = null;
let quizWords = [];
let index = 0;
let wrongWords = [];
let completedDays = 
JSON.parse(localStorage.getItem("completedDays")) || [];

let mode = "EN_KO"; // EN_KO : 영어→한국어 / KO_EN : 한국어→영어
let testMode = false;
let score = 0;

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

const parsed = Papa.parse(data, {
  header:true,
  skipEmptyLines:true
});

  words = parsed.data;

  console.log(words);

  makeDays();

});



function makeDays(){

  dayList.innerHTML = "";

  const days = [...new Set(
    words
    .map(w=>w.DAY)
    .filter(day => day && day !== "DAY")
  )];


  days.forEach(day=>{

    const btn=document.createElement("button");


    if(completedDays.includes(day)){

      btn.textContent=`DAY ${day} ✅`;

    }else{

      btn.textContent=`DAY ${day}`;

    }


    btn.onclick=()=>startQuiz(day);


    dayList.appendChild(btn);

  });

}



function startQuiz(day){

  currentDay=day;
  testMode = false;
  score = 0;


  quizWords = words.filter(
    w=>w.DAY==day
  );


  quizWords.sort(
    ()=>Math.random()-0.5
  );


  // 문제 방향 랜덤
  mode = "EN_KO";


  index=0;


  dayScreen.classList.add("hidden");

  quizScreen.classList.remove("hidden");


  showQuestion();

}


function splitMeaning(text){

  const match =
  text.match(/^(n\.|v\.|adj\.|adv\.)\s*(.*)/);

  if(match){

    return {
      pos: match[1],
      meaning: match[2]
    };

  }


  return {
    pos:"",
    meaning:text
  };

}

function showQuestion(){
  

  const word = quizWords[index];


  progress.textContent =
  `${index+1}/${quizWords.length}`;



  if(mode==="EN_KO"){

    question.textContent =
    word.영어;

  }
  else{

    question.textContent =
    word.뜻;

  }



  answerInput.value="";

  result.textContent="";


  const meaning =
  splitMeaning(word.뜻);
  
  
  info.innerHTML =
  `
  <div class="pos">
  ${meaning.pos}
  </div>
  
  <div class="meaning">
  ${meaning.meaning}
  </div>
  `;


}




document
.getElementById("checkBtn")
.onclick=function(){


const word = quizWords[index];


const user =
answerInput.value.trim();



let correct;



if(mode==="EN_KO"){

  correct =
  word.뜻;

}
else{

  correct =
  word.영어;

}



if(
 user.toLowerCase()
 ==
 correct.toLowerCase()
){

 result.textContent="⭕ 정답";


if(testMode){

score++;

}


}else{

 result.textContent =
 `❌ 정답 : ${correct}`;

 wrongWords.push(word);

}



setTimeout(()=>{


 index++;


  if(index >= quizWords.length){

  if(testMode){

    alert(
    `시험 종료!\n점수 : ${score}/${quizWords.length}\n${score*5}점`
    );
    
    
    quizScreen.classList.add("hidden");
    
    dayScreen.classList.remove("hidden");
    
    return;
    
    }
  
  if(wrongWords.length > 0){
  
  const retry =
  confirm(
  `DAY 완료!\n틀린 단어 ${wrongWords.length}개 다시 풀까요?`
  );
  
  
  if(retry){
  
  quizWords = wrongWords;
  
  wrongWords=[];
  
  index=0;
  
  showQuestion();
  
  return;
  
  }
  
  }


  if(!completedDays.includes(currentDay)){

    completedDays.push(currentDay);
    
    localStorage.setItem(
    "completedDays",
    JSON.stringify(completedDays)
    );
    
  }
  
  alert(
  `DAY ${currentDay} 완료!`
  );


  quizScreen.classList.add("hidden");
  
  dayScreen.classList.remove("hidden");
  
  makeDays();


 }else{


   showQuestion();


 }



},1200);



};





document
.getElementById("speakBtn")
.onclick=function(){

if(index >= quizWords.length){
  return;
}

const word = quizWords[index];

const speech =
new SpeechSynthesisUtterance(word.영어);

speech.lang="en-US";
speech.rate=0.8;

speechSynthesis.speak(speech);

};


document
.getElementById("backBtn")
.onclick=function(){

quizScreen.classList.add("hidden");

dayScreen.classList.remove("hidden");

quizWords=[];
index=0;
wrongWords=[];

};


document.getElementById("modeBtn").onclick = () => {

  if(mode==="EN_KO"){
    mode="KO_EN";
  }else{
    mode="EN_KO";
  }

  index=0;
  showQuestion();

};
