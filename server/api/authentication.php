<?php
/**
 * Created by PhpStorm.
 * User: josec
 * Date: 6/27/2015
 * Time: 11:20 AM
 */

function obtenCaracterAleatorio($arreglo) {
	$clave_aleatoria = array_rand($arreglo, 1);	//obtén clave aleatoria
	return $arreglo[ $clave_aleatoria ];	//devolver ítem aleatorio
}

function obtenCaracterMd5($car) {
	$md5Car = md5($car.Time());	//Codificar el carácter y el tiempo POSIX (timestamp) en md5
	$arrCar = str_split(strtoupper($md5Car));	//Convertir a array el md5
	$carToken = obtenCaracterAleatorio($arrCar);	//obtén un ítem aleatoriamente
	return $carToken;
}

function obtenToken($longitud) {
	//crear alfabeto
	$mayus = "ABCDEFGHIJKMNPQRSTUVWXYZ";
	$mayusculas = str_split($mayus);	//Convertir a array
	//crear array de numeros 0-9
	$numeros = range(0,9);
	//revolver arrays
	shuffle($mayusculas);
	shuffle($numeros);
	//Unir arrays
	$arregloTotal = array_merge($mayusculas,$numeros);
	$newToken = "";

	for($i=0;$i<=$longitud;$i++) {
		$miCar = obtenCaracterAleatorio($arregloTotal);
		$newToken .= obtenCaracterMd5($miCar);
	}
	return $newToken;
}

$app->get('/login',function() use ($app){
    $r = json_decode($app->request->getBody());
    var_dump( $r);
    echoResponse(200, "termino");
});

//
// Cambio para que el cliente no tenga que mandar nada, para que la informacion de la
// sesion se use para pedir la informacion, de lo contrario se responde con 401 de no autorizado.
// Tambien cambie la ruta a get porque no se va a mandar nada.

$app->get('/session/',function() use ($app){
	  session_start();
    $response = array();
    $code = 0;

    $r = json_decode($app->request->getBody());   // Aqui espero me manden el token

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

        // Verifica que exista el token   --
/*
        $token = $r->token;

        $usuario = $db->get1Record("call sp_sel_seg_usuario_token( '$token' )");
        if($usuario['id'] != NULL) {
          $code = 200;
        }
        else {
          $code = 401;
          $response['status'] = "error";
          $response['message'] = 'Ha tenido problemas con la validación de su token.';
        }
*/
        // Fin. - Verifica que exista el token --

    }else{
        $code = 401;
        $response['status'] = "error";
        $response['message'] = 'Aun no ha iniciado sesion.';
    }

    echoResponse($code, $response);
});

$app->post('/login',function() use ($app){

  // espera recibir un token que ya fue asignado previamente

	// Recupera los datos de la forma
    $r = json_decode($app->request->getBody());
    verifyRequiredParams(array('username', 'password'),$r);//cambio el nombre customer por user

    $clave = str_rot13($r->password);
    $user = $r->username;

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
			$name = $usuario['nombre'];
			$resx = $db->get1Record("select fn_ins_seg_user_logging( '$id', '$id', '$user') as id");
			// Ya tiene los accesos , ahora busca las opciones asignadas de acuerdo a su rol
			$res = $db->getAllRecord("call sp_sel_opciones_menu( '$id' )" );

			$response['opciones'] = $res;

      // le genera su token - 26/01/2016
      $nuevoToken = "";

    	//const INTENTOS = 5;
    	$contador = 1;
    	while( $contador<=5 ) {

      		$tmpToken = obtenToken(10);
      		//Validar que no exista ya el token generado
      		$sql = "SELECT  count(id) as total FROM seg_usuario_token
      						WHERE token = '$tmpToken';";
          $resx2 = $db->get1Record($sql);

      		//Si no existe, entonces el token generado es valido
      		if( $resx2['total']==0 ) {
      			$nuevoToken = $tmpToken;
      			break;	//Salir del bucle
      		}
      		$contador++;
      	}

      	if(strlen($nuevoToken)>0 ) {
          $response['token'] = $nuevoToken;
        }

      // Fin. de se le genera su token - 26/01/2016

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

    // Recupera los datos de la forma
    $r = json_decode($app->request->getBody());

    // $sql = "UPDATE seg_usuario_token set estado = 1 WHERE token = '$r->token'";

    $sql = "UPDATE seg_usuario_token set estado = 1 WHERE id_usuario = " . $_SESSION['uid'];
    $db = new DbHandler();
    $resx2 = $db->get1Record($sql);

    // Se actualizó el estado del token para invalidarlo y dejarlo como históreadline_completion_function

    $response["status"] = "info";
    $response["message"] = "Se ha desconectado del sistema.";
    session_unset();
  	session_destroy();
    echoResponse(200, $response);
});

?>
