$("#options img").on("click", function() {
    $(this).addClass("active").siblings().removeClass("active");
});

const oLink = $("#board input"),
      oNewGameBtn = $("#board #new_game")
      oLoading = $("#board #loading");
let sGameId = null;

oLink.on("focus", function() {
    $(this).select();
    document.execCommand("copy");
});

// Start new game
$("#new_game").click(function() {
    oNewGameBtn.hide();
    oLoading.show();
    $.getJSON("ajax.php?a=start_game", function(oJson) {
        oLoading.hide();
        oLink.val("localhost:333/#" + oJson.id).show();
        //history.pushState(null, null, "#" + oJson.id);
    });
});

// Join existing game
if (window.location.hash) {
    sGameId = window.location.hash.slice(1);
    oNewGameBtn.hide();
    oLoading.show();
    $.getJSON("ajax.php?a=join_game", {
        gid: sGameId
    }, function(oJson) {
        switch (parseInt(oJson.code)) {
            case 1: // Owner joined, second player missing
                oLoading.hide();
                oLink.val("localhost:333/#" + sGameId ).show();
                break;
        }
        console.log(oJson);
    });
}

function getGameState() {

}