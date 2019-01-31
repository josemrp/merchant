<?php 

// session_start();
// if($_SESSION['login'] !== true)
//     exit;

function getRequest() {
    $data = (object) $_REQUEST;
    $data->method = $_SERVER['REQUEST_METHOD'];
    return $data;
}

function apiResponse($data) {
    echo json_encode($data);
    if(isset($conn))
        $conn->close();
    die;
}

$request = getRequest();
$conn = new mysqli('localhost', 'root', '', 'db_merchant');

if($conn->connect_errno) {
    apiResponse((object) ['error' => $conn->connect_error]);
}

?>