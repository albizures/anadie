<?php
/**
 * Autor: Luis Albizures
 * fecha: 30/08/2015
 * Hora: 11:50 AM
 *
 * sectores.php
 
 * server CRUD para la tabla de cat_sector de Sectores de la ANADIE.
 
 * Entidades de DB que se utilizan:
 *
   cat_sector
   
   sp_sel_cat_sector()
   
   sp_ins_cat_sector()

   
 **/

// Opción para ingresar un registro a la tabla cat_sector
$app->post('/sectorIn','sessionAlive',function() use ($app){

	// Recupera los datos de la forma
	//
    $r = json_decode($app->request->getBody());
	
	$nombre       = $r->nombre;
    $response = array();
	//
	//
    $db = new DbHandler();
	$id = $db->get1Record("select fn_ins_cat_sector( '$nombre' ) as id");

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

// Opcion para obtener la totalidad de registros de la tabla cat_sector
$app->get('/sectorSel','sessionAlive', function() use ($app){

    $response = array();
	//
    $db = new DbHandler();
    $datos = $db->getAllRecord("call sp_sel_cat_sector( )");
    //var_dump($datos);
    if ($datos != NULL) {
			$response = $datos;
    }else{
        $response['status'] = "info";
        $response['message'] = 'No hay sectores';
    }

    echoResponse(200, $response);
});

// Opción para actualizar un registro de la tabla cat_sector

// Opción para eliminar un registro de la tabla cat_sector
$app->get('/sectorD/:id','sessionAlive',function($id) use ($app){

	// Recupera los datos de la forma
	//
	
    $response = array();
	//
	//
    $db = new DbHandler();
    $resId = $db->deleteRecord("call sp_del_cat_sector(?)", $id);
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
