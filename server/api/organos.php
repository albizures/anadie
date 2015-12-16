<?php
/**
 * Autor: Luis Albizures
 * fecha: 11/12/2015
 * Hora: 16:55 AM
 *
 * organos.php
 
 * server CRUD para la tabla sip_organo de la ANADIE. Contiene nombres de los organos que autorizan o emiten resoluciones.
 
 * Entidades de DB que se utilizan:
 *
   sip_organo
   
   fn_ins_sip_organo( nombre )

   sp_sel_sip_organo()
      
   sp_del_sip_organo( ? )
   
   
 **/

// Opción para ingresar un registro a la tabla sip_organo
$app->post('/organoIn','sessionAlive',function() use ($app){

	// Recupera los datos de la forma
	//
    $r = json_decode($app->request->getBody());
	//var_dump ($r);
	$nombre       = $r->nombre;
    $response = array();
	//
	//
    $db = new DbHandler();
	$id = $db->get1Record("select fn_ins_sip_organo( '$nombre' ) as id");

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

// Opcion para obtener la totalidad de registros de la tabla sip_organo
$app->get('/organoSel','sessionAlive', function() use ($app){

    $response = array();
	//
    $db = new DbHandler();
    $datos = $db->getAllRecord("call sp_sel_sip_organo( )");
    //var_dump($datos);
    if ($datos != NULL) {
			$response = $datos;
    }else{
        $response['status'] = "info";
        $response['message'] = 'No hay información';
    }

    echoResponse(200, $response);
});

// Opción para eliminar un registro de la tabla sip_organo
$app->get('/organoD/:id','sessionAlive',function($id) use ($app){

    $response = array();
	//
	//
    $db = new DbHandler();
    $resId = $db->deleteRecord("call sp_del_sip_organo(?)", $id);
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
