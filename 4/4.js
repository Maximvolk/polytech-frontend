var latinPhrases = [ 'Consuetudo est altera natura', 'Nota bene', 'Nulla calamitas sola', 'Per aspera ad astra' ];
var russianPhrases = [ 'Привычка - вторая натура', 'Заметьте хорошо!', 'Беда не приходит одна', 'Через тернии к звёздам' ];

var unusedPhrasesIndices = new Set();
for (var i = 0; i < latinPhrases.length; i++)
    unusedPhrasesIndices.add(i);

function create() {
    if (unusedPhrasesIndices.size == 0)
    {
        alert('Фразы закончились');
        return;
    }

    var nextPhraseIndex = getRandomItem();
    unusedPhrasesIndices.delete(nextPhraseIndex);
    
    var usedPhrasesCount = latinPhrases.length - unusedPhrasesIndices.size;
    var text = `<u>n=${usedPhrasesCount - 1}</u>  `;
    text += `<i>"${latinPhrases[nextPhraseIndex]}"</i>  "${russianPhrases[nextPhraseIndex]}"`;

    var nextPhraseElement = document.createElement('p');
    nextPhraseElement.innerHTML = text;
    nextPhraseElement.id = usedPhrasesCount;

    // Figure out if upcoming row will be even or odd
    if (usedPhrasesCount % 2 == 0)
        nextPhraseElement.className = 'class1';
    else
        nextPhraseElement.className = 'class2';

    document.getElementById('rand').appendChild(nextPhraseElement);
}

function changeColour() {
    var rows = document.getElementById('rand').children;

    for (const row of rows) {
        if (Number(row.id) % 2 == 0)
            row.innerHTML = `<b>${row.innerHTML}</b>`;
    }
}

function getRandomItem() {
    return [...unusedPhrasesIndices][Math.floor(Math.random() * unusedPhrasesIndices.size)];
}