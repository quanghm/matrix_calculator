<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">

<title>Insert title here</title>
<script type="text/javascript" src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>
<body>
<?php 
include "matrix_class.php";

$aTestMatrix = [];
for($nRow=1;$nRow<5;$nRow++)
{
	for ($nCol=1;$nCol<5;$nCol++)
	{
		$aTestMatrix[$nRow][$nCol]=rand(0,8)*($nRow-1);//$nRow+$nCol+$nRow*$nCol;
	}
}

$matrix =new matrix($aTestMatrix,2);
$matrix->displayEntries();
$matrix->doGaussJordan();
//$matrix->displayEntries();
?>
</body>
