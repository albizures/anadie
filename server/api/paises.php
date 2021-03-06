<?php
/**
 * Autor: Luis Albizures
 * fecha: 30/08/2015
 * Hora: 11:50 AM
 *
 * paises.php
 
 * server CRUD para la tabla de cat_pais de paises de la ANADIE.
 
 * Entidades de DB que se utilizan:
 *
   cat_pais
   
   sp_sel_cat_pais()

   
 **/

// Opción para ingresar un registro a la tabla cat_pais
$app->post('/paisIn','sessionAlive',function() use ($app){

	// Recupera los datos de la forma
	//
    $r = json_decode($app->request->getBody());
	
	$nombre   = $r->nombre;
    $response = array();
	//
	//
    $db = new DbHandler();
	$id = $db->get1Record("select fn_ins_cat_pais( '$nombre' ) as id");

    if ($id != NULL) {
        $response['status'] = "success";
        $response['message'] = 'Se agrego correctamente';
		$response['data'] = $id['id'];
			
    }else{
        $response['status'] = "info";
        $response['message'] = 'No fue posible agregar los datos';
    }
	
    echoResponse(200, $response);
});

// Opcion para obtener la totalidad de registros de la tabla cat_pais
$app->get('/paisSel','sessionAlive', function() use ($app){

    $response = array();
	//
    $db = new DbHandler();
    $datos = $db->getAllRecord("call sp_sel_cat_pais( )");
    //var_dump($datos);
    if ($datos != NULL) {
			$response = $datos;
    }else{
        $response['status'] = "info";
        $response['message'] = 'No hay paises';
    }

    echoResponse(200, $response);
});

// Opción para actualizar un registro de la tabla cat_pais

// Opción para eliminar un registro de la tabla cat_pais
$app->get('/paisD/:id','sessionAlive',function($id) use ($app){

	// Recupera los datos de la forma
	//
	
    $response = array();
	//
	//
    $db = new DbHandler();
    $resId = $db->deleteRecord("call sp_del_cat_pais(?)", $id);
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
