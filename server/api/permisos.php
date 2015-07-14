<?php
/**
 * Autor: Luis Albizures
 * fecha: 13/07/2015
 * Hora: 13:00 AM
 
 * server CRUD para la tabla de opciones de menu.
 
 * Entidades de DB que se utilizan:
 *
   seg_rol_opcion
   
   sp_sel_seg_opcion_idRol( )
   sp_ins_seg_opcion_idRol(? )
   sp_del_seg_opcion_idRol( ? )
   
 **/

// Opcion para obtener los registros asociados a opciones permitidas en un rol especifico
$app->get('/perDatos/:id','sessionAlive', function($id) use ($app){

    $response = array();
	//
    $db = new DbHandler();
	//echo "dato: " . $id;
	//var_dump($db);
    $datos = $db->getAllRecord("call sp_sel_seg_opcion_idRol( $id )");
    //var_dump($datos);
	// call sp_sel_seg_usuario( ? ) pusuario
    if ($datos != NULL) {
			$response = $datos;
    }else{
        $response['status'] = "info";
        $response['message'] = 'No hay datos';
    }
	
    echoResponse(200, $response);
});


//   Opción para ingresar un registro en la tabla seg_rol_opcion
$app->post('/perIn','sessionAlive',function() use ($app){

	// Recupera los datos de la forma
	//
    $r = json_decode($app->request->getBody());
	$idrol = $r->idrol;
	$idopcion = $r->idopcion;
    $response = array();
	//
	//
	// Ejemplo de uso de un insert:
	//
	// select fn_ins_seg_opcion('Ingresa opciones', 'ingreso de opciones', 'Opciones' , 0, 1, 1)
	//
    $db = new DbHandler();
	$column_names = array('idrol', 'idopcion');
	//var_dump($db);
	$result = $db->insertIntoTable($r, $column_names, 'seg_rol_opcion' );
	//$id = $db->get1Record("call sp_ins_seg_opcion_idRol( '$idrol', '$idopcion' )");
    if (is_null($result)) {
        $response['status'] = "info";
        $response['message'] = 'No fue posible agregar los datos';
    }else{
        $response['status'] = "success";
        $response['message'] = 'Se agrego correctamente';
		$response['data'] = $result;
    }
	
    echoResponse(200, $response);
});

//   Opción para eliminar un registro de la tabla seg_rol_opcion
$app->post('/perD/:id','sessionAlive',function($id) use ($app){

	// Recupera los datos de la forma
	//
	
    $response = array();
	//
    $db = new DbHandler();
	$resId = $db->deleteRecord("call sp_del_seg_opcion_idRol( ? )",$id);

    if ($resId == 0) {
        $response['status'] = "success";
        $response['message'] = 'Datos eliminados';
			
    }else{
        $response['status'] = "error " . $resId;
        $response['message'] = 'No fue posible eliminar los datos';
    }
	
    echoResponse(200, $response);
});

?>
