/**
 * 
 */
function float2rat(n, mathlook, tolerance) {
	var aux = 0;
	var h1 = 0;
	var h2 = 0;
	var k1 = 0;
	var k2 = 0;
	var b = 0;
	var a = 0;
	var sign = "";
	if (tolerance === undefined) {
		tolerance = 0.00001;
	}
	if (mathlook === undefined) {
		mathlook = "display";
	}
	if (n == 0) {
		return 0;
	}
	if (n == Math.floor(n)) {
		return n;
	}
	if (n < 0) {
		sign = (mathlook === "none") ? "&#8722;" : "-";
		n = -n;
	} else {
		sign = "";
	}
	h1 = 1;
	h2 = 0;
	k1 = 0;
	k2 = 1;
	b = 1 / n;
	do {
		b = 1 / b;
		a = Math.floor(b);
		aux = h1;
		h1 = a * h1 + h2;
		h2 = aux;
		aux = k1;
		k1 = a * k1 + k2;
		k2 = aux;
		b = b - a;
	} while (abs(n - h1 / k1) > tolerance);

	if (h1 == 0) {
		return 0;
	}
	if (k1 == 1) {
		return sign + h1;
	}
	if (mathlook == "none") {
		return '<span style="vertical-align:10px;">' + sign
				+ ' </span><span class="frac"><sup>' + h1
				+ '</sup><span>/</span><sub>' + k1 + '</sub></span>';
	} else {
		return sign + '\\frac{' + h1 + "}{" + k1 + "}";
		// return sign + h1 + '/' + k1;
	}
}

// The matrix object
var matrix = function(aRequests, nAugmented) {
	// chaining puposese
	var oThis = this;
	// dimension of matrix
	// matrix dimensions
	this.rowCount = aRequests.length - 1;
	this.colCount = aRequests[1].length - 1;

	// entries
	this.entries = aRequests;

	// if this is not an augemented matrix, return 0.
	// otherwise return the number of augemented columns
	this.augementedCols = (nAugmented == undefined) ? (0) : (nAugmented);

	// if no augemented columns

	// if this is a square matrix
	this.isSquare = function() {
		return (this.rowCount == this.colCount);
	}

	// transpose of the matrix
	this.transpose = function() {
		var aTranspose = [];
		var nRowCount = this.rowCount;
		var nColCount = this.colCount;
		for (var row = 1; row <= nColCount; row++) {
			aTranspose[row] = [];
			for (var col = 1; col <= nRowCount; col++) {
				aTranspose[row][col] = this.entries[col][row];
			}
		}
		writeOutputToElement('original_matrix', "Original Matrix", this
				.displayEntries(), "step");
		return matrix(aTranspose);
	}

	this.print = function(oConfig) {
		/*
		 * display option: mathlook = display => display matrix (default);
		 * mathlook = inline => inline math; mathlook = none => no mathjax;
		 */
		if (oConfig === undefined) {
			oConfig = {};
		}
		if (!oConfig.hasOwnProperty("mathlook")) {
			oConfig.mathlook = "display";
		}
		/*
		 * delimeter option: delimeter = | ; delimeter = ( ; (default) delimeter = [ ;
		 */
		if (!oConfig.hasOwnProperty("delimeter")) {
			oConfig.delimeter = "(";
		}

		if (!oConfig.hasOwnProperty("pivot")) {
			oConfig.pivot = 0;
		}

		if (!oConfig.hasOwnProperty("targetRow")) {
			oConfig.targetRow = 0;
		}

		// matrix dimesion
		var nRowCount = this.rowCount;
		var nColCount = this.colCount;
		var nAugCols = this.augementedCols;

		var sRowToDisplay = ""; // temporary row string
		var sEntryToDisplay = ""; // temporary entry string
		var sOutput = ''; // output html string

		if (oConfig.mathlook !== "none") {
			sOutput = "\\begin{array}{";
			for (var nCol = 1; nCol <= nColCount; nCol++) {
				sOutput += "r";
				if ((nAugCols > 0) && (nCol + nAugCols * 1 == nColCount)) {
					sOutput += "|";
				}
			}
			sOutput += "}\r\n";

			for (var nRow = 1; nRow <= nRowCount; nRow++) {
				sRowToDisplay = "";
				for (var nCol = 1; nCol <= nColCount; nCol++) {
					sEntryToDisplay = float2rat(this.entries[nRow][nCol],
							oConfig.mathlook);
					if ((oConfig.pivot !== 0) && (nRow == oConfig.pivot[0])) {
						if (nCol == oConfig.pivot[1]) {
							sEntryToDisplay = "\\mathbf{" + sEntryToDisplay
									+ "}";
						}
						sEntryToDisplay = "\\color{brown}{" + sEntryToDisplay
								+ "}";
					}
					if (nRow == oConfig.targetRow) {
						sEntryToDisplay = "\\color{blue}{" + sEntryToDisplay
								+ "}";
					}
					sRowToDisplay += (sEntryToDisplay + "&");
				}
				sRowToDisplay = sRowToDisplay.substring(0,
						sRowToDisplay.length - 1)
						+ "\\\\ \r\n";
				sOutput += sRowToDisplay;
			}
			sOutput += "\\end{array}";
			switch (oConfig.delimeter) {
				case "(" :
					sOutput = "\\(\\left(" + sOutput + "\\right)\\)";
					break;
				case "|" :
					sOutput = "\\(\\left|" + sOutput + "\\right|\\)";
					break;
				case "[" :
					sOutput = "\\(\\left[" + sOutput + "\\right]\\)";
					break
			}
		} else {
			sOutput = "<table class='tbl-matrix'>";
			for (var nRow = 1; nRow <= nRowCount; nRow++) {
				sOutput += "<tr class='tr-matrix'>";
				for (var nCol = 1; nCol <= nColCount; nCol++) {
					sOutput += ("<td class='td-matrix'>"
							+ float2rat(this.entries[nRow][nCol],
									oConfig.mathlook) + "</td>");
				}
				sOutput += "</tr>";
			}
			sOutput += "</table>"
		}
		// console.log(sOutput);
		return sOutput;
	}

	/*
	 * turn a matrix to an html-mathjax string pivotRow=0: row to be highlighted
	 * inline=false: if display formula inline mathlook=true: use fraction or
	 * "/" for rational
	 */
	this.displayEntries = function(pivotRow, inline, mathlook) {
		// set up variables
		if (pivotRow === undefined) {
			pivotRow = 0;
		}
		if (inline === undefined) {
			inline = false;
		}
		if (mathlook === undefined) {
			mathlook = true;
		}
		// mathlook: inline, display, none

		// get dimensions of matrix
		var nRowCount = this.rowCount;
		var nColCount = this.colCount;
		var augmentedCols = this.augementedCols;

		// setting up output string
		var sOutput = "";

		if (inline) {
			sOutput += "\\(";
		} else {
			sOutput += "\\(\\displaystyle";
		}
		sOutput += "\\left(\\begin{array}{";
		for (var nCol = 1; nCol <= nColCount; nCol++) {
			sOutput += "r";
			if ((augmentedCols > 0) && (nCol + augmentedCols * 1 === nColCount)) {
				sOutput += "|";
			}
		}
		sOutput += "}\r\n";
		for (nRow = 1; nRow <= nRowCount; nRow++) {
			sRowToDisplay = "";
			for (nCol = 1; nCol <= nColCount; nCol++) {
				sToBeAdded = float2rat(this.entries[nRow][nCol], mathlook);
				if (nRow == pivotRow) {
					sToBeAdded = "\\mathbf{" + sToBeAdded + "}";
				}
				if (nColCount - nCol < this.augementedCols) {
					sToBeAdded = "\\color{blue}{" + sToBeAdded + "}";
				}
				sRowToDisplay += (sToBeAdded + "&");
			}
			sRowToDisplay = sRowToDisplay
					.substring(0, sRowToDisplay.length - 1)
					+ "\\\\ \r\n";
			sOutput += sRowToDisplay;
		}
		sOutput += "\\end{array}\\right)\\)";
		return sOutput;
	}

	/* Elementary Row Operations */
	/*
	 * Multiply a row by a number nRow: Row to by multiplied nMultiplier:
	 * muliplier
	 */
	this.multiplyRow = function(nRow, nMultiplier) {
		// Get number of columns
		var nColCount = this.colCount;

		// if nRow is out of range
		if ((nRow > this.rowCount) || (nRow < 1)) {
			return ("Wrong dimensions");
		}
		// if not
		else {
			for (nCol = 1; nCol <= nColCount; nCol++) {
				this.entries[nRow][nCol] = this.entries[nRow][nCol]
						* nMultiplier;
			}
			if (nMultiplier == -1) {
				return "Invert the sign of Row " + nMultiplier;
			}
			if (Math.round(1 / nMultiplier) == 1 / nMultiplier) {
				return " Divide Row " + nRow + " by \\("
						+ float2rat(1 / nMultiplier) + "\\)"
			}
			return "Multiply Row " + nRow + " by \\(" + float2rat(nMultiplier)
					+ "\\)";
		}
	}

	/*
	 * interchange two rows
	 * 
	 */
	this.interchangeRows = function(nRow1, nRow2) {
		// get dimensions of matrix
		var tmp = [];
		if ((nRow1 > this.rowCount) || (nRow2 > this.rowCount) || (nRow1 < 1)
				|| (nRow2 < 1)) {
			return "Wrong dimensions";
		} else {
			tmp = this.entries[nRow1];
			this.entries[nRow1] = this.entries[nRow2];
			this.entries[nRow2] = tmp;
		}
		return ("Interchange Row " + nRow1 + " and Row " + nRow2);
	}

	/* add a multiple of a row to another row */
	this.addMultipleOfRow = function(nRowToBeModified, nRowToBeMultiplied,
			nMultiplier) {
		var nRowCount = this.rowCount;
		var nColCount = this.colCount;
		if ((nRowToBeModified > nRowCount) || (nRowToBeMultiplied > nRowCount)) {
			return ("Wrong dimension");
		} else {
			for (nCol = 1; nCol <= nColCount; nCol++) {
				this.entries[nRowToBeModified][nCol] = parseFloat(this.entries[nRowToBeMultiplied][nCol]
						* nMultiplier)
						+ parseFloat(this.entries[nRowToBeModified][nCol]);
			}
			if (nMultiplier == -1) {
				return ("Substract Row " + nRowToBeMultiplied + " from Row " + nRowToBeModified);
			}
			if (nMultiplier == 1) {
				return ("Add Row " + nRowToBeMultiplied + " to Row " + nRowToBeModified);
			}
			if (nMultiplier < 0) {
				if ((1 / nMultiplier) == Math.round(1 / nMultiplier)) {
					return ("Divide Row " + nRowToBeMultiplied + " by \\("
							+ float2rat(-1 / nMultiplier)
							+ "\\) and substract from Row " + nRowToBeModified);
				} else {
					return ("Multiply Row " + nRowToBeMultiplied + " by \\("
							+ float2rat(-nMultiplier)
							+ "\\) and substract from Row " + nRowToBeModified);
				}
			} else {
				if ((1 / nMultiplier) == Math.round(1 / nMultiplier)) {
					return ("Divide Row " + nRowToBeMultiplied + " by \\("
							+ float2rat(nMultiplier) + "\\) and add to Row " + nRowToBeModified);
				} else {
					return ("Multiply Row " + nRowToBeMultiplied + " by \\("
							+ float2rat(nMultiplier) + "\\) and add to Row " + nRowToBeModified);
				}
			}

		}

	}

	this.findNextPivot = function(nStartRow, nStartCol) {
		// get dimensions of matrix
		var nRowCount = this.rowCount;
		var nColCount = this.colCount - this.augementedCols;

		// current position
		var currentRow = nStartRow;
		var currentCol = nStartCol;

		// return object
		var result = new Object();

		for (currentCol = nStartCol + 1; currentCol <= nColCount; currentCol++) {
			for (currentRow = nStartRow + 1; currentRow <= nRowCount; currentRow++) {
				if (this.entries[currentRow][currentCol] != 0) {
					result[0] = currentRow;
					result[1] = currentCol;
					return result;
				}
			}
		}
		return 0;
	}

	// Gauss
	this.ref = function(findDet) {
		// disable determinant display
		if (findDet == undefined) {
			findDet = false;
		}

		// step count
		var nStepCount = 0;
		var sExplanation = "";
		var sStepOutput = "";

		// get dimensions of matrix
		var nRowCount = this.rowCount;
		var nColCount = this.colCount;

		var nMultiplier = 0;
		var sNextStepID = "";

		// set pivot to first entry
		var aPivot = [0, 0];
		var aNewPivot = [];

		while (aPivot != 0) {
			aNewPivot = this.findNextPivot(aPivot[0], aPivot[1]);

			// check if done
			if (aNewPivot == 0) {
				return this.print();
			}

			nStepCount++;
			sNextStepID = "step" + nStepCount;
			// sStepOutput = " + ")</div>";
			sExplanation = "Found new pivot at entry (" + aNewPivot[0] + ","
					+ aNewPivot[1] + ")";
			writeOutputToElement(sNextStepID, sExplanation, this.print({
				pivot : aNewPivot
			}), "step");

			// jump more than one row
			if (aNewPivot[0] > aPivot[0] + parseFloat(1)) {
				nStepCount++;
				sNextStepID = "step" + nStepCount;
				writeOutputToElement(sNextStepID, this.interchangeRows(
						aNewPivot[0], aPivot[0] + 1), this.print({
					pivot : [aPivot[0] + 1, aNewPivot[1]],
					targetRow : aNewPivot[0]
				}), "step");
			}

			// new pivot
			aPivot[0] = aPivot[0] + parseFloat(1);
			aPivot[1] = aNewPivot[1];

			// normalize the pivot row
			nMultiplier = this.entries[aPivot[0]][aPivot[1]];

			if (nMultiplier != 1) {
				nMultiplier = 1 / parseFloat(nMultiplier);
				nStepCount++;
				sNextStepID = "step" + nStepCount;
				writeOutputToElement(sNextStepID, this.multiplyRow(aPivot[0],
						nMultiplier), this.print({
					pivot : aPivot,
					mathlook : "display"
				}), "step");
			}

			// kill entries in pivot columns
			for (var row = aPivot[0] + 1; row <= nRowCount; row++) {
				if (this.entries[row][aPivot[1]] != 0)// &&
				// (this.entries[nRow][aPivot[1]]!=0))
				{
					nMultiplier = -this.entries[row][aPivot[1]];
					nStepCount++;
					sNextStepID = "step" + nStepCount;
					writeOutputToElement(sNextStepID, this.addMultipleOfRow(
							row, aPivot[0], nMultiplier), this.print({
						pivot : aPivot,
						targetRow : row
					}), "step");
				}
			}
		}
	}
	// // Gauss-Jordan
	this.rref = function(findDet) {
		// disable determinant display
		if (findDet == undefined) {
			findDet = false;
		}

		// step count
		var nStepCount = 0;

		// get dimensions of matrix
		var nRowCount = this.rowCount;
		var nColCount = this.colCount;

		var nMultiplier = 0;
		var sNextStepID = "";

		// set pivot to first entry
		var aPivot = [0, 0];
		var aNewPivot = [];

		while (aPivot != 0) {
			aNewPivot = this.findNextPivot(aPivot[0], aPivot[1]);

			// check if done
			if (aNewPivot == 0) {
				return this.print();
			}

			// found new pivot
			nStepCount++;
			sNextStepID = "step" + nStepCount;
			writeOutputToElement(sNextStepID, "Found new pivot at entry ("
					+ aNewPivot[0] + "," + aNewPivot[1] + ")", this.print({
				pivot : aNewPivot
			}), "step");

			// jump more than one row
			if (aNewPivot[0] > aPivot[0] + parseFloat(1)) {
				nStepCount++;
				sNextStepID = "step" + nStepCount;
				writeOutputToElement(sNextStepID, this.interchangeRows(
						aNewPivot[0], aPivot[0] + 1), this.print({
					pivot : [aPivot[0] + 1, aNewPivot[1]],
					targetRow : aNewPivot[0]
				}), "step");
			}

			// new pivot
			aPivot[0] = aPivot[0] + parseFloat(1);
			aPivot[1] = aNewPivot[1];

			// normalize the pivot row
			nMultiplier = this.entries[aPivot[0]][aPivot[1]];

			if (nMultiplier != 1) {
				nMultiplier = 1 / parseFloat(nMultiplier);
				nStepCount++;
				sNextStepID = "step" + nStepCount;
				writeOutputToElement(sNextStepID, this.multiplyRow(aPivot[0],
						nMultiplier), this.print({
					pivot : aPivot
				}), "step");
			}

			// kill entries in pivot columns
			for (var row = 1; row <= nRowCount; row++) {
				if ((this.entries[row][aPivot[1]] != 0) && (row != aPivot[0])) {
					nMultiplier = -this.entries[row][aPivot[1]];
					nStepCount++;
					sNextStepID = "step" + nStepCount;
					writeOutputToElement(sNextStepID, this.addMultipleOfRow(
							row, aPivot[0], nMultiplier), this.print({
						pivot : aPivot,
						targetRow : row
					}), "step");
				}
			}
		}
	}

	this.det = function() {
		// determinant
		var nDet = 1;
		// det display
		var sDet = "";

		// step count
		var nStepCount = 0;

		// get dimensions of matrix
		var nRowCount = this.rowCount;
		var nColCount = this.colCount;

		var nMultiplier = 0;
		var sNextStepID = "";
		var sStepOutput = "";

		// set pivot to first entry
		var aPivot = [0, 0];
		var aNewPivot = [];

		if (!(this.isSquare())) {
			return "This is not a square matrix";
		}
		while (aPivot != 0) {
			aNewPivot = this.findNextPivot(aPivot[0], aPivot[1]);

			// check if done
			if (aNewPivot == 0) {
				break;
			}

			// find new pivot
			nStepCount++;
			sNextStepID = "step" + nStepCount;
			sStepOutput = "";

			switch (nDet) {
				case 1 :
					sDet = "\\(\\)";
					break;
				case -1 :
					sDet = "\\(-\\)";
					break;
				default :
					sDet = "\\(" + float2rat(nDet) + "\\)";
			}

			sStepOutput += sDet;
			sStepOutput += this.print({
				delimeter : "|",
				pivot : aNewPivot,
				mathlook : "inline"
			});
			writeOutputToElement(sNextStepID, "Found new pivot at entry ("
					+ aNewPivot[0] + "," + aNewPivot[1] + ")", sStepOutput,
					"step");

			// jump more than one row
			if (aNewPivot[0] > aPivot[0] + parseFloat(1)) {
				nStepCount++;
				sNextStepID = "step" + nStepCount;
				nDet *= -1;
				switch (nDet) {
					case 1 :
						sDet = "";
						break;
					case -1 :
						sDet = "\\(-\\)";
						break;
					default :
						sDet = "\\(" + float2rat(nDet) + "\\)";
				}
				console.log(aPivot);
				writeOutputToElement(sNextStepID, this.interchangeRows(
						aNewPivot[0], aPivot[0] + 1), (sDet + this.print({
					delimeter : "|",
					pivot : [aPivot[0] + 1, aNewPivot[1]],
					targetRow : aNewPivot[0],
					mathlook : "inline"
				})), "step");
			}

			// new pivot
			aPivot[0] = aPivot[0] + parseFloat(1);
			aPivot[1] = aNewPivot[1];

			// normalize the pivot row
			nMultiplier = this.entries[aPivot[0]][aPivot[1]];
			// new det
			nDet *= nMultiplier;

			if (nMultiplier != 1) {
				nMultiplier = 1 / parseFloat(nMultiplier);
				nStepCount++;
				sNextStepID = "step" + nStepCount;

				// display det
				switch (nDet) {
					case 1 :
						sDet = "";
						break;
					case -1 :
						sDet = "\\(-\\)";
						break;
					default :
						sDet = "\\(" + float2rat(nDet) + "\\)";
				}
				writeOutputToElement(sNextStepID, this.multiplyRow(aPivot[0],
						nMultiplier), sDet + this.print({
					delimeter : "|",
					pivot : aPivot,
					mathlook : "inline"
				}), "step");
			}

			// kill entries in pivot columns
			for (var row = aPivot[0] + 1; row <= nRowCount; row++) {
				if (this.entries[row][aPivot[1]] != 0)// &&
				// (this.entries[nRow][aPivot[1]]!=0))
				{
					nMultiplier = -this.entries[row][aPivot[1]];
					nStepCount++;
					sNextStepID = "step" + nStepCount;
					writeOutputToElement(sNextStepID, this.addMultipleOfRow(
							row, aPivot[0], nMultiplier), sDet + this.print({
						delimeter : "|",
						pivot : aPivot,
						targetRow : row,
						mathlook : "inline"
					}), "step");
				}
			}
		}
		return float2rat(nDet * this.entries[nRowCount][nColCount]);
	}
	this.inverse = function() {
		var newRow = [];
		// var augmentedMatrix = new matrix();
		if (this.isSquare() === false) {
			return "Matrix is not square";
		}

		var aNewMatrix = this.entries;
		var nSize = this.rowCount;

		for (var row = 1; row <= nSize; row++) {
			newRow = array_fill(nSize + 1, nSize, 0);
			for (var col = nSize + 1; col <= 2 * nSize; col++) {
				if (col - row == nSize) {
					aNewMatrix[row][col] = 1;
				} else {
					aNewMatrix[row][col] = newRow[col];
				}
			}
		}
		var augmentedMatrix = new matrix(aNewMatrix, nSize);
		writeOutputToElement("augemented_matrix",
				"Augment original matrix by the identity matrix",
				augmentedMatrix.print(), "step");
		augmentedMatrix.rref();
		if (float2rat(augmentedMatrix.entries[nSize][nSize]) == 1) {
			return "invertible";
		} else {
			return "not invertible";
		}
	}
	return oThis;
}

function scaleMath(element) {
	var math = $(element).find(".MathJax");
	var w = math.width();
	if (w >= $(window).width()) {
		$(element).css("font-size",
				Math.floor($(window).width() / w * 95) + "%");
		MathJax.Hub.Queue(["Rerender", MathJax.Hub, math.attr("id")]);
	}
}
function writeOutputToElement(sElementID, sExplanation, sStringToAdd, sClass) {
	if (sClass == undefined) {
		sClass = "";
	}
	if (sExplanation == undefined) {
		sExplanation = "";
	}

	var newDiv = $("<div/>", {
		id : sElementID,
		name : sElementID,
		class : sClass
	}).appendTo($("#slider"));

	$("<div/>", {
		id : sElementID + "-explanation",
		name : sElementID + "-explanation",
		html : sExplanation,
		class : "explanation"
	}).appendTo(newDiv);

	var matrixDiv = $("<div/>", {
		id : sElementID + "-matrix",
		name : sElementID + "-matrix",
		html : sStringToAdd,
		class : "matrixEntries"
	}).appendTo(newDiv);
	$("<hr/>").appendTo(newDiv);

	MathJax.Hub.Queue(["Typeset", MathJax.Hub, sElementID]);
	// MathJax.Hub.Typeset(sElementID);
	MathJax.Hub.Queue(function() {
		scaleMath(matrixDiv);
	});
}