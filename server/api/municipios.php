<?php
/**
 * Autor: Luis Albizures
 * fecha: 30/08/2015
 * Hora: 11:50 AM
 *
 * municipios.php
 
 * server CRUD para la tabla de cat_municipio de municipios geograficos de la ANADIE.
 
 * Entidades de DB que se utilizan:
 *
   cat_municipio
   
   sp_sel_cat_municipio()

   
 **/

// Opción para ingresar un registro a la tabla cat_municipio
$app->post('/municipioIn','sessionAlive',function() use ($app){

	// Recupera los datos de la forma
	//
    $r = json_decode($app->request->getBody());
	
	$nombre       = $r->nombre;
	$idDeptogeo       = $r->idDeptogeo;
    $response = array();
	//
	//
    $db = new DbHandler();
	$id = $db->get1Record("select fn_ins_cat_municipio( '$idDeptogeo','$nombre' ) as id");

    if ($id != NULL) {
        $response['status'] = "success";
        $response['message'] = 'Se agrego correctamente';
		$response['data'] = $id['id'];;
			
    }else{
        $response['status'] = "info";
        $response['message'] = 'No fue posible agregar los datos';
    }
	
    echoResponse(200, $response);
});

// Opcion para obtener la totalidad de registros de la tabla cat_municipio
$app->get('/municipioSel/:id','sessionAlive', function($id) use ($app){

    //$r = json_decode($app->request->getBody());

    $response = array();
	//
    $db = new DbHandler();
    $datos = $db->getAllRecord("call sp_sel_cat_municipio( $id )");
    //var_dump($datos);
    if ($datos != NULL) {
		$response['data'] = $datos;
        $response['status'] = "success";
        $response['message'] = '';
    }else{
        $response['status'] = "info";
        $response['message'] = 'No hay municipios';
    }

    echoResponse(200, $response);
});

// Opción para actualizar un registro de la tabla cat_municipio

// Opción para eliminar un registro de la tabla cat_municipio
$app->get('/municipioD/:id','sessionAlive',function($id) use ($app){

	// Recupera los datos de la forma
	//
	
    $response = array();
	//
	//
    $db = new DbHandler();
    $resId = $db->deleteRecord("call sp_del_cat_municipio(?)", $id);
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
