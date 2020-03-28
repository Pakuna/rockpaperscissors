<?php

require_once "helper.php";

// Process action parameter
$sAction = $_GET["a"] ?? null;
if (!$sAction || !function_exists($sAction)) {
    die;
}

$sAction();

function start_game() {
    remove_old_games();

    $oGame = new Game();
    $sGameId = $oGame->startNew();

    echo json_encode(["id" => $sGameId]); die;
}

function join_game() {
    $sGameId = $_GET["gid"] ?? null;
    if (!$sGameId) die;

    $oGame = new Game($sGameId);
    $iReturn = $oGame->join();
    echo json_encode(["code" => $iReturn]); die;
}

function remove_old_games() {
    $oGames = new DirectoryIterator("games");
    foreach ($oGames as $oFile) {
        $sGameId = $oFile->getBasename(".json");
        if (!$oFile->isFile() || $sGameId[0] == ".") continue;

        $oGame = new Game($sGameId);
        if ($oGame->isOld()) $oGame->remove();
    }
}