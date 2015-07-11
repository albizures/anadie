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
   sp_sel_opcion()
   sp_sel_seg_opcion( )
   sp_sel_tipo_opcion()
   sp_sel_seg_opcion_hijos( padre )
   
   sp_sel_seg_usuario()
 
 **/

$app->get('/opLista','sessionAlive', function() use ($app) {
	$db = new DbHandler();
    $response = array();
	$datos = $db->getAllRecord("call sp_sel_tipo_opcion()");
    if ($datos != NULL) {
			$response = $datos;
    }else{
        $response['status'] = "info";
        $response['message'] = 'No hay datos';
    }
    echoResponse(200, $response);
});

$app->post('/opListaH','sessionAlive', function() use ($app) {
    $r = json_decode($app->request->getBody());
    verifyRequiredParams(array('idPadre'),$r); // 
    $idPadre = $r->idPadre;

	$db = new DbHandler();
    $response = array();
	$datos = $db->getAllRecord("call sp_sel_seg_opcion_hijos($idPadre)");
    if ($datos != NULL) {
			$response = $datos;
    }else{
        $response['status'] = "info";
        $response['message'] = 'No hay datos';
    }
    echoResponse(200, $response);
});
 
// Opcion para obtener la totalidad de registros de la tabla opcion 

$app->get('/userDatos','sessionAlive', function() use ($app){

    $response = array();
	//
	// Solicita de la base de datos, la totalidad de registros
	//
    $db = new DbHandler();
    $datos = $db->getAllRecord("call sp_sel_seg_usuario( )");
    if ($datos != NULL) {
			$response = $datos;
    }else{
        $response['status'] = "info";
        $response['message'] = 'No hay datos';
    }

    echoResponse(200, $response);
});

//   Opción para ingresar un registro de la tabla opcion

$app->post('/opDatos','sessionAlive',function() use ($app){

	// Recupera los datos de la forma
	//
    $r = json_decode($app->request->getBody());
    verifyRequiredParams(array('nombre', 'descripcion', 'titulo', 'idPadre','idTipo','orden'),$r->opcion); // 
    $nombre = $r->opcion->nombre;
    $descripcion = $r->opcion->descripcion;
	$titulo = $r->opcion->titulo;
	$idPadre = $r->opcion->idPadre;
	$idTipo = $r->opcion->idTipo;
	$orden = $r->opcion->orden;

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
	$id = $db->get1Record("select fn_ins_seg_opcion( '$nombre','$descripcion','$titulo', $idPadre, $idTipo , $orden ) as id");

    if ($id != NULL) {
        $response['status'] = "success";
        $response['message'] = 'Se agrego correctamente';
			$response = $id;
			
    }else{
        $response['status'] = "info";
        $response['message'] = 'No hay datos';
    }
	
	
    echoResponse(200, $response);
});

$app->post('/opDatosU','sessionAlive',function() use ($app){

	// Recupera los datos de la forma
	//
    $r = json_decode($app->request->getBody());
    verifyRequiredParams(array('id','nombre', 'descripcion', 'titulo', 'idPadre','idTipo','orden'),$r->opcion); // 
    $nombre = $r->opcion->nombre;
    $descripcion = $r->opcion->descripcion;
	$titulo = $r->opcion->titulo;
	$idPadre = $r->opcion->idPadre;
	$idTipo = $r->opcion->idTipo;
	$orden = $r->opcion->orden;

    $response = array();
	//
	//
	// Ejemplo de uso de un insert:
	//
	// select fn_ins_seg_opcion('Ingresa opciones', 'ingreso de opciones', 'Opciones' , 0, 1, 1)
	//
    $db = new DbHandler();
    $column_names = array('id','nombre', 'descripcion', 'titulo', 'idPadre','idTipo','orden');
	// $db->insertIntoTable($r->opcion, $column_names, 'seg_usuario' );
	$resId = $db->updateRecord("call sp_upd_seg_opcion(?,?,?,?,?,?,?)", $r->opcion, $column_names,'isss');
	
    if ($resId == 0) {
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

$app->get('/userDatosD/:id','sessionAlive',function($id) use ($app){

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
