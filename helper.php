<?php

session_start();

ini_set("display_errors", 1);
ini_set("display_startup_errors", 1);
error_reporting(E_ALL);

// Autoload from classes folder
spl_autoload_register(function($sClass) {
    $sPath = __DIR__ . "/classes/";
    require_once $sPath . strtolower($sClass) . ".php";
});