// ==========================
// English Quiz v2.0
// PART 1
// ==========================

let words = [];
let currentDay = 0;
let quizWords = [];
let currentQuestion = 0;
let score = 0;

// 화면
const daySelect = document.getElementById("daySelect");
const quizScreen = document.getElementById("quizScreen");
const resultScreen = document.getElementById("resultScreen");

const dayList = document.getElementById("dayList");
const progress = document.getElementById("progress");
const question = document.getElementById("question");
const partOfSpeech = document.getElementById("partOfSpeech");
const choices = document.getElementById("choices");

const backBtn = document.getElementById("backBtn");
const restartBtn = document.getElementById("restartBtn");


// --------------------
// CSV 읽기
// --------------------

async function loadCSV() {

    const response = await fetch("vocabulary.csv");
    const text = await response.text();

    Papa.parse(text, {

        header: true,
        skipEmptyLines: true,

        complete: function(result) {

            words = [];

            result.data.forEach(row => {

                // DAY 읽기 (공백/BOM 제거)
                let dayValue = "";

                for (let key in row) {
                    if (key.replace(/\uFEFF/g, "").trim().toUpperCase() === "DAY") {
                        dayValue = row[key];
                    }
                }

                const day = Number(dayValue);

                if (!day || day < 1) return;

                let english = row["영어"] || "";
                let meaning = row["뜻"] || "";

                english = english.trim();

                // 영어 뒤의 ~ 제거
                english = english.replace(/\s*~$/, "");

                meaning = meaning.trim();

                // 품사 분리
                let pos = "";
                let korean = meaning;

                const match = meaning.match(/^(n\.|v\.|adj\.|adv\.|prep\.|pron\.|conj\.|int\.)\s*/i);

                if (match) {

                    pos = match[1];

                    korean = meaning.replace(match[0], "").trim();

                }

                words.push({

                    day,
                    english,
                    korean,
                    pos

                });

            });

            createDayButtons();

        }

    });

}


// --------------------
// DAY 버튼
// --------------------

function createDayButtons() {

    dayList.innerHTML = "";

    const days = [...new Set(words.map(w => w.day))];

    days.sort((a, b) => a - b);

    days.forEach(day => {

        const count = words.filter(w => w.day === day).length;

        const btn = document.createElement("button");

        btn.className = "dayButton";

        btn.innerHTML = `
            <div style="font-size:28px;">DAY ${day}</div>
            <div style="margin-top:8px;color:#666;">
                ${count} words
            </div>
        `;

        btn.onclick = () => startDay(day);

        dayList.appendChild(btn);

    });

}


// --------------------
// DAY 시작
// --------------------

function startDay(day) {

    currentDay = day;

    quizWords = words.filter(w => w.day === day);

    currentQuestion = 0;
    score = 0;

    console.log("DAY 시작", day);
    console.log(quizWords);

    // 다음 PART에서 여기부터 퀴즈 시작

}


// --------------------

backBtn.onclick = function(){

    quizScreen.classList.add("hidden");
    resultScreen.classList.add("hidden");
    daySelect.classList.remove("hidden");

}

restartBtn.onclick=function(){

    startDay(currentDay);

}

loadCSV();
