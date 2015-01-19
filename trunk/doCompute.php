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

$matrix =new matrix($aTestMatrix,$_REQUEST["augmented_rows"]);
$matrix->displayEntries();
//echo inverse($matrix->entries);

switch ($_REQUEST["operationType"])
{
	case "Gauss":
		$matrix->doGauss();
		break;
	case "Gauss-Jordan":
		$matrix->doGaussJordan();
		break;
	case "findDet":
		echo $matrix->findDet();
		break;
	case "inverse":
		echo inverse($matrix->entries);
		break;
}
//$matrix->displayEntries();
?>
</div>
</body>
