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
	var sign="";
	if (tolerance==undefined) {tolerance=0.00001;}
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
	} while (abs(n-h1/k1) > tolerance);

	if (h1==0) {return 0;}
	if (k1==1) {return sign+h1;}
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
	this.augementedCols=(nAugmented==undefined)?(0):(nAugmented);

	// if no augemented columns


		
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
			if (nMultiplier==-1){
				return "<div class='explanation'>Change sign of Row "+nMultiplier+"</div>";
			}
			if (Number.isInteger(1/nMultiplier)){
				return "<div class='explanation'> Divide Row "+nRow+" by \\("+float2rat(1/nMultiplier)+"\\)</div>"
			}
			return "<div class='explanation'>Multiply Row "+nRow+" by \\("+float2rat(nMultiplier)+"\\)</div>";
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
		return("<div class='explanation'>interchange Row "+nRow1+" and Row "+nRow2+"</div>");
	}

	/*	add a multiple of a row to another row 	 */
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
			if (nMultiplier==-1){
				return("<div class='explanation'>Substract Row "+nRowToBeMultiplied+" from Row "+nRowToBeModified+"</div>");
			}
			if (nMultiplier==1){
				return("<div class='explanation'>Add Row "+nRowToBeMultiplied+" to Row "+nRowToBeModified+"</div>");
			}
			if (nMultiplier<0){
				if (Number.isInteger(1/nMultiplier)){
					return ("<div class='explanation'>Divide Row "+nRowToBeMultiplied+" by \\("+float2rat(-1/nMultiplier)+"\\) and substract from Row "+nRowToBeModified+"</div>");
				}
				else {
					return ("<div class='explanation'>Multiply Row "+nRowToBeMultiplied+" by \\("+float2rat(-nMultiplier)+"\\) and substract from Row "+nRowToBeModified+"</div>");
				}
			}
			else{
				if (Number.isInteger(1/nMultiplier)){
					return ("<div class='explanation'>Divide Row "+nRowToBeMultiplied+" by \\("+float2rat(nMultiplier)+"\\) and add to Row "+nRowToBeModified+"</div>");
				}
				else{
					return("<div class='explanation'>Multiply Row "+nRowToBeMultiplied+" by \\("+float2rat(nMultiplier)+"\\) and add to Row "+nRowToBeModified+"</div>")	;	
				}
			}
			
					
		}

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
				return "Row Echelon Form:<br/>"+this.displayEntries();
			}
			
			//	jump more than one row
			if (aNewPivot[0]>aPivot[0]+parseFloat(1))
			{
				nStepCount++;
				sNextStepID = "step"+nStepCount;
				sStepOutput=this.interchangeRows(aNewPivot[0], aPivot[0]+1);
				sStepOutput+=this.displayEntries(aPivot[0]+1);
				writeOutputToElement(sNextStepID,sStepOutput,"step");
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
				sNextStepID = "step"+nStepCount;
				sStepOutput=this.multiplyRow(aPivot[0], nMultiplier);
				sStepOutput+=this.displayEntries(aPivot[0]);
				writeOutputToElement(sNextStepID,sStepOutput,"step");
			}
			
			//	kill entries in pivot columns
			for (row=aPivot[0]+1;row<=nRowCount;row++) 
			{
				if (this.entries[row][aPivot[1]]!=0)// && (this.entries[nRow][aPivot[1]]!=0))
				{
					nMultiplier=-this.entries[row][aPivot[1]];
					nStepCount++;
					sNextStepID = "step"+nStepCount;
					sStepOutput=this.addMultipleOfRow(row, aPivot[0], nMultiplier);
					sStepOutput+=this.displayEntries(aPivot[0]);
					writeOutputToElement(sNextStepID,sStepOutput,"step");
				}
			}
		}
	}
//	//	Gauss-Jordan
	this.doGaussJordan = function(findDet)
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
				return "Row Echelon Form:<br/>"+this.displayEntries();
			}
			
			//	jump more than one row
			if (aNewPivot[0]>aPivot[0]+parseFloat(1))
			{
				nStepCount++;
				sNextStepID = "step"+nStepCount;
				sStepOutput=this.interchangeRows(aNewPivot[0], aPivot[0]+1);
				sStepOutput+=this.displayEntries(aPivot[0]+1);
				writeOutputToElement(sNextStepID,sStepOutput,"step");
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
				sNextStepID = "step"+nStepCount;
				sStepOutput=this.multiplyRow(aPivot[0], nMultiplier);
				sStepOutput+=this.displayEntries(aPivot[0]);
				writeOutputToElement(sNextStepID,sStepOutput,"step");
			}
			
			//	kill entries in pivot columns
			for (row=1;row<=nRowCount;row++) 
			{
				if ((this.entries[row][aPivot[1]]!=0) && (row!=aPivot[0]))
				{
					nMultiplier=-this.entries[row][aPivot[1]];
					nStepCount++;
					sNextStepID = "step"+nStepCount;
					sStepOutput=this.addMultipleOfRow(row, aPivot[0], nMultiplier);
					sStepOutput+=this.displayEntries(aPivot[0]);
					writeOutputToElement(sNextStepID,sStepOutput,"step");
				}
			}
		}
	}

   this.findDet = function()
	{
	   	//	determinant
		var nDet=1;	
		//	det display
		var sDet="";
		
		//	step count
		var nStepCount=0;
		
		//	get dimensions of matrix
		var nRowCount=this.rowCount;
		var nColCount=this.colCount;
	
		var nMultiplier=0;
		var sNextStepID="";
		var sStepOutput="";
		
		//	set pivot to first entry
		var aPivot=[0,0];
		var aNewPivot=[];
		
		if (!(this.isSquare())){return "This is not a square matrix";}
		while (aPivot!=0)
			{
			aNewPivot=this.findNextPivot(aPivot[0],aPivot[1]);
			
			//	check if done
			if (aNewPivot==0){
				break;
			}
			
			//	jump more than one row
			if (aNewPivot[0]>aPivot[0]+parseFloat(1))
			{
				nStepCount++;
				sNextStepID = "step"+nStepCount;
				sStepOutput=this.interchangeRows(aNewPivot[0], aPivot[0]+1);
				nDet*=-1;
				switch ( nDet ){
					case 1:
						sDet="\\(\\det\\)";
						break;
					case -1:
						sDet="\\(-\\det\\)";
						break;
					default:
						sDet="\\("+float2rat(nDet)+"\\det\\)";
				}
				sStepOutput+=("<div class='matrixEntries'>"+sDet+this.displayEntries(aPivot[0],true)+"</div>");
				writeOutputToElement(sNextStepID,sStepOutput,"step");
			}
			
			//	new pivot
			aPivot[0]=aPivot[0]+parseFloat(1);
			aPivot[1]=aNewPivot[1];

			//	normalize the pivot row
			nMultiplier=this.entries[aPivot[0]][aPivot[1]];
			//	new det
			nDet*=nMultiplier;
			
			if (nMultiplier!=1)
			{
				nMultiplier=1/parseFloat(nMultiplier);
				nStepCount++;	
				sNextStepID = "step"+nStepCount;
				sStepOutput=this.multiplyRow(aPivot[0], nMultiplier);

				//	display det
				switch ( nDet ){
					case 1:
						sDet="\\(\\det\\)";
						break;
					case -1:
						sDet="\\(-\\det\\)";
						break;
					default:
						sDet="\\("+float2rat(nDet)+"\\det\\)";
				}
				sStepOutput+=("<div class='matrixEntries'>"+sDet+this.displayEntries(aPivot[0],true)+"</div>");
				writeOutputToElement(sNextStepID,sStepOutput,"step");
			}
			
			//	kill entries in pivot columns
			for (row=aPivot[0]+1;row<=nRowCount;row++) 
			{
				if (this.entries[row][aPivot[1]]!=0)// && (this.entries[nRow][aPivot[1]]!=0))
				{
					nMultiplier=-this.entries[row][aPivot[1]];
					nStepCount++;	
					sNextStepID="step"+nStepCount;
					sStepOutput=this.addMultipleOfRow(row, aPivot[0], nMultiplier);
					sStepOutput+=("<div class='matrixEntries'>"+sDet+this.displayEntries(aPivot[0],true)+"</div>");
					writeOutputToElement(sNextStepID,sStepOutput,"step");
				}
			}
		}
		return float2rat(nDet);
	}
}
inverse = function(aMatrix){
	augmentedMatrix = new matrix(aMatrix);
	if (augmentedMatrix.isSquare()==false){
		return "Matrix is not square";
	}
	aNewMatrix=augmentedMatrix.entries;
	nSize = augmentedMatrix.rowCount;
	for (row=1;row<=nSize;row++)
	{
		newRow=array_fill(nSize+1,nSize,0);
		for (col=nSize+1;col<=2*nSize;col++)
		{
			if (col-row==nSize)
			{aNewMatrix[row][col]=1;}
			else{aNewMatrix[row][col]=newRow[col];}
		}
	}
	augmentedMatrix = new matrix(aNewMatrix,nSize);
	writeOutputToElement("augemented_matrix",augmentedMatrix.displayEntries(),"step");
	augmentedMatrix.doGaussJordan();
	if (float2rat(augmentedMatrix.entries[nSize][nSize])==1)
	{
	    return "invertible";
	}
	else 
	{
	    return "not invertible";
	}
}


function writeOutputToElement(sElementID,sStringToAdd,sClass)
{
	if (sClass==undefined){sClass="";}
	$("<div/>",{
		id: sElementID,
		name: sElementID,
		html: sStringToAdd,
		class: sClass
	}).appendTo($("#slider"));
	MathJax.Hub.Queue(["Typeset",MathJax.Hub,sElementID]);
}