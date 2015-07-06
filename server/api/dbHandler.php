<?php

	require_once('dbStatementParameter.php');

class DbHandler {

    private $conn;

	
    function __construct() {
        require_once 'dbConnect.php';
        // opening db connection
        //$db = new dbConnect();
        //$this->conn = $db->connect();
    }
    /**
     * Fetching single record
     */
	public function getRecord($query) {
        $r = $this->conn->query($query) or die($this->conn->error.__LINE__);
		while($row = $r->fetch_array(MYSQLI_ASSOC))
			{
				$rows[] = $row;
			}
        //return $result = $r->fetch_array(MYSQLI_ASSOC);    
		return $rows;
    }

		public function getAllRecord($query) {
		$db = new dbConnect();
		$this->conn = $db->connect();

        $r = $this->conn->query($query) or die($this->conn->error.__LINE__);
		while($row = $r->fetch_array(MYSQLI_ASSOC))
			{
				$rows[] = $row;
			}
        //return $result = $r->fetch_array(MYSQLI_ASSOC);    
		$db->disconnect();
		
		return $rows;
    }

	public function get1Record($query) {
		$db = new dbConnect();
		$this->conn = $db->connect();
		
        $r = $this->conn->query($query) or die($this->conn->error.__LINE__);
		$res = $r->fetch_assoc();    
		$db->disconnect();
		
        return $res;
    }
		
    public function getOneRecord($query) {
        $r = $this->conn->query($query.' LIMIT 1') or die($this->conn->error.__LINE__);
        return $result = $r->fetch_assoc();    
    }

    public function deleteRecord($sp_name,$id) {
		$db = new dbConnect();
		$this->conn = $db->connect();
		
		$st = $this->conn->prepare($sp_name);
		$st->bind_param('i', $idvalue);
		$idvalue = $id;
		$st->execute();
		$st->close();
		$db->disconnect();
		return 0;
    }
	
	public function updateRecord($sp_name,$obj,$column_names,$comillas) {
		$db = new dbConnect();
		$this->conn = $db->connect();
		

		$column_list = "";
		$value_list = "";
		
		$c = (array)$obj;
		$keys = array_keys($c);
		
//		var_dump($sp);
		$st = $this->conn->stmt_init();
		if ($st->prepare($sp_name)) {
		$sp = new Statement_Parameter();

		//-------------------------------- Arma la lista para luego realizar el prepare
		//
		$i=0;
		foreach ($column_names as $desired_key) {
			if (substr($comillas,$i,1)=='s') {
				$sp->Add_Parameter($desired_key,Statement_Parameter_Type::$STATEMENT_TYPE_STRING); }
			else {
				$sp->Add_Parameter($desired_key,Statement_Parameter_Type::$STATEMENT_TYPE_INTEGER); }
			$i= $i+1;
		}
		
		//--------------------------------
//		echo "Hara el bind";
		$sp->Bind_Params($st);
		$i = 0;
		foreach ($column_names as $desired_key2) {
			$$desired_key2 = $c[$desired_key2];
			if (substr($comillas,$i,1)=='s') {
				$sp->Set_Parameter($desired_key2,$$desired_key2); 
			}
			else {
				$sp->Set_Parameter($desired_key2,$$desired_key2); 
			}
			$i = $i+1;
			}
		
		$st->execute();
		$db->disconnect();
		
        return 0;    
		}
		else { return -1; }
	}
    /**
     * Creating new record
     */
    public function insertIntoTable($obj, $column_names, $table_name) {
        
        $c = (array) $obj;
        $keys = array_keys($c);
        $columns = '';
        $values = '';
        foreach($column_names as $desired_key){ // Check the obj received. If blank insert blank into the array.
           if(!in_array($desired_key, $keys)) {
                $$desired_key = '';
            }else{
                $$desired_key = $c[$desired_key];
            }
            $columns = $columns.$desired_key.',';
            $values = $values."'".$$desired_key."',";
        }
        $query = "INSERT INTO ".$table_name."(".trim($columns,',').") VALUES(".trim($values,',').")";
        $r = $this->conn->query($query) or die($this->conn->error.__LINE__);

        if ($r) {
            $new_row_id = $this->conn->insert_id;
            return $new_row_id;
            } else {
            return NULL;
        }
    }
public function getSession(){
    if (!isset($_SESSION)) {
        session_start();
    }
    $sess = array();
    if(isset($_SESSION['uid']))
    {
        $sess["uid"] = $_SESSION['uid'];
        $sess["name"] = $_SESSION['name'];
    }
    else
    {
        $sess["uid"] = '';
        $sess["name"] = 'Guest';
    }
    return $sess;
}
public function destroySession(){
    if (!isset($_SESSION)) {
    session_start();
    }
    if(isSet($_SESSION['uid']))
    {
        unset($_SESSION['uid']);
        unset($_SESSION['name']);
        $info='info';
        if(isSet($_COOKIE[$info]))
        {
            setcookie ($info, '', time() - $cookie_time);
        }
        $msg="Se ha desconectado del sistema...";
    }
    else
    {
        $msg = "No está registrado en el sistema...";
    }
    return $msg;
}
 
}

?>
