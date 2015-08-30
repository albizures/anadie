<?php
/**
 * Autor: Luis Albizures
 * fecha: 30/08/2015
 * Hora: 11:50 AM
 *
 * municipios.php
 
 * server CRUD para la tabla de cat_municipio de municipios geograficos de la ANADIE.
 
 * Entidades de DB que se utilizan:
 *
   cat_municipio
   
   sp_sel_cat_municipio()

   
 **/

// Opción para ingresar un registro a la tabla cat_municipio

// Opcion para obtener la totalidad de registros de la tabla cat_municipio
$app->get('/municipioSel','sessionAlive', function() use ($app){

    $r = json_decode($app->request->getBody());

    $response = array();
	//
    $db = new DbHandler();
    $datos = $db->getAllRecord("call sp_sel_cat_municipio( $r->idDeptoGeo )");
    //var_dump($datos);
    if ($datos != NULL) {
			$response = $datos;
    }else{
        $response['status'] = "info";
        $response['message'] = 'No hay datos';
    }

    echoResponse(200, $response);
});

// Opción para actualizar un registro de la tabla cat_municipio

// Opción para eliminar un registro de la tabla cat_municipio

?>
