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
        difficulty: "medium"
    };
}

function getStats() {
    return JSON.parse(window.localStorage.getItem("stats"));
}

function setStats(stats) {
    window.localStorage.setItem("stats", JSON.stringify(stats));
}