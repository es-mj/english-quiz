let words = [];

let currentDay = null;
let quizWords = [];
let index = 0;
let wrongWords = [];
let completedDays = 
JSON.parse(localStorage.getItem("completedDays")) || [];

let mode = "EN_KO"; // EN_KO : 영어→한국어 / KO_EN : 한국어→영어


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
  skipEmptyLines:true,
  delimiter:"\t"
});

  words = parsed.data;

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


  quizWords = words.filter(
    w=>w.DAY==day
  );


  quizWords.sort(
    ()=>Math.random()-0.5
  );


  // 문제 방향 랜덤
  mode =
  Math.random()>0.5
  ? "EN_KO"
  : "KO_EN";


  index=0;


  dayScreen.classList.add("hidden");

  quizScreen.classList.remove("hidden");


  showQuestion();

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


  info.textContent =
  `품사/뜻 : ${word.뜻}`;


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

}else{

 result.textContent =
 `❌ 정답 : ${correct}`;

 wrongWords.push(word);

}



setTimeout(()=>{


 index++;


  if(index >= quizWords.length){
  
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


const word =
quizWords[index];


const text =
word.영어;



const speech =
new SpeechSynthesisUtterance(text);



speech.lang="en-US";


speech.rate=0.8;


speechSynthesis.speak(
 speech
);



};





document
.getElementById("backBtn")
.onclick=function(){


quizScreen.classList.add("hidden");

dayScreen.classList.remove("hidden");


};


document
.getElementById("modeBtn")
.onclick=function(){

if(mode==="EN_KO"){
 mode="KO_EN";
 alert("한국어 → 영어 모드");
}
else{
 mode="EN_KO";
 alert("영어 → 한국어 모드");
}

showQuestion();

};



console.log("script loaded once");
