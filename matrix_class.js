/**
 * 
**/
function matrix(aRequests,nAugmented) {
	//	dimension of matrix
	this.rowCount;
	this.colCount;
	
	//	if this is not an augemented matrix, return 0.
	//	otherwise return the number of augemented columns
	this.augementedCols=nAugmented;

	//	array of entries
	this.entries = [[]];

	//	set entries along with dimensions
	//this.__construct = function(){
		// if no augemented columns
		if (nAugmented==undefined) {nAugmented=0;}
		
		//	matrix dimensions
		this.rowCount=count(aRequests);
		this.colCount=count(aRequests[1]);
		
		//	entries
		this.entries = aRequests;
		this.augementedCols=nAugmented;
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
	this.displayEntries = function(pivotRow,inline,mathLook){
		//	set up variables
		if (pivotRow==undefined){pivotRow=0;}
		if (inline==undefined){inline=false;}
		if (mathlook==undefined){mathlook=true;}
		
		
		//	get dimensions of matrix
		nRowCount=this.rowCount;
		nColCount=this.colCount;
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
			 for (nCol=1;nCol<=nColCount;nCol++){
				
				sToBeAdded=float2rat(this.entries[nRow][nCol],mathLook);
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
	
	
	
	//	Elementary Row Operations	
	this.multiplyRow = function(nRow,nMultiplier)
	{
		nColCount = this.colCount;
		if ((nRow>this.rowCount)||(nRow<1))
		{
			return("Wrong dimensions");
		}
		else
		{
			nColCount = count(this.entries[nRow]);
			for (nCol=1;nCol<=nColCount;nCol++)
			{
				this.entries[nRow][nCol]*=nMultiplier;
			}
			return "multiply Row "+nRow+"by \("+float2rat(nMultiplier)+"\)<br/>";
		}
	}
	
//	this.interchangeRows = function(nRow1,nRow2)
//	{
//		//	get dimensions of matrix
//	
//		if ((nRow1>this.rowCount) OR (nRow2>this.rowCount))
//		{
//			trigger_error("Wrong dimensions");
//			return FALSE;
//		}
//		else {
//			tmp=this.entries[nRow1];
//			this.entries[nRow1]=this.entries[nRow2];
//			this.entries[nRow2]=tmp;
//		}
//		document.write("interchange Row "+nRow1+" and Row "+nRow2+"<br/>");
//		return TRUE;
//	}
//
//	this.addMultipleOfRow = function(nRowToBeModified,nRowToBeMultiplied,nMultiplier){
//		nRowCount=this.rowCount;
//		nColCount=this.colCount;
//		if ((nRowToBeModified > nRowCount) OR (nRowToBeMultiplied>nRowCount)){
//			trigger_error("Wrong dimension");
//			return FALSE;
//		}
//		else{
//			 (nCol=1;nCol<=nColCount;nCol++){
//				this.entries[nRowToBeModified][nCol]+=this.entries[nRowToBeMultiplied][nCol]*nMultiplier;
//			}
//		}
//		document.write("multiply Row "+nRowToBeMultiplied+"by \("+float2rat(nMultiplier)+"\) and add to Row "+nRowToBeModified+"<br>");
//		return TRUE;
//	}
//	 this.findNextPivot = function(nStartRow,nStartCol){
//		//	get dimensions of matrix
//		nRowCount=this.rowCount;
//		nColCount=this.colCount-this.augementedCols;
//	
//		//	current position
//		currentRow=nStartRow;
//		currentCol=nStartCol;
//	
//		 (currentCol=nStartCol+1;currentCol<=nColCount;currentCol++)
//		{
//			 (currentRow=nStartRow+1;currentRow<=nRowCount;currentRow++)
//			{
//				if (this.entries[currentRow][currentCol]!==0)
//				{
//					aPivot=[currentRow,currentCol];
//					return aPivot;
//				}						
//			}
//		}
//		return 0;
//	}
//	
	
//	
//	//	Gauss
//	this.doGauss = function(findDet=FALSE){
//		//	get dimensions of matrix
//		nRowCount=this.rowCount;
//		nColCount=this.colCount;
//	
//		//	set pivot to first entry
//		aPivot=[0,0];
//		while (aPivot!==0){
//			document.write( "<hr/>");
//			aNewPivot=this.findNextPivot(aPivot[0],aPivot[1]);
//			//print_r($aNewPivot);
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
//				this.displayEntries();
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
//				this.displayEntries();
//			}
//	
//			//	kill entries in pivot columns
//			(nRow=aPivot[0]+1;nRow<=nRowCount;nRow++)
//			{
//				if ((this.entries[nRow][aPivot[1]]!==0) AND (this.entries[nRow][aPivot[1]]!==0))
//				{
//					nMultiplier=-this.entries[nRow][aPivot[1]];
//					this.addMultipleOfRow(nRow, aPivot[0], nMultiplier);
//					this.displayEntries();
//				}
//			}
//		}
//	}
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

this.float2rat = function(n, mathLook,tolerance) {
	if (tolerance==undefined) {tolerance=0.00001;}
	if (mathlook==undefined) {mathlook=true;}
	if (n==0)
	{
		return 0;
	}
	if (n==floor(n))
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
	 {
		b = 1/b;
		a = floor(b);
		aux = h1; h1 = a*h1+h2; h2 = aux;
		aux = k1; k1 = a*k1+k2; k2 = aux;
		b = b-a;
	} while (abs(n-h1/k1) > n*tolerance);

	if (mathLook){return sign+'\frac{'+h1+"}{"+k1+"}";}else{return sign+h1+'/'+k1;}
}

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