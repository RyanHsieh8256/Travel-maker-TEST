<?php
    require_once("./connectdatabase.php");

    try{
        $sql = "select * from group_";

        $groData = $pdo -> prepare($sql);
        $groData -> execute();

        if($groData -> rowCount() == 0){
            echo "not found";
        }else{
            $data = $groData -> fetchAll(PDO::FETCH_ASSOC);

            echo json_encode($data);
        }
    }catch(PDOExcaption $e){
        echo $e->getMessage();
    }
?>