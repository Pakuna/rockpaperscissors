<?php

class Game {

    public $id;
    public $data;

    const SUCCESS_OWNER_JOINED_PLAYER_MISSING = 1;
    const SUCCESS_OWNER_JOINED = 2;
    const SUCCESS_PLAYER_JOINED = 3;
    const ERROR_NO_GAME = -1;
    const ERROR_GAME_FULL = -2;

    function __construct(?string $sId = null) {
        // Set initial timestamp
        $this->data["created"] = date("Y-m-d H:i:s");

        if ($sId) $this->load($sId);
    }

    function load(string $sId) {
        // Get stored game file
        $sGamePath = $this->getPath($sId);
        if (!file_exists($sGamePath)) return false;

        // Load and verify JSON file
        $sJson = file_get_contents($sGamePath);
        $aData = json_decode($sJson, true);
        if (json_last_error() != JSON_ERROR_NONE) return false;

        $this->id = $sId;
        $this->data = $aData;

        return true;
    }

    /**
     * Initialises new game and returns its id
     */
    function startNew() {
        //$this->id = uniqid();
        $this->id = "5e7f0c3dad118";
        $this->data["owner"] = session_id();
        $this->data["player"] = "";
        $this->save();
        return $this->id;
    }

    function join() : int {
        // No game? Can't join
        if (!$this->id) return self::ERROR_NO_GAME;

        $sSessionId = session_id();
        $sOwner = $this->data["owner"];
        $sPlayer = $this->data["player"];

        // You the owner?
        if ($sOwner == $sSessionId) {
            if ($sPlayer) return self::SUCCESS_OWNER_JOINED;
            return self::SUCCESS_OWNER_JOINED_PLAYER_MISSING;
        }

        // Second player already occupied?
        if ($sPlayer == $sSessionId) return self::SUCCESS_PLAYER_JOINED;
        if ($sPlayer) return self::ERROR_GAME_FULL;

        // Set second player
        $this->data["player"] = $sSessionId;
        $this->save();
        return self::SUCCESS_PLAYER_JOINED;
    }

    /**
     * Stores game data to JSON file
     */
    function save() {
        $sGamePath = $this->getPath($this->id);
        $this->data["modified"] = date("Y-m-d H:i:s");
        return file_put_contents(
            $sGamePath,
            json_encode($this->data, JSON_PRETTY_PRINT)
        );
    }

    /**
     * Returns full path to games JSON file
     */
    function getPath(string $sId) : string {
        return __DIR__ . "/../games/" . $sId . ".json";
    }

    /**
     * Whether or not the game was not modified/played for 24h
     */
    function isOld() : bool {
        // Not yet modified? Not old..
        if (!isset($this->data["modified"])) return false;

        $sYesterday = date("Y-m-d H:i:s", strtotime("-1 days"));
        return $this->data["modified"] < $sYesterday;
    }

    /**
     * Removes games JSON file
     */
    function remove() : bool {
        $sGamePath = $this->getPath($this->id);
        return @unlink($sGamePath);
    }
}