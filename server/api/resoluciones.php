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
   sp_sel_sip_resolucionID
   
   Tablas relacionadas:
		sip_proyecto
		cat_documento
		sip_organo
		sip_tema
   
   -- Ingresa una resolucion
   $app->post('/resIn'   
		fn_ins_sip_resolucion( ?, ?, ?, ?, ?, ?, ? )
		
	-- Selecciona las resoluciones existentes
   $app->get('/resSel'		
		sp_sel_sip_resolucion()
		
	-- Selecciona una resolucion especifica
   $app->get('/resSelID/:id'		
		sp_sel_sip_resolucion_id( ? )
		   
**/

// Ingresa una resolucion
// fn_ins_sip_resolucion( pid_proyecto int, pid_doc int, pid_organo int, pfecha date, pnum_registro varchar(20), pid_tema int, psinopsis varchar(200) )

$app->post('/resIn','sessionAlive',function() use ($app){

	// Recupera los datos de la forma
	//
    $r = json_decode($app->request->getBody());
	
	$idProyecto      = $r->res->idProyecto;
	$idDoc           = $r->res->idDoc;
	$idOrgano        = $r->res->idOrgano;
	$fecha           = $r->res->fecha;
	$num_registro    = $r->res->num_registro;
	$idTema          = $r->res->idTema;
	$sinopsis        = $r->res->sinopsis;

    $response = array();
	//
    // Ej. select fn_ins_sip_resolucion( 1, 1, 1, '2015-12-01', '12-22', 1, 'Este es un ejemplo de ingreso manual de una resolucion' );
	//
    $db = new DbHandler();
	$id = $db->get1Record("select fn_ins_sip_resolucion( '$idProyecto', '$idDoc', '$idOrgano', '$fecha', '$num_registro', '$idTema', '$sinopsis' ) as id");

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

// Opcion para obtener la totalidad de registros de la tabla sip_resolucion
$app->get('/resSel','sessionAlive', function() use ($app){

    $response = array();
	//
    $db = new DbHandler();
    $datos = $db->getAllRecord("call sp_sel_sip_resolucion( )");
    //var_dump($datos);
    if ($datos != NULL) {
			$response = $datos;
    }else{
        $response['status'] = "info";
        $response['message'] = 'No hay datos';
    }

    echoResponse(200, $response);
});

// Selecciona una resolucion especifica
$app->get('/resSelID/:id','sessionAlive', function($id) use ($app){

    $r = json_decode($app->request->getBody());
	$idRes = $id;

    $response = array();
	//
    $db = new DbHandler();
    $datos = $db->getAllRecord("call sp_sel_sip_resolucionID( '$idRes' )");
    //var_dump($datos);
    if ($datos != NULL) {
		$response = $datos;
    }else{
        $response['status'] = "info";
        $response['message'] = 'No hay datos';
    }

    echoResponse(200, $response);
});

?>