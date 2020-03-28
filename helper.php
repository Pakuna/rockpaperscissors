<?php

session_start();

// Autoload from classes folder
spl_autoload_register(function($sClass) {
    $sPath = __DIR__ . "/classes/";
    require_once $sPath . $sClass . ".php";
});