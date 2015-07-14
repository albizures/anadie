<?php
/**
 * Autor: Luis Albizures
 * fecha: 12/07/2015
 * Hora: 16:00 AM
 
 * server CRUD para la tabla de opciones de menu.
 
 * Entidades de DB que se utilizan:
 *
   cat_organizacion
   
   sp_sel_cat_organizacion( )
   fn_ins_cat_organizacion( ? )
   sp_del_cat_organizacion( ? )
   sp_upd_cat_organizacion(?,?)
   
 **/
//   Opción para actualizar un registro de la tabla roles
$app->post('/orgU','sessionAlive',function() use ($app){

	// Recupera los datos de la forma
	//
    $r = json_decode($app->request->getBody());
	$nombre = $r->rol->nombre;
	$id = $r->rol->id;
    $response = array();
	//
	//
	// Ejemplo de uso de un insert:
	//
	// select fn_ins_seg_opcion('Ingresa opciones', 'ingreso de opciones', 'Opciones' , 0, 1, 1)
	//
    $db = new DbHandler();
    $column_names = array('id','nombre');
		// $resId = $db->updateRecord("call sp_upd_seg_usuario(?,?,?,?,?,?,?,?)", $r->user, $column_names,'isssiiis');
	$resId = $db->updateRecord("call sp_upd_cat_organizacion(?,?)", $r->rol, $column_names,'is');

    if ($id != NULL) {
        $response['status'] = "info";
        $response['message'] = 'Datos actualizados';
			
    }else{
        $response['status'] = "error " . $resId;
        $response['message'] = 'No fue posible actualizar los datos';
    }
	
    echoResponse(200, $response);
});

// Opcion para obtener la totalidad de registros de la tabla cat_organizacion
$app->get('/organizacionesDatos','sessionAlive', function() use ($app){

    $response = array();
	//
    $db = new DbHandler();
    $datos = $db->getAllRecord("call sp_sel_cat_organizacion( )");
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

//   Opción para ingresar un registro de la tabla cat_organizacion
$app->post('/orgIn','sessionAlive',function() use ($app){

	// Recupera los datos de la forma
	//
    $r = json_decode($app->request->getBody());
	$nombre = $r->rol->nombre;
    $response = array();
	//
	//
    $db = new DbHandler();
	$id = $db->get1Record("select fn_ins_cat_organizacion( '$nombre' ) as id");

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

//   Opción para eliminar un registro de la tabla cat_organizacion
$app->get('/orgD/:id','sessionAlive',function($id) use ($app){

	// Recupera los datos de la forma
	//
	
    $response = array();
	//
    $db = new DbHandler();
	$resId = $db->deleteRecord("call sp_del_cat_organizacion( ? )",$id);

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
