<?php
include "conn.php";

session_start();
$user_id=$_SESSION['userid'];
//$user_id已取得
$sql="SELECT * FROM COURSE WHERE user_id='".$user_id."';";
$rst=$mysqli->query($sql);
$num=0;
$response = array();
$tags=array();

$gpa_all=0;
$rank_all=0;

$gpa_tags=array();
$rank_tags=array();

while($row=$rst->fetch_array()){
    $course_name=$row[2];
    $course_rank=$row[3];
    $course_gpa=$row[4];
    $course_tags=$row[5];

    $n = array('k'=>"all",
    'i'=>$num++,
    'n'=>$course_name,
    'r'=>$course_rank,
    'g'=>$course_gpa,
    't'=>$course_tags);

    $response[]=$n;
    $n=null;

    //计算gpa
    $rank_all=$rank_all+(int)$course_rank;
    $gpa_all=$gpa_all+(double)$course_gpa*(int)$course_rank;


    $tags_stream=explode(',',$course_tags);
    for($i=0;$i<count($tags_stream);$i++){
        if(in_array($tags_stream[$i],$tags)==NULL){
            $tags[]=$tags_stream[$i];
        }
    }

}

// echo $tags[0];
// echo $tags[1];
// echo $tags[2];
// echo in_array("物",$tags)==NULL;


//更新gpa值
$gpa_all=$gpa_all/$rank_all;
$sql="UPDATE USER SET rank='".$rank_all."',gpa='".$gpa_all."' WHERE id='".$user_id."';";
$mysqli->query($sql);

$n=array('k'=>"sum",
'r'=>$rank_all,
'g'=>$gpa_all);
$response[]=$n;
$n=null;

//分标签计算gpa
for($i=0;$i<count($tags);$i++){
    $this_tag=$tags[$i];
    $sql="SELECT * FROM COURSE WHERE user_id='".$user_id."' AND tags like '%".$this_tag."%';";
    $rst=$mysqli->query($sql);   
    $rank_tags[$this_tag]=0;
    $gpa_tags[$this_tag]=0; 
    while($row=$rst->fetch_array()){
        $course_name=$row[2];
        $course_rank=$row[3];
        $course_gpa=$row[4];
        $course_tags=$row[5];

        $rank_tags[$this_tag]=$rank_tags[$this_tag]+(int)$course_rank;
        $gpa_tags[$this_tag]=$gpa_tags[$this_tag]+(double)$course_gpa*(int)$course_rank;
    }
    $this_rank=$rank_tags[$this_tag];
    $this_gpa=$gpa_tags[$this_tag]/$this_rank;

    $n = array('k'=>"tags",
    'i'=>$i,
    't'=>$this_tag,
    'r'=>$this_rank,
    'g'=>$this_gpa);

    $response[]=$n;
    $n=null;
    

}

//读取待办事项
$sql="SELECT * FROM TODO WHERE user_id='".$user_id."' AND isdone='0';";
$rst=$mysqli->query($sql);
while($row=$rst->fetch_array()){
    $title=$row[2];
    $content=$row[3];
    $time=$row[4];

    $n=array('k'=>"todo",
    't'=>$title,
    'c'=>$content,
    'm'=>$time);
    $response[]=$n;
    $n=null;
}
echo json_encode($response);

?>


