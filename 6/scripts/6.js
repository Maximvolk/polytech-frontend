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

$(document).ready(function() {
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
        setPage(state.currentPage);

    $("#" + state.difficulty).prop("checked", true);

    $(":radio[name='difficulty']").change(function() {
        var state = getState();
        state.difficulty = this.value;

        $("#" + state.difficulty).prop("checked", true);
        setState(state);
    });
})