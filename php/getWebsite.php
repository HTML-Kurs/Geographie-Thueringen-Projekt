<?php
    echo "test";
    $s = str_replace("[QUEST]", "?",  $_GET["site"]);
    $s = str_replace("[AND]", "&",  $s);
    echo file_get_contents('http://' . $s);
?>