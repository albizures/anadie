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
    var_dump($_POST); // aqui viene la infomacion para ingresar el documento, id del proyecto y a que registro pertenece
    var_dump($_FILES);// aqui te paso el documento pero siempre va a venir con un nombre diferente dependiendo el documento
	                  // para saber el nombre del documento es de contaquetar el id y el nombre del campo.
    $target_dir = "D:/wamp/www/anadie/server/files/";

    // en este caso lo hice quemado, pero el id seria 3 y el campo seria dictamen_leg_doc
    $target_file = $target_dir . basename($_FILES["3dictamen_leg_doc"]["name"]);
    move_uploaded_file($_FILES["3dictamen_leg_doc"]["tmp_name"], $target_file);

    $response['message'] = 'archivo cargado';
    echoResponse(200, $response);
});
	