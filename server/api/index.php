<?php

/**
 * Step 1: Require the Slim Framework
 *
 * If you are not using Composer, you need to require the
 * Slim Framework and register its PSR-0 autoloader.
 *
 * If you are using Composer, you can skip this step.
 */

require_once 'dbHandler.php';
require_once 'passwordHash.php';
require 'Slim/Slim.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

// User id from db - Global Variable
$user_id = NULL;

require_once "authentication.php";
require_once "opciones.php";
require_once "usuarios.php";
require_once "organizaciones.php";
require_once "roles.php";

/**
 * Verifying required params posted or not
 */
function verifyRequiredParams($required_fields,$request_params) {
    $error = false;
    $error_fields = "";
    foreach ($required_fields as $field) {
        if (!isset($request_params->$field) || strlen(trim($request_params->$field)) <= 0) {
            $error = true;
            $error_fields .= $field . ', ';
        }
    }

    if ($error) {
        // Required field(s) are missing or empty
        // echo error json and stop the app
        $response = array();
        $app = \Slim\Slim::getInstance();
        $response["status"] = "error";
        $response["message"] = 'Faltan campos requeridos ' . substr($error_fields, 0, -2) . ' o vienen vacíos.';
        echoResponse(200, $response);
        $app->stop();
    }
}

function echoResponse($status_code, $response) {
    $app = \Slim\Slim::getInstance();
    // Http response code
    $app->status($status_code);

    // setting response content type to json
    $app->contentType('application/json');

    echo json_encode($response);
}

// $authenticateForRole = function ( $role = 'member' ) {
//    return function () use ( $role ) {
//       $user = User::fetchFromDatabaseSomehow();
	
function sessionAlive () {
		session_start();

// Si acaso quisieramos ponerle un timeout mayor al estandar
		
// if (isset($_SESSION['LAST_ACTIVITY']) && (time() - $_SESSION['LAST_ACTIVITY'] > 1800)) {
    // // last request was more than 30 minutes ago
    // session_unset();     // unset $_SESSION variable for the run-time 
    // session_destroy();   // destroy session data in storage
// }
// $_SESSION['LAST_ACTIVITY'] = time(); // update last activity time stamp
		
		if (!isset($_SESSION['name'])) {
			$code = 401;
			$response = array();
			$response['status'] = "error";
			$response['message'] = 'Aun no ha iniciado sesion.';			
			$app = \Slim\Slim::getInstance();
		    echoResponse($code, $response);
			$app->stop();
        }
};

$app->run();

?>