<?php
/**
 * Autor: Luis Albizures
 * fecha: 12/07/2015
 * Hora: 16:00 AM
 
 * server CRUD para la tabla de opciones de menu.
 
 * Entidades de DB que se utilizan:
 *
   seg_rol
   
   sp_sel_seg_roles( )
   fn_ins_seg_rol(
   sp_upd_seg_rol(
   sp_del_seg_rol(
   
 **/

// Opcion para obtener la totalidad de registros de la tabla opcion 
$app->get('/rolDatos','sessionAlive', function() use ($app){

    $response = array();
	//
    $db = new DbHandler();
    $datos = $db->getAllRecord("call sp_sel_roles( )");
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
