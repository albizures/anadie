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

//
// Cambio para que el cliente no tenga que mandar nada, para que la informacion de la
// sesion se use para pedir la informacion, de lo contrario se responde con 401 de no autorizado.
// Tambien cambie la ruta a get porque no se va a mandar nada.

$app->get('/session',function() use ($app){
	session_start();
    $response = array();
    $code = 0;
    if(isset($_SESSION['name'])){
        //
        // Verifica si los datos existen en la base de datos.
        //
        $opciones = array();
        $response = array();

        $db = new DbHandler();
        $usuario = $db->get1Record("call sp_sel_seg_usuario( '".$_SESSION['name']."' )");
        //$usuario = $db->get1Record("call sp_sel_seg_usuario( 'lalbizures' )");
        $response['status']         = "success";
        //$response['message']      = 'Ha ingresado al sistema.';
        $response['name']           = $usuario['nombre'];
        $id = $response['uid']      = $usuario['id'];
        $response['email']          = $usuario['email'];
        $response['nombres']        = $usuario['nombres'];
        $response['apellidos']      = $usuario['apellidos'];
        $response['idrol']          = $usuario['idrol'];
        $idrol                      = $usuario['idrol'];
        $response['rol']            = $usuario['rol'];
        $response['idorganizacion'] = $usuario['idorganizacion'];
        $response['organizacion']   = $usuario['organizacion'];
        $response['idestado']       = $usuario['idestado'];
        $response['estado']         = $usuario['estado'];

        $response['fecha']          = $usuario['fecha'];

        // Ya tiene los datos , ahora busca las opciones asignadas de acuerdo a su rol
        $res = $db->getAllRecord("call sp_sel_opciones_menu( '$id' )" );
        $response['opciones'] = $res;
        $code = 200;
    }else{
        $code = 401;
        $response['status'] = "error";
        $response['message'] = 'Aun no ha iniciado sesion.';
    }

    echoResponse($code, $response);
});

$app->post('/login',function() use ($app){

	// Recupera los datos de la forma
    $r = json_decode($app->request->getBody());
    verifyRequiredParams(array('username', 'password'),$r->user);//cambio el nombre customer por user

    $clave = $r->user->password;
    $user = $r->user->username;

    $response = array();
	//
	// Verifica si los datos existen en la base de datos.
	//
    $db = new DbHandler();
    $usuario = $db->get1Record("call sp_sel_seg_usuario( '$user' )");

	$opciones = array();
	// call sp_sel_seg_usuario( ? ) pusuario
    if ($usuario != NULL) {
        //if($clave == $usuario['clave']/*passwordHash::check_password($usuario['clave'],$clave)*/){
		if(passwordHash::check_password($usuario['clave'],$clave)){
			$response['status'] = "success";
			$response['message'] = 'Ha ingresado al sistema.';
			$response['name'] = $usuario['nombre'];
			$id = $response['uid'] = $usuario['id'];
			$response['email'] = $usuario['email'];
			$response['nombres'] = $usuario['nombres'];
			$response['apellidos'] = $usuario['apellidos'];
			$response['idrol'] = $usuario['idrol'];
			$idrol = $usuario['idrol'];
			$response['rol'] = $usuario['rol'];
			$response['idorganizacion'] = $usuario['idorganizacion'];
			$response['organizacion'] = $usuario['organizacion'];
			$response['idestado'] = $usuario['idestado'];
			$response['estado'] = $usuario['estado'];
			
			$response['fecha'] = $usuario['fecha'];
			if (!isset($_SESSION)) {
				session_start();
			}
			$_SESSION['uid'] = $id;
			$_SESSION['name'] = $usuario['nombre'];
			// 
			// Ya tiene los accesos , ahora busca las opciones asignadas de acuerdo a su rol
			$res = $db->getAllRecord("call sp_sel_opciones_menu( '$id' )" );
			
			$response['opciones'] = $res;
			
		}else{
			$response['status'] = "error";
			$response['message'] = 'Falló el ingreso al sistema. Datos de ingreso incorrectos';
		}
	} else {$response['status'] = "error";
        $response['message'] = 'Falló el ingreso al sistema. Datos de ingreso incorrectos';
    }
	
    echoResponse(200, $response);
});

$app->get('/logout', function() use ($app){
    session_start();
    $response["status"] = "info";
    $response["message"] = "Se ha desconectado del sistema.";
    session_unset();
	session_destroy();
    echoResponse(200, $response);
});

?>