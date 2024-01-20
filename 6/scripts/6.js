var victory = false;

async function launchGameAsync() {
    closeModal();

    var state = getState();
    state.lastTimePointsAdded = 0;
    setState(state);

    setPage(`game${state.currentGameNumber}`);

    if (state.currentGameNumber === 1)
        await launchFirstGameAsync();
}

function setPage(pageId) {
    var state = getState();
    
    if (state.currentPage != pageId)
    {
        $("#" + state.currentPage).css("display", "none");
        state.currentPage = pageId;
    }

    if (pageId === "login" || pageId === "menu")
        $("#back-to-menu").css("display", "none");
    else
        $("#back-to-menu").css("display", "block");
    
    $("#" + pageId).css("display", "block");

    if (pageId === "login")
        state = resetStateAndChoosedOptions();

    if (pageId != "game1")
        $("#timer").css("display", "none");

    if (pageId === "stats")
        fillStats();

    setState(state);
}

function resetStateAndChoosedOptions() {
    var state = getDefaultState();
        
    $("#" + state.difficulty).prop("checked", true);
    $("#username").val(state.username);
    $("#login-button").prop("disabled", true);

    return state;
}

function login() {
    var state = getState();

    state.username = $("#username").val();
    if (state.username === "")
        return;

    setState(state);
    setPage("menu");
}

function checkInputIsNotEmpty(element) {
    if (element.value === "")
        $("#login-button").prop("disabled", true);
    else
        $("#login-button").prop("disabled", false);
}

function backFromModal() {
    closeModal();

    var state = getState();
    if (victory && state.currentGameNumber < 3)
        state.currentGameNumber++;

    setState(state);
    setPage("menu");
}

async function restartGameAsync() {
    closeModal();
    await launchGameAsync();
}

async function nextGameAsync() {
    var state = getState();
    if (state.currentGameNumber < 3)
        state.currentGameNumber++;

    setState(state);
    await launchGameAsync();
}

function backToMenu() {
    if (getState().currentPage === "game1")
        stopTimer();

    if (timeout != null)
        clearTimeout(timeout);

    setPage('menu');
}

function fillStats() {
    var statsBody = document.getElementById("stats-body");
    statsBody.innerHTML = "";

    var stats = getStats();
    var statsArray = [];

    for (var username in stats)
        statsArray.push([username, stats[username]]);

    statsArray.sort(function(a, b) { return b[1] - a[1]; });
    
    for (const [username, record] of statsArray)
    {
        var row = document.createElement("tr");
        row.innerHTML = `<td>${username}</td><td>${record}</td>`;

        statsBody.appendChild(row);
    }
}

$(document).ready(async function() {
    document.getElementById("modal-restart").addEventListener("click", async () => {
        var state = getState();
        state.points -= state.lastTimePointsAdded;
        setState(state);

        await restartGameAsync();
    })
    document.getElementById("modal-next").addEventListener("click", async () => {
        var state = getState();
        state.currentGameNumber++;
        setState(state);
        
        await launchGameAsync();
    })
    document.getElementById("start-game").addEventListener("click", async () => {
        await launchGameAsync();
    })

    var state = getState();

    if (state == null) {
        state = getDefaultState();
        setState(state);
        setPage("login");
    }
    else
    {
        if (state.currentPage.includes("game"))
            await launchGameAsync();
        else
            setPage(state.currentPage);
    }

    $("#" + state.difficulty).prop("checked", true);

    $(":radio[name='difficulty']").change(function() {
        var state = getState();
        state.difficulty = this.value;

        $("#" + state.difficulty).prop("checked", true);
        setState(state);
    });

    var stats = getStats();
    if (stats == null)
        setStats({});
})