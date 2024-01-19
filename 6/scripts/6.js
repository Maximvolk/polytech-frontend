async function launchGameAsync() {
    closeModal();
    var state = getState();
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
    setPage("menu");
}

async function restartGameAsync() {
    closeModal();
    await launchGameAsync();
}

async function nextGameAsync() {
    var state = getState();
    state.currentGameNumber++;
    setState(state);

    await launchGameAsync();
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
        setState();
        
        await launchGameAsync();
    })
    document.getElementById("start-game").addEventListener("click", async () => { await launchGameAsync(); })

    var state = getState();

    if (state == null) {
        state = {
            username: null,
            currentPage: "login",
            difficulty: "medium"
        };

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