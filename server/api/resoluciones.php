<?php
/**
 * Autor: Luis Albizures
 * fecha: 11/12/2015
 * Hora: 16:50
 *
 * resoluciones.php
 
 * server CRUD para la tabla de sip_resolucion de Resoluciones de la ANADIE y servicios adicionales asociados a estas.
 
 * Entidades de DB que se utilizan:
 *
   sip_resolucion

   fn_ins_sip_resolucion
   sp_sel_sip_resolucion
   sp_del_sip_resolucion
   
   -- Ingresa una resolucion
   $app->post('/resIn'   
		fn_ins_sip_resolucion( ?, ?, ?, ? )
		
	-- Selecciona las resoluciones existentes
   $app->get('/resSel'		
		sp_sel_sip_resolucion()
		
	-- Selecciona una resolucion especifica
   $app->get('/resSelID/:id'		
		sp_sel_sip_resolucion_id( ? )
		   
**/

// Ingresa una resolucion
$app->post('/resIn','sessionAlive',function() use ($app){

	// Recupera los datos de la forma
	//
    $r = json_decode($app->request->getBody());
	
	$tipo_base       = $r->base->tipo_base;
	$ices            = $r->base->ices;         // Debe ser un arreglo con una lista de IDs corta de ice (instituciones contratantes del estado)
	$idProyecto      = $r->base->idProyecto;
	$fecha_aprob_ice      = $r->evento->fecha_aprob_ice;
	$fecha_aprob_anadie   = $r->evento->fecha_aprob_anadie;
	$fecha_aprob_conadie  = $r->evento->fecha_aprob_conadie;
	$num_folios           = $r->base->num_folios;
	$num_anexos           = $r->base->num_anexos;
	$nog                  = isset($r->base->nog) ? $r->base->nog : "";

    $response = array();
	//
	//
    $db = new DbHandler();
	$id = $db->get1Record("select fn_ins_sip_base( '$tipo_base', '$idProyecto', '$fecha_aprob_ice', '$fecha_aprob_anadie', '$fecha_aprob_conadie', '$num_folios', '$num_anexos', '$nog' ) as id");

    if ($id != NULL) {
		
		// ingresa cada uno de las ICEs que vienen en la lista $ices
        $response['status'] = "success";
        $response['message'] = 'Se agrego correctamente';
		$response['data'] = $id;
			
    }else{
        $response['status'] = "info";
        $response['message'] = 'No fue posible agregar los datos';
    }
	
    echoResponse(200, $response);
});

// Opcion para obtener la totalidad de registros de la tabla sip_base
$app->get('/resSel','sessionAlive', function() use ($app){

    $response = array();
	//
    $db = new DbHandler();
    $datos = $db->getAllRecord("call sp_sel_sip_base( )");
    //var_dump($datos);
    if ($datos != NULL) {
			$response = $datos;
    }else{
        $response['status'] = "info";
        $response['message'] = 'No hay datos';
    }

    echoResponse(200, $response);
});

// Selecciona una base especifica
$app->get('/resSelID/:id','sessionAlive', function($id) use ($app){

    $r = json_decode($app->request->getBody());
	$idBase = $id;//$r->idBase;

    $response = array();
	//
    $db = new DbHandler();
    $datos = $db->getAllRecord("call sp_sel_sip_base_id( '$idBase' )");
    //var_dump($datos);
    if ($datos != NULL) {
		
		// Debe traer la lista de ICEs en un arreglo asociado a los datos de la base
			$response = $datos;
    }else{
        $response['status'] = "info";
        $response['message'] = 'No hay datos';
    }

    echoResponse(200, $response);
});

?>