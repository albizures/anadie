<?php
/**
 * Autor: Luis Albizures
 * fecha: 22/08/2015
 * Hora: 3:00 AM
 *
 * proyectos.php
 
 * server CRUD para la tabla de sip_proyecto de Proyectos de la ANADIE.
 
 * Entidades de DB que se utilizan:
 *
   sip_proyecto
   
   fn_ins_sip_proyecto( ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,? ) -->>> 22 parametros
   sp_sel_sip_proyecto()

   
 **/

// Opción para ingresar un registro a la tabla sip_proyecto
$app->post('/proyectoIn','sessionAlive',function() use ($app){

	// Recupera los datos de la forma
	//
    $r = json_decode($app->request->getBody());
	
	$idsector      = $r->proyecto->id_sector;
	$prestaciones  = $r->proyecto->prestaciones;
	$nombre        = $r->proyecto->nombre;
	$idice         = $r->proyecto->id_ice;
	$objetivo      = $r->proyecto->objetivo;
	$idpais        = $r->proyecto->id_pais;
	$iddepto       = $r->proyecto->id_depto;
	$idmunic       = $r->proyecto->id_munic;
	$montopreaprox = $r->proyecto->monto_pre_aprox;
	$fechapresentp = $r->proyecto->fecha_present_p;
	
	$dictamentecref= $r->proyecto->dictamen_tec_ref;
	$dictamentecfec= $r->proyecto->dictamen_tec_fec;
	$dictamentecdoc= "";//$r->proyecto->dictamen_tec_doc;
	
	$dictamenlegref= $r->proyecto->dictamen_leg_ref;
	$dictamenlegfec= $r->proyecto->dictamen_leg_fec;
	$dictamenlegdoc= "";//$r->proyecto->dictamen_leg_doc;
	
	$resdirejeref  = $r->proyecto->res_dir_eje_ref;
	$resdirejefec  = $r->proyecto->res_dir_eje_fec;
	$resdirejedoc  = "";//$r->proyecto->res_dir_eje_doc;
	
	$resconadieref  = $r->proyecto->res_conadie_ref;
	$resconadiefec  = $r->proyecto->res_conadie_fec;
	$resconadiedoc  = "";//$r->proyecto->res_conadie_doc;
	var_dump($r->proyecto);
	//					   dictamen_tec_doc, dictamen_leg_ref, dictamen_leg_fec, dictamen_leg_doc, res_dir_eje_ref , res_dir_eje_fec , 
	//					   res_dir_eje_doc ,res_conadie_ref , res_conadie_fec , res_conadie_doc
    $response = array();
	//
	//
    $db = new DbHandler();
	$id = $db->get1Record("select fn_ins_sip_proyecto( '$idsector', '$prestaciones', '$nombre',       '$idice',        '$objetivo',      '$idpais',
                                                       '$iddepto' , '$idmunic',      '$montopreaprox','$fechapresentp','$dictamentecref','$dictamentecfec',
                                                       '$dictamentecdoc', '$dictamenlegref','$dictamenlegfec','$dictamenlegdoc','$resdirejeref','$resdirejefec',
                                                       '$resdirejedoc'  , '$resconadieref' ,'$resconadiefec' ,'$resconadiedoc'
													   ) as id");

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

// Opcion para obtener la totalidad de registros de la tabla sip_proyecto
$app->get('/proyectoSel','sessionAlive', function() use ($app){

    $response = array();
	//
    $db = new DbHandler();
    $datos = $db->getAllRecord("call sp_sel_sip_proyecto( )");
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

// Opción para actualizar un registro de la tabla sip_proyecto

// Opción para eliminar un registro de la tabla proyecto

?>
