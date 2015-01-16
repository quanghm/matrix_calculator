<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">

<title>Insert title here</title>
<script type="text/javascript" src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>
<body>
<?php 
include "matrix.php";

$aTestMatrix = [];
for($nRow=1;$nRow<4;$nRow++)
{
	for ($nCol=1;$nCol<4;$nCol++)
	{
		$aTestMatrix[$nRow][$nCol]=$nRow+$nCol+$nRow*$nCol;
	}
}
displayMatrix($aTestMatrix);
try {
//	print_r(findNextPivot($aTestMatrix, 1, 1));
//	doGaussElimination($aTestMatrix);
//	echo "<br/>";
	doGaussJordan($aTestMatrix);
} catch (Exception $e) {
	echo $e;
} 
?>
</body>
