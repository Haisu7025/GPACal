<?php
include "conn.php";
session_start();

$user_id=$_SESSION['userid'];

$title=$_GET['title'];
$content=$_GET['content'];

if($user_id==null){
    echo "<script> alert('请先登录！') </script>";
}
$sql="INSERT INTO TODO (user_id,title,content,time,isdone) VALUES('".$user_id."','".$title."','".$content."',SYSDATE(),'0');";

echo $sql;
$mysqli->query($sql);

header("Location: GPACal.html"); 
exit;
?>