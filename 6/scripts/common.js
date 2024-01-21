var timerStopRequested = false;

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
    var stats = window.localStorage.getItem("stats");
    if (stats == null)
        stats = "{}";

    return JSON.parse(stats);
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

    while (seconds > 0 && !timerStopRequested)
    {
        await sleep(1000);
        
        if (timerStopRequested)
            break;

        seconds--;
        $("#timer").html(seconds);
    }
    
    timerStopRequested = false;
}

function stopTimer() {
    timerStopRequested = true;
}

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

function openModal(text, allowNext) {
    stopTimer();
    var state = getState();

    if (!allowNext || state.currentGameNumber === 3)
        $("#modal-next").css("display", "none");
    else
        $("#modal-next").css("display", "block");

    if (allowNext && state.currentGameNumber === 3)
        $("#modal-restart-everything").css("display", "block");

    $("#modal-text").html("<h1>" + text + "</h1>");
    $("#modal").css("display", "block");

    $("#back-to-menu").prop("disabled", true);
}

function closeModal() {
    $("#modal").css("display", "none");
    $("#back-to-menu").prop("disabled", false);
    $("#modal-restart-everything").css("display", "none");
}

function updateStats() {
    var state = getState();
    var stats = getStats();

    var newRecord = false;

    if (!(state.username in stats))
    {
        stats[state.username] = state.points;
        if (state.points > 0)
            newRecord = true;
    }
    else
    {
        if (state.points > stats[state.username])
        {
            stats[state.username] = state.points;
            newRecord = true;
        }
    }

    setStats(stats);
    return newRecord;
}

function getRandomItem(set) {
    return [...set][Math.floor(Math.random() * set.size)];
}