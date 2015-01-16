<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">

<title>Insert title here</title>
<script type="text/javascript" src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>
<body>
<div align="center">
<?php 
include "matrix_class.php";

foreach ($_REQUEST['e'] as $nRow =>$aRow)
{
	foreach ($aRow as $nCol=>$sEntry)
	{
		$aTestMatrix[$nRow][$nCol]=(float)$sEntry;
	}
}
	
// for($nRow=1;$nRow<5;$nRow++)
// {
// 	for ($nCol=1;$nCol<5;$nCol++)
// 	{
// 		$aTestMatrix[$nRow][$nCol]=rand(0,8);//*($nRow-1);//$nRow+$nCol+$nRow*$nCol;
// 	}
// }

$matrix =new matrix($aTestMatrix,$_REQUEST["augmented_rows"]);
$matrix->displayEntries();
inverse($matrix->entries);
//$matrix->displayEntries();
?>
</div>
</body>
