<?php
/**
 * Autor: Luis Albizures
 * fecha: 14/10/2015
 * Hora: 11:50
 *
 * preguntas.php
 
 * server CRUD para la tabla de pyr_pregunta, en Eventos de licitación de la ANADIE y servicios adicionales asociados a la pregunta y su posicionamiento.
 
 * Entidades de DB que se utilizan:
 *
   pyr_pregunta
   pyr_objeto
   
   -- Inserta una pregunta, la primera de un objeto específico.
   $app->post('/preguntaPrimeraIn'   
		fn_ins_pyr_pregunta0( ?, ?, ?, ?, ?, ? )
		pidClave , pidtipo , pidevento , piddocdet int, pidusuario , ppregunta 
									   
   -- Inserta una pregunta, adicional a la primekra de un objeto específico.
   $app->post('/preguntaAdicionalIn'   
		fn_ins_pyr_pregunta1( ?, ?, ?, ?, ? )
		pidClave , pidevento , piddocdet , pidusuario , ppregunta

	-- Selecciona todas las preguntas de un documento
   $app->get('/preguntaSel'		
		sp_sel_pyr_pregunta( ? , ? )
		pidevento , IN piddocdet
		 
	-- Selecciona todas las preguntas de un objeto específico 
   $app->post('/preguntaSelOBJ'
	    sp_sel_pyr_pregunta_OBJ( ? , ? )
		piddocdet ,  pidClave
		
 **/
/*require('lib_pdf/fpdf.php');
class PDF extends FPDF
{
var $widths;
var $aligns;

function SetWidths($w)
{
	//Set the array of column widths
	$this->widths=$w;
}

function SetAligns($a)
{
	//Set the array of column alignments
	$this->aligns=$a;
}

function Row($data)
{
	//Calculate the height of the row
	$nb=0;
	for($i=0;$i<count($data);$i++)
		$nb=max($nb,$this->NbLines($this->widths[$i],$data[$i]));
	$h=5*$nb;
	//Issue a page break first if needed
	$this->CheckPageBreak($h);
	//Draw the cells of the row
	for($i=0;$i<count($data);$i++)
	{
		$w=$this->widths[$i];
		$a=isset($this->aligns[$i]) ? $this->aligns[$i] : 'L';
		//Save the current position
		$x=$this->GetX();
		$y=$this->GetY();
		//Draw the border
		
		$this->Rect($x,$y,$w,$h);

		$this->MultiCell($w,5,$data[$i],0,$a,'true');
		//Put the position to the right of the cell
		$this->SetXY($x+$w,$y);
	}
	//Go to the next line
	$this->Ln($h);
}

function CheckPageBreak($h)
{
	//If the height h would cause an overflow, add a new page immediately
	if($this->GetY()+$h>$this->PageBreakTrigger)
		$this->AddPage($this->CurOrientation);
}

function NbLines($w,$txt)
{
	//Computes the number of lines a MultiCell of width w will take
	$cw=&$this->CurrentFont['cw'];
	if($w==0)
		$w=$this->w-$this->rMargin-$this->x;
	$wmax=($w-2*$this->cMargin)*1000/$this->FontSize;
	$s=str_replace("\r",'',$txt);
	$nb=strlen($s);
	if($nb>0 and $s[$nb-1]=="\n")
		$nb--;
	$sep=-1;
	$i=0;
	$j=0;
	$l=0;
	$nl=1;
	while($i<$nb)
	{
		$c=$s[$i];
		if($c=="\n")
		{
			$i++;
			$sep=-1;
			$j=$i;
			$l=0;
			$nl++;
			continue;
		}
		if($c==' ')
			$sep=$i;
		$l+=$cw[$c];
		if($l>$wmax)
		{
			if($sep==-1)
			{
				if($i==$j)
					$i++;
			}
			else
				$i=$sep+1;
			$sep=-1;
			$j=$i;
			$l=0;
			$nl++;
		}
		else
			$i++;
	}
	return $nl;
}

function Header()
{
    global $connect, $num_rows;

	if ($_SESSION['uid'] !="")
	{
		$id_usuario  = $_SESSION['uid'];
	}
	else
	{
//		$sql ="select id_usuario from AG1_usuario where usuario = '" . $_SESSION['v_usuario'] . "'" ;
//		$row = select_datos($sql);
//		$id_usuario = $row['id_usuario'];
        $id_usuario = "usario_temp";
	}

//	$sql = "select mes_operacion, ano_operacion from AG1_config where id_usuario = " . $id_usuario;
//    $row = select_datos($sql);
//    $mes_operacion = $row['mes_operacion'];
//    $ano_operacion = $row['ano_operacion'];	


	$this->SetFont('Arial','',9);
    $this->Cell(200,6,'INFORME DE PREGUNTAS Y RESPUESTAS (SIPREL) - ' . getdate(),1,1);
	$this->Cell(0,6,' ',0,1);
	$this->Cell(200,6,'ANADIE',1,1); 
	$this->Ln(5);
	$this->Cell(0,6,'LOTE NO.: xxxxx' ,0,0,'C'); 
	$this->Ln(10);
}

function Footer()
{
	$this->SetY(-15);
	$this->SetFont('Arial','B',8);
//	$this->Cell(100,10,'Historial medico',0,0,'L');

}

}*/
//require('gmail.php');
//require 'PHPMailerAutoload.php';
//require_once('class.phpmailer.php');


// -- Inserta una pregunta, la primera de un objeto específico. 
$app->post('/preguntaPrimeraIn','sessionAlive',function() use ($app){

	// Recupera los datos de la forma
	//
    $r = json_decode($app->request->getBody());
	
	$clave         = $r->pregunta->clave;         // Clave que se le asignó al objeto.
	$idTipo        = $r->pregunta->tipo;          // Tipo de objeto, pudiedo ser P=Parrafo y IMG=image
	$idEvento      = $r->pregunta->idEvento;      // Id del evento
	$idDoc         = $r->pregunta->idDoc;         // Id del documento
	$idUser        = $_SESSION['uid'];            //$r->pregunta->idUser;        // Id del usuario que crea la pregunta
	$pregunta      = addslashes($r->pregunta->pregunta);      // Texto o contenido de la pregunta ... con slashes evito que palabras como Moody's no causen problemas.
	
	$ambitos       = $r->pregunta->ambitos;                 // Un arreglo que contiene los ambitos (idAmbito)
	
    $response = array();
	//
	//
    $db = new DbHandler();
	$id = $db->get1Record("select fn_ins_pyr_pregunta0( '$clave', '$idTipo', $idEvento, $idDoc, $idUser, '$pregunta' ) as id");
	
	$error = "no";
	$mensaje_correo = "";
	$idPregunta = $id['id'];
    if ($id != NULL) {
        //
        // Insertará $id pregunta en pyr_pregunta_ambito, insert into pyr_pregunta_ambito (id_pregunta, id_ambito ) values ($id, $ambitos[0] );
        //
        foreach ($ambitos as $idAmbito) {
            $id2 = $db->get1Record("select fn_ins_pyr_pregunta_ambito( '$idPregunta', '$idAmbito' ) as id");
            if ($id2 == NULL) {
                $error = "si";
                break;
            }
        }
		// Si todo salió bien, enviamos un correo notificando
		if ($error == "no") {
			$datos = $db->getAllRecord( "call sp_sel_pyr_pregunta_consultor( '$idPregunta' )" );
			if ($datos ==! NULL) {
				
				ini_set("SMTP", "aspmx.l.google.com");
				ini_set("sendmail_from", 'siprel@agenciadealianzas.gob.gt');
				
				$subject = "SIPREL ha recibido una pregunta/comentario dentro del ámbito al cual usted está asignado";

				$message = "Este es un correo automático de notificaciones, no responda a este remitente. " . "\r\n";
				$message .= "La información relacionada con la presente pregunta/comentario puede ser visualizada en SIPREL " . "\r\n";
				$message .= "El texto de la pregunta/comentario recibido es: " . "\r\n\r\n";
				$message .= wordwrap($pregunta,70,"\r\n");
				$msgUTF   = utf8_encode($message);
				
				$from = "From: Administrador SIPREL <siprel@agenciadealianzas.gob.gt;>";
				$headers = "From: 'siprel@agenciadealianzas.gob.gt'";
				$i = 1;
				foreach ($datos as $rec) {
					mail($rec['email'],$subject,$msgUTF,$from);
				} 				
				$mensaje_correo = "Mensaje enviado!";
				if ($mensaje_correo == "Mensaje enviado!") {
					$error = "no";
					}
				else {
					$error = "si";
				}
			}
		}
    }
	else { $error = "si"; }		

	if ($error == "no") {
			$response['status'] = "success";
			$response['message'] = 'Se agrego correctamente - ' . $mensaje_correo;
			$response['data'] = $id;
	}
	else{
        $response['status'] = "info";
        $response['message'] = 'No fue posible agregar los datos - ' . $mensaje_correo;
    }
	
    echoResponse(200, $response);
});

//    -- Inserta una pregunta, la primera de un objeto específico.
$app->post('/preguntaAdicionalIn','sessionAlive',function() use ($app){

	// Recupera los datos de la forma
	//
    $r = json_decode($app->request->getBody());
	
	$clave         = $r->pregunta->clave;         // Clave que se le asignó al objeto.
	$idTipo        = $r->pregunta->tipo;          // Tipo de objeto, pudiedo ser P=Parrafo y IMG=image
	$idEvento      = $r->pregunta->idEvento;      // Id del evento
	$idDoc         = $r->pregunta->idDoc;         // Id del documento
	$idUser        = $_SESSION['uid'];//$r->pregunta->idUser;        // Id del usuario que crea la pregunta
	$pregunta      = addslashes($r->pregunta->pregunta);      // Texto o contenido de la pregunta
	
	$ambitos       = $r->pregunta->ambitos;                 // Un arreglo que contiene los ambitos (idAmbito)

    $response = array();
	//
	//
    $db = new DbHandler();
	$id = $db->get1Record("select fn_ins_pyr_pregunta1( '$clave', $idEvento, $idDoc, $idUser, '$pregunta' ) as id");

	$error = "no";
	$mensaje_correo = "";
	$idPregunta = $id['id'];
    if ($id != NULL) {
        //
        // Insertará $id pregunta en pyr_pregunta_ambito, insert into pyr_pregunta_ambito (id_pregunta, id_ambito ) values ($id, $ambitos[0] );
        //
        foreach ($ambitos as $idAmbito) {
            $id2 = $db->get1Record("select fn_ins_pyr_pregunta_ambito( '$idPregunta', '$idAmbito' ) as id");
            if ($id2 == NULL) {
                $error = "si";
                break;
            }
        }
		// Si todo salió bien, enviamos un correo notificando
		if ($error == "no") {
			$datos = $db->getAllRecord( "call sp_sel_pyr_pregunta_consultor( '$idPregunta' )" );
			if ($datos ==! NULL) {
				
				ini_set("SMTP", "aspmx.l.google.com");
				ini_set("sendmail_from", 'siprel@agenciadealianzas.gob.gt');
				
				$subject = "SIPREL ha recibido una pregunta/comentario dentro del ámbito al cual usted está asignado";

				$message = "Este es un correo automático de notificaciones, no responda a este remitente. " . "\r\n";
				$message .= "La información relacionada con la presente pregunta/comentario puede ser visualizada en SIPREL " . "\r\n";
				$message .= "El texto de la pregunta/comentario recibido es: " . "\r\n\r\n";
				$message .= wordwrap($pregunta,70,"\r\n");
				$msgUTF  = utf8_encode($message);
				
				$from = "From: Administrador SIPREL <siprel@agenciadealianzas.gob.gt;>";
				$headers = "From: 'siprel@agenciadealianzas.gob.gt'";
				$i = 1;
				foreach ($datos as $rec) {
					mail($rec['email'],$subject,$msgUTF,$from);
				} 				
				$mensaje_correo = "Mensaje enviado!";
				if ($mensaje_correo == "Mensaje enviado!") {
					$error = "no";
					}
				else {
					$error = "si";
				}
			}
		}
    }
	else { $error = "si"; }		
	
    if ($error == "no" ) {
        $response['status'] = "success";
        $response['message'] = 'Se agrego correctamente';
		$response['data'] = $id;
			
    }else{
        $response['status'] = "info";
        $response['message'] = 'No fue posible agregar los datos';
    }
	
    echoResponse(200, $response);
});

//    -- Opcion para ingresar comentarios relacionados con la respuesta 
$app->post('/coments','sessionAlive',function() use ($app){

	// Recupera los datos de la forma
	//
    $r = json_decode($app->request->getBody());
	
	$idPregunta    = $r->idPregunta;
	$idConsultor   = intval($_SESSION['uid']);//$r->pregunta->idConsultor;
	$idAmbito      = $r->idAmbito;
	$comentario    = $r->comentario;
	
    $response = array();
	//
	//
    $db = new DbHandler();
	$id = $db->get1Record("select fn_ins_pyr_coment( '$idPregunta', '$idConsultor', '$idAmbito', '$comentario' ) as id")['id'];
	
    if ($id != NULL) {
			$response['status'] = "success";
			$response['message'] = 'Se agrego correctamente';
			$response['data'] = $id;
	}
	else{
        $response['status'] = "info";
        $response['message'] = 'No fue posible agregar los datos';
    }
	
    echoResponse(200, $response);
});

//    -- Opcion para obtener todos los comentarios relacionados con un ambito, así mismo trae cual de los Consultores que comentan es el secretario y los
//            datos generales de la pregunta a la cual se están refierendo.
//            llama al  sp_sel_comentario_ambito y pasa los parametros de pidPregunta, pidConsultor y pidAmbito
$app->get('/comentariosAmbito/:idPregunta/:idAmbito','sessionAlive',function($idPregunta,$idAmbito) use ($app) {
    $r = json_decode($app->request->getBody());

	//$idPregunta    = $r->idPregunta;
    $idConsultor   =  intval($_SESSION['uid']);
	//$idAmbito      = $r->idAmbito;

    $response = array();
	//
    $db = new DbHandler();

    $datos = $db->getAllRecord("call sp_sel_comentario_ambito('$idPregunta','$idConsultor', $idAmbito )");
    //var_dump($datos);
    if ($datos != NULL) {
			$response = $datos;
    }else{
        $response['status'] = "info";
        $response['message'] = 'No hay datos';
    }

    echoResponse(200, $response);
	
});


// Opcion para obtener la totalidad de las preguntas, de todos los documentos de un evento.
$app->get('/preguntaSelEvento/:id','sessionAlive', function($idEvento) use ($app){

    //$r = json_decode($app->request->getBody());

	//$idEvento      = $r->idEvento;      // Id del evento

    $response = array();
	//
    $db = new DbHandler();
	
    $datos = $db->getAllRecord("call sp_sel_pyr_pregunta_evento('$idEvento' )");
    //var_dump($datos);
    if ($datos != NULL) {
			$response = $datos;
    }else{
        $response['status'] = "info";
        $response['message'] = 'No hay datos';
    }

    echoResponse(200, $response);
});

// Opcion para obtener la totalidad de las preguntas, de todos los documentos de un evento de quien la hizo (usuario precalificado, opcion Consulta de menu )
$app->get('/preguntaSelEventoPrec/:id','sessionAlive', function($id) use ($app){

    $response = array();
	//
    $db = new DbHandler();
	
	$idConsultor = $_SESSION['uid'];
    $datos = $db->getAllRecord("call sp_sel_pyr_pregunta_evento_prec('$id','$idConsultor')");
    //var_dump($datos);
    if ($datos != NULL) {
			$response = $datos;
    }else{
        $response['status'] = "info";
        $response['message'] = 'No hay datos';
        $response['id'] = $id;
        $response['usuarios'] = $idConsultor;
    }

    echoResponse(200, $response);
});

// Seleccion de preguntas que pertenecen a un evento y a un ámbito específicos
// sp_sel_pyr_pregunta_eventoAmbito
$app->get('/preguntaSelEventoAmbito/:evento/:ambito','sessionAlive', function($evento,$ambito) use ($app){

    $r = json_decode($app->request->getBody());

	$idEvento      = $evento;//$r->idEvento;      // Id del evento
	$idAmbito      = $ambito;//$r->idAmbito;      // Id del ambito

    $response = array();
	//
    $db = new DbHandler();

// 02/11/2015 -- jose me dice que pida el session_id y dependiendo del usuario verificar si tiene permiso o no a este evento y ambito
    $idConsultor =  intval($_SESSION['uid']);
	
    $datos = $db->getAllRecord("call sp_sel_pyr_pregunta_eventoAmbito('$idEvento','$idAmbito', $idConsultor )");
    //var_dump($datos);
    if ($datos != NULL) {
			$response = $datos;
    }else{
        $response['status'] = "info";
        $response['message'] = 'No hay datos';
    }

    echoResponse(200, $response);
});

// 
// Seleccion de preguntas que pertenecen a un evento y a un ámbito específicos, solo las estado 3 = RESPONDIDAS
// sp_sel_pyr_pregunta_eventoAmbito
$app->get('/preguntaSelEventoAmbitoE3/:evento','sessionAlive', function($evento) use ($app){

    $r = json_decode($app->request->getBody());

    $idEvento      = $evento;//$r->idEvento;      // Id del evento
    //$idAmbito      = $ambito;//$r->idAmbito;      // Id del ambito

    $response = array();
    //
    $db = new DbHandler();

// 02/11/2015 -- jose me dice que pida el session_id y dependiendo del usuario verificar si tiene permiso o no a este evento y ambito
    $idConsultor =  intval($_SESSION['uid']);

    $datos = $db->getAllRecord("call sp_sel_pyr_pregunta_eventoAmbitoE3('$idEvento' )");
    //var_dump($datos);
    if ($datos != NULL) {
        $response = $datos;
    }else{
        $response['status'] = "info";
        $response['message'] = 'No hay datos';
    }

    echoResponse(200, $response);
});

// Opcion para obtener la totalidad de preguntas del documento de un evento, de la tabla pyr_pregunta
$app->get('/preguntaSel','sessionAlive', function() use ($app){

    $r = json_decode($app->request->getBody());

	$idEvento      = $r->idEvento;      // Id del evento
	$idDoc         = $r->idDoc;         // Id del documento

    $response = array();
	//
    $db = new DbHandler();
	
    $datos = $db->getAllRecord("call sp_sel_pyr_pregunta('$idEvento','$idDoc' )");
    //var_dump($datos);
    if ($datos != NULL) {
			$response = $datos;
    }else{
        $response['status'] = "info";
        $response['message'] = 'No hay datos';
    }

    echoResponse(200, $response);
});

// Opcion para obtener la totalidad de preguntas de un objeto específico.
$app->get('/preguntaSelOBJ/:idDoc/:idClave','sessionAlive', function($idDoc,$idClave) use ($app){

//    $r = json_decode($app->request->getBody());
//	$idDoc   = $r->idDoc;
//	$idClave = $r->idClave;

    $response = array();
	//
    $db = new DbHandler();
    $datos = $db->getAllRecord("call sp_sel_pyr_pregunta_OBJ( '$idDoc', '$idClave' )");
    //var_dump($datos);
    if ($datos != NULL) {
			$response = $datos;
    }else{
        $response['status'] = "info";
        $response['message'] = 'No hay datos';
    }

    echoResponse(200, $response);
});

//  -- Opcion para responder una pregunta: actualiza respuesta y modifica el estado.
$app->post('/respuesta','sessionAlive',function() use ($app) {
    $r = json_decode($app->request->getBody());

// en $r debe venir id de la pregunta, id del consultor y respuesta
    $r->idConsultor = intval($_SESSION['uid']);
    $response = array();
    //
    //
    //var_dump($r);
    $db = new DbHandler();
    $column_names = array('id','idConsultor','respuesta');
    // $db->insertIntoTable($r->opcion, $column_names, 'seg_usuario' );
    $resId = $db->updateRecord("call sp_upd_pyr_respuesta(?,?,?)", $r, $column_names,'iis');

    if ($resId > 0) {
        $response['status'] = "success";
        $response['message'] = 'Se actualizó correctamente';
        //$response['data'] = $id;

    }else{
        $response['status'] = "info";
        $response['message'] = 'No fue posible actualizar los datos';
    }

    echoResponse(200, $response);
});

$app->get('/selPreguntaAmbito/:idPregunta/:idAmbito','sessionAlive',function($idPregunta,$idAmbito) use ($app) {
    $r = json_decode($app->request->getBody());

    //$idPregunta    = $r->idPregunta;
    $idConsultor   =  intval($_SESSION['uid']);
    //$idAmbito      = $r->idAmbito;

    $response = array();
//
    $db = new DbHandler();

    $datos = $db->getAllRecord("call sp_sel_pregunta_ambito('$idPregunta','$idConsultor', $idAmbito )");
    //var_dump($datos);
    if ($datos != NULL) {
        $response = $datos;
    }else{
        $response['status'] = "info";
        $response['message'] = 'No hay datos';
    }

    echoResponse(200, $response);
});

// Determina si existe secretario en el evento y ambito indicados - trae cantidad de secretarios
$app->get('/canSecretarios/:idEvento/:idAmbito','sessionAlive',function($idEvento,$idAmbito) use ($app) {

    $response = array();

    $db = new DbHandler();
    $datos = $db->getAllRecord("select fn_get_num_secretarios( $idEvento , $idAmbito ) as id");
    if ($datos != NULL) {
			$response = $datos;
    }else{
        $response['status'] = "info";
        $response['message'] = 'No hay datos';
    }

    echoResponse(200, $response);
    
});

// Imprime - retorna un pdf con todas las preguntas respondidas que se le soliciten en la lista indicada
$app->post('/printPreguntas','sessionAlive',function() use ($app) {

// Reporte

	$pdf=new PDF('L','mm','Letter');
	$pdf->Open();
	$pdf->AddPage();
	$pdf->SetMargins(5,3,5);  // margen, left, top y right
	//$pdf->Ln(03);

	//$pdf->SetWidths(array(65, 60, 55, 50, 20));
	$pdf->SetFont('Arial','B',8);
	$pdf->SetFillColor(85,107,47);
    $pdf->SetTextColor(0);
	
	$pdf->ln();
//

    $response = array();

    $lisPreguntas = json_decode($app->request->getBody());
    $idUser   =  intval($_SESSION['uid']);
    $lista = implode(",",$lisPreguntas);

    $db = new DbHandler();
	$impresas = $db->get1Record("select fn_num_respuesta_print( '$lista' ) as cantidad");
    //var_dump($impresas);
    if ($impresas['cantidad'] == 0 ) {
		// genera las respuestas en el documento PDF
		// $target_dir = $_SERVER['DOCUMENT_ROOT'] . "/server/uploaded_files/";

		// registra el nuevo lote de preguntas impresas
        // insert into pyr_respuesta_print ( id, fecha, id_usuario ) values ( now(), now(), 12 );
		$idLote = $db->get1Record("select fn_ins_pyr_respuesta_print( $idUser ) as id");

        if ($idLote != NULL && $idLote > 0) {
			$ok = true;
			foreach ($lisPreguntas as $respuesta) {
				// registra el detalle de preguntas incluidas en el lote
				// insert into pyr_respuesta_print_det ( id_print, id_pregunta ) values ( '2015-11-13 01:04:40', 63 );
				if ($ok == true) {
					$idDet = $db->get1Record("select fn_ins_pyr_respuesta_print_det( '".$idLote['id']."', $respuesta ) as idDet");
					if ($idDet == NULL ) { $ok = false; }
					else {                                             
						// Imprime pregunta por pregunta
						$pdf->Cell(20,4,'Pregunta ' . $idDet,1,0,'L');
					}
				}
			 
			}
		}
		else { $ok = false; }

    }else{
        $response['status'] = "error";
        $response['message'] = 'No se puede imprimir';
    }
	$file = $_SERVER['DOCUMENT_ROOT'] . "/server/uploaded_files/prueba_impresion.pdf";
	
    if (file_exists($file)) {
        /*header('Content-Description: File Transfer');
        header('Content-Type: application/octet-stream');
        header('Content-Disposition: attachment; filename="'.basename($file).'"');
        header('Expires: 0');
        header('Cache-Control: must-revalidate');
        header('Pragma: public');
        header('Content-Length: ' . filesize($file));
        readfile($file);
        exit;*/
        $response['url'] =  "/server/uploaded_files/prueba_impresion.pdf";
		ob_end_clean();																
		$pdf->Output();
    }else{
        $response['status'] = "error";
        $response['message'] = 'No se encontro el archivo';
    }
//    echoResponse(200, $response);
});

?>
