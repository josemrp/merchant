<?php 

// Config
sleep(1); // To simulte real work

// session_start();
// if($_SESSION['login'] !== true)
//     exit();

require_once('linearRegression.php');

/**
 * Get data for the reques
 * Get the method
 */
function getRequest() {
    $data = (object) $_REQUEST;
    $data->method = $_SERVER['REQUEST_METHOD'];
    return $data;
}

/**
 * Response with JSON format
 * And exit to the API
 * 
 * @param Object $data
 */
function apiResponse($data) {
    echo json_encode($data);
    if(isset($conn))
        $conn->close();
    exit();
}

$request = getRequest();
$conn = new mysqli('localhost', 'root', '', 'db_merchant');

if($conn->connect_errno) {
    apiResponse((object) ['error' => $conn->connect_error]);
}

?>