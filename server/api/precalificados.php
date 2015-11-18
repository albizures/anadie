<?php
/**
 * Autor: Luis Albizures
 * fecha: 04/11/2015
 * Hora: 09:18
 *
 * precalificados.php
 
 * server CRUD para la tabla de sip_precalificados.
 
 * Entidades de DB que se utilizan:
 *
   sip_precalificados
   
   -- Inserta un precalificado.
   $app->post('/precalificadosIn'   
		fn_ins_sip_precalificados( ?, ?, ?, ?, ?, ? )
									   
	-- Selecciona todos los datos de un precalificado específico buscado por ID
   $app->get('/precalificadosSelBYid/:id'		
		sp_sel_sip_precalificadosBYid( ? )
		 
	-- Selecciona todos los registros de precalificados
   $app->post('/precalificadosSel'
	    sp_sel_sip_precalificados( )
		
 **/

// -- Inserta un precalificado.
$app->post('/precalificadosIn','sessionAlive',function() use ($app){

	// Recupera los datos de la forma
	//
    $r = json_decode($app->request->getBody());
	
	$id_tipo_pre   = $r->prec->id_tipo_pre;
	$lugar         = $r->prec->lugar; 
	$fecha         = $r->prec->fecha; 
	$tipo_persona  = $r->prec->tipo_persona; 
	$nombre        = $r->prec->nombre; 
	$DPI           = $r->prec->DPI; 
	$pasaporte     = $r->prec->pasaporte; 
	$nit           = $r->prec->nit; 
	$id_pais_nac   = $r->prec->id_pais_nac;
    $razon_social  = $r->prec->razon_social; 
	$ofis_principal = $r->prec->ofis_principal; 
	$Domicilio      = $r->prec->Domicilio; 
	$dir_recibe_notificacion = $r->prec->dir_recibe_notificacion; 
	$Telefono       = $r->prec->Telefono; 
	$rep_legal      = $r->prec->rep_legal;
//	$id_especialidad = $r->prec->id_especialidad;
	$perj_nombre    = $r->prec->perj_nombre; 
	$perj_razon_social = $r->prec->perj_razon_social; 
	$perj_ofis_principal = $r->prec->perj_ofis_principal; 
	$perj_Domicilio = $r->prec->perj_Domicilio;
	$perj_dir_recibe_notificacion = $r->prec->perj_dir_recibe_notificacion; 
	$perj_Telefono  = $r->prec->perj_Telefono; 
	$perj_rep_legal = $r->prec->perj_rep_legal; 
	$perj_DPI       = $r->prec->perj_DPI; 
//	$fecha_crea = $r->prec-> ;
	$id_usuario_crea = $_SESSION['uid'];
								   
    $response = array();
	//
	//
    $db = new DbHandler();
	$id = $db->get1Record("select fn_ins_sip_precalificados( '$id_tipo_pre', '$lugar', '$fecha', '$tipo_persona', 
                                            '$nombre', '$DPI', '$pasaporte', '$nit', '$id_pais_nac',
											'$razon_social', '$ofis_principal', '$Domicilio',
											'$dir_recibe_notificacion', '$Telefono', '$rep_legal',
											'$perj_nombre', '$perj_razon_social', '$perj_ofis_principal', 
											'$perj_Domicilio', '$perj_dir_recibe_notificacion',
											'$perj_Telefono', '$perj_rep_legal', '$perj_DPI', 
											'$id_usuario_crea' ) as id")['id'];
	
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


// -- Selecciona todos los datos de un precalificado específico buscado por ID

$app->get('/precalificadosSelBYid/:id','sessionAlive', function($id) use ($app){

    $response = array();
	//
    $db = new DbHandler();
	
    $datos = $db->getAllRecord("call sp_sel_sip_precalificadosBYid('$id' )");
    //var_dump($datos);
    if ($datos != NULL) {
			$response = $datos;
    }else{
        $response['status'] = "info";
        $response['message'] = 'No hay datos';
    }

    echoResponse(200, $response);
});

// -- Selecciona todos los registros de precalificados
$app->get('/precalificadosSel','sessionAlive', function() use ($app){

    $db = new DbHandler();
	
    $datos = $db->getAllRecord("call sp_sel_sip_precalificados( )");
	if ($datos[0]['tipo_persona'] == '0') { $datos[0]['tipo_persona'] = 'Persona'; }
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