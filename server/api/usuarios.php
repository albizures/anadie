<?php
/**
 * Autor: Luis Albizures
 * fecha: 10/07/2015
 * Hora: 9:00 AM
 
 * server CRUD para la tabla de usuarios de menu.
 
 * Entidades de DB que utiliza:
 *
   fn_estado()
   pg_estado
   seg_usuario
   
  
	sp_sel_seg_usuarios()    --- ojo: este debiera ser en singular pero tuve que dejarlo en plural porque ya existe en singular 
	                         --- para pedir 1 usuario en las rutas de authentication.php
	sp_sel_seg_usuarioId(?)
	fn_ins_seg_usuario( ? , ? , ?, ? , ? , ? , ? , ? )
	sp_upd_seg_usuario( ? , ? , ?, ? , ? , ? , ? , ? )
	sp_del_seg_usuario(?)
 **/

// Opcion para obtener la totalidad de registros de la tabla usuarios
$app->get('/userDatos','sessionAlive', function() use ($app){

    $response = array();
	//
	// Solicita de la base de datos, la totalidad de registros
	//
    $db = new DbHandler();
    $datos = $db->getAllRecord("call sp_sel_seg_usuarios( )");
    if ($datos != NULL) {
			$response = $datos;
    }else{
        $response['status'] = "info";
        $response['message'] = 'No hay datos';
    }

    echoResponse(200, $response);
});

// Opcion para obtener un registro de la tabla usuarios
$app->get('/userDatos/:id','sessionAlive', function($id) use ($app){

    $response = array();
	//
	// Solicita de la base de datos, la totalidad de registros
	//
    $db = new DbHandler();
    $datos = $db->get1Record("call sp_sel_seg_usuarioId(".$id." )");
    if ($datos != NULL) {
		$response['status'] = "success";
		$response['name'] = $datos['nombre'];
		$response['nombres'] = $datos['nombres'];
		$response['apellidos'] = $datos['apellidos'];
		$response['idrol'] = $datos['idrol'];
		$response['idorganizacion'] = $datos['idorganizacion'];
		$response['estado'] = $datos['estado'];
		$response['email'] = $datos['email'];
		$response['cargo'] = $datos['cargo'];
    }else{
        $response['status'] = "info";
        $response['message'] = 'No hay datos';
    }

    echoResponse(200, $response);
});

//   Opción para ingresar un registro de la tabla usuario
$app->post('/userIn','sessionAlive',function() use ($app){

	// Recupera los datos de la forma
	//
    $r = json_decode($app->request->getBody());
	//SELECT `id`, `nombre`, `nombres`, `apellidos`, `clave`, `idrol`, `idorganizacion`, `estado`, `email`, `fecha` FROM `seg_usuario` WHERE 1
	// la fecha la vamos a guardar desde el store procedure
    verifyRequiredParams(array('nombre', 'nombres', 'apellidos', 'clave','idrol','idorganizacion','estado','email','cargo'),$r->user); // 
    $nombre = $r->user->nombre;
    $nombres = $r->user->nombres;
	$apellidos = $r->user->apellidos;
	$clave = passwordHash::hash($r->user->clave);
	$idrol = $r->user->idrol;
	$idorganizacion = $r->user->idorganizacion;
	$estado = $r->user->estado;
	$email = $r->user->email;
	$cargo = $r->user->cargo;
	
    $response = array();
	//
	//
	// Ejemplo de uso de un insert:
	//
	// select fn_ins_seg_opcion('Ingresa opciones', 'ingreso de opciones', 'Opciones' , 0, 1, 1)
	//
    $db = new DbHandler();
	// $column_names = array('nombre', 'descripcion', 'titulo', 'idPadre','idTipo','orden');
	// $db->insertIntoTable($r->opcion, $column_names, 'seg_usuario' );
	$id = $db->get1Record("select fn_ins_seg_usuario( '$nombre','$nombres','$apellidos', '$clave', $idrol , $idorganizacion, $estado, '$email', '$cargo' ) as id");

    if ($id != NULL) {
        $response['status'] = "success";
        $response['message'] = 'Se agrego correctamente';
		$response['data'] = $id;
			
    }else{
        $response['status'] = "info";
        $response['message'] = 'No fue posible agregar los datos';
    }
	
    echoResponse(200, $response);
});

// 
$app->post('/userU','sessionAlive',function() use ($app){

	// Recupera los datos de la forma
	//
    $r = json_decode($app->request->getBody());
    verifyRequiredParams(array('id','nombre', 'nombres', 'apellidos', 'idrol','idorganizacion','estado','email','cargo'),$r->user); // 
	$id = $r->user->id;
    $nombre = $r->user->nombre;
    $nombres = $r->user->nombres;
	$apellidos = $r->user->apellidos;
	
	$idrol = $r->user->idrol;
	$idorganizacion = $r->user->idorganizacion;
	$estado = $r->user->estado;
	$email = $r->user->email;
	$cargo = $r->user->cargo;

    $response = array();
	//
	//
	// Ejemplo de uso de un insert:
	//
	// select fn_ins_seg_opcion('Ingresa opciones', 'ingreso de opciones', 'Opciones' , 0, 1, 1)
	//
    $db = new DbHandler();
    $column_names = array('id','nombre', 'nombres', 'apellidos', 'idrol','idorganizacion','estado','email','cargo');
	// $db->insertIntoTable($r->opcion, $column_names, 'seg_usuario' );
	$resId = $db->updateRecord("call sp_upd_seg_usuario(?,?,?,?,?,?,?,?,?)", $r->user, $column_names,'isssiiiss');
    if ($resId == 1) {
		$response['status'] = "info";
		$response['message'] = 'Datos actualizados';
	}else{
		if ($resId < 0) {
				$response['status'] = "error " . $resId;
				$response['message'] = 'No pudo actualizar los Datos';
			}
	}
	
    echoResponse(200, $response);
});

// Actualizacion de clave
$app->post('/userUpdclave','sessionAlive',function() use ($app){

	// Recupera los datos de la forma
	//
    $r = json_decode($app->request->getBody());
	
	$user   = $_SESSION['name'];
	$clave1 = $r->user->clave1;
	$r2 = array();

    $response = array();
	//
    $db = new DbHandler();
	$usuario = $db->get1Record("call sp_sel_seg_usuario( '$user' )");
    if ($usuario != NULL) {
        //if($clave == $usuario['clave']/*passwordHash::check_password($usuario['clave'],$clave)*/){
		if(passwordHash::check_password($usuario['clave'],str_rot13($clave1))){
			$column_names = array('id','clave2');
			$r2['id'] = $usuario['id'];
			$r2['clave2'] = passwordHash::hash(str_rot13($r->user->clave2));
			$resId = $db->updateRecord("call sp_upd_seg_usuario_clave(?,?)", $r2, $column_names,'is');
			if ($resId == 1) {
				$response['status'] = "info";
				$response['message'] = 'Su clave ha sido actualizada';
			}
			else{
				$response['status'] = "error";
				$response['message'] = 'No pudo actualizarse la Clave';
			}	
		}
		else{
			$response['status'] = "error";
			$response['message'] = "No se pudo validar al usuario o clave ";
		}
	}
	else{
		$response['status'] = "error";
		$response['message'] = 'No se pudo validar al usuario o clave';
		}	
	
    echoResponse(200, $response);
});

$app->get('/userD/:id','sessionAlive',function($id) use ($app){

    $response = array();
	//
	//
	// Ejemplo de uso de un insert:
	//
	// select fn_ins_seg_opcion('Ingresa opciones', 'ingreso de opciones', 'Opciones' , 0, 1, 1)
	//
    $db = new DbHandler();
	
    $resId = $db->deleteRecord("call sp_del_seg_usuario(?)", $id);
    if ($resId == 0) {
		$response['status'] = "info";
		$response['message'] = 'Datos eliminados';
	}else{
		if ($resId < 0) {
				$response['status'] = "error " . $resId;
				$response['message'] = 'No pudo eliminar los Datos';
			}
	}
	
    echoResponse(200, $response);
});

?>
