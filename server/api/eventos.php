<?php
/**
 * Autor: Luis Albizures
 * fecha: 31/08/2015
 * Hora: 14:50
 *
 * eventos.php
 
 * server CRUD para la tabla de pyr_evento de Eventos de licitación de la ANADIE.
 
 * Entidades de DB que se utilizan:
 *
   pyr_evento
   
   sp_sel_pyr_evento()
   fn_ins_pyr_evento( ?, ?, ?, ? )
   sp_upd_pyr_evento( ?, ?, ?, ?, ?, ? )
   sp_del_pyr_evento( ? )
   
 **/

// Opción para ingresar un registro a la tabla pyr_evento

// Opcion para obtener la totalidad de registros de la tabla pyr_evento
$app->get('/sectorSel','sessionAlive', function() use ($app){

    $response = array();
	//
    $db = new DbHandler();
    $datos = $db->getAllRecord("call sp_sel_pyr_evento( )");
    //var_dump($datos);
    if ($datos != NULL) {
			$response = $datos;
    }else{
        $response['status'] = "info";
        $response['message'] = 'No hay datos';
    }

    echoResponse(200, $response);
});

// Opción para actualizar un registro de la tabla pyr_evento

// Opción para eliminar un registro de la tabla pyr_evento

?>
