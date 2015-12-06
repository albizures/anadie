<?php
/**
 * Autor: Luis Albizures
 * fecha: 04/12/2015
 * Hora: 02:10 AM
 *
 * documentos.php
 
 * server CRUD para la tabla de cat_documento de la ANADIE. Contiene nombres de todos los tipos de documentos que se utilicen para registrar.
 
 * Entidades de DB que se utilizan:
 *
   cat_documento
   
   fn_ins_cat_documento()

   sp_sel_cat_documento()
      
   sp_del_cat_documento()

   
 **/

// Opción para ingresar un registro a la tabla cat_documento
$app->post('/docIn','sessionAlive',function() use ($app){

	// Recupera los datos de la forma
	//
    $r = json_decode($app->request->getBody());
	//var_dump ($r);
	$nombre       = $r->nombre;
    $response = array();
	//
	//
    $db = new DbHandler();
	$id = $db->get1Record("select fn_ins_cat_documento( '$nombre' ) as id");

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

// Opcion para obtener la totalidad de registros de la tabla cat_documento
$app->get('/docSel','sessionAlive', function() use ($app){

    $response = array();
	//
    $db = new DbHandler();
    $datos = $db->getAllRecord("call sp_sel_cat_documento( )");
    //var_dump($datos);
    if ($datos != NULL) {
			$response = $datos;
    }else{
        $response['status'] = "info";
        $response['message'] = 'No hay documentos';
    }

    echoResponse(200, $response);
});

// Opción para eliminar un registro de la tabla cat_documento
$app->get('/docD/:id','sessionAlive',function($id) use ($app){

    $response = array();
	//
	//
    $db = new DbHandler();
    $resId = $db->deleteRecord("call sp_del_cat_documento(?)", $id);
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
