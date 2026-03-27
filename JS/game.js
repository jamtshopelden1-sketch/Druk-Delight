let score = 0;
let currentGame = "match";

const gameTimes = {
    match: 30,
    quiz: 40,
    memory: 50
};

let time;
let timer;

/* SCORE */
function addScore() {
    score++;
    document.getElementById("score").innerText = score;
}

/* TIMER + PROGRESS */
function startTimer() {
    clearInterval(timer);

    time = gameTimes[currentGame];
    document.getElementById("time").innerText = time;

    let total = time;

    timer = setInterval(() => {
        time--;
        document.getElementById("time").innerText = time;

        let percent = (time / total) * 100;
        document.getElementById("progressBar").style.width = percent + "%";

        if (time === 0) {
            clearInterval(timer);
            nextGame();
        }
    }, 1000);
}

/* GAME SWITCH */
function showGame(game) {
    currentGame = game;

    document.querySelectorAll(".game").forEach(g => g.classList.add("hidden"));
    document.getElementById(game + "Game").classList.remove("hidden");

    startTimer();
}

/* NEXT GAME */
function nextGame() {
    if (currentGame === "match") {
        showGame("quiz");
        loadQuestion();
    } 
    else if (currentGame === "quiz") {
        showGame("memory");
        loadMemory();
    } 
    else {
        clearInterval(timer);
        document.getElementById("message").innerText =
            "🎉 All Games Completed! Score: " + score;
    }
}

/* ---------------- MATCH GAME (FIXED DRAG) ---------------- */

let correctMatch = 0;
let draggedElement = null;

document.querySelectorAll(".item").forEach(item => {
    item.addEventListener("dragstart", e => {
        draggedElement = item;
        e.dataTransfer.setData("text", item.dataset.name);
    });
});

document.querySelectorAll(".box").forEach(box => {
    box.addEventListener("dragover", e => e.preventDefault());

    box.addEventListener("drop", e => {
        let data = e.dataTransfer.getData("text");

        if (data === box.dataset.match) {

            addScore();
            correctMatch++;

            // MOVE item into box
            box.appendChild(draggedElement);

            // disable dragging
            draggedElement.setAttribute("draggable", "false");

            // prevent multiple drops
            box.style.pointerEvents = "none";

            document.getElementById("message").innerText = "✅ Correct!";

            if (correctMatch === 5) {
                nextGame();
            }

        } else {
            document.getElementById("message").innerText = "❌ Wrong!";
        }
    });
});

/* ---------------- QUIZ ---------------- */

const quizData = [
    { q: "What is Ema Datshi?", options: ["Rice", "Chili Cheese", "Soup"], answer: 1 },
    { q: "Momos are?", options: ["Dumplings", "Cake", "Bread"], answer: 0 },
    { q: "Puta is made from?", options: ["Rice", "Buckwheat", "Wheat"], answer: 1 },
    { q: "Phaksha Paa is?", options: ["Pork Dish", "Fish", "Chicken"], answer: 0 },
    { q: "Main chili dish?", options: ["Ema Datshi", "Pizza", "Burger"], answer: 0 },
    { q: "Bhutan staple food?", options: ["Rice", "Pasta", "Bread"], answer: 0 },
    { q: "Kewa Datshi uses?", options: ["Potato", "Rice", "Corn"], answer: 0 },
    { q: "Soup dish?", options: ["Thukpa", "Burger", "Cake"], answer: 0 },
    { q: "Momos filling?", options: ["Meat/Veg", "Chocolate", "Sugar"], answer: 0 },
    { q: "Ema means?", options: ["Chili", "Salt", "Milk"], answer: 0 }
];

let currentQ = 0;

function loadQuestion() {
    let q = quizData[currentQ];

    document.getElementById("question").innerText = q.q;

    let html = "";
    q.options.forEach((opt, i) => {
        html += `<button onclick="checkAnswer(${i})">${opt}</button>`;
    });

    document.getElementById("options").innerHTML = html;
}

function checkAnswer(i) {
    if (i === quizData[currentQ].answer) {
        addScore();
    }

    currentQ++;

    if (currentQ < quizData.length) {
        loadQuestion();
    } else {
        nextGame();
    }
}

/* ---------------- MEMORY ---------------- */

const memoryCards = [
    "🍲","🍲","🥟","🥟",
    "🍛","🍛","🍜","🍜",
    "🍚","🍚","🌶️","🌶️",
    "🥔","🥔","🍗","🍗"
];

let first = null;
let second = null;
let matchedPairs = 0;

function shuffle(arr) {
    return arr.sort(() => 0.5 - Math.random());
}

function loadMemory() {
    let grid = document.getElementById("memoryGrid");
    grid.innerHTML = "";

    shuffle(memoryCards).forEach(symbol => {
        let card = document.createElement("div");
        card.classList.add("card");
        card.innerText = "?";
        card.dataset.value = symbol;

        card.onclick = () => flip(card);

        grid.appendChild(card);
    });
}

function flip(card) {
    card.innerText = card.dataset.value;

    if (!first) {
        first = card;
    } else {
        second = card;

        if (first.dataset.value === second.dataset.value) {
            addScore();
            matchedPairs++;

            first = null;
            second = null;

            if (matchedPairs === 8) {
                nextGame();
            }

        } else {
            setTimeout(() => {
                first.innerText = "?";
                second.innerText = "?";
                first = null;
                second = null;
            }, 500);
        }
    }
}

/* START GAME */
showGame("match");