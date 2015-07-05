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
// Segun yo, solo es necesario que mandes el username, ya no valido clave, puesto que se hizo cuando se hizo el login
$app->post('/session',function() use ($app){
	// Recupera los datos de la forma
    $r = json_decode($app->request->getBody());
    verifyRequiredParams(array('username'),$r->customer);

    $user = $r->customer->username;

    $response = array();
	//
	// Verifica si los datos existen en la base de datos.
	//
    $db = new DbHandler();
    $usuario = $db->get1Record("call sp_sel_seg_usuario( '$user' )");

	$opciones = array();

	$response['status'] = "success";
	$response['message'] = 'Ha ingresado al sistema.';
	$response['name'] = $usuario['nombre'];
	$response['uid'] = $usuario['id'];
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

	// Ya tiene los datos , ahora busca las opciones asignadas de acuerdo a su rol
	$res = $db->getAllRecord("call sp_sel_rol_opcion( '$idrol' )" );
	$response['opciones'] = $res;
			
    echoResponse(200, $response);
});
	
$app->post('/login',function() use ($app){

	// Recupera los datos de la forma
    $r = json_decode($app->request->getBody());
    verifyRequiredParams(array('username', 'password'),$r->customer);

    $clave = $r->customer->password;
    $user = $r->customer->username;

    $response = array();
	//
	// Verifica si los datos existen en la base de datos.
	//
    $db = new DbHandler();
    $usuario = $db->get1Record("call sp_sel_seg_usuario( '$user' )");

	$opciones = array();
	// call sp_sel_seg_usuario( ? ) pusuario
    if ($usuario != NULL) {
        if(passwordHash::check_password($usuario['clave'],$clave)){
			$response['status'] = "success";
			$response['message'] = 'Ha ingresado al sistema.';
			$response['name'] = $usuario['nombre'];
			$response['uid'] = $usuario['id'];
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
			$_SESSION['uid'] = 1;
			$_SESSION['name'] = $usuario['nombre'];
			// 
			// Ya tiene los accesos , ahora busca las opciones asignadas de acuerdo a su rol
			$res = $db->getAllRecord("call sp_sel_rol_opcion( '$idrol' )" );
			$response['opciones'] = $res;
			
		}else{
			$response['status'] = "error";
			$response['message'] = 'Falló el ingreso al sistema. Datos de ingreso incorrectos';
			}
		}
    echoResponse(200, $response);
});

$app->get('/logout', function() {

    $response["status"] = "info";
    $response["message"] = "Se ha desconectado del sistema.";
	
    echoResponse(200, $response);
});