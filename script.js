const places = [
  {
    id: "library",
    name: "图书馆",
    pinyin: "túshūguǎn",
    ru: "библиотека",
    desktop: { x: 58, y: 18, size: 11 },
    mobile: { x: 49, y: 31, size: 16 },
  },
  {
    id: "hospital",
    name: "医院",
    pinyin: "yīyuàn",
    ru: "больница",
    desktop: { x: 83, y: 22, size: 11 },
    mobile: { x: 25, y: 7, size: 17 },
  },
  {
    id: "bank",
    name: "银行",
    pinyin: "yínháng",
    ru: "банк",
    desktop: { x: 78, y: 44, size: 11 },
    mobile: { x: 76, y: 9, size: 17 },
  },
  {
    id: "post-office",
    name: "邮局",
    pinyin: "yóujú",
    ru: "почта",
    desktop: { x: 17, y: 46, size: 11 },
    mobile: { x: 13, y: 41, size: 17 },
  },
  {
    id: "shop",
    name: "商店",
    pinyin: "shāngdiàn",
    ru: "магазин",
    desktop: { x: 22, y: 69, size: 11 },
    mobile: { x: 84, y: 45, size: 17 },
  },
  {
    id: "office",
    name: "办公室",
    pinyin: "bàngōngshì",
    ru: "офис",
    desktop: { x: 71, y: 69, size: 11 },
    mobile: { x: 50, y: 86, size: 17 },
  },
  {
    id: "dorm",
    name: "宿舍",
    pinyin: "sùshè",
    ru: "общежитие",
    desktop: { x: 14, y: 18, size: 11 },
    mobile: { x: 21, y: 68, size: 17 },
  },
  {
    id: "canteen",
    name: "食堂",
    pinyin: "shítáng",
    ru: "столовая",
    desktop: { x: 36, y: 22, size: 11 },
    mobile: { x: 73, y: 71, size: 17 },
  },
];

const questionEl = document.querySelector("#question");
const vocabHintEl = document.querySelector("#vocabHint");
const feedbackEl = document.querySelector("#feedback");
const correctCountEl = document.querySelector("#correctCount");
const wrongCountEl = document.querySelector("#wrongCount");
const hotspotsEl = document.querySelector("#hotspots");
const restartButton = document.querySelector("#restartButton");

let questions = [];
let currentIndex = 0;
let currentPlace = null;
let correctCount = 0;
let wrongCount = 0;
let isFinished = false;

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function isPhoneLayout() {
  return window.matchMedia("(max-width: 700px)").matches;
}

function getPosition(place) {
  return isPhoneLayout() ? place.mobile : place.desktop;
}

function renderHotspots() {
  hotspotsEl.innerHTML = "";

  places.forEach((place) => {
    const position = getPosition(place);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "hotspot";
    button.dataset.place = place.id;
    button.setAttribute("aria-label", place.name);
    button.style.setProperty("--x", `${position.x}%`);
    button.style.setProperty("--y", `${position.y}%`);
    button.style.setProperty("--size", `${position.size}%`);
    button.addEventListener("click", () => checkAnswer(place.id));
    hotspotsEl.appendChild(button);
  });
}

function makeQuestion(place) {
  return `${place.name}在哪儿？`;
}

function vocabText(place) {
  return `${place.name} · ${place.pinyin} · ${place.ru}`;
}

function updateScore() {
  correctCountEl.textContent = correctCount;
  wrongCountEl.textContent = wrongCount;
}

function setFeedback(text, type) {
  feedbackEl.textContent = text;
  feedbackEl.className = `feedback ${type}`;
}

function showQuestion() {
  currentPlace = questions[currentIndex];
  questionEl.textContent = makeQuestion(currentPlace);
  vocabHintEl.textContent = "";
  setFeedback("Нажмите на нужное место на карте.", "neutral");
}

function startGame() {
  questions = shuffle(places);
  currentIndex = 0;
  currentPlace = null;
  correctCount = 0;
  wrongCount = 0;
  isFinished = false;
  restartButton.classList.add("hidden");
  hotspotsEl.querySelectorAll(".hotspot").forEach((button) => {
    button.disabled = false;
  });
  updateScore();
  showQuestion();
}

function finishGame() {
  isFinished = true;
  questionEl.textContent = "Упражнение завершено!";
  vocabHintEl.textContent = "";
  setFeedback(`Правильно: ${correctCount}  Ошибки: ${wrongCount}`, "correct");
  restartButton.classList.remove("hidden");
  hotspotsEl.querySelectorAll(".hotspot").forEach((button) => {
    button.disabled = true;
  });
}

function checkAnswer(placeId) {
  if (isFinished || !currentPlace) return;

  if (placeId === currentPlace.id) {
    correctCount += 1;
    updateScore();
    setFeedback(`✅ 对！ ${vocabText(currentPlace)}`, "correct");

    setTimeout(() => {
      currentIndex += 1;
      if (currentIndex >= questions.length) {
        finishGame();
      } else {
        showQuestion();
      }
    }, 850);
  } else {
    wrongCount += 1;
    updateScore();
    setFeedback("❌ 错。", "wrong");
  }
}

window.addEventListener("resize", renderHotspots);
restartButton.addEventListener("click", startGame);

renderHotspots();
startGame();
