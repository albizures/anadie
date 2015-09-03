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

?>
