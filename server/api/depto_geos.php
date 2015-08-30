<?php
/**
 * Autor: Luis Albizures
 * fecha: 30/08/2015
 * Hora: 11:50 AM
 *
 * deptogeos.php
 
 * server CRUD para la tabla de cat_depto_geo de departamentos geograficos de la ANADIE.
 
 * Entidades de DB que se utilizan:
 *
   cat_depto_geo
   
   sp_sel_cat_depto_geo()

   
 **/

// Opción para ingresar un registro a la tabla cat_depto_geo

// Opcion para obtener la totalidad de registros de la tabla cat_depto_geo
$app->get('/deptogeoSel','sessionAlive', function() use ($app){

    $r = json_decode($app->request->getBody());

    $response = array();
	//
    $db = new DbHandler();
    $datos = $db->getAllRecord("call sp_sel_cat_depto_geo( $r->idPais )");
    //var_dump($datos);
    if ($datos != NULL) {
			$response = $datos;
    }else{
        $response['status'] = "info";
        $response['message'] = 'No hay datos';
    }

    echoResponse(200, $response);
});

// Opción para actualizar un registro de la tabla cat_depto_geo

// Opción para eliminar un registro de la tabla cat_depto_geo

?>
