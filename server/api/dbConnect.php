<?php

class dbConnect {

    private $conn;

    function __construct() {        
    }

    /**
     * Establishing database connection
     * @return database connection handler
     */
    function connect() {
        include_once 'config.php';

        // Connecting to mysql database
        $this->conn = new mysqli(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME);

        // Check for database connection error
        if (mysqli_connect_errno()) {
            echo "No es posible conectar con la base de datos MySQL: " . mysqli_connect_error();
        }

        // returing connection resource
        return $this->conn;
    }
	
	function disconnect() {
		$this->conn->close();
	}

}

?>
