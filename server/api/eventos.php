<?php
/**
 * Autor: Luis Albizures
 * fecha: 31/08/2015
 * Hora: 14:50
 *
 * eventos.php

 * server CRUD para la tabla de pyr_evento de Eventos de licitación de la ANADIE y servicios adicionales asociados al evento y documentos.

 * Entidades de DB que se utilizan:
 *
   pyr_evento
   pyr_evento_doc_det
   pyr_precalificado_licitacion

   -- Inserta un evento
   $app->post('/eventoIn'
		fn_ins_pyr_evento( ?, ?, ?, ? )

	-- Selecciona un evento
   $app->get('/eventoSel'
		sp_sel_pyr_evento()

   $app->get('/eventoSelPre'
		sp_sel_pyr_evento_pre( ? )

   $app->post('/uploadFileEvento'
	    fn_ins_pyr_evento_doc_det

   $app->get('/eventoFileSel/:id'
		sp_sel_pyr_evento_doc_det

   $app->get('/eventoFileSelHTML/:id'
        sp_sel_pyr_evento_doc_detHTML

    -- Obtiene datos de un documento, basado en el ID del documento.
   $app->get('/eventoFileSelID/:id'
        sp_sel_pyr_evento_doc_detID

   $app->post('/eventoUserIn'
		fn_ins_pyr_precalificado_licitacion

   $app->get('/eventoUserSel/:id
		sp_sel_pyr_precalificado_licitacion

   $app->get('/userEventoSel/:id'
		sp_sel_pyr_licitacion_precalificados

   $app->get('/userAllEventoSel/:id'
		sp_sel_pyr_licitacion_precalificados_ALL

Inserción de consultores a un evento
   fn_ins_pyr_consultor_licitacion
   $app->post('/eventoConsultorI'

Selección de consultores de un evento
   sp_sel_pyr_consultor_licitacion
   $app->get('/eventoConsultorS/:id

Eliminación de un consultor de un evento
   sp_del_pyr_consultor_licitacion
   $app->get('/eventoConsultorD/:id


   sp_upd_pyr_evento( ?, ?, ?, ?, ?, ? )
   sp_del_pyr_evento( ? )

 **/

// Opción para ingresar un registro a la tabla pyr_evento
/*CREATE DEFINER=`root`@`localhost` PROCEDURE `fn_ins_pyr_evento`( IN pnombre varchar(200), IN pdescripcion varchar(500), IN pfecha_inicio date,
                                                                 IN pfecha_final date ) RETURN INT
begin
insert into pyr_evento ( nombre, descripcion, fecha_inicio, fecha_final, estado )
   values ( pnombre, pdescripcion, pfecha_inicio, pfecha_final, 1 );
select last_insert_id();
end$$*/

$app->post('/eventoIn','sessionAlive',function() use ($app){

	// Recupera los datos de la forma
	//
    $r = json_decode($app->request->getBody());

	$nombre       = $r->evento->nombre;
	$descripcion  = $r->evento->descripcion;
	$fecha_inicio = $r->evento->fecha_inicio;
	$fecha_final  = $r->evento->fecha_final;

	//$fechapresentp = $r->proyecto->fecha_present_p;

	//var_dump($r->evento);
    $response = array();
	//
	//
    $db = new DbHandler();
	$id = $db->get1Record("select fn_ins_pyr_evento( '$nombre', '$descripcion', '$fecha_inicio', '$fecha_final' ) as id");

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

// Opcion para obtener la totalidad de registros de la tabla pyr_evento
$app->get('/eventoSel','sessionAlive', function() use ($app){

    $response = array();
	//
    $db = new DbHandler();
    $datos = $db->getAllRecord("call sp_sel_pyr_evento( )");
    //var_dump($datos);
    if ($datos != NULL) {
			$response = $datos;
    }else{
        $response['status'] = "info";
        $response['message'] = 'No hay datos';
    }

    echoResponse(200, $response);
});

// Opcion para obtener la totalidad de registros de la tabla pyr_evento a los cuales una persona tiene acceso
$app->get('/eventoSelPre','sessionAlive', function() use ($app){

    $r = json_decode($app->request->getBody());

	$idUsuario       = $_SESSION['uid'];// $r->idUsuario;

    $response = array();
	//
    $db = new DbHandler();
    $datos = $db->getAllRecord("call sp_sel_pyr_evento_pre( '$idUsuario')");
    //var_dump($datos);
    if ($datos != NULL) {
			$response = $datos;
    }else{
        $response['status'] = "info";
        $response['message'] = 'No hay datos';
    }

    echoResponse(200, $response);
});

// Opción para actualizar un registro de la tabla pyr_evento

// Opción para eliminar un registro de la tabla pyr_evento

// Carga de archvios asociados al evento de licitación

$app->post('/uploadFileEvento','sessionAlive',function() use ($app){

class R {

	public $idEvento = 0;
	public $nombre_doc = "";
	public $ubicacion = "";
	public $usuario = 0;

}

	$target_dir = $_SERVER['DOCUMENT_ROOT'] . "/server/uploaded_files/";
    $target_dir_rel = "/server/uploaded_files/";
	$idEvento   = $_POST['idEvento'];
	$nombre_doc = $_POST['nombre_doc'];  // Nombre descriptivo que le pone el usuario
	$tipo_doc   = $_POST['tipo'];       // Espera la extensión pudiendo ser PDF o HTML
	                                    // El nombre del archivo lo realiza concatenando el ID del evento mas el nombre que le dio el usuario sin espacios
										//                y adjuntando la extensión
/*
	$extension = explode(".",$archivo_name);
	if (count($extension) == 2) {
		$base = $extension[0];
		$tipo = $extension[1];
	}


	if (strtoupper($tipo_doc) == "PDF")
		 { $fname      = $idEvento . '_' . str_replace(' ', '',$_POST['nombre_doc']) . ".pdf"; }
	else { $fname      = $idEvento . '_' . str_replace(' ', '',$_POST['nombre_doc']) . ".html";}
*/
	$fname = $_FILES["file"]["name"]; //$nombre_doc;

	$ubicacion  = $target_dir . $fname;
    $ubicacion_rel  = $target_dir_rel . $fname;
	$usuario    = $_SESSION['uid'];//$_POST['id_usuario'];

	$response = array("status" => "", "message" => "", "id" => 0);

	$r = new R;
//	$r = array ( "opcion" => [ "id" => $_POST['id'], "field_name" => $_POST['nombre'], "target_file" => $target_file, ] );
	$r->idEvento    = $idEvento;
	$r->nombre_doc  = $nombre_doc;
	$r->ubicacion   = $ubicacion;
	$r->usuario     = $usuario;
	$extension      = (strtoupper($tipo_doc) == "PDF") ? '.pdf' : '.html';


    if (move_uploaded_file($_FILES["file"]["tmp_name"], $ubicacion)){
		//echo "el archivo vino bien\n";

		$new_ubicacion_rel = $ubicacion;
		$new_fname = $fname;
		if (strtoupper($tipo_doc) == "ZIP")     // Si es un ZIP lo desempaca
		{
			$z = new ZipArchive();
			$z->open($ubicacion);
			$z->extractTo($target_dir);
			$z->close($ubicacion);

		    unlink( $ubicacion );              // Una vez desempacado, elimina el ZIP

												// El nombre del ARCHIVO no es ZIP, debe ser HTML (que es lo que viene adentro del ZIP)
			$vzip = array('.zip','.ZIP');
			$new_ubicacion_rel = str_replace($vzip,'.html',$ubicacion);
			$new_fname = str_replace($vzip,'.html',$fname);
		}

		$db = new DbHandler();
		//$id = $db->get1Record("select fn_ins_pyr_evento_doc_det( '$idEvento', '$nombre_doc','$new_ubicacion_rel' , '$usuario' ) as id");
		$id = $db->get1Record("select fn_ins_pyr_evento_doc_det( '$idEvento', '$nombre_doc','$target_dir_rel' , '$usuario', '$extension' ) as id");
		// Una vez generado el ID del documento en la base de datos, este usaremos para nombrar al archivo, así si se suben varios con el mismo nombre
		//                     no se tiene conflicto.

		if (strtoupper($tipo_doc) == "PDF") {
			$ultimo_name = $target_dir . 'f_id_' . $id['id'] . '.pdf';
		}
		else {
			$ultimo_name = $target_dir . 'f_id_' . $id['id'] . '.html';
			rename(str_replace(".html","_archivos",$new_ubicacion_rel),$target_dir . 'f_id_' . $id['id'] . '_archivos');
		}

		rename($new_ubicacion_rel,$ultimo_name);


		$response['status'] = "success";
		$response['message'] = "Archivo recibido";
		$response['id'] = $id;//$target_file;
	}
	else {
		//echo "hubo error\n" ;
        $response['status'] = "info";
        $response['message'] = 'No pudo recibirse el archivo ';
		$response['id'] = 0;
		 }

    echoResponse(200, $response);
});

$app->post('/uploadFileUPD','sessionAlive',function() use ($app){
    $r = (object) ['id' =>  0];
    $r->id = $_POST['id'];
	$target_dir     = $_SERVER['DOCUMENT_ROOT'] ;//. "/server/uploaded_files/";
    //$target_dir_rel = "/server/uploaded_files/";
	$nombre_doc = $_POST['nombre_doc'];  // Nombre descriptivo que le pone el usuario
	//$fname = $nombre_doc;

	$ubicacion      = $target_dir . $nombre_doc;//. $fname;
    //$ubicacion_rel  = $target_dir_rel . $fname;

	$response = array("status" => "", "message" => "", "id" => 0);

    if (move_uploaded_file($_FILES["file"]["tmp_name"], $ubicacion)){
		$file_contents = file_get_contents($ubicacion);
		$fh = fopen($ubicacion, "w");
		$file_contents = str_replace('windows-1252','UTF-8',$file_contents);
		fwrite($fh, $file_contents);
		fclose($fh);
        $db = new DbHandler();
        $column_names = array('id');
        $resId = $db->updateRecord("call sp_upd_pyr_evento_doc_detESTADO(?)", $r, $column_names,'i');

		$response['status'] = "success";
		$response['message'] = "Archivo recibido";
		$response['id'] = 0;
	}
	else {
		//echo "hubo error\n" ;
        $response['status'] = "info";
        $response['message'] = 'No pudo recibirse el archivo ';
		$response['id'] = 0;
		 }
    echoResponse(200, $response);
});


// Opcion para obtener la totalidad de registros de documentos del evento de licitacion
$app->get('/eventoFileSel/:id','sessionAlive', function($id) use ($app){

    $r = json_decode($app->request->getBody());
	$idEvento = $id;//$r->idEvento;

    $response = array();
	//
    $db = new DbHandler();
    $datos = $db->getAllRecord("call sp_sel_pyr_evento_doc_det( '$idEvento' )");
    //var_dump($datos);
    if ($datos != NULL) {
			$response = $datos;
    }else{
        $response['status'] = "info";
        $response['message'] = 'No hay datos';
    }

    echoResponse(200, $response);
});

// Recupera solo los HTML asociados a un evento.
$app->get('/eventoFileSelHTML/:id','sessionAlive', function($id) use ($app){

    $r = json_decode($app->request->getBody());
	$idEvento = $id;//$r->idEvento;

    $response = array();
	//
    $db = new DbHandler();
    $datos = $db->getAllRecord("call sp_sel_pyr_evento_doc_detHTML( '$idEvento' )");
    //var_dump($datos);
    if ($datos != NULL) {
			$response = $datos;
    }else{
        $response['status'] = "info";
        $response['message'] = 'No hay datos';
    }

    echoResponse(200, $response);
});

//  -- Obtiene datos de un documento, basado en el ID del documento.

$app->get('/eventoFileSelID/:id','sessionAlive', function($id) use ($app){

    //$r = json_decode($app->request->getBody());
	$idDoc = $id;

    $response = array();
	//
    $db = new DbHandler();
    $datos = $db->getAllRecord("call sp_sel_pyr_evento_doc_detID( '$idDoc' )");
    //var_dump($datos);
    if ($datos != NULL) {
			$response = $datos;
    }else{
        $response['status'] = "info";
        $response['message'] = 'No hay datos';
    }

    echoResponse(200, $response);
});

// create table pyr_precalificado_licitacion ( id int not null auto_increment,
//                                            id_proyecto_licitacion int not null,   -- Id del evento de licitación respectivo
//											id_precalificado int not null,         -- Id del precalificado ???
											//primary key(id) );

// Opcion para ingresar a la lista de eventos asociados a un usuario (precalificado) en particular -- Organizacion: incluira todos los usuarios de esta.
$app->post('/eventoUserIn','sessionAlive',function() use ($app){

	// Recupera los datos de la forma
	//
    $r = json_decode($app->request->getBody());

	$idUser    = $r->id;
	$idEvento  = $r->idEvento;

	//var_dump($r->evento);
    $response = array();
	//
    $db = new DbHandler();
	$id = $db->get1Record("select fn_ins_pyr_organizacion_licitacion( '$idUser', '$idEvento' ) as id");

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

// Opcion para obtener la lista de eventos asociados a un usuario (precalificado) en particular
$app->get('/eventoUserSel','sessionAlive', function() use ($app){
    //$r = json_decode($app->request->getBody());
	$idUser = $_SESSION['uid']; //$r->idUser;

    $response = array();
	//
    $db = new DbHandler();
    $datos = $db->getAllRecord("call sp_sel_pyr_precalificado_licitacion( '$idUser' )");
    //var_dump($datos);
    if ($datos != NULL) {
			$response = $datos;
    }else{
        $response['status'] = "info";
        $response['message'] = 'No hay datos';
    }

    echoResponse(200, $response);
});

// Opcion para eliminar un precalificado de la lista de usuarios (precalificados) asociados a un evento en particular
$app->get('/eventoUserDel/:id','sessionAlive', function($id) use ($app){
    //$r = json_decode($app->request->getBody());

//  En $r deben venir solo el ID del registro que corresponde en la tabla pyr_precalificado_licitacion
	$r = array();
	$r['id'] = $id;

//	$r->idPrecalificado = $idPrecalificado;
//	$r->idEvento = $idEvento;
//	$idUser      = $r->idPrecalificado;
//	$idEvento    = $r->idEvento;

    $response = array();
	//
	$column_names = array('id');
    $db = new DbHandler();
//	var_dump($r);
	$resId = $db->updateRecord("call sp_del_pyr_precalificado_licitacion(?)", $r, $column_names,'i');
//    if ($resId == 0) {
    //var_dump($datos);
    if ($resId > 0) {
		$response['status'] = "success";
		$response['message'] = 'Datos eliminados';
	}else{
		if ($resId <= 0) {
				$response['status'] = "error" . $resId;
				$response['message'] = 'No pudo eliminar los Datos';
			}
	}

    echoResponse(200, $response);
});

// Opcion para obtener la lista de usuarios asignados a un evento específico
$app->get('/userEventoSel/:id','sessionAlive', function($id) use ($app){
	$idEvento = $id;

    $response = array();
	//
    $db = new DbHandler();
    $datos = $db->getAllRecord("call sp_sel_pyr_licitacion_precalificados( '$idEvento' )");
    //var_dump($datos);
    if ($datos != NULL) {
			$response = $datos;
    }else{
        $response['status'] = "info";
        $response['message'] = 'No hay datos';
    }

    echoResponse(200, $response);
});

// Opcion para obtener la lista de los usuarios que no han sido asignados a un evento en particular.
$app->get('/userAllEventoSel/:id','sessionAlive', function($id) use ($app){
	$idEvento = $id;

    $response = array();
	//
    $db = new DbHandler();
    $datos = $db->getAllRecord("call sp_sel_pyr_licitacion_precalificados_ALL( '$idEvento' )");
    //var_dump($datos);
    if ($datos != NULL) {
			$response = $datos;
    }else{
        $response['status'] = "info";
        $response['message'] = 'No usuarios para agregar';
    }

    echoResponse(200, $response);
});

//Inserción de consultores a un evento
//   fn_ins_pyr_consultor_licitacion	( pidconsultor int, pidevento int, pidambito int, pidsecretario char(1) )
   $app->post('/eventoConsultorI','sessionAlive',function() use ($app){

	// Recupera los datos de la forma
	//
    $r = json_decode($app->request->getBody());

	$idConsultor = $r->idConsultor;
	$idEvento    = $r->idEvento;
	$idAmbito    = $r->idAmbito;
	$Secretario  = $r->Secretario;

    $response = array();
	//
	//
    $db = new DbHandler();
	$id = $db->get1Record("select fn_ins_pyr_consultor_licitacion( '$idConsultor', '$idEvento', '$idAmbito', '$Secretario' ) as id");

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

//Selección de consultores de un evento
//   sp_sel_pyr_consultor_licitacion (pidevento )
   $app->get('/eventoConsultorS/:id','sessionAlive', function($id) use ($app){
	$idEvento = $id;

    $response = array();
	//
    $db = new DbHandler();
    $datos = $db->getAllRecord("call sp_sel_pyr_consultor_licitacion( '$idEvento' )");
    //var_dump($datos);
    if ($datos != NULL) {
			$response = $datos;
    }else{
        $response['status'] = "info";
        $response['message'] = 'No hay datos';
    }

    echoResponse(200, $response);
});

//Eliminación de un consultor de un evento
//   sp_del_pyr_consultor_licitacion ( pid )
   $app->get('/eventoConsultorD/:id','sessionAlive',function($id) use ($app){

	// Recupera los datos de la forma
	// en $r deben venir idConsultor y idEvento y su Ambito
	//
    //$r = json_decode($app->request->getBody());

//	$idUser      = $r->idConsultor;
//	$idEvento    = $r->idEvento;
    $r = array();
	$r['id'] = $id;
    $response = array();
	//
	//
	$column_names = array('id');
    $db = new DbHandler();
	$resId = $db->updateRecord("call sp_del_pyr_consultor_licitacion(?)", $r, $column_names,'i');
    if ($resId > 0) {
		$response['status'] = "success";
		$response['message'] = 'Datos eliminados';
	}else{
		if ($resId <= 0) {
				$response['status'] = "error" . $resId;
				$response['message'] = 'No pudo eliminar los Datos';
			}
	}

    echoResponse(200, $response);
});

// Opción para actualizar un registro de la tabla pyr_evento - fechas del evento
$app->post('/eventoUpd','sessionAlive',function() use ($app){

 // Recupera los datos de la forma
 //
  $r = json_decode($app->request->getBody());

 //var_dump($r->evento);
  $response = array();
 //
  //var_dump($r);
  $db = new DbHandler();
  $column_names = array('id','nombre','descripcion','fecha_inicio','fecha_final','estado');

  //
  $resId = $db->updateRecord("call sp_upd_pyr_evento(?,?,?,?,?,?)", $r, $column_names,'issssi');

  if ($resId > 0) {
        $response['status'] = "success";
        $response['message'] = 'Se actualizo correctamente';
  //$response['data'] = $id;

    }else{
        $response['status'] = "info";
        $response['message'] = 'No fue posible actualizar los datos';
    }

    echoResponse(200, $response);
});


?>
