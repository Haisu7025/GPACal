<?php
include 'conn.php';
session_start();
// echo $_GET["account"];
// echo $_GET["password"];

$account=$_GET["account"];
$password=$_GET["password"];

$sql = "SELECT * FROM USER WHERE account='".$account."' AND password='".$password."';";
$rst = $mysqli->query($sql);

if(!$user_array=$rst->fetch_array()){
    //无结果返回
    echo "登录失败,3s后返回";
    sleep(3000);
    header("Location: login.html"); 
    exit;
}
else{
    $user_id=$user_array[0];
    echo $user_id;
    $_SESSION['userid']=$user_id;
    header("Location: GPACal.html"); 
    exit;
}

?>