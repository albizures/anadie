<?php
/*
<!--

-- Abajo el segmento de código que se debiera utilizar bajo la ruta /uploadFile
--    utilizando como ejemplo el segmento de código html de abajo comentado.

<!DOCTYPE html>
<html>
<body>

<form action="upload.php" method="post" enctype="multipart/form-data">
    Select image to upload:
    <input type="file" name="fileToUpload" id="fileToUpload">
    <input type="submit" value="Upload file" name="submit">
</form>

</body>
</html>
-->*/

$app->post('/uploadFile','sessionAlive',function() use ($app){

class R {
	
	public $id = "";
	public $field_name = "";
	public $target_file = "";
	public $ref = "";
	public $fec = "";
	
}

// field_name indica el documento que se está guardando, pudiendo ser las constantes:  dictamen_tec_doc, dictamen_leg_doc, res_dir_eje_doc, res_conadie_doc

    //var_dump($_POST); // aqui viene la infomacion para ingresar el documento, id del proyecto y a que registro pertenece
    //var_dump($_FILES);// aqui te paso el documento pero siempre va a venir con un nombre diferente dependiendo el documento
	//var_dump($app->request);             // para saber el nombre del documento es de contaquetar el id y el nombre del campo.
	
	//    $target_dir = "D:/wamp/www/anadie/server/files/";

	$target_dir = $_SERVER['DOCUMENT_ROOT'] . "/server/uploaded_files/";
	$fname1 = $_POST['id'] . $_POST['nombre'];
	$fname = $_POST['id'] . $_POST['nombre'] . ".pdf";
	
	// L.A. 
	// 29/09/2015
	// Ahora también debe traer No. de referencia del documento que corresponda y su fecha de creación según el usuario
	$ref  = $_POST['referencia'];
	$fec  = $_POST['fecha'];

	$target_file = $target_dir . $fname;
    $relative_dir =  "/server/uploaded_files/" . $fname;
	$response = array("status" => "", "message" => "", "data" => "");
	
	$r = new R;
//	$r = array ( "opcion" => [ "id" => $_POST['id'], "field_name" => $_POST['nombre'], "target_file" => $target_file, ] );
	$r->id = $_POST['id'];
	$r->field_name = $_POST['nombre'];
	$r->target_file = $relative_dir;//$target_file;
	$r->ref = $ref;
	$r->fec = $fec;
	
//	$r->field_name = "dictamen_tec_doc";
//	$r->target_file = $target_file;

    if (move_uploaded_file($_FILES[$fname1]["tmp_name"], $target_file)){
		//echo "el archivo vino bien\n";

		$db = new DbHandler();
		$column_names = array('id','field_name','target_file','ref','fec');
		$resId = $db->updateRecord("call sp_upd_proyecto_archivo(?,?,?,?,?)", $r, $column_names,'issss');
		
		$response['status'] = "success";
		$response['message'] = "Archivo recibido";
		$response['target_file'] = $relative_dir;//$target_file;
	}
	else { 
		//echo "hubo error\n" ;
        $response['status'] = "info";
        $response['message'] = 'No pudo recibirse el archivo ';
		$response['target_file'] = "";
		 }

    echoResponse(200, $response);
});

// Carga archivos relacionados con el precalificado
	
$app->post('/upFilePrec','sessionAlive',function() use ($app){
	$idPrecalificado = $_POST['idPrecalificado'];
	$idTipoDoc       = $_POST['idTipoDoc'];
	$idUser          = $_SESSION['uid'];
	$fname           = $_POST['nombre_file'];
	$source_fname    = $_FILES['file']['name'];
	$source_type     = $_FILES['file']['type'];
	$target_dir  = $_SERVER['DOCUMENT_ROOT'] . "/server/uploaded_files/";
	$server_dir  = "/server/uploaded_files/";
	//$target_file = $_SERVER['DOCUMENT_ROOT'] . "/server/uploaded_files/" . $source_fname;
	

	$db = new DbHandler();
	$id = $db->get1Record("select fn_ins_sip_precalificado_doc( '$idPrecalificado', '$idTipoDoc', '$fname', '$source_fname', '$server_dir', '$idUser' ) as id")['id'];
	
	$response = array("status" => "", "message" => "", "data" => "");
	
	if ($id != NULL) {

		$target_file =  $target_dir . $id . '_' . $source_fname;
		//var_dump('from: ',$_FILES['file']['tmp_name']);
		//var_dump('to : ',$target_file);
		if (move_uploaded_file($_FILES['file']['tmp_name'], $target_file)){
			//echo "el archivo vino bien\n";
			$response['status'] = "success";
			$response['message'] = "Archivo recibido";
			//$response['target_file'] = $relative_dir;//$target_file;
		}
		else {                                           // OJO: si aqui hubo error, debiera eliminar el registro que se creo en get1Record()
			//echo "hubo error\n" ;
			$response['status'] = "info";
			$response['message'] = 'No pudo recibirse el archivo ';
			//$response['target_file'] = "";
			 }
	}
	else
	{
			$response['status'] = "info";
			$response['message'] = 'No pudo registrarse el archivo ';
			//$response['target_file'] = "";
	}
    echoResponse(200, $response);
});
		
		