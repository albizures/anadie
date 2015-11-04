<?php
/**
 * Autor: Luis Albizures
 * fecha: 24/10/2015
 * Hora: 04:40 AM
 *
 * tipoPrecalificados.php
 
 * server CRUD para la tabla de sip_tipo_precalificado de la ANADIE.
 
 * Entidades de DB que se utilizan:
 *
   sip_tipo_precalificado
   
   sp_sel_sip_tipo_precalificado()
   
   fn_ins_sip_tipo_precalificado( ? )
   
   sp_del_sip_tipo_precalificado( ? )
   
 **/

// Opción para ingresar un registro a la tabla sip_tipo_precalificado

$app->post('/tpIn','sessionAlive',function() use ($app){

	// Recupera los datos de la forma
	//
    $r = json_decode($app->request->getBody());
	$precalificado       = $r->nombre;
    $response = array();
	//
	//
    $db = new DbHandler();
	$id = $db->get1Record("select fn_sip_tipo_precalificado( '$precalificado' ) as id");

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

// Opcion para obtener la totalidad de registros de la tabla sip_tipo_precalificado

$app->get('/tpSel','sessionAlive', function() use ($app){

    $response = array();
	//
    $db = new DbHandler();
    $datos = $db->getAllRecord("call sp_sel_sip_tipo_precalificado( )");
    //var_dump($datos);
    if ($datos != NULL) {
			$response = $datos;
    }else{
        $response['status'] = "info";
        $response['message'] = 'No hay sectores';
    }

    echoResponse(200, $response);
});

// Opción para actualizar un registro de la tabla sip_tipo_precalificado

// Opción para eliminar un registro de la tabla sip_tipo_precalificado
$app->get('/tpD/:id','sessionAlive',function($id) use ($app){

	// Recupera los datos de la forma
	//
	
    $response = array();
	//
	//
    $db = new DbHandler();
    $resId = $db->deleteRecord("call sp_del_sip_tipo_precalificado(?)", $id);
    if ($resId == 0) {
		$response['status'] = "success";
		$response['message'] = 'Datos eliminados';
	}else{
		if ($resId < 0) {
				$response['status'] = "error " . $resId;
				$response['message'] = 'No pudo eliminar los Datos';
			}
	}
	
    echoResponse(200, $response);
});

?>
