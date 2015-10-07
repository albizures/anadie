<?php
/**
 * Autor: Luis Albizures
 * fecha: 31/08/2015
 * Hora: 14:50
 *
 * eventos.php
 
 * server CRUD para la tabla de pyr_evento de Eventos de licitación de la ANADIE.
 
 * Entidades de DB que se utilizan:
 *
   pyr_evento
   
   sp_sel_pyr_evento()
   fn_ins_pyr_evento( ?, ?, ?, ? )
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
	$idEvento   = $_POST['idEvento'];
	$nombre_doc = $_POST['nombre_doc'];  // Nombre descriptivo que le pone el usuario
	$tipo_doc   = $_POST['tipo'];       // Espera la extensión pudiendo ser PDF o HTML
	                                    // El nombre del archivo lo realiza concatenando el ID del evento mas el nombre que le dio el usuario sin espacios
										//                y adjuntando la extensión 
	if (strtoupper($tipo_doc) == "PDF") 
		 { $fname      = $idEvento . '_' . str_replace(' ', '',$_POST['nombre_doc']) . ".pdf"; }
	else { $fname      = $idEvento . '_' . str_replace(' ', '',$_POST['nombre_doc']) . ".html";}
	
	$ubicacion  = $target_dir . $fname;
	$usuario    = $_POST['id_usuario'];
	
	$response = array("status" => "", "message" => "", "id" => 0);
	
	$r = new R;
//	$r = array ( "opcion" => [ "id" => $_POST['id'], "field_name" => $_POST['nombre'], "target_file" => $target_file, ] );
	$r->idEvento    = $idEvento;
	$r->nombre_doc  = $nombre_doc;
	$r->ubicacion   = $ubicacion;
	$r->usuario     = $usuario;
/* create table pyr_evento_doc_det (
 id            int not null auto_increment,
 id_evento     int not null,
 nombre_doc    varchar(100) not null,
 ubicacion     varchar(100) not null,
 fecha_carga   date not null,
 usuario_carga int not null, primary key (id) );   */	

    if (move_uploaded_file($_FILES[$nombre_doc]["tmp_name"], $ubicacion)){
		//echo "el archivo vino bien\n";

		$db = new DbHandler();
		$id = $db->get1Record("select fn_ins_pyr_evento_doc_det( '$idEvento', '$nombre_doc', '$ubicacion', '$usuario' ) as id");

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

?>
