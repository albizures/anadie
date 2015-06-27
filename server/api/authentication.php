<?php
/**
 * Created by PhpStorm.
 * User: josec
 * Date: 6/27/2015
 * Time: 11:20 AM
 */

$app->get('/login',function() use ($app){
    $r = json_decode($app->request->getBody());
    var_dump( $r);
    echoResponse(200, "termino");
});

$app->post('/login',function() use ($app){

    $r = json_decode($app->request->getBody());
    $password = $r->customer->password;
    $response = array();
    $user = $r->customer->username;
    if($user == "luis" && $password == "hyperion"){
        $response['status'] = "success";
        $response['message'] = 'Logged in successfully.';
        $response['name'] = $user;
        $response['uid'] = 1;
        $response['email'] = "lalbizurs@nadie.com";
        //$response['createdAt'] = $user['created'];
        if (!isset($_SESSION)) {
            session_start();
        }
        $_SESSION['uid'] = 1;
        $_SESSION['email'] = "lalbizurs@nadie.com";;
        $_SESSION['name'] = $user;

    }else{
        $response['status'] = "error";
        $response['message'] = 'Login failed. Incorrect credentials';
    }

    echoResponse(200, $response);
});
$app->get('/logout', function() {

    $response["status"] = "info";
    $response["message"] = "Logged out successfully";
    echoResponse(200, $response);
});