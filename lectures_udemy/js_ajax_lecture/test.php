<?php
//nameKey
//mydata
$name = (isset($_POST['nameKey'])) ? $_POST['nameKey'] : 'No Name';
$data = (isset($_POST['mydata'])) ? $_POST['mydata'] : 'No Data';
$array = ['name' => $name, 'data' => $data, 'response' => 'Success'];

echo json_encode($array);

?>