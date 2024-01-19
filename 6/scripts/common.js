var secondsLeft = 0;

function setState(state) {
    window.localStorage.setItem("state", JSON.stringify(state));
}

function getState() {
    return JSON.parse(window.localStorage.getItem("state"));
}

function getDefaultState() {
    return {
        username: null,
        currentPage: "login",
        difficulty: "medium",
        currentGameNumber: 1
    };
}

function getStats() {
    return JSON.parse(window.localStorage.getItem("stats"));
}

function setStats(stats) {
    window.localStorage.setItem("stats", JSON.stringify(stats));
}

function preventDefaultEventHandling(e) {
    e.preventDefault();
}

function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

function launchTimer(seconds) {
    secondsLeft = seconds;

    $("#timer").text(secondsLeft);
    $("#timer").css("visibility", true);

    while (secondsLeft > 0)
    {
        setTimeout(() => {
            secondsLeft--;
            $("#timer").text(secondsLeft);
        }, 1000);
    }
}

function createModal(text, allowNext) {
    
}