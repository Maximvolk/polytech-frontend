function appear() {
    document.getElementById('second').style.visibility = 'visible';
    document.getElementById('third').style.visibility = 'visible';
}

function disappear() {
    document.getElementById('second').style.visibility = 'hidden';
    document.getElementById('third').style.visibility = 'hidden';
    document.getElementById('fourth').style.visibility = 'hidden';
}

function appearAndShake() {
    disappear();
    document.getElementById('fourth').style.visibility = 'visible';
}