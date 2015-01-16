<?php
function multiplyRow(&$aMatrix,$nRow,$nMultiplier)
{
	if (!isset($aMatrix[$nRow]))
	{
		trigger_error("Wrong dimensions");
		return FALSE;
	}
	else{
		$nColCount = count($aMatrix[$nRow]);
		for ($nCol=1;$nCol<=$nColCount;$nCol++)
		{
			$aMatrix[$nRow][$nCol]*=$nMultiplier;
		}
		return TRUE;
	}
}

function interchangeRows(&$aMatrix,$nRow1,$nRow2)
{
	//	get dimensions of matrix
	$nRowCount=Count($aMatrix);
//	$nColCount=Count($aMatrix[1]);
	
	if (($nRow1>$nRowCount) or ($nRow2>$nRowCount))
	{
		trigger_error("Wrong dimensions");
		return FALSE;
	}
	else {
		$tmp=$aMatrix[$nRow1];
		$aMatrix[$nRow1]=$aMatrix[$nRow2];
		$aMatrix[$nRow2]=$tmp;
	}
	return TRUE;
}

function addMultipleOfRow(&$aMatrix,$nRowToBeModified,$nRowToBeMultiplied,$nMultiplier){
	//	get dimensions of matrix
	$nRowCount=Count($aMatrix);
	$nColCount=Count($aMatrix[1]);

	if (($nRowToBeModified > $nRowCount) or ($nRowToBeMultiplied>$nRowCount)){
		trigger_error("Wrong dimension");
		return FALSE;
	}
	else{
		for ($nCol=1;$nCol<=$nColCount;$nCol++){
			$aMatrix[$nRowToBeModified][$nCol]+=$aMatrix[$nRowToBeMultiplied][$nCol]*$nMultiplier;
		}
	} 
	return TRUE;
}

function findNextPivot($nStartRow,$nStartCol){
	//	get dimensions of matrix
	$nRowCount=count($aMatrix);
	$nColCount=count($aMatrix[1]);
	
	//	current position
	$aPivot=[$nStartRow,$nStartCol];
	
	while (($aMatrix[$nStartRow][$nStartCol]==0) 	// if current entry is 0
			and ($nStartCol<=$nColCount) 			// and within column range 
			and ($nStartRow<=$nRowCount))			// and within row range
	{
		if ($nStartRow<$nRowCount)
		{
			$nStartRow++;
		}
		else{
			$nStartRow=$aPivot[0];
			$nStartCol++;
		}
		if (($nStartCol>$nColCount) or ($nStartRow>$nRowCount)) {return 0;}
	}
	$aPivot=[$nStartRow,$nStartCol];
	return $aPivot;
}

//	it's time to do Gauss
function doGaussElimination(&$aMatrix){
	//	get dimensions of matrix
	$nRowCount=Count($aMatrix);
	$nColCount=Count($aMatrix[1]);
	
	//	set pivot to first entry
	$aPivot=findNextPivot($aMatrix, 1,1);
	while ($aPivot!==0){	
		//	normalize pivot row
		$nMultiplier=1/$aMatrix[$aPivot[0]][$aPivot[1]];
		if ($nMultiplier!==-1)
		{
			multiplyRow($aMatrix, $aPivot[0], $nMultiplier);
			displayMatrix($aMatrix);
		}
		
		//	kill entries below pivot
		for($nRow=$aPivot[0];$nRow<=$nRowCount;$nRow++)
		{
			if ($nRow!==$aPivot[0])
			{
				$nMultiplier=-$aMatrix[$nRow][$aPivot[1]];
				addMultipleOfRow($aMatrix, $nRow, $aPivot[0], $nMultiplier);
				displayMatrix($aMatrix);
			}
		}
		
		//	check if finished
		if (($aPivot[0]<$nRowCount)and($aPivot[1]<$nColCount))
		{
			$aPivot=findNextPivot($aMatrix, $aPivot[0]+1,$aPivot[1]+1);
		}
		else{return true;}
	}
}
function float2rat($n, $tolerance = 1.e-6) {
	if ($n==0)
	{
		return 0;
	}
	if ($n==floor($n))
	{return $n;}
	if ($n<0)
	{
		$sign="-";
		$n=-$n;
	}
	else{$sign="";}
	$h1=1; $h2=0;
	$k1=0; $k2=1;
	$b = 1/$n;
	do {
		$b = 1/$b;
		$a = floor($b);
		$aux = $h1; $h1 = $a*$h1+$h2; $h2 = $aux;
		$aux = $k1; $k1 = $a*$k1+$k2; $k2 = $aux;
		$b = $b-$a;
	} while (abs($n-$h1/$k1) > $n*$tolerance);

	return "$sign\\frac{$h1}{$k1}";
}

//	Gauss-Jordan
function doGaussJordan(&$aMatrix){
	//	get dimensions of matrix
	$nRowCount=Count($aMatrix);
	$nColCount=Count($aMatrix[1]);
	
	//	set pivot to first entry
	$aPivot=findNextPivot($aMatrix, 1,1);
	while ($aPivot!==0){	
		//	normalize the pivot row
		$nMultiplier=1/$aMatrix[$aPivot[0]][$aPivot[1]];
		if ($nMultiplier!==-1)
		{
			multiplyRow($aMatrix, $aPivot[0], $nMultiplier);
			displayMatrix($aMatrix);
		}
		
		//	kill entries in pivot columns
		for($nRow=1;$nRow<=$nRowCount;$nRow++)
		{
			if ($nRow!==$aPivot[0])
			{
				$nMultiplier=-$aMatrix[$nRow][$aPivot[1]];
				addMultipleOfRow($aMatrix, $nRow, $aPivot[0], $nMultiplier);
				displayMatrix($aMatrix);
			}
		}
		
		//	check if finished
		if (($aPivot[0]<$nRowCount)and($aPivot[1]<$nColCount))
		{
			$aPivot=findNextPivot($aMatrix, $aPivot[0]+1,$aPivot[1]+1);
		}
		else{return TRUE;}
	}
}


//	print a matrix
function displayMatrix(&$aMatrix,$inline=FALSE){
	//	get dimensions of matrix
	$nRowCount=Count($aMatrix);
	$nColCount=Count($aMatrix[1]);

	if ($inline)	{	echo "\\(";	}	else{echo "\\[";} 
	echo "\\left(\\begin{array}{";
	for ($nCol=1;$nCol<=$nColCount;$nCol++)
	{
		echo "r";
	}
	echo "}\r\n";
	for ($nRow=1;$nRow<=$nRowCount;$nRow++){
		$sRowToDisplay="";
		for ($nCol=1;$nCol<=$nColCount;$nCol++){
			$sToBeAdded=float2rat($aMatrix[$nRow][$nCol]);
			$sRowToDisplay.=($sToBeAdded."&");
		}
		$sRowToDisplay=substr($sRowToDisplay, 0,-1);
		echo $sRowToDisplay."\\\\ \r\n";
	}
	echo "\\end{array}\\right)";
	if ($inline) {echo "\\)";}else{echo "\\]";}
}
?>
