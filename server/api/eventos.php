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
CREATE DEFINER=`root`@`localhost` PROCEDURE `fn_ins_pyr_evento`( IN pnombre varchar(200), IN pdescripcion varchar(500), IN pfecha_inicio date,
                                                                 IN pfecha_final date ) RETURN INT
begin
insert into pyr_evento ( nombre, descripcion, fecha_inicio, fecha_final, estado )
   values ( pnombre, pdescripcion, pfecha_inicio, pfecha_final, 1 );
select last_insert_id();
end$$

$app->post('/eventoIn','sessionAlive',function() use ($app){

	// Recupera los datos de la forma
	//
    $r = json_decode($app->request->getBody());
	
	$nombre       = $r->evento->nombre;
	$descripcion  = $r->evento->descripcion;
	$fecha_inicio = $r->evento->fecha_inicio;
	$fecha_final  = $r->evento->fecha_final;

	$fechapresentp = $r->proyecto->fecha_present_p;
	
	var_dump($r->evento);
    $response = array();
	//
	//
    $db = new DbHandler();
	$id = $db->get1Record("select fn_ins_pyr_proyecto( '$nombre', '$descripcion', '$fecha_inicio', '$fecha_final' ) as id");

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
