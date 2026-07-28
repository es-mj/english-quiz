const TOTAL_QUESTIONS = 10;

let quizWords = [];
let currentIndex = 0;
let score = 0;

const questionNumber = document.getElementById("questionNumber");
const englishWord = document.getElementById("englishWord");
const choices = document.getElementById("choices");
const nextBtn = document.getElementById("nextBtn");

const quiz = document.getElementById("quiz");
const result = document.getElementById("result");
const scoreText = document.getElementById("score");

// 단어 섞기
function shuffle(array) {
    return [...array].sort(() => Math.random() - 0.5);
}

// 시작
function startQuiz() {
    quizWords = shuffle(words).slice(0, TOTAL_QUESTIONS);
    currentIndex = 0;
    score = 0;
    showQuestion();
}

// 문제 표시
function showQuestion() {

    nextBtn.style.display = "none";

    const current = quizWords[currentIndex];

    questionNumber.textContent =
        `문제 ${currentIndex + 1} / ${TOTAL_QUESTIONS}`;

    englishWord.textContent = current.english;

    choices.innerHTML = "";

    // 오답 후보
    const wrongAnswers = shuffle(
        words.filter(w => w.korean !== current.korean)
    ).slice(0, 3);

    // 보기 4개 만들기
    const answerList = shuffle([
        current.korean,
        ...wrongAnswers.map(w => w.korean)
    ]);

    answerList.forEach(answer => {

        const button = document.createElement("button");

        button.className = "choice";

        button.textContent = answer;

        button.onclick = () => checkAnswer(button, answer);

        choices.appendChild(button);

    });

}

// 정답 확인
function checkAnswer(button, answer) {

    const correct = quizWords[currentIndex].korean;

    document.querySelectorAll(".choice").forEach(btn => {

        btn.disabled = true;

        if (btn.textContent === correct) {

            btn.classList.add("correct");

        }

    });

    if (answer === correct) {

        score++;

    } else {

        button.classList.add("wrong");

    }

    nextBtn.style.display = "inline-block";

}

// 다음 문제
nextBtn.onclick = () => {

    currentIndex++;

    if (currentIndex >= TOTAL_QUESTIONS) {

        quiz.classList.add("hidden");

        result.classList.remove("hidden");

        scoreText.textContent =
            `${TOTAL_QUESTIONS}문제 중 ${score}개 정답!`;

    } else {

        showQuestion();

    }

};

startQuiz();
