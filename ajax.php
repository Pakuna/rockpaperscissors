<?php

$sAction = $_GET["a"] ?? null;
if (!$sAction || !function_exists($sAction)) {
    die;
}

$sAction();

function start_game() {
    $sGameId = $_GET["gid"] ?? null;
    if (!$sGameId) {
        die;
    }

    $aData = [
        "created" => date("Y-m-d H:i:s"),
    ];

    file_put_contents("games/" . $sGameId . ".json", json_encode($aData));
}