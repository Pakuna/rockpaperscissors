$("#options img").on("click", function() {
    $(this).addClass("active").siblings().removeClass("active");
});

const oLink = $("#board input");
let sGameId = null;

oLink.on("focus", function() {
    $(this).select();
    document.execCommand("copy");
});

// Join existing game
if (window.location.hash) {
    sGameId = window.location.hash.slice(1);
    joinGame(sGameId);
}
// Start new game
else {
    sGameId = Math.random().toString(36).slice(2);
    oLink.val("localhost:333/#" + sGameId).show();
    startGame(sGameId);
}

function startGame(sGameId) {
    $.getJSON("ajax.php", {
        a: "start_game",
        gid: sGameId
    }, function(sReturn) {
        console.log(sReturn);
    });
}

function joinGame(sGameId) {
    $.getJSON("ajax.php", {
        a: "join_game",
        gid: sGameId
    }, function(sReturn) {
        console.log(sReturn);
    });
}