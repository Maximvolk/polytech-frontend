var words = [
    "Синий", "Красный", "Желтый", "Зеленый", "Оранжевый", "Коричневый",
    "Фиолетовый", "Бежевый", "Серый", "Бирюзовый", "Бордовый", "Розовый", "Салатовый"
]

var colours = [
    "blue", "red", "yellow", "green", "darkorange", "sienna",
    "purple", "bisque", "grey", "aquamarine", "firebrick", "deeppink", "lime"
]
// var words = [
//     "Синий",
// ]

// var colours = [
//     "blue", "yellow"
// ]

var timeout = null;
var incorrectCount = 0;

function fillWordsButtons() {
    incorrectCount = 0;
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

    if (boxType != checkDraggedCorrectly(button))
        incorrectCount++;

    if (incorrectCount > getAllowedErrorsCount())
        finish(false);

    if (!colouredWordsBox.hasChildNodes())
        finish(true);
}

function checkDraggedCorrectly(button) {
    return button.classList.contains("correct");
}

function getAllowedErrorsCount() {
    var difficulty = getState().difficulty;

    if (difficulty === "easy")
        return 2;
    else if (difficulty === "medium")
        return 1;
    else
        return 0;
}

function finish(success) {
    clearTimeout(timeout);
    var state = getState()
    
    var result = "Вы проиграли. Попробуйте еще раз";
    var allowNext = false;

    if (success)
    {
        allowNext = true;
        var points = words.length - incorrectCount;

        state.lastTimePointsAdded += points;
        state.points += points;
        setState(state);

        result = `Вы победили! У вас ${points} очков`;
        updateStats();
    }

    openModal(result, allowNext);
}

async function launchFirstGameAsync() {
    $("#timer").css("display", "block");
    updateStats(0);

    incorrectCount = 0;
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
        $("#timer").css("display", "none");
        openModal("Время вышло. Попробуйте еще раз", false);
    }, secondsToFinish * 1000);

    await launchTimerAsync(secondsToFinish);
}