<?php
/**
 * Autor: Luis Albizures
 * fecha: 16/10/2015
 * Hora: 04:10 AM
 *
 * ambitos.php
 
 * server CRUD para la tabla de cat_ambito de la ANADIE.
 
 * Entidades de DB que se utilizan:
 *
   cat_ambito
   
   sp_sel_cat_ambito()
   
   fn_ins_cat_ambito()
   
   sp_del_cat_ambito()

   
 **/

// Opción para ingresar un registro a la tabla cat_ambito
$app->post('/ambitoIn','sessionAlive',function() use ($app){

	// Recupera los datos de la forma
	//
    $r = json_decode($app->request->getBody());
	var_dump ($r);
	$nombre       = $r->nombre;
	$codigo       = $r->codigo;
    $response = array();
	//
	//
    $db = new DbHandler();
	$id = $db->get1Record("select fn_ins_cat_ambito( '$nombre', '$codigo' ) as id");

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

// Opcion para obtener la totalidad de registros de la tabla cat_ambito
$app->get('/ambitoSel','sessionAlive', function() use ($app){

    $response = array();
	//
    $db = new DbHandler();
    $datos = $db->getAllRecord("call sp_sel_cat_ambito( )");
    //var_dump($datos);
    if ($datos != NULL) {
			$response = $datos;
    }else{
        $response['status'] = "info";
        $response['message'] = 'No hay sectores';
    }

    echoResponse(200, $response);
});

// Opción para actualizar un registro de la tabla cat_ambito

// Opción para eliminar un registro de la tabla cat_ambito
$app->get('/ambitoD/:id','sessionAlive',function($id) use ($app){

	// Recupera los datos de la forma
	//
	
    $response = array();
	//
	//
    $db = new DbHandler();
    $resId = $db->deleteRecord("call sp_del_cat_ambito(?)", $id);
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
