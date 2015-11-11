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
									   
   -- Inserta una pregunta, adicional a la primekra de un objeto específico.
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
	$idUser        = $_SESSION['uid'];            //$r->pregunta->idUser;        // Id del usuario que crea la pregunta
	$pregunta      = $r->pregunta->pregunta;      // Texto o contenido de la pregunta
	
	$ambitos       = $r->pregunta->ambitos;                 // Un arreglo que contiene los ambitos (idAmbito)
	
    $response = array();
	//
	//
    $db = new DbHandler();
	$id = $db->get1Record("select fn_ins_pyr_pregunta0( '$clave', '$idTipo', $idEvento, $idDoc, $idUser, '$pregunta' ) as id")['id'];
	
	$error = "no";
    if ($id != NULL) {
        //
        // Insertará $id pregunta en pyr_pregunta_ambito, insert into pyr_pregunta_ambito (id_pregunta, id_ambito ) values ($id, $ambitos[0] );
        //
        foreach ($ambitos as $idAmbito) {
            //var_dump($ambitos);
            //var_dump($id);
            //var_dump($ambitos);
            $id2 = $db->get1Record("select fn_ins_pyr_pregunta_ambito( '$id', '$idAmbito' ) as id");
            if ($id2 == NULL) {
                $error = "si";
                break;
            }
        }
    }
	else { $error = "si"; }		

	
	if ($error == "no") {
			$response['status'] = "success";
			$response['message'] = 'Se agrego correctamente';
			$response['data'] = $id;
	}
	else{
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

//    -- Opcion para ingresar comentarios relacionados con la respuesta 
$app->post('/coments','sessionAlive',function() use ($app){

	// Recupera los datos de la forma
	//
    $r = json_decode($app->request->getBody());
	
	$idPregunta    = $r->idPregunta;
	$idConsultor   = intval($_SESSION['uid']);//$r->pregunta->idConsultor;
	$idAmbito      = $r->idAmbito;
	$comentario    = $r->comentario;
	
    $response = array();
	//
	//
    $db = new DbHandler();
	$id = $db->get1Record("select fn_ins_pyr_coment( '$idPregunta', '$idConsultor', '$idAmbito', '$comentario' ) as id")['id'];
	
    if ($id != NULL) {
			$response['status'] = "success";
			$response['message'] = 'Se agrego correctamente';
			$response['data'] = $id;
	}
	else{
        $response['status'] = "info";
        $response['message'] = 'No fue posible agregar los datos';
    }
	
    echoResponse(200, $response);
});

//    -- Opcion para obtener todos los comentarios relacionados con un ambito, así mismo trae cual de los Consultores que comentan es el secretario y los
//            datos generales de la pregunta a la cual se están refierendo.
//            llama al  sp_sel_comentario_ambito y pasa los parametros de pidPregunta, pidConsultor y pidAmbito
$app->get('/comentariosAmbito/:idPregunta/:idAmbito','sessionAlive',function($idPregunta,$idAmbito) use ($app) {
    $r = json_decode($app->request->getBody());

	//$idPregunta    = $r->idPregunta;
    $idConsultor   =  intval($_SESSION['uid']);
	//$idAmbito      = $r->idAmbito;

    $response = array();
	//
    $db = new DbHandler();

    $datos = $db->getAllRecord("call sp_sel_comentario_ambito('$idPregunta','$idConsultor', $idAmbito )");
    //var_dump($datos);
    if ($datos != NULL) {
			$response = $datos;
    }else{
        $response['status'] = "info";
        $response['message'] = 'No hay datos';
    }

    echoResponse(200, $response);
	
});


// Opcion para obtener la totalidad de las preguntas, de todos los documentos de un evento.
$app->get('/preguntaSelEvento/:id','sessionAlive', function($idEvento) use ($app){

    //$r = json_decode($app->request->getBody());

	//$idEvento      = $r->idEvento;      // Id del evento

    $response = array();
	//
    $db = new DbHandler();
	
    $datos = $db->getAllRecord("call sp_sel_pyr_pregunta_evento('$idEvento' )");
    //var_dump($datos);
    if ($datos != NULL) {
			$response = $datos;
    }else{
        $response['status'] = "info";
        $response['message'] = 'No hay datos';
    }

    echoResponse(200, $response);
});

// Seleccion de preguntas que pertenecen a un evento y a un ámbito específicos
// sp_sel_pyr_pregunta_eventoAmbito
$app->get('/preguntaSelEventoAmbito/:evento/:ambito','sessionAlive', function($evento,$ambito) use ($app){

    $r = json_decode($app->request->getBody());

	$idEvento      = $evento;//$r->idEvento;      // Id del evento
	$idAmbito      = $ambito;//$r->idAmbito;      // Id del ambito

    $response = array();
	//
    $db = new DbHandler();

// 02/11/2015 -- jose me dice que pida el session_id y dependiendo del usuario verificar si tiene permiso o no a este evento y ambito
    $idConsultor =  intval($_SESSION['uid']);
	
    $datos = $db->getAllRecord("call sp_sel_pyr_pregunta_eventoAmbito('$idEvento','$idAmbito', $idConsultor )");
    //var_dump($datos);
    if ($datos != NULL) {
			$response = $datos;
    }else{
        $response['status'] = "info";
        $response['message'] = 'No hay datos';
    }

    echoResponse(200, $response);
});

// 
// Seleccion de preguntas que pertenecen a un evento y a un ámbito específicos, solo las estado 3 = RESPONDIDAS
// sp_sel_pyr_pregunta_eventoAmbito
$app->get('/preguntaSelEventoAmbitoE3/:evento/:ambito','sessionAlive', function($evento,$ambito) use ($app){

    $r = json_decode($app->request->getBody());

	$idEvento      = $evento;//$r->idEvento;      // Id del evento
	$idAmbito      = $ambito;//$r->idAmbito;      // Id del ambito

    $response = array();
	//
    $db = new DbHandler();

// 02/11/2015 -- jose me dice que pida el session_id y dependiendo del usuario verificar si tiene permiso o no a este evento y ambito
    $idConsultor =  intval($_SESSION['uid']);
	
    $datos = $db->getAllRecord("call sp_sel_pyr_pregunta_eventoAmbitoE3('$idEvento','$idAmbito', $idConsultor )");
    //var_dump($datos);
    if ($datos != NULL) {
			$response = $datos;
    }else{
        $response['status'] = "info";
        $response['message'] = 'No hay datos';
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
//  -- Opcion para responder una pregunta: actualiza respuesta y modifica el estado.
$app->post('/respuesta','sessionAlive',function() use ($app) {
    $r = json_decode($app->request->getBody());

// en $r debe venir id de la pregunta, id del consultor y respuesta
    $r->idConsultor = intval($_SESSION['uid']);
    $response = array();
    //
    //
    //var_dump($r);
    $db = new DbHandler();
    $column_names = array('id','idConsultor','respuesta');
    // $db->insertIntoTable($r->opcion, $column_names, 'seg_usuario' );
    $resId = $db->updateRecord("call sp_upd_pyr_respuesta(?,?,?)", $r, $column_names,'iis');

    if ($resId > 0) {
        $response['status'] = "success";
        $response['message'] = 'Se actualizó correctamente';
        //$response['data'] = $id;

    }else{
        $response['status'] = "info";
        $response['message'] = 'No fue posible actualizar los datos';
    }

    echoResponse(200, $response);
});
$app->get('/selPreguntaAmbito/:idPregunta/:idAmbito','sessionAlive',function($idPregunta,$idAmbito) use ($app) {
    $r = json_decode($app->request->getBody());

    //$idPregunta    = $r->idPregunta;
    $idConsultor   =  intval($_SESSION['uid']);
    //$idAmbito      = $r->idAmbito;

    $response = array();
//
    $db = new DbHandler();

    $datos = $db->getAllRecord("call sp_sel_pregunta_ambito('$idPregunta','$idConsultor', $idAmbito )");
    //var_dump($datos);
    if ($datos != NULL) {
        $response = $datos;
    }else{
        $response['status'] = "info";
        $response['message'] = 'No hay datos';
    }

    echoResponse(200, $response);
});

// Determina si existe secretario en el evento y ambito indicados
$app->get('/canSecretarios/:idEvento/:idAmbito','sessionAlive',function($idEvento,$idAmbito) use ($app) {

    $response = array();

    $db = new DbHandler();
    $datos = $db->getAllRecord("select fn_get_num_secretarios( $idEvento , $idAmbito ) as id");
    if ($datos != NULL) {
			$response = $datos;
    }else{
        $response['status'] = "info";
        $response['message'] = 'No hay datos';
    }

    echoResponse(200, $response);
    
});

?>
