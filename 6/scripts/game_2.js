var hangmanWords = {
    "easy": [ "ЦВЕТ", "ДОМ", "ПАСТА", "КРАЙ" ],
    "medium": [ "КАНАВА", "ПИСТОЛЕТ", "ЖИДКОСТЬ", "ПОЛИЦИЯ" ],
    "hard": [ "СИНХРОНИЗАЦИЯ", "ОППОЗИЦИЯ", "СУПЕРПОЗИЦИЯ", "АРАХНОФОБИЯ" ]
}

var hangmanWord = "";
var currentHangmanPart = 1;

function launchSecondGame() {
    currentHangmanPart = 1;

    for (var hangmanPart of document.getElementById("hangman").children)
        hangmanPart.style.display = "none";

    var state = getState();
    hangmanWord = getRandomItem(new Set(hangmanWords[state.difficulty]));

    var wordBox = document.getElementById("word");
    wordBox.innerHTML = "";

    for (var i = 0; i < hangmanWord.length; i++)
    {
        var letterPlaceholder = document.createElement("div");
        wordBox.appendChild(letterPlaceholder);
    }
}

function clickLetter(button) {
    if (!hangmanWord.includes(button.innerText))
    {
        $(`#hangman${currentHangmanPart}`).css("display", "block");
        currentHangmanPart++;

        if (currentHangmanPart > 9)
            openModal("Вы проиграли. Попробуйте еще раз", false);

        return;
    }

    var letterPlaceholders = [...document.getElementById("word").children];
    for (var i = 0; i < hangmanWord.length; i++)
    {
        if (hangmanWord[i] === button.innerText)
            letterPlaceholders[i].innerText = button.innerText;
    }

    if (letterPlaceholders.every((item) => item.innerText != ""))
    {
        var points = 10 - currentHangmanPart;

        var state = getState();
        state.points += points;
        state.lastTimePointsAdded += points;
        setState(state);

        var message = `Вы победили! У вас ${points} очков за уровень и ${state.points} очков всего. `;
        if (updateStats())
            message += "\nВаш новый рекорд!";

        victory = true;
        openModal(message, true);
    }
}