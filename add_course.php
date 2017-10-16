<?php
include "conn.php";
session_start();

$user_id=$_SESSION['userid'];

$course_name=$_GET['name'];
$course_rank=$_GET['rank'];
$course_gpa=$_GET['gpa'];
$course_tags=$_GET['tags'];

if($user_id==null){
    echo "<script> alert('请先登录！') </script>";
}
$sql="INSERT INTO COURSE (user_id,name,rank,gpa,tags) VALUES('".$user_id."','".$course_name."','".$course_rank."','".$course_gpa."','".$course_tags."');";

echo $sql;
$mysqli->query($sql);

header("Location: GPACal.html"); 
exit;
?>