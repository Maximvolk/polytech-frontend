
var stopTimer = false;

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
        currentGameNumber: 1,
        points: 0,
        lastTimePointsAdded: 0
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

async function launchTimerAsync(seconds) {
    $("#timer").text(seconds);
    $("#timer").css("visibility", true);

    while (seconds > 0 && !stopTimer)
    {
        await sleep(1000);
        
        seconds--;
        $("#timer").html(seconds);
    }
}

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

function openModal(text, allowNext) {
    var state = getState();

    if (!allowNext || state.currentGameNumber === 3)
        $("#modal-next").css("display", "none");

    $("#modal-text").html("<h1>" + text + "</h1>");
    $("#modal").css("display", "block");
}

function closeModal() {
    $("#modal").css("display", "none");
}

function updateStats(points = null) {
    var state = getState();
    var stats = getStats();

    if (points == null)
        points = state.points

    if (!(state.username in stats))
        stats.username = points;
    else
    {
        if (state.points > stats.username)
            stats.username = points;
    }

    setStats(stats);
}