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
	
}

    //var_dump($_POST); // aqui viene la infomacion para ingresar el documento, id del proyecto y a que registro pertenece
    //var_dump($_FILES);// aqui te paso el documento pero siempre va a venir con un nombre diferente dependiendo el documento
	//var_dump($app->request);             // para saber el nombre del documento es de contaquetar el id y el nombre del campo.
//    $target_dir = "D:/wamp/www/anadie/server/files/";

    // en este caso lo hice quemado, pero el id seria 3 y el campo seria dictamen_leg_doc
    //$target_file = $target_dir . basename($_FILES["3dictamen_leg_doc"]["name"]);
    //move_uploaded_file($_FILES["3dictamen_leg_doc"]["tmp_name"], $target_file);

	$target_dir = $_SERVER['DOCUMENT_ROOT'] . "/server/uploaded_files/";
	$fname1 = $_POST['id'] . $_POST['nombre'];
	$fname = $_POST['id'] . $_POST['nombre'] . ".pdf";
	$target_file = $target_dir . $fname;
    $relative_dir =  "/server/uploaded_files/" . $fname;
	$response = array("status" => "", "message" => "", "data" => "");
	
	$r = new R;
//	$r = array ( "opcion" => [ "id" => $_POST['id'], "field_name" => $_POST['nombre'], "target_file" => $target_file, ] );
	$r->id = $_POST['id'];
	$r->field_name = $_POST['nombre'];
	$r->target_file = $relative_dir;//$target_file;
	
//	$r->field_name = "dictamen_tec_doc";
//	$r->target_file = $target_file;

    if (move_uploaded_file($_FILES[$fname1]["tmp_name"], $target_file)){
		//echo "el archivo vino bien\n";

		$db = new DbHandler();
		$column_names = array('id','field_name','target_file');
		$resId = $db->updateRecord("call sp_upd_proyecto_archivo(?,?,?)", $r, $column_names,'iss');
		
		$response['status'] = "ok";
		$response['message'] = "archivo recibido";
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
	