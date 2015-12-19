<?php
/**
 * Autor: Luis Albizures
 * fecha: 19/12/2015
 * Hora: 03:40 AM
 *
 * temas.php
 
 * server CRUD para la tabla sip_tema de la ANADIE. Contiene temas que se asocian a resoluciones.
 
 * Entidades de DB que se utilizan:
 *
   sip_tema
   
   fn_ins_sip_tema( tema )

   sp_sel_sip_tema()
      
   sp_del_sip_tema( ? )
   
   
 **/

// Opción para ingresar un registro a la tabla sip_tema
$app->post('/temaIn','sessionAlive',function() use ($app){

	// Recupera los datos de la forma
	//
    $r = json_decode($app->request->getBody());
	//var_dump ($r);
	$nombre       = $r->tema;
    $response = array();
	//
	//
    $db = new DbHandler();
	$id = $db->get1Record("select fn_ins_sip_tema( '$nombre' ) as id");

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

// Opcion para obtener la totalidad de registros de la tabla sip_tema
$app->get('/temaSel','sessionAlive', function() use ($app){

    $response = array();
	//
    $db = new DbHandler();
    $datos = $db->getAllRecord("call sp_sel_sip_tema( )");
    //var_dump($datos);
    if ($datos != NULL) {
			$response = $datos;
    }else{
        $response['status'] = "info";
        $response['message'] = 'No hay información';
    }

    echoResponse(200, $response);
});

// Opción para eliminar un registro de la tabla sip_tema
$app->get('/temaD/:id','sessionAlive',function($id) use ($app){

    $response = array();
	//
	//
    $db = new DbHandler();
    $resId = $db->deleteRecord("call sp_del_sip_tema(?)", $id);
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
