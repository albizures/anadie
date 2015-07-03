<?php

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
