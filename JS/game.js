// --- 1. GAME STATE & VARIABLES ---
let score = 0;
let currentGame = "match";
let timer, time;
let gameActive = false;

// Level tracking variables
let correctMatchCount = 0;
let currentQ = 0;
let matched = 0;
let first = null, second = null;

const timeLimits = { 
    match: 15, 
    quiz: 40, 
    memory: 70 };

// --- 2. AUDIO INITIALIZATION ---
// NOTE: Ensure you have a 'music.mp3' file in your folder or replace with a direct URL
const bgMusic = new Audio("BackMusic.mp3"); 
bgMusic.loop = true;
bgMusic.volume = 0.4;

const correctSound = new Audio("winner.mp4");
const wrongSound = new Audio("Game_Over_Music.mp3");

// DOM Elements
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const progressBar = document.getElementById("progressBar");
const messageEl = document.getElementById("message");

// --- 3. CORE GAME CONTROL ---

/** Starts the entire experience from the landing page */
function initGame() {
    document.getElementById("startScreen").classList.add("hidden");
    document.getElementById("gameContent").classList.remove("hidden");
    
    // Play background music
    bgMusic.play().catch(() => console.log("Music waiting for user interaction"));
    
    showGame("match");
}

/** Handles the countdown and progress bar */
function startTimer() {
    clearInterval(timer);
    time = timeLimits[currentGame];
    gameActive = true;
    
    timer = setInterval(() => {
        if (!gameActive) return;
        time--;
        timeEl.innerText = time;
        progressBar.style.width = (time / timeLimits[currentGame]) * 100 + "%";
        
        if (time <= 0) gameOver("⏰ Time Up!");
    }, 1000);
}

/** Switches the UI to the requested level */
function showGame(level) {
    document.querySelectorAll(".game").forEach(g => g.classList.add("hidden"));
    document.getElementById(level + "Game").classList.remove("hidden");
    currentGame = level;
    startTimer();
}

/** Called when a user makes a mistake or runs out of time */
function gameOver(msg) {
    gameActive = false;
    clearInterval(timer);
    
    // STOP MUSIC immediately on error
    bgMusic.pause();
    bgMusic.currentTime = 0; 
    
    wrongSound.play();
    
    messageEl.innerHTML = `<span style="color:#d32f2f; font-weight:bold;">${msg}</span><br>
                           <button class="btn-main" onclick="retryLevel()">Try Level Again</button>`;
}

/** Resets only the current level so they don't start from Level 1 */
function retryLevel() {
    messageEl.innerHTML = "";
    bgMusic.play(); // Restart music for the new attempt
    
    if (currentGame === "match") {
        correctMatchCount = 0;
        const itemsContainer = document.getElementById("itemsContainer");
        document.querySelectorAll(".item").forEach(item => {
            item.classList.remove("correct", "selected");
            item.style.pointerEvents = "auto";
            itemsContainer.appendChild(item);
        });
        showGame("match");
    } else if (currentGame === "quiz") {
        currentQ = 0;
        showGame("quiz");
        loadQuestion();
    } else if (currentGame === "memory") {
        matched = 0;
        showGame("memory");
        loadMemory();
    }
}

/** Called when a level is finished successfully */
function nextLevelPrompt() {
    gameActive = false;
    clearInterval(timer);
    
    // STOP MUSIC for the celebration
    bgMusic.pause();
    correctSound.play();
    
    messageEl.innerHTML = `<span style="color:#2e7d32; font-weight:bold;">🎉 Level Completed!</span><br>
                           <button class="btn-main" onclick="goNextLevel()">Next Level</button>`;
}

/** Moves the user to the next logical level */
function goNextLevel() {
    messageEl.innerText = "";
    bgMusic.play(); // Start music for the next challenge
    
    if (currentGame === "match") {
        showGame("quiz");
        loadQuestion();
    } else if (currentGame === "quiz") {
        showGame("memory");
        loadMemory();
    } else {
        bgMusic.pause();
        messageEl.innerHTML = "🏆 You are a Bhutanese Food Master!<br><button class='btn-main' onclick='location.reload()'>Play Again</button>";
    }
}

// --- 4. LEVEL 1: MATCHING LOGIC ---
let selectedItem = null;

document.querySelectorAll(".item").forEach(item => {
    item.addEventListener("dragstart", () => { selectedItem = item; });
    item.addEventListener("click", () => {
        if (!gameActive) return;
        document.querySelectorAll(".item").forEach(i => i.classList.remove("selected"));
        selectedItem = item;
        item.classList.add("selected");
    });
});

document.querySelectorAll(".box").forEach(box => {
    box.addEventListener("dragover", e => e.preventDefault());
    box.addEventListener("drop", () => handleMatch(box));
    box.addEventListener("click", () => handleMatch(box));
});

function handleMatch(box) {
    if (!gameActive || !selectedItem) return;
    
    if (selectedItem.dataset.name === box.dataset.match) {
        box.appendChild(selectedItem);
        selectedItem.classList.add("correct");
        selectedItem.classList.remove("selected");
        selectedItem.style.pointerEvents = "none";
        
        score++;
        scoreEl.innerText = score;
        correctMatchCount++;
        selectedItem = null;
        
        if (correctMatchCount === 5) nextLevelPrompt();
    } else {
        gameOver("❌ Wrong Match!");
    }
}

// --- 5. LEVEL 2: QUIZ LOGIC ---
const quizData = [
    { q: "Ema Datshi is widely known in Bhutan. What key characteristic makes it unique compared to most global dishes?", 
    options: [
    "It is mainly a sweet dessert made with milk",
    "It uses chili as a main ingredient rather than just a spice",
    "It is served only during festivals"
    ], answer: 1 },

    { q: "Momos are popular across many Asian regions. What distinguishes Bhutanese momos from other variations?", 
    options: [
    "They are always deep fried instead of steamed",
    "They commonly include local spices and fillings adapted to Bhutanese taste",
    "They are made only with sweet fillings"
    ], answer: 1 },

    { q: "Puta is a traditional Bhutanese noodle dish. What makes it different from regular wheat noodles?", 
    options: [
    "It is made using buckwheat, giving it a firmer texture",
    "It is always served cold with sugar",
    "It is made from fermented rice paste"
    ], answer: 0 },

    { q: "Phaksha Paa is a well-known Bhutanese dish. What is the main component that defines this dish?", 
    options: [
    "Fish cooked with herbs",
    "Pork cooked with chili and radish",
    "Chicken cooked in tomato gravy"
    ], answer: 1 },

    { q: "In Bhutanese cuisine, chili is not treated like in many other countries. How is it commonly used?", 
    options: [
    "As a decorative garnish only",
    "As a main vegetable and core ingredient in dishes",
    "Only in dry powdered form"
    ], answer: 1 },

    { q: "Kewa Datshi is a variation of Datshi dishes. What ingredient replaces chili as the primary base?", 
    options: [
    "Potato combined with cheese",
    "Tomato mixed with butter",
    "Spinach blended with milk"
    ], answer: 0 },

    { q: "Thukpa is a dish enjoyed in Bhutan. What category best describes it?", 
    options: [
    "A baked bread dish",
    "A noodle-based soup with vegetables or meat",
    "A fried rice dish"
    ], answer: 1 },

    { q: "Rice is a staple in Bhutan. What type of rice is commonly consumed and gives a distinct identity?", 
    options: [
    "White basmati rice",
    "Red rice with a nutty flavor",
    "Sticky rice used for desserts"
    ], answer: 1 },

    { q: "Momos can have different fillings. What is the most common type of filling in Bhutanese households?", 
    options: [
    "Chocolate and sugar mixture",
    "Meat or vegetable fillings with local spices",
    "Only cheese without seasoning"
    ], answer: 1 },

    { q: "The word 'Ema' in Bhutanese cuisine carries important meaning. What does it refer to?", 
    options: [
    "Milk used in cooking",
    "Chili, a staple ingredient in many dishes",
    "Salt used for preservation"
    ], answer: 1 }
];

function loadQuestion() {
    let q = quizData[currentQ];
    document.getElementById("question").innerText = q.q;
    let html = "";
    q.options.forEach((opt, i) => {
        html += `<button class="btn-main" style="display:block; margin:10px auto; width:80%" onclick="checkAnswer(${i})">${opt}</button>`;
    });
    document.getElementById("options").innerHTML = html;
}

function checkAnswer(i) {
    if (i === quizData[currentQ].answer) {
        correctSound.play();
        score++;
        scoreEl.innerText = score;
        currentQ++;
        if (currentQ < quizData.length) loadQuestion();
        else nextLevelPrompt();
    } else {
        gameOver("❌ Wrong Answer!");
    }
}

// --- 6. LEVEL 3: MEMORY LOGIC ---
const memoryCards = [
    "🍲","🍲","🥟","🥟","🍛","🍛","🍜","🍜",
    "🍚","🍚","🌶️","🌶️","🥔","🥔","🍗","🍗"
];

function loadMemory() {
    let grid = document.getElementById("memoryGrid");
    grid.innerHTML = "";
    [...memoryCards].sort(() => 0.5 - Math.random()).forEach(val => {
        let card = document.createElement("div");
        card.className = "card";
        card.innerText = "?";
        card.dataset.val = val;
        card.onclick = () => flip(card);
        grid.appendChild(card);
    });
}

function flip(card) {
    if (!gameActive || card === first || card.classList.contains("correct")) return;
    
    card.innerText = card.dataset.val;
    
    if (!first) { 
        first = card; 
    } else {
        second = card;
        if (first.dataset.val === second.dataset.val) {
            first.classList.add("correct");
            second.classList.add("correct");
            score++;
            scoreEl.innerText = score;
            matched++;
            first = null; 
            second = null;
            if (matched === 8) nextLevelPrompt();
        } else {
            gameActive = false;
            setTimeout(() => {
                first.innerText = "?";
                second.innerText = "?";
                first = null; 
                second = null;
                gameActive = true;
            }, 600);
        }
    }
}