<?php
/**
 * Autor: Luis Albizures
 * fecha: 30/08/2015
 * Hora: 11:50 AM
 *
 * ices.php
 
 * server CRUD para la tabla de cat_ice de ICEs de la ANADIE.
 
 * Entidades de DB que se utilizan:
 *
   cat_ice
   
   sp_sel_cat_ice()

   
 **/

// Opción para ingresar un registro a la tabla cat_ice
$app->post('/iceIn','sessionAlive',function() use ($app){

	// Recupera los datos de la forma
	//
    $r = json_decode($app->request->getBody());
	
	$nombre       = $r->nombre;
    $response = array();
	//
	//
    $db = new DbHandler();
	$id = $db->get1Record("select fn_ins_cat_ice( '$nombre' ) as id");

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

// Opcion para obtener la totalidad de registros de la tabla cat_ice
$app->get('/iceSel','sessionAlive', function() use ($app){

    $response = array();
	//
    $db = new DbHandler();
    $datos = $db->getAllRecord("call sp_sel_cat_ice( )");
    //var_dump($datos);
    if ($datos != NULL) {
			$response = $datos;
    }else{
        $response['status'] = "info";
        $response['message'] = "No hay ICE's";
    }

    echoResponse(200, $response);
});

// Opción para actualizar un registro de la tabla cat_ice

// Opción para eliminar un registro de la tabla cat_ice
$app->get('/iceD/:id','sessionAlive',function($id) use ($app){

	// Recupera los datos de la forma
	//
	
    $response = array();
	//
	//
    $db = new DbHandler();
    $resId = $db->deleteRecord("call sp_del_cat_ice(?)", $id);
    if ($resId == 0) {
		$response['status'] = "success";
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
