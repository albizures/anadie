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
   
 **/

// Opcion para obtener la totalidad de registros de la tabla opcion 
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

?>
