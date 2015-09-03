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

?>
