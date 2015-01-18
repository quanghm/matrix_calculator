/**
 * 
**/
float2rat = function(n, mathlook,tolerance) 
{
	var aux=0;
	var h1=0;
	var h2=0;
	var k1=0;
	var k2=0;
	var b=0;
	var a=0;
	if (tolerance==undefined) {tolerance=0.0001;}
	if (mathlook==undefined) {mathlook=true;}
	if (n==0)
	{
		return 0;
	}
	if (n==Math.floor(n))
	{return n;}
	if (n<0)
	{
		sign="-";
		n=-n;
	}
	else{sign="";}
	h1=1; h2=0;
	k1=0; k2=1;
	b = 1/n;
	do {
		b = 1/b;
		a = Math.floor(b);
		aux = h1; h1 = a*h1+h2; h2 = aux;
		aux = k1; k1 = a*k1+k2; k2 = aux;
		b = b-a;
	} while (abs(n-h1/k1) > n*tolerance);

	if (mathlook){return sign+'\\frac{'+h1+"}{"+k1+"}";}else{return sign+h1+'/'+k1;}
}

//	The matrix object
function matrix(aRequests,nAugmented) {
	//	dimension of matrix
	//	matrix dimensions
	this.rowCount=aRequests.length-1;
	this.colCount=aRequests[1].length-1;
	
	//	entries
	this.entries = aRequests;

	//	if this is not an augemented matrix, return 0.
	//	otherwise return the number of augemented columns
	this.augementedCols=nAugmented;

	//	array of entries
	//this.entries = [[]];

	//	set entries along with dimensions
	//this.__construct = function(){
		// if no augemented columns
		if (nAugmented==undefined) {nAugmented=0;}
	//}
		
	//	if this is a square matrix
	 this.isSquare = function(){
		return (this.rowCount==this.colCount);
	}

	/*	turn a matrix to an html-mathjax string
	 *		pivotRow=0: row to be highlighted
	 * 		inline=false:	if display formula inline
	 * 		mathlook=true:	use fraction or "/" for rational
	 */
	this.displayEntries = function(pivotRow,inline,mathlook)
	{
		//	set up variables
		if (pivotRow==undefined){pivotRow=0;}
		if (inline==undefined){inline=false;}
		if (mathlook==undefined){mathlook=true;}
		
		//	get dimensions of matrix
		var nRowCount=this.rowCount;
		var nColCount=this.colCount;
		augmentedCols=this.augementedCols;
		
		//	setting up output string
		sOutput = "";
		
		if (inline)	{	sOutput+="\\(";	}	else{sOutput+= "\\[";}
		sOutput+="\\left(\\begin{array}{";
		for (nCol=1;nCol<=nColCount;nCol++)
		{
			sOutput+="r";
			if ((augmentedCols>0)&&(nCol+augmentedCols==nColCount))	
			{
				sOutput+= "|";
			}
		}
		sOutput+="}\r\n";
		for (nRow=1;nRow<=nRowCount;nRow++)
		{
			sRowToDisplay="";
			 for (nCol=1;nCol<=nColCount;nCol++)
			 {
				sToBeAdded=float2rat(this.entries[nRow][nCol],mathlook);
				if (nRow==pivotRow){
					sToBeAdded="\\mathbf{"+sToBeAdded+"}";
				}
				if (nColCount-nCol<this.augementedCols)
				{
					sToBeAdded="\\color{blue}{"+sToBeAdded+"}";
				}
				sRowToDisplay+= (sToBeAdded+"&");
			}
			sRowToDisplay=substr(sRowToDisplay, 0,-1)+"\\\\ \r\n";
			sOutput+=sRowToDisplay;
		}
		sOutput+="\\end{array}\\right)";
		if (inline) {sOutput+="\\)";}else{sOutput+="\\]";}
		return sOutput;
	}
	
	
	/*	Elementary Row Operations	 */
	/*	Multiply a row by a number
	 *	nRow:	Row to by multiplied
	 *	nMultiplier: muliplier
	 */
	this.multiplyRow = function(nRow, nMultiplier)
	{
		//	Get number of columns
		var nColCount = this.colCount;
		
		//	if nRow is out of range
		if ((nRow>this.rowCount)||(nRow<1))
		{
			return("Wrong dimensions");
		}
		//	if not
		else
		{
			for (nCol=1;nCol<=nColCount;nCol++)
			{
				this.entries[nRow][nCol]=this.entries[nRow][nCol]*nMultiplier;
			}
			return "multiply Row "+nRow+" by \\("+float2rat(nMultiplier)+"\\)<br/>";
		}
	}
	
	/*	interchange two rows
	 * 
	 */
	this.interchangeRows = function(nRow1,nRow2)
	{
		//	get dimensions of matrix
		var tmp=[];
		if ((nRow1>this.rowCount)||(nRow2>this.rowCount)||(nRow1<1)||(nRow2<1))
		{
			return "Wrong dimensions";
		}
		else {
			tmp=this.entries[nRow1];
			this.entries[nRow1]=this.entries[nRow2];
			this.entries[nRow2]=tmp;
		}
		return("interchange Row "+nRow1+" and Row "+nRow2+"<br/>");
	}

	/*	add a multiple of a row to another row
	 * 
	 */
	this.addMultipleOfRow = function(nRowToBeModified,nRowToBeMultiplied,nMultiplier){
		var nRowCount=this.rowCount;
		var nColCount=this.colCount;
		if ((nRowToBeModified > nRowCount)||(nRowToBeMultiplied>nRowCount))
		{
			return("Wrong dimension");
		}
		else{
			for (nCol=1;nCol<=nColCount;nCol++){
				this.entries[nRowToBeModified][nCol]=parseFloat(this.entries[nRowToBeMultiplied][nCol]*nMultiplier)+parseFloat(this.entries[nRowToBeModified][nCol]);
			}
		}
		return("multiply Row "+nRowToBeMultiplied+" by \\("+float2rat(nMultiplier)+"\\) and add to Row "+nRowToBeModified+"<br>");
	}

	this.findNextPivot = function(nStartRow,nStartCol){
		//	get dimensions of matrix
		var nRowCount=this.rowCount;
		var nColCount=this.colCount-this.augementedCols;
	
		//	current position
		var currentRow=nStartRow;
		var currentCol=nStartCol;
		
		//	return object
		var result=new Object();
	
		for (currentCol=nStartCol+1;currentCol<=nColCount;currentCol++)
		{
			for (currentRow=nStartRow+1;currentRow<=nRowCount;currentRow++)
			{
				if (this.entries[currentRow][currentCol]!=0)
				{
					result[0]=currentRow;
					result[1]=currentCol;
					return result;
				}						
			}
		}
		return 0;
	}	
	
	//	Gauss
	this.doGauss = function(findDet)
	{
		//	disable determinant display
		if (findDet==undefined){findDet=false;}
		
		//	step count
		var nStepCount=0;
		
		//	get dimensions of matrix
		var nRowCount=this.rowCount;
		var nColCount=this.colCount;
	
		var nMultiplier=0;
		var sNextStepID="";
		
		//	set pivot to first entry
		var aPivot=[0,0];
		var aNewPivot=[];
		
		while (aPivot!=0)
		{
			aNewPivot=this.findNextPivot(aPivot[0],aPivot[1]);
			
			//	check if done
			if (aNewPivot==0){
				return 0;
			}
			
			//	jump more than one row
			if (aNewPivot[0]>aPivot[0]+parseFloat(1))
			{
				nStepCount++;
				sNextStepID = "Solution"+nStepCount;
				writeOutputToElement("explanation"+nStepCount,this.interchangeRows(aNewPivot[0], aPivot[0]+1));
				writeOutputToElement(sNextStepID,this.displayEntries());
			}
			
			//	new pivot
			aPivot[0]=aPivot[0]+parseFloat(1);
			aPivot[1]=aNewPivot[1];

			//	normalize the pivot row
			nMultiplier=this.entries[aPivot[0]][aPivot[1]];

			if (nMultiplier!=1)
			{
				nMultiplier=1/parseFloat(nMultiplier);
				nStepCount++;				
				writeOutputToElement("explanation"+nStepCount,this.multiplyRow(aPivot[0], nMultiplier));
				sNextStepID = "Solution"+nStepCount;
				writeOutputToElement(sNextStepID,this.displayEntries());
			}
	
			//	kill entries in pivot columns
			for (nRow=aPivot[0]+1; nRow<=nRowCount; nRow++)
			{
				if (this.entries[nRow][aPivot[1]]!=0)// && (this.entries[nRow][aPivot[1]]!=0))
				{
					nMultiplier=-this.entries[nRow][aPivot[1]];
					nStepCount++;				
					writeOutputToElement("Hello"+nStepCount,nRow+":"+nMultiplier+"<br/>");	
					writeOutputToElement("Explanation"+nStepCount,this.addMultipleOfRow(nRow, aPivot[0], nMultiplier));
					sNextStepID = "Solution"+nStepCount;
					writeOutputToElement(sNextStepID,this.displayEntries());
				}
			}
		}
	}
//	//	Gauss-Jordan
//	this.doGaussJordan = function(){
//			//	get dimensions of matrix
//		nRowCount=this.rowCount;
//		nColCount=this.colCount;
//	
//		//	set pivot to first entry
//		aPivot=[0,0];
//		while (aPivot!==0){
//			aNewPivot=this.findNextPivot(aPivot[0],aPivot[1]);
//			
//			//	check if done
//			if (aNewPivot==0){
//				return TRUE;
//			}
//			
//			//	jump more than one row
//			if (aNewPivot[0]>aPivot[0]+1)
//			{
//				this.interchangeRows(aNewPivot[0], aPivot[0]+1);
//				this.displayEntries(aPivot[0]);
//			}
//			
//			
//			//	new pivot
//			aPivot[0]+=1;
//			aPivot[1]=aNewPivot[1];
//
//			
//			//	normalize the pivot row
//			nMultiplier=1/this.entries[aPivot[0]][aPivot[1]];
//			if (nMultiplier!==1)
//			{
//				this.multiplyRow(aPivot[0], nMultiplier);
//				this.displayEntries(aPivot[0]);
//			}
//	
//			//	kill entries in pivot columns
//			(nRow=1;nRow<=nRowCount;nRow++)
//			{
//				if ((nRow!==aPivot[0])AND (this.entries[nRow][aPivot[0]]!==0) AND (this.entries[nRow][aPivot[0]]!==0))
//				{
//					nMultiplier=-this.entries[nRow][aPivot[1]];
//					this.addMultipleOfRow(nRow, aPivot[0], nMultiplier);
//					this.displayEntries(aPivot[0]);
//				}
//			}
//		}
//	}
//    this.findDet = function(){
//        //    Check square
//        if ((this.isSquare()))
//        {
//            return "Matrix is not square.";
//        }
//        
//        //	set augmented cols to 0
//        this.augementedCols=0;
//        
//        //  set det
//        nDet=1;
//        
//        //	Gauss
//        //	get dimensions of matrix
//        nRowCount=this.rowCount;
//        nColCount=this.colCount;
//        
//        //	set pivot to first entry
//        aPivot=[0,0];
//        while (aPivot!==0){
//        	document.write( "<hr/>");
//        	aNewPivot=this.findNextPivot(aPivot[0],aPivot[1]);
//        	//print_r($aNewPivot);
//        		
//        	//	check if done
//        	if (aNewPivot==0){
//        		return TRUE;
//        	}
//        		
//        	//	jump more than one row
//        	if (aNewPivot[0]>aPivot[0]+1)	{
//        	    nDet*=-1;
//        		this.interchangeRows(aNewPivot[0], aPivot[0]+1);
//        		document.write( '\(\color{red}{');
//        		if (nDet!==1){document.write( float2rat(nDet));}
//        		document.write( '}\det\)');
//        		this.displayEntries(aPivot[0],TRUE);
//        		document.write( "<br/>");
//        	}
//        		
//        		
//        	//	new pivot
//        	aPivot[0]+=1;
//        	aPivot[1]=aNewPivot[1];
//        
//        		
//        	//	normalize the pivot row
//        	nMultiplier=this.entries[aPivot[0]][aPivot[1]];
//        	if (nMultiplier!==1){
//        		nDet*=nMultiplier;
//        		this.multiplyRow(aPivot[0], 1/nMultiplier);
//	        	
//        		document.write( '\(\color{red}{');
//        		if (nDet!==1){document.write( float2rat(nDet));}
//        		document.write( '}\det\)');
//        		this.displayEntries(aPivot[0],TRUE);
//        		document.write( "<br/>");;
//        	}
//        
//        	//	kill entries in pivot columns
//        	(nRow=aPivot[0]+1;nRow<=nRowCount;nRow++){
//	        	if (this.entries[nRow][aPivot[0]]!==0){
//	        		nMultiplier=-this.entries[nRow][aPivot[1]];
//	        		this.addMultipleOfRow(nRow, aPivot[0], nMultiplier);
//	        		
//	        		document.write( '\(\color{red}{');
//	        		if (nDet!==1){document.write( float2rat(nDet));}
//	        		document.write( '}\det\)');
//	        		this.displayEntries(aPivot[0],TRUE);
//	        		document.write( "<br/>");
//	        	}
//	       	}
//        }
//        nDet*=this.entries[nRowCount][nColCount];
//        document.write( nDet);
//    }  
//}

//this.inverse = function(aMatrix){
//	matrix = new matrix(aMatrix);
//	if (matrix.isSquare()==FALSE){
//		return "Matrix is not square";
//	}
//	aNewMatrix=matrix.entries;
//	nSize = matrix.rowCount;
//	 (nRow=1;nRow<=nSize;nRow++)
//	{
//		newRow=array_fill(nSize+1,nSize,0);
//		 (nCol=nSize+1;nCol<=2*nSize;nCol++)
//		{
//			if (nCol-nRow==nSize)
//			{aNewMatrix[nRow][nCol]=1;}
//			else{aNewMatrix[nRow][nCol]=newRow[nCol];}
//		}
//	}
//	//print_r($aNewMatrix); die("");
//	matrix = new matrix(aNewMatrix,nSize);
//	matrix.displayEntries();
//	matrix.doGaussJordan();
//	if (matrix.entries[nSize][nSize]==1)
//	{
//	    return "invertible";
//	}
//	else 
//	{
//	    return "not invertible";
//	}

}

function writeOutputToElement(sElementID,sStringToAdd)
{
	$("<span/>",{
		id: sElementID,
		name:	sElementID,
		html: sStringToAdd		
	}).appendTo($("#outputDiv"));
	MathJax.Hub.Queue(["Typeset",MathJax.Hub,"outputDiv"]);
}