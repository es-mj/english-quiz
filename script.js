let words = [];
let currentDay = "";
let quizWords = [];
let currentIndex = 0;
let mode = "EN_KO";

// 틀린 단어
let wrongWords = [];
let isRetry = false;

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
const checkBtn = document.getElementById("checkBtn");
const nextBtn = document.getElementById("nextBtn");
const modeBtn = document.getElementById("modeBtn");
const restartBtn = document.getElementById("restartBtn");


// 단어 LIST
const listScreen = document.getElementById("listScreen");
const wordList = document.getElementById("wordList");
const listTitle = document.getElementById("listTitle");
const listBackBtn = document.getElementById("listBackBtn");


// 정답 입력
const answerInput = document.getElementById("answerInput");


// DAY 선택 후 버튼
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
    
      currentDay = day;
    
      quizWords = words.filter(
        word => word.DAY === day
      );
    
    
      // 기존 선택 DAY의 색상 제거
      document
        .querySelectorAll(".day-buttons button")
        .forEach(button => {
          button.classList.remove("selected");
        });
    
    
      // 현재 선택한 DAY의 색상 적용
      btn.classList.add("selected");
    
    
      dayActions.classList.remove("hidden");
    
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
  wrongWords = [];


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

  if (mode === "EN_KO") {

    questionWord.textContent =
      item.영어;

    answerText.textContent =
      item.뜻;

    answerInput.placeholder =
      "한국어 뜻 입력";

  } else {

    questionWord.textContent =
      item.뜻;

    answerText.textContent =
      item.영어;

    answerInput.placeholder =
      "영어 단어 입력";

  }

  answerInput.value = "";

  answerBox.classList.add("hidden");

  answerInput.disabled = false;
  answerInput.blur();

  checkBtn.disabled = false;
  nextBtn.disabled = true;

}


// 정답 확인
checkBtn.onclick = () => {

  const item = quizWords[currentIndex];


  // 채점용 문자열 정리
  function normalizeAnswer(text) {

    return text
      .trim()
      .toLowerCase()

      // 품사 제거
      .replace(/^(v\.|n\.|a\.|adj\.|adv\.|prep\.|conj\.|pron\.|det\.|aux\.)\s*/i, "")

      // 물결표 제거
      .replace(/~/g, "")

      // 공백 제거
      .replace(/\s+/g, "");

  }


  const userAnswer =
    normalizeAnswer(answerInput.value);


  if (!userAnswer) {

    alert("정답을 입력해주세요.");

    answerInput.focus();

    return;

  }


  let correctAnswers = [];


  if (mode === "EN_KO") {

    correctAnswers = item.뜻
      .split(",")
      .map(answer =>
        normalizeAnswer(answer)
      )
      .filter(answer => answer);

  } else {

    correctAnswers = item.영어
      .split(",")
      .map(answer =>
        normalizeAnswer(answer)
      )
      .filter(answer => answer);

  }


  const isCorrect =
    correctAnswers.includes(userAnswer);


  answerBox.classList.remove("hidden");


  if (isCorrect) {
  
    answerText.textContent =
      "⭕ 정답!";
  
  } else {
  
    answerText.textContent =
      `❌ 오답\n정답: ${item.뜻}`;
  
    // 오답 저장
    if (!wrongWords.includes(item)) {
      wrongWords.push(item);
    }
  
  }


  answerInput.disabled = true;

  checkBtn.disabled = true;

  nextBtn.disabled = false;

};

// 다음 문제
nextBtn.onclick = () => {

  currentIndex++;


  // 현재 문제 목록이 끝났을 때
  if (currentIndex >= quizWords.length) {

    // 오답 재시험 중
    if (isRetry) {

      if (wrongWords.length === 0) {

        alert("🎉 오답을 모두 맞혔어요!");

        currentIndex = 0;
        isRetry = false;

        return;

      }

      // 아직 오답이 남아있음
      quizWords = [...wrongWords];

      wrongWords = [];

      currentIndex = 0;

      quizWords.sort(() => Math.random() - 0.5);

      showWord();

      return;

    }


    // 첫 시험 종료
    if (wrongWords.length === 0) {

      alert("🎉 DAY 완료!");

      currentIndex = 0;

      showWord();

      return;

    }


    // 오답이 있는 경우
    const retry = confirm(
      `❌ 오답 ${wrongWords.length}개가 있습니다.\n\n오답만 다시 풀까요?`
    );


    if (retry) {

      isRetry = true;

      quizWords = [...wrongWords];

      wrongWords = [];

      currentIndex = 0;

      quizWords.sort(() => Math.random() - 0.5);

      showWord();

    } else {

      alert("DAY 학습을 종료합니다.");

      currentIndex = 0;

      showWord();

    }

    return;

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

  dayScreen.classList.add("hidden");

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

  dayScreen.classList.remove("hidden");

  dayActions.classList.add("hidden");

};

startBtn.onclick = () => {

  currentIndex = 0;
  mode = "EN_KO";
  wrongWords = [];
  isRetry = false;
  
  // 단어 순서 랜덤 섞기
  quizWords.sort(() => Math.random() - 0.5);

  dayTitle.textContent =
    "DAY " + currentDay;

  dayScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");

  showWord();

};


// 엔터키로 정답 확인 / 다음 문제
answerInput.addEventListener("keydown", (event) => {

  if (event.key !== "Enter") {
    return;
  }


  // 정답 확인 전
  if (!answerInput.disabled) {

    checkBtn.click();

    return;

  }


  // 정답 확인 후
  if (!nextBtn.disabled) {

    nextBtn.click();

  }

});



