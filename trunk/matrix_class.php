<?php
class matrix{
	//	dimension of matrix
	public $rowCount=0;
	public $colCount=0;

	//	if this is a square matrix
	public function isSquare(){
		return ($this->rowCount==$this->colCount);
	}

	//	if this is not an augemented matrix, return 0.
	//	otherwise return the number of augemented columns
	public $augementedCols=0;

	//	array of entries
	public $entries= [[]];

	//	set entries along with dimensions
	function __construct(&$aRequests,$nAugmented=0){
		$this->rowCount=count($aRequests);
		$this->colCount=count($aRequests[1]);

		$this->entries = $aRequests;
		$this->augementedCols=$nAugmented;
	}

	//	Elementary Row Operations	
	function multiplyRow($nRow,$nMultiplier)
	{
		$nColCount = $this->colCount;
		if ($nRow>$this->rowCount or $nRow<1)
		{
			trigger_error("Wrong dimensions");
			return FALSE;
		}
		else{
			$nColCount = count($this->entries[$nRow]);
			for ($nCol=1;$nCol<=$nColCount;$nCol++)
			{
				$this->entries[$nRow][$nCol]*=$nMultiplier;
			}
			echo "multiply Row $nRow by \(".float2rat($nMultiplier)."\)<br/>";
			return TRUE;
		}
	}
	
	function interchangeRows($nRow1,$nRow2)
	{
		//	get dimensions of matrix
	
		if (($nRow1>$this->rowCount) or ($nRow2>$this->rowCount))
		{
			trigger_error("Wrong dimensions");
			return FALSE;
		}
		else {
			$tmp=$this->entries[$nRow1];
			$this->entries[$nRow1]=$this->entries[$nRow2];
			$this->entries[$nRow2]=$tmp;
		}
		echo "interchange Row $nRow1 and Row $nRow2<br/>";
		return TRUE;
	}

	function addMultipleOfRow($nRowToBeModified,$nRowToBeMultiplied,$nMultiplier){
		$nRowCount=$this->rowCount;
		$nColCount=$this->colCount;
		if (($nRowToBeModified > $nRowCount) or ($nRowToBeMultiplied>$nRowCount)){
			trigger_error("Wrong dimension");
			return FALSE;
		}
		else{
			for ($nCol=1;$nCol<=$nColCount;$nCol++){
				$this->entries[$nRowToBeModified][$nCol]+=$this->entries[$nRowToBeMultiplied][$nCol]*$nMultiplier;
			}
		}
		echo "multiply Row $nRowToBeMultiplied by \(".float2rat($nMultiplier)."\) and add to Row $nRowToBeModified<br/>";
		return TRUE;
	}
	function findNextPivot($nStartRow,$nStartCol){
		//	get dimensions of matrix
		$nRowCount=$this->rowCount;
		$nColCount=$this->colCount-$this->augementedCols;
	
		//	current position
		$currentRow=$nStartRow;
		$currentCol=$nStartCol;
	
		for ($currentCol=$nStartCol+1;$currentCol<=$nColCount;$currentCol++)
		{
			for ($currentRow=$nStartRow+1;$currentRow<=$nRowCount;$currentRow++)
			{
				if ($this->entries[$currentRow][$currentCol]!==(float)0)
				{
					$aPivot=[$currentRow,$currentCol];
					return $aPivot;
				}						
			}
		}
		//$aPivot=[$nStartRow,$nStartCol];
		return 0;
	}
	
	function displayEntries($inline=FALSE,$mathLook=TRUE){
		//	get dimensions of matrix
		$nRowCount=$this->rowCount;
		$nColCount=$this->colCount;
		$augmentedCols=$this->augementedCols;
	
		if ($inline)	{	echo "\\(";	}	else{echo "\\[";}
		echo "\\left(\\begin{array}{";
		for ($nCol=1;$nCol<=$nColCount;$nCol++)
		{
			echo "r";
			if (($augmentedCols>0) and ($nCol+$augmentedCols==$nColCount))
			{echo "|";}
		}
		echo "}\r\n";
		for ($nRow=1;$nRow<=$nRowCount;$nRow++){
			$sRowToDisplay="";
			for ($nCol=1;$nCol<=$nColCount;$nCol++){
				$sToBeAdded=float2rat($this->entries[$nRow][$nCol],1.e-6,$mathLook);
				if ($nColCount-$nCol<$this->augementedCols)
				{
					$sToBeAdded="\\color{blue}{".$sToBeAdded."}";
				}
				$sRowToDisplay.=($sToBeAdded."&");
			}
			$sRowToDisplay=substr($sRowToDisplay, 0,-1);
			echo $sRowToDisplay."\\\\ \r\n";
		}
		echo "\\end{array}\\right)";
		if ($inline) {echo "\\)";}else{echo "\\]";}
	}
	
	//	Gauss
	function doGauss(){
		//	get dimensions of matrix
		$nRowCount=$this->rowCount;
		$nColCount=$this->colCount;
	
		//	set pivot to first entry
		$aPivot=[0,0];
		while ($aPivot!==0){
			echo "<hr/>";
			$aNewPivot=$this->findNextPivot($aPivot[0],$aPivot[1]);
			//print_r($aNewPivot);
			
			//	check if done
			if ($aNewPivot==0){
				return TRUE;
			}
			
			//	jump more than one row
			if ($aNewPivot[0]>$aPivot[0]+1)
			{
				$this->interchangeRows($aNewPivot[0], $aPivot[0]+1);
				$this->displayEntries();
			}
			
			
			//	new pivot
			$aPivot[0]+=1;
			$aPivot[1]=$aNewPivot[1];

			
			//	normalize the pivot row
			$nMultiplier=1/$this->entries[$aPivot[0]][$aPivot[1]];
			if ($nMultiplier!==1)
			{
				$this->multiplyRow($aPivot[0], $nMultiplier);
				$this->displayEntries();
			}
	
			//	kill entries in pivot columns
			for($nRow=$aPivot[0]+1;$nRow<=$nRowCount;$nRow++)
			{
				if ($this->entries[$nRow][$aPivot[0]]!=='0')
				{
					$nMultiplier=-$this->entries[$nRow][$aPivot[1]];
					$this->addMultipleOfRow($nRow, $aPivot[0], $nMultiplier);
					$this->displayEntries();
				}
			}
		}
	}
	//	Gauss-Jordan
	function doGaussJordan(){
			//	get dimensions of matrix
		$nRowCount=$this->rowCount;
		$nColCount=$this->colCount;
	
		//	set pivot to first entry
		$aPivot=[0,0];
		while ($aPivot!==0){
			$aNewPivot=$this->findNextPivot($aPivot[0],$aPivot[1]);
			
			//	check if done
			if ($aNewPivot==0){
				return TRUE;
			}
			
			//	jump more than one row
			if ($aNewPivot[0]>$aPivot[0]+1)
			{
				$this->interchangeRows($aNewPivot[0], $aPivot[0]+1);
				$this->displayEntries();
			}
			
			
			//	new pivot
			$aPivot[0]+=1;
			$aPivot[1]=$aNewPivot[1];

			
			//	normalize the pivot row
			$nMultiplier=1/$this->entries[$aPivot[0]][$aPivot[1]];
			if ($nMultiplier!==1)
			{
				$this->multiplyRow($aPivot[0], $nMultiplier);
				$this->displayEntries();
			}
	
			//	kill entries in pivot columns
			for($nRow=1;$nRow<=$nRowCount;$nRow++)
			{
				if (($nRow!==$aPivot[0])and ($this->entries[$nRow][$aPivot[0]]!=='0'))
				{
					$nMultiplier=-$this->entries[$nRow][$aPivot[1]];
					$this->addMultipleOfRow($nRow, $aPivot[0], $nMultiplier);
					$this->displayEntries();
				}
			}
		}
	}
}

function float2rat($n, $tolerance = 1.e-6,$mathLook=TRUE) {
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

	if ($mathLook){return "$sign\\frac{".$h1."}{".$k1."}";}else{return "$sign$h1/$k1";}
}

function inverse(&$aMatrix){
	$matrix = new matrix($aMatrix);
	if ($matrix->isSquare()==FALSE){
		return "Matrix is not square";
	}
	$aNewMatrix=$matrix->entries;
	$nSize = $matrix->rowCount;
	for ($nRow=1;$nRow<=$nSize;$nRow++)
	{
		$newRow=array_fill($nSize+1,$nSize,0);
		for ($nCol=$nSize+1;$nCol<=2*$nSize;$nCol++)
		{
			if ($nCol-$nRow==$nSize)
			{$aNewMatrix[$nRow][$nCol]=1;}
			else{$aNewMatrix[$nRow][$nCol]=$newRow[$nCol];}
		}
	}
	//print_r($aNewMatrix); die("");
	$matrix = new matrix($aNewMatrix,$nSize);
	$matrix->displayEntries();
	$matrix->doGaussJordan();
}
?>