let words = [];
let currentDay = "";
let quizWords = [];
let currentIndex = 0;
let mode = "EN_KO";


// 화면 요소
const dayScreen = document.getElementById("dayScreen");
const quizScreen = document.getElementById("quizScreen");

const dayButtons = document.getElementById("dayButtons");

const dayTitle = document.getElementById("dayTitle");
const progress = document.getElementById("progress");

const wordType = document.getElementById("wordType");
const questionWord = document.getElementById("questionWord");
const answerText = document.getElementById("answerText");

const answerBox = document.getElementById("answerBox");


// 버튼
const backBtn = document.getElementById("backBtn");
const speakBtn = document.getElementById("speakBtn");
const showAnswerBtn = document.getElementById("showAnswerBtn");
const nextBtn = document.getElementById("nextBtn");
const modeBtn = document.getElementById("modeBtn");
const restartBtn = document.getElementById("restartBtn");


// 단어LIST
const listScreen = document.getElementById("listScreen");
const wordList = document.getElementById("wordList");
const listTitle = document.getElementById("listTitle");

const showListBtn = document.getElementById("showListBtn");
const listBackBtn = document.getElementById("listBackBtn");



const answerInput = document.getElementById("answerInput");

const dayActions = document.getElementById("dayActions");
const startBtn = document.getElementById("startBtn");
const showListBtn = document.getElementById("showListBtn");


// CSV 읽기
Papa.parse("words.csv", {
  download: true,
  header: true,
  skipEmptyLines: true,

  complete: function(result) {

    words = result.data;

    createDayButtons();

  }

});



// DAY 버튼 생성
function createDayButtons() {

  const days = [
    ...new Set(
      words.map(word => word.DAY)
    )
  ];


  dayButtons.innerHTML = "";


  days.forEach(day => {

    const btn = document.createElement("button");

    btn.textContent = "DAY " + day;


    btn.onclick = () => {

      startDay(day);

    };


    dayButtons.appendChild(btn);

  });

}



// DAY 시작
function startDay(day) {

  currentDay = day;


  quizWords = words.filter(
    word => word.DAY === day
  );


  currentIndex = 0;
  mode = "EN_KO";


  dayTitle.textContent = "DAY " + day;


  dayScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");


  showWord();

}



// 문제 표시
function showWord() {


  const item = quizWords[currentIndex];


  progress.textContent =
    `${currentIndex + 1} / ${quizWords.length}`;



  wordType.textContent =
    item.품사 || "";



  if(mode === "EN_KO") {

    questionWord.textContent =
      item.영어;


    answerText.textContent =
      item.뜻;


  } else {

    questionWord.textContent =
      item.뜻;


    answerText.textContent =
      item.영어;

  }



  answerBox.classList.add("hidden");

}



// 정답 보기
showAnswerBtn.onclick = () => {

  answerBox.classList.remove("hidden");

};



// 다음 문제
nextBtn.onclick = () => {

  currentIndex++;


  if(currentIndex >= quizWords.length) {

    alert("DAY 완료!");

    currentIndex = 0;

  }


  showWord();

};



// 발음
speakBtn.onclick = () => {


  const text =
    quizWords[currentIndex].영어;


  const utterance =
    new SpeechSynthesisUtterance(text);


  utterance.lang = "en-US";


  speechSynthesis.speak(
    utterance
  );

};



// 방향 변경
modeBtn.onclick = () => {


  if(mode === "EN_KO") {

    mode = "KO_EN";
    modeBtn.textContent = "KO → EN";

  } else {

    mode = "EN_KO";
    modeBtn.textContent = "EN → KO";

  }


  showWord();

};



// DAY 선택으로 돌아가기
backBtn.onclick = () => {

  quizScreen.classList.add("hidden");

  dayScreen.classList.remove("hidden");

};



// 다시 풀기
restartBtn.onclick = () => {

  currentIndex = 0;

  showWord();

};


// 전체 단어 보기
showListBtn.onclick = () => {


  quizScreen.classList.add("hidden");

  listScreen.classList.remove("hidden");


  listTitle.textContent =
    "DAY " + currentDay + " 전체 단어";


  wordList.innerHTML = "";


  quizWords.forEach(word => {


    const div =
      document.createElement("div");


    div.className =
      "word-item";


    div.innerHTML =
      `
      <b>${word.영어}</b>
      <br>
      ${word.뜻}
      `;


    wordList.appendChild(div);


  });


};



// 목록에서 돌아가기
listBackBtn.onclick = () => {


  listScreen.classList.add("hidden");

  quizScreen.classList.remove("hidden");


};
