<?php
/**
 * Autor: Luis Albizures
 * fecha: 07/12/2015
 * Hora: 01:30
 *
 * bases.php
 
 * server CRUD para la tabla de sip_base de Bases de licitación de la ANADIE y servicios adicionales asociados a estas.
 
 * Entidades de DB que se utilizan:
 *
   sip_base
   sip_base_ice
   sip_base_doc_aprob

   fn_ins_sip_base_ice
   sp_sel_sip_base
   sp_sel_sip_base_id
   
   -- Ingresa una base
   $app->post('/baseIn'   
		fn_ins_sip_base( ?, ?, ?, ? )
		
	-- Selecciona las bases existentes
   $app->get('/baseSel'		
		sp_sel_sip_base()
		
	-- Selecciona una base especifica
   $app->get('/baseSelID/:id'		
		sp_sel_sip_base_id( ? )
		   
**/

// Ingresa una base
$app->post('/baseIn','sessionAlive',function() use ($app){

	// Recupera los datos de la forma
	//
    $r = json_decode($app->request->getBody());
	//var_dump($r);
	$tipo_base       = ($r->base->tipo_base == 'P') ? 1 : 0;
	$ices            = $r->base->ices;         // Debe ser un arreglo con una lista de IDs corta de ice (instituciones contratantes del estado)
	$idProyecto      = $r->base->idProyecto;
	$fecha_aprob_ice      = $r->evento->fecha_aprob_ice;
	$fecha_aprob_anadie   = $r->evento->fecha_aprob_anadie;
	$fecha_aprob_conadie  = $r->evento->fecha_aprob_conadie;
	$num_folios           = $r->base->num_folios;
	$num_anexos           = $r->base->num_anexos;
	$idDoc                = $r->base->idDoc;
	$nog                  = isset($r->base->nog) ? $r->base->nog : "";

    $response = array();
	//
	//
    $db = new DbHandler();
	$id = $db->get1Record("select fn_ins_sip_base( '$tipo_base', '$idProyecto', '$fecha_aprob_ice', '$fecha_aprob_anadie', '$fecha_aprob_conadie', '$idDoc', '$num_folios', '$num_anexos', '$nog' ) as id")['id'];

    if ($id != NULL) {
		
		// ingresa cada uno de las ICEs que vienen en la lista $ices
		foreach ($ices as $ice) {
			//var_dump("ICE: ",$ice);
			$id2 = $db->get1Record("select fn_ins_sip_base_ice( $id, $ice ) as id");
		}
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
$app->get('/baseSel','sessionAlive', function() use ($app){

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
$app->get('/baseSelID/:id','sessionAlive', function($id) use ($app){

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