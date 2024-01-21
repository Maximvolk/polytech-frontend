var texts = [
    `Я всегда твердил, что судьба — игра.<br>
    Что зачем нам солнце, раз есть икра.<br>
    Что готический стиль победит, как школа,<br>
    как способность торчать, избежав осколка.<br>
    Я сижу у окна. За окном осина.<br>
    Я любил многих. Однако — сильно.`,
    `Я считал, что куст — только часть полена.<br>
    Что зачем вся дева, раз есть колено.<br>
    Что, устав от поднятой веком жути,<br>
    русский глаз отдохнет на эстонском шпиле.<br>
    Я сижу у окна. Я помыл посуду.<br>
    Я был несчастлив здесь, и уже не буду.`,
    `Я писал, что в лампочке — ужас пола.<br>
    Что любовь, как акт, лишена существительного.<br>
    Что не знал Эвклид, что, сходя на конус,<br>
    вещь обретает не ноль, но Хронос.<br>
    Я сижу у окна. Приобретаю юность.<br>
    Улыбнусь порою, порой перекрещусь.`,
    `Я сказал, что лист разрушает почку.<br>
    И что семя, упавши в дурную славу,<br>
    не дает побега; что луг с поляной<br>
    есть пример рукоблудья, в Природе данный.<br>
    Я сижу у подоконника, обхватив колени,<br>
    в обществе собственной грузной грусти.`,
    `Моя песня была лишена мотива,<br>
    но зато ее хором не написать. Не диво,<br>
    что в награду мне за такие попытки<br>
    своих ног никто не кладет на плечи.<br>
    Я сижу у окна в темноте; как скорый,<br>
    море гремит за волнистой далью.`
]

var currentTextIndex = 0;

var answers = {
    0: {
        "солнце": "рыба",
        "осколка": "укола",
        "многих": "немногих"
    },
    1: {
        "куст": "лес",
        "жути": "пыли",
        "несчастлив": "счастлив"
    },
    2: {
        "существительного": "глагола",
        "Приобретаю": "Вспоминаю",
        "перекрещусь": "плюнусь"
    },
    3: {
        "славу": "почву",
        "подоконника": "окна",
        "грусти": "тени"
    },
    4: {
        "написать": "спеть",
        "попытки": "речи",
        "далью": "шторой"
    }
}

var selections = []

function launchThirdGame() {
    currentTextIndex = Math.floor(Math.random() * texts.length);
    setTextToBox();
}

function setTextToBox() {
    $("#text-box").html("<p>" + texts[currentTextIndex] + "</p>");
}

function highlightSelected() {
    var selection = document.getSelection();
    if (selection.isCollapsed)
        return;

    selection = selection.toString();
    var paragraph = document.getElementById("text-box").children[0];

    var currentText = paragraph.innerHTML;
    currentText = currentText.replace(selection, "<mark>" + selection + "</mark>");

    currentText = removeNestedSelection(currentText);
    paragraph.innerHTML = currentText;
}

function removeNestedSelection(text) {
    var parts = text.split("<mark>");
    var finalParts = [parts[0]];

    for (var i = 1; i < parts.length; i++)
    {
        finalParts.push("<mark>");

        var innerParts = parts[i].split("</mark>");
        finalParts.push(innerParts[0]);

        if (innerParts.length === 1)   
           continue;

        for (var j = 1; j < innerParts.length; j++)
        {
            finalParts.push("</mark>");
            finalParts.push(innerParts[j]);
        }
    }

    var result = "";
    var highlightStack = 0;

    for (var part of finalParts)
    {
        if (part === "</mark>")
        {
            if (highlightStack === 1)
                result += part;
            
            highlightStack--;
        }
        else if (part === "<mark>")
        {
            if (highlightStack === 0)
                result += part;
            
            highlightStack++;
        }
        else
            result += part;
    }

    return result;
}

function clearSelection() {
    setTextToBox();
}

function checkSelection() {
    var parser = new DOMParser();
    const doc = parser.parseFromString($("#text-box").html(), 'text/html');
    
    var correctCount = 0;
    var correctHighlights = Object.keys(answers[currentTextIndex]);

    for (var highlight of doc.getElementsByTagName("mark"))
    {
        if (correctHighlights.includes(highlight.innerText))
            correctCount++;
    }

    var correctCountNeeded = 0;
    var state = getState();

    if (state.difficulty === "easy")
        correctCountNeeded = 1;
    else if (state.difficulty === "medium")
        correctCountNeeded = 2;
    else
        correctCountNeeded = 3;

    var message = "Вы проиграли. Попробуйте еще раз";
    if (correctCount >= correctCountNeeded)
    {
        state.points += correctCount;
        state.lastTimePointsAdded += correctCount;
        setState(state);

        var message = `Вы победили! У вас ${correctCount} очков за уровень и ${state.points} очков всего. `;
        if (updateStats())
            message += "\nВаш новый рекорд!";

        victory = true;
    }

    openModal(message, victory);
}