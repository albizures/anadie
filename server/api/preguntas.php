<?php
/**
 * Autor: Luis Albizures
 * fecha: 14/10/2015
 * Hora: 11:50
 *
 * preguntas.php
 
 * server CRUD para la tabla de pyr_pregunta, en Eventos de licitación de la ANADIE y servicios adicionales asociados a la pregunta y su posicionamiento.
 
 * Entidades de DB que se utilizan:
 *
   pyr_pregunta
   pyr_objeto
   
   -- Inserta una pregunta, la primera de un objeto específico.
   $app->post('/preguntaPrimeraIn'   
		fn_ins_pyr_pregunta0( ?, ?, ?, ?, ?, ? )
		pidClave , pidtipo , pidevento , piddocdet int, pidusuario , ppregunta 
									   
   -- Inserta una pregunta, la primera de un objeto específico.
   $app->post('/preguntaAdicionalIn'   
		fn_ins_pyr_pregunta1( ?, ?, ?, ?, ? )
		pidClave , pidevento , piddocdet , pidusuario , ppregunta

	-- Selecciona todas las preguntas de un documento
   $app->get('/preguntaSel'		
		sp_sel_pyr_pregunta( ? , ? )
		pidevento , IN piddocdet
		 
	-- Selecciona todas las preguntas de un objeto específico 
   $app->post('/preguntaSelOBJ'
	    sp_sel_pyr_pregunta_OBJ( ? , ? )
		piddocdet ,  pidClave
		
 **/

// -- Inserta una pregunta, la primera de un objeto específico. 
$app->post('/preguntaPrimeraIn','sessionAlive',function() use ($app){

	// Recupera los datos de la forma
	//
    $r = json_decode($app->request->getBody());
	
	$clave         = $r->pregunta->clave;         // Clave que se le asignó al objeto.
	$idTipo        = $r->pregunta->tipo;          // Tipo de objeto, pudiedo ser P=Parrafo y IMG=image
	$idEvento      = $r->pregunta->idEvento;      // Id del evento
	$idDoc         = $r->pregunta->idDoc;         // Id del documento
	$idUser        = $_SESSION['uid'];//$r->pregunta->idUser;        // Id del usuario que crea la pregunta
	$pregunta      = $r->pregunta->pregunta;      // Texto o contenido de la pregunta
	
    $response = array();
	//
	//
    $db = new DbHandler();
	$id = $db->get1Record("select fn_ins_pyr_pregunta0( '$clave', '$idTipo', $idEvento, $idDoc, $idUser, '$pregunta' ) as id");

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

//    -- Inserta una pregunta, la primera de un objeto específico.
$app->post('/preguntaAdicionalIn','sessionAlive',function() use ($app){

	// Recupera los datos de la forma
	//
    $r = json_decode($app->request->getBody());
	
	$clave         = $r->pregunta->clave;         // Clave que se le asignó al objeto.
	$idEvento      = $r->pregunta->idEvento;      // Id del evento
	$idDoc         = $r->pregunta->idDoc;         // Id del documento
	$idUser        = $_SESSION['uid'];//$r->pregunta->idUser;        // Id del usuario que crea la pregunta
	$pregunta      = $r->pregunta->pregunta;      // Texto o contenido de la pregunta
	
    $response = array();
	//
	//
    $db = new DbHandler();
	$id = $db->get1Record("select fn_ins_pyr_pregunta1( '$clave', $idEvento, $idDoc, $idUser, '$pregunta' ) as id");

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

// Opcion para obtener la totalidad de preguntas del documento de un evento, de la tabla pyr_pregunta
$app->get('/preguntaSel','sessionAlive', function() use ($app){

    $r = json_decode($app->request->getBody());

	$idEvento      = $r->idEvento;      // Id del evento
	$idDoc         = $r->idDoc;         // Id del documento

    $response = array();
	//
    $db = new DbHandler();
	
    $datos = $db->getAllRecord("call sp_sel_pyr_pregunta('$idEvento','$idDoc' )");
    //var_dump($datos);
    if ($datos != NULL) {
			$response = $datos;
    }else{
        $response['status'] = "info";
        $response['message'] = 'No hay datos';
    }

    echoResponse(200, $response);
});

// Opcion para obtener la totalidad de preguntas de un objeto específico.
$app->get('/preguntaSelOBJ/:idDoc/:idClave','sessionAlive', function($idDoc,$idClave) use ($app){

//    $r = json_decode($app->request->getBody());
//	$idDoc   = $r->idDoc;
//	$idClave = $r->idClave;

    $response = array();
	//
    $db = new DbHandler();
    $datos = $db->getAllRecord("call sp_sel_pyr_pregunta_OBJ( '$idDoc', '$idClave' )");
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
