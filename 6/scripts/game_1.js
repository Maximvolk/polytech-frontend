var words = [
    "Синий", "Красный", "Желтый", "Зеленый", "Оранжевый", "Коричневый",
    "Фиолетовый", "Бежевый", "Серый", "Бирюзовый", "Бордовый", "Розовый", "Салатовый"
]

var colours = [
    "blue", "red", "yellow", "green", "darkorange", "sienna", "purple", "bisque",
    "grey", "aquamarine", "firebrick", "deppink", "lime"
]

var timeout = null;
var correctCount = 0;

function fillWordsButtons() {
    correctCount = 0;
    var colouredWordsBox = document.getElementById("coloured-words");

    if (colouredWordsBox.hasChildNodes())
        colouredWordsBox.innerHTML = "";

    var wordsIndices = new Set();
    var unusedWordsIndices = new Set();

    for (var i = 0; i < words.length; i++)
    {
        unusedWordsIndices.add(i);
        wordsIndices.add(i);
    }

    while (unusedWordsIndices.size > 0)
    {
        var wordIndex = getRandomItem(unusedWordsIndices);
        unusedWordsIndices.delete(wordIndex);
        wordsIndices.delete(wordIndex);

        var buttonColourIndex = wordIndex;
        var correct = true;

        if (Math.random() < 0.5)
        {
            buttonColourIndex = getRandomItem(wordsIndices);
            correct = false;
        }

        wordsIndices.add(wordIndex);

        var button = createWordButton(colours[buttonColourIndex], words[wordIndex], correct);
        colouredWordsBox.appendChild(button);
    };
};

function createWordButton(buttonColour, text, correct) {
    var button = document.createElement("button");
    button.classList.add("word-button");

    if (correct)
        button.classList.add("correct");

    button.style.background = buttonColour;
    button.innerText = text;

    button.ondragover = function(e) { preventDefaultEventHandling(e); }
    button.ondragstart = function(e) { e.dataTransfer.setData("text", e.target.id); }
    button.draggable = "true";
    button.id = uuidv4();

    return button;
}

function getRandomItem(set) {
    return [...set][Math.floor(Math.random() * set.size)];
}

function drop(e, boxType) {
    e.preventDefault();

    var button = document.getElementById(e.dataTransfer.getData("text"));
    var colouredWordsBox = document.getElementById("coloured-words");
    colouredWordsBox.removeChild(button);

    if (boxType === checkDraggedCorrectly(button))
        correctCount++;

    if (!colouredWordsBox.hasChildNodes())
        notifyAboutResults();
}

function checkDraggedCorrectly(button) {
    return button.classList.contains("correct");
}

function notifyAboutResults() {
    clearTimeout(timeout);
    var correctCountNeeded = words.length;

    var state = getState()
    var difficulty = state.difficulty;

    if (difficulty === "easy")
        correctCountNeeded -= 2;
    else if (difficulty === "medium")
        correctCountNeeded -= 1;

    var result = "Неправильно. Попробуйте еще раз";
    var allowNext = false;

    if (correctCount >= correctCountNeeded)
    {
        allowNext = true;

        state.lastTimePointsAdded += correctCount;
        state.points += correctCount;
        setState(state);

        result = `Правильно! У вас ${correctCount} очков за уровень и ${state.points} очков всего`;
        updateStats();
    }

    openModal(result, allowNext);
}

async function launchFirstGameAsync() {
    $("#timer").css("display", "block");
    updateStats(0);

    correctCount = 0;
    fillWordsButtons();

    var secondsToFinish = 0;
    var difficulty = getState().difficulty;

    if (difficulty === "easy")
        secondsToFinish = 59;
    else if (difficulty === "medium")
        secondsToFinish = 40;
    else
        secondsToFinish = 20;

    timeout = setTimeout(() => {
        openModal("Время вышло. Попробуйте еще раз", false);
    }, secondsToFinish * 1000);

    await launchTimerAsync(secondsToFinish);
}