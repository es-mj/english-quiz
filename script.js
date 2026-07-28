// ==========================
// English Quiz 2.0
// ==========================

let words = [];
let currentDay = 0;

// 화면 요소
const dayList = document.getElementById("dayList");

// CSV 읽기
async function loadCSV() {

    const response = await fetch("vocabulary.csv");
    const csvText = await response.text();

    Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,

        complete: function(result){

            words = result.data.map(item=>{

                return{

                    day:Number(item.DAY),

                    english:item["영어"].trim(),

                    meaning:item["뜻"].trim()

                }

            });

            createDayButtons();

        }

    });

}

// Day 버튼 생성
function createDayButtons(){

    dayList.innerHTML="";

    const daySet = [...new Set(words.map(w=>w.day))];

    daySet.sort((a,b)=>a-b);

    daySet.forEach(day=>{

        const count = words.filter(w=>w.day===day).length;

        const button=document.createElement("button");

        button.className="dayButton";

        button.innerHTML=`DAY ${day}<br><small>${count} words</small>`;

        button.onclick=()=>{

            alert(`DAY ${day} 선택!`);

            // 다음 단계에서 퀴즈 시작

        };

        dayList.appendChild(button);

    });

}

loadCSV();
