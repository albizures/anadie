<?php
class Statement_Parameter 
{ 
    private $_array = array(); 
    
    public function __constructor() 
    { 
    } 
    
    public function Add_Parameter($name, $type, $value = NULL) 
    { 
        $this->_array[$name] = array("type" => $type, "value" => $value);    
    } 
    
    public function Get_Type_String() 
    { 
        $types = "";    
    
        foreach($this->_array as $name => $la) 
            $types .= $la['type']; 
        
        return $types; 
    } 
    
    public function Set_Parameter($name, $value) 
    { 
        if (isset($this->_array[$name])) 
        { 
            $this->_array[$name]["value"] = $value; 
            return true; 
        } 
        return false; 
    } 
    
    public function Bind_Params(&$stmt) 
    { 
        $ar = Array(); 
        
        $ar[] = $this->Get_Type_String(); 
        
        foreach($this->_array as $name => $la) 
            $ar[] = &$this->_array[$name]['value']; 
        
        return call_user_func_array(array($stmt, 'bind_param'),$ar); 
    } 
} 

class Statement_Parameter_Type 
{ 
    public static $STATEMENT_TYPE_INTEGER = 'i'; 
    public static $STATEMENT_TYPE_DOUBLE =     'd'; 
    public static $STATEMENT_TYPE_STRING =     's'; 
    public static $STATEMENT_TYPE_BLOB =     'b'; 
} 
?>