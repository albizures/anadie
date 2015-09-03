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

   
 **/

// Opción para ingresar un registro a la tabla cat_sector

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

?>
