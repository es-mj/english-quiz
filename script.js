let words = [];
let currentDay = "";
let quizWords = [];
let currentIndex = 0;
let score = 0;


// CSV 불러오기
function loadCSV() {

    Papa.parse("words.csv", {
        download: true,
        delimiter: "\t",
        header: true,
        skipEmptyLines: true,

        complete: function(results) {

            words = results.data.map(item => ({
                day: item["DAY"]?.trim(),
                word: item["영어"]?.trim(),
                meaning: item["뜻"]?.trim()
            }));

            createDayButtons();
        },

        error: function(error) {
            alert("단어 파일을 불러오지 못했습니다.");
            console.log(error);
        }
    });

}



// DAY 버튼 만들기
function createDayButtons() {

    const dayList = document.getElementById("dayList");

    const days = [...new Set(words.map(w => w.day))];


    days.forEach(day => {

        const button = document.createElement("button");

        button.textContent = `DAY ${day}`;

        button.onclick = () => startQuiz(day);


        dayList.appendChild(button);

    });

}



// 퀴즈 시작
function startQuiz(day) {

    currentDay = day;

    quizWords = words
        .filter(w => w.day === day)
        .sort(() => Math.random() - 0.5);


    currentIndex = 0;
    score = 0;


    document.getElementById("daySelect")
        .classList.add("hidden");


    document.getElementById("quizScreen")
        .classList.remove("hidden");


    document.getElementById("subtitle")
        .textContent = `DAY ${day}`;


    showQuestion();

}



// 문제 보여주기
function showQuestion() {


    const item = quizWords[currentIndex];


    document.getElementById("progress")
        .textContent =
        `${currentIndex + 1} / ${quizWords.length}`;


    document.getElementById("question")
        .textContent = item.word;


    document.getElementById("partOfSpeech")
        .textContent = "";


    const choices =
        document.getElementById("choices");


    choices.innerHTML = "";


    let answers = [item.meaning];


    while (answers.length < 4) {

        let random =
            words[Math.floor(Math.random() * words.length)].meaning;


        if (!answers.includes(random)) {
            answers.push(random);
        }

    }


    answers.sort(() => Math.random() - 0.5);



    answers.forEach(answer => {


        const button =
            document.createElement("button");


        button.textContent = answer;


        button.onclick = () => {


            if (answer === item.meaning) {

                score++;

                button.style.fontWeight = "bold";

            }


            setTimeout(nextQuestion, 500);

        };


        choices.appendChild(button);

    });

}



// 다음 문제
function nextQuestion() {


    currentIndex++;


    if (currentIndex >= quizWords.length) {

        showResult();

    } else {

        showQuestion();

    }

}



// 결과
function showResult() {


    document.getElementById("quizScreen")
        .classList.add("hidden");


    document.getElementById("resultScreen")
        .classList.remove("hidden");


    document.getElementById("score")
        .textContent =
        `${quizWords.length}개 중 ${score}개 정답`;

}



// DAY 다시 풀기
document.getElementById("restartBtn").onclick = function() {

    startQuiz(currentDay);

};



// DAY 선택으로 돌아가기
document.getElementById("backBtn").onclick = function() {


    document.getElementById("quizScreen")
        .classList.add("hidden");


    document.getElementById("daySelect")
        .classList.remove("hidden");


    document.getElementById("subtitle")
        .textContent =
        "DAY를 선택하세요";

};



// 발음 듣기
document.getElementById("speakBtn").onclick = function() {


    const text =
        document.getElementById("question").textContent;


    const speech =
        new SpeechSynthesisUtterance(text);


    speech.lang = "en-US";


    speechSynthesis.speak(speech);

};



// 시작
loadCSV();
