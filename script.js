const oOptions      = $("#options [data-option]"), // Options the user can choose from
      oChoices      = $("#board [data-option]"), // Options the opponent selected
      oLink         = $("#board input"), // Link to copy and share
      oNewGameBtn   = $("#board #new_game"),
      oLoading      = $("#board #loading"), // Loading animation
      oPolling      = null; // Timeout handler while polling for game result

let sGameId = null;

// Sends users choice
oOptions.on("click", function() {
    oOptions.removeClass("active");
    if (!sGameId) return;

    $(this).addClass("active");
    sendChoice(sGameId, $(this).data("option"));
});

// Select and copy link to clipboard when clicked/focused
oLink.on("focus", function() {
    $(this).select();
    document.execCommand("copy");
});

// Start new game
$("#new_game").click(function() {
    // Replace new game button with loading animation
    oNewGameBtn.hide();
    oLoading.show();

    $.getJSON("ajax.php?a=start_game", function(oJson) {
        sGameId = oJson.id;
        oLoading.hide();
        oLink.val("localhost:333/#" + sGameId).show();
        history.pushState(null, null, "#" + sGameId);
        waitForPlayer(sGameId);
    });
});

// Join existing game with game id provided by URL hash
if (window.location.hash) {
    sGameId = window.location.hash.slice(1);
    oNewGameBtn.hide();
    oLoading.show();

    $.getJSON("ajax.php?a=join_game", {
        "gid": sGameId
    }, function(oJson) {
        const iCode     = parseInt(oJson.code),
              sChoice   = oJson.choice;

        oOptions.removeClass("active");

        // Error code? Show new game button
        if (iCode < 0) {
            oNewGameBtn.show();
            oLoading.hide();
            history.pushState(null, null, "");
            return;
        }

        // User already chose an option before?
        if (sChoice) {
            $("#options [data-option='" + sChoice + "'").addClass("active");
        }

        // Second player still missing
        if (iCode == 1) {
            oLoading.hide();
            oLink.val("localhost:333/#" + sGameId).show();
            waitForPlayer(sGameId);
        }
    });
}

// Polls game till second player is found
function waitForPlayer(sGameId) {
    $.getJSON("ajax.php?a=join_game", {
        "gid": sGameId
    }, function(oJson) {
        if (oJson.code == 2) {
            oLoading.show();
            oLink.hide();
            return;
        }

        // No second player yet? Poll again..
        setTimeout(waitForPlayer, 1000, sGameId);
    });
}

// Sends users choise and starts polling for a result
function sendChoice(sGameId, sChoice) {
    $.getJSON("ajax.php?a=update_game", {
        "gid": sGameId,
        "c": sChoice
    }, function() {
        getResult(sGameId);
    });
}

// Polls game till opponent choice is found
function getResult(sGameId) {
    clearTimeout(oPolling);

    $.getJSON("ajax.php?a=poll_game", {
        "gid": sGameId
    }, function(oJson) {
        if (oJson.choice) {
            showResult(oJson.choice);
            setTimeout(resetChoices, 3000, sGameId);
            return;
        }

        // No choice yet? Poll again..
        oPolling = setTimeout(getResult, 1000, sGameId);
    });
}

function showResult(sChoice) {
    const sYourChoice = oOptions.filter(".active").data("option");
    oLoading.hide();

    // Show choice icon
    oChoices.removeClass("active");
    $("#board [data-option='" + sChoice + "']").addClass("active");
}

// Reset users and opponents choice
function resetChoices(sGameId) {
    $.getJSON("ajax.php?a=reset_game", {
        "gid": sGameId
    }, function() {
        $("[data-option]").removeClass("active");
        oLoading.show();
    });
}