/**
 * 
 */

// The matrix object
function matrix(aRequests, nAugmented) {
	// chaining puposese
	var oThis = this;

	// entries
	this.entries = aRequests;

	// if this is not an augemented matrix, return 0.
	// otherwise return the number of augemented columns
	this.augmentedCols = ((nAugmented === undefined) || (nAugmented === "")) ? (0)
			: (nAugmented);

	return oThis;
}

// create a diagonal matrix
matrix.diag = function(aDiagonal) {
	var nSize = aDiagonal.length;

	var aNewMatrix = [];
	for (var row = 0; row < nSize; row++) {
		aNewMatrix[row] = [];
		for (var col = 0; col < nSize; col++) {
			aNewMatrix[row][col] = (row === col) ? aDiagonal[col] : 0;
		}
	}
	return (new matrix(aNewMatrix));
}

// return identity matrix
matrix.I = function(nSize) {
	var aNewMatrix = [];
	for (var row = 0; row < nSize; row++) {
		aNewMatrix[row] = [];
		for (var col = 0; col < nSize; col++) {
			aNewMatrix[row][col] = (row === col) ? 1 : 0;
		}
	}
	return new matrix(aNewMatrix);
}

// augment a matrix
matrix.prototype.augment = function(objMatrix) {
	if (this.rowCount() !== objMatrix.rowCount()) {
		return null;
	}
	var rowCount = this.rowCount();
	var augCols = objMatrix.colCount();
	var aNewEntries = [];
	for (var row = 0; row < rowCount; row++) {
		aNewEntries[row] = this.entries[row].concat(objMatrix.entries[row]);
	}

	return new matrix(aNewEntries, augCols);
}

matrix.prototype.rowCount = function() {
	return this.entries.length;
}
matrix.prototype.colCount = function() {
	return this.entries[0].length;
}

// if this is a square matrix
matrix.prototype.isSquare = function() {
	return ((this.rowCount() == this.colCount()) && (this.augmentedCols == 0));
}

matrix.prototype.minor = function(row, col) {
	if (!this.isSquare()) {
		return "Not a square matrix";
	}

	var aMinor = [], aTempRow = [], nSize = this.rowCount();
	if ((row > nSize) || (col > nSize)) {
		return "Wrong dimensions.}"
	}
	;
	for (var i = 0; i < nSize; i++) {
		if (i !== row) {
			aTempRow = this.entries[row].slice(0, col).concat(
					this.entries[row].slice(col + 1));
		}
		aMinor.push(aTempRow);
	}
	return new matrix(aMinor).det();
}
matrix.prototype.findNextPivot = function(nStartRow, nStartCol) {
	// get dimensions of matrix
	var nRowCount = this.rowCount();
	var nColCount = this.colCount() - this.augmentedCols;

	// current position
	// var currentRow = nStartRow;
	// var currentCol = nStartCol;

	// return object
	var result = new Object();

	for (var currentCol = nStartCol + 1; currentCol < nColCount; currentCol++) {
		for (var currentRow = nStartRow + 1; currentRow < nRowCount; currentRow++) {
			if (this.entries[currentRow][currentCol] != 0) {
				result[0] = currentRow;
				result[1] = currentCol;
				return result;
			}
		}
	}
	return null;
}

/* Basic methods */
// Gauss
matrix.prototype.ref = function(oConfig) {
	if (typeof oConfig === "undefined") {
		oConfig = {};
	}

	// disable determinant display
	if (!oConfig.hasOwnProperty("mode"))
		oConfig.mode = "gauss";
	if (!oConfig.hasOwnProperty("detailed"))
		oConfig.detailed = true;

	// step count
	var nStepCount = 0, sExplanation = "", sDet = "", nDet = 1;

	// get dimensions of matrix
	var nRowCount = this.rowCount(), nColCount = this.colCount();
	if (oConfig.findDet) {
		if (!this.isSquare()) {
			return "Matrix is not square";
		}
	}

	var nMultiplier = 0;

	// set pivot to first entry
	var aPivot = [ -1, -1 ];
	var aNewPivot = [];

	while (aPivot !== null) {
		aNewPivot = this.findNextPivot(aPivot[0], aPivot[1]);
		console.log(aNewPivot);
		// check if done
		if (aNewPivot === null) {
			switch (oConfig.mode) {
			case "det":
				return nDet * this.entries[nRowCount - 1][nRowCount - 1];
				break;
			default:
				return this;
				break;
			}
		}

		if (oConfig.detailed) {
			sExplanation = "Found new pivot at entry (" + (1 + aNewPivot[0])
					+ "," + (1 + aNewPivot[1]) + ")";
			writeOutputToElement("step" + nStepCount++, sExplanation, this
					.printOutput({
						pivot : aNewPivot
					}), "step");
		}

		// jump more than one row
		if (aNewPivot[0] > aPivot[0] + parseFloat(1)) {
			sExplanation = this.interchangeRows(aNewPivot[0], aPivot[0] + 1);
			nDet *= -1;
			if (oConfig.detailed)
				writeOutputToElement("step" + nStepCount++, sExplanation, this
						.printOutput({
							pivot : [ aPivot[0] + 1, aNewPivot[1] ],
							targetRow : aNewPivot[0]
						}), "step");
		}

		// new pivot
		aPivot[0] = aPivot[0] + parseFloat(1);
		aPivot[1] = aNewPivot[1];

		// normalize the pivot row
		nMultiplier = this.entries[aPivot[0]][aPivot[1]];

		if (nMultiplier != 1) {
			nDet *= nMultiplier;
			nMultiplier = 1 / parseFloat(nMultiplier);
			sExplanation = this.multiplyRow(aPivot[0], nMultiplier);
			if (oConfig.detailed) {
				writeOutputToElement("step" + nStepCount++, sExplanation, this
						.printOutput({
							pivot : aPivot,
							mathlook : "display"
						}), "step");
			}
		}

		// kill entries in pivot columns
		for (var row = ((oConfig.mode === "jordan") ? 0 : aPivot[0] + 1); row < nRowCount; row++) {
			if ((this.entries[row][aPivot[1]] != 0) && (row != aPivot[0])) {
				nMultiplier = -this.entries[row][aPivot[1]];
				sExplanation = this.addMultipleOfRow(row, aPivot[0],
						nMultiplier);
				if (oConfig.detailed)
					writeOutputToElement("step" + nStepCount++, sExplanation,
							this.printOutput({
								pivot : aPivot,
								targetRow : row
							}), "step");
			}
		}
	}
}

// Gauss-Jordan
matrix.prototype.rref = function(oConfig) {
	if (typeof oConfig === "undefined") {
		oConfig = {};
	}
	oConfig.mode = "jordan";
	return this.ref(oConfig);
}

// Determinant
matrix.prototype.det = function() {
	// determinant
	var nDet = 1;
	// det display
	var sDet = "";

	if (typeof nStepCount === "undefined") {
		// step count
		console.log("this is not fun");
		var nStepCount = 0;
	}

	// get dimensions of matrix
	var nRowCount = this.rowCount();
	var nColCount = this.colCount();

	var nMultiplier = 0;
	var sNextStepID = "";
	var sStepOutput = "";

	// set pivot to first entry
	var aPivot = [ -1, -1 ];
	var aNewPivot = [];

	if (!(this.isSquare())) {
		return "This is not a square matrix";
	}
	while (aPivot !== null) {
		aNewPivot = this.findNextPivot(aPivot[0], aPivot[1]);

		// check if done
		if (aNewPivot === null) {
			break;
		}

		// find new pivot
		nStepCount++;
		sNextStepID = "step" + nStepCount;
		sStepOutput = "";

		switch (nDet) {
		case 1:
			sDet = "\\(\\)";
			break;
		case -1:
			sDet = "\\(-\\)";
			break;
		default:
			sDet = "\\(" + float2rat(nDet) + "\\)";
		}

		sStepOutput += sDet;
		sStepOutput += this.printOutput({
			delimeter : "|",
			pivot : aNewPivot,
			mathlook : "inline"
		});

		writeOutputToElement(sNextStepID, "Found new pivot at entry ("
				+ (1 + aNewPivot[0]) + "," + (1 + aNewPivot[1]) + ")",
				sStepOutput, "step");

		// jump more than one row
		if (aNewPivot[0] > aPivot[0] + parseFloat(1)) {
			nStepCount++;
			sNextStepID = "step" + nStepCount;
			nDet *= -1;
			switch (nDet) {
			case 1:
				sDet = "";
				break;
			case -1:
				sDet = "\\(-\\)";
				break;
			default:
				sDet = "\\(" + float2rat(nDet) + "\\)";
			}
			writeOutputToElement(sNextStepID, this.interchangeRows(
					aNewPivot[0], aPivot[0] + 1), (sDet + this.printOutput({
				delimeter : "|",
				pivot : [ aPivot[0] + 1, aNewPivot[1] ],
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
			case 1:
				sDet = "";
				break;
			case -1:
				sDet = "\\(-\\)";
				break;
			default:
				sDet = "\\(" + float2rat(nDet) + "\\)";
			}
			writeOutputToElement(sNextStepID, this.multiplyRow(aPivot[0],
					nMultiplier), sDet + this.printOutput({
				delimeter : "|",
				pivot : aPivot,
				mathlook : "inline"
			}), "step");
		}

		// kill entries in pivot columns
		for (var row = aPivot[0] + 1; row < nRowCount; row++) {
			if (this.entries[row][aPivot[1]] != 0)// &&
			// (this.entries[nRow][aPivot[1]]!=0))
			{
				nMultiplier = -this.entries[row][aPivot[1]];
				nStepCount++;
				sNextStepID = "step" + nStepCount;
				writeOutputToElement(sNextStepID, this.addMultipleOfRow(row,
						aPivot[0], nMultiplier), sDet + this.printOutput({
					delimeter : "|",
					pivot : aPivot,
					targetRow : row,
					mathlook : "inline"
				}), "step");
			}
		}
	}
	return float2rat(nDet * this.entries[nRowCount - 1][nColCount - 1]);
}

// transpose of the matrix
matrix.prototype.transpose = function() {
	var aTranspose = [];
	var nRowCount = this.rowCount();
	var nColCount = this.colCount();
	for (var row = 0; row < nColCount; row++) {
		aTranspose[row] = [];
		for (var col = 0; col < nRowCount; col++) {
			aTranspose[row][col] = this.entries[col][row];
		}
	}
	writeOutputToElement('original_matrix', "Original Matrix", this
			.printOutput(), "step");
	return new matrix(aTranspose);
}

// inverse
matrix.prototype.inverse = function() {
	// var augmentedMatrix = new matrix();
	if (this.isSquare() === false) {
		return "Matrix is not square";
	}

	var aNewMatrix = this.entries;
	var nSize = this.rowCount();

	// for (var row = 0; row < nSize; row++) {
	// for (var col = nSize; col < 2 * nSize; col++) {
	// aNewMatrix[row][col] = (col - row === nSize) ? 1 : 0;
	// }
	// }

	// var augmentedMatrix = new matrix(aNewMatrix, nSize);
	var augmentedMatrix = this.augment(matrix.I(nSize));
	writeOutputToElement("augemented_matrix",
			"Augment original matrix by the identity matrix", augmentedMatrix
					.printOutput(), "step");
	augmentedMatrix.rref();
	var inverse = [];
	if (float2rat(augmentedMatrix.entries[nSize - 1][nSize - 1]) == 1) {
		for (var row = 0; row < nSize; row++) {
			inverse[row] = [];
			for (var col = 0; col < nSize; col++) {
				inverse[row][col] = augmentedMatrix.entries[row][col + nSize];
			}
		}
		var oMatrix = new matrix(inverse);
		return oMatrix;
	} else {
		return "not invertible";
	}
}

matrix.prototype.add = function(oMatrix) {
	if ((this.colCount() !== oMatrix.colCount())
			|| (this.rowCount() !== oMatrix.rowCount())) {
		return "Wrong dimension!";
	}
	var aResult = [];
	for (var i = 0; i < this.rowCount(); i++) {
		aResult.push([]);
		for (var j = 0; j < this.colCount(); j++) {
			aResult[i][j] = this.entries[i][j]*1 + oMatrix.entries[i][j]*1;
		}
	}
	return new matrix(aResult);
}

matrix.prototype.multiplyScalar = function(nMultiplier) {
	var aResult = [];

	for (var i = 0; i < this.rowCount(); i++) {
		for (var j = 0; j < this.rowCount(); j++) {
			aResult.push(this.entries[i][j] * nMultiplier);
		}
	}

	return new matrix(aResult);
}
/* Elementary Row Operations */

/*
 * interchange two rows
 */
matrix.prototype.interchangeRows = function(nRow1, nRow2) {
	// get dimensions of matrix
	var tmp = [];
	if ((nRow1 >= this.rowCount()) || (nRow2 >= this.rowCount()) || (nRow1 < 0)
			|| (nRow2 < 0)) {
		return "Wrong dimensions";
	} else {
		tmp = this.entries[nRow1];
		this.entries[nRow1] = this.entries[nRow2];
		this.entries[nRow2] = tmp;
	}
	return ("Interchange Row " + (1 + nRow1 * 1) + " and Row " + (1 + nRow2 * 1));
}

/*
 * Multiply a row by a number nRow: Row to by multiplied nMultiplier: muliplier
 */
matrix.prototype.multiplyRow = function(nRow, nMultiplier) {
	// Get number of columns
	var nColCount = this.colCount();

	// if nRow is out of range
	if ((nRow >= this.rowCount()) || (nRow < 0)) {
		return ("Wrong dimensions");
	}
	// if not
	else {
		for (var nCol = 0; nCol < nColCount; nCol++) {
			this.entries[nRow][nCol] = this.entries[nRow][nCol] * nMultiplier;
		}
		if (nMultiplier == -1) {
			return "Invert the sign of Row " + (1 + nRow);
		}
		if (Math.round(1 / nMultiplier) == 1 / nMultiplier) {
			return " Divide Row " + (1 + nRow) + " by \\("
					+ float2rat(1 / nMultiplier) + "\\)";
		}
		return "Multiply Row " + (1 + nRow) + " by \\("
				+ float2rat(nMultiplier) + "\\)";
	}
}

/* add a multiple of a row to another row */
matrix.prototype.addMultipleOfRow = function(nRowToBeModified,
		nRowToBeMultiplied, nMultiplier) {
	var nRowCount = this.rowCount();
	var nColCount = this.colCount();
	if ((nRowToBeModified > nRowCount) || (nRowToBeMultiplied > nRowCount)) {
		return ("Wrong dimension");
	} else {
		for (var nCol = 0; nCol < nColCount; nCol++) {
			this.entries[nRowToBeModified][nCol] = parseFloat(this.entries[nRowToBeMultiplied][nCol]
					* nMultiplier)
					+ parseFloat(this.entries[nRowToBeModified][nCol]);
		}
		if (nMultiplier == -1) {
			return ("Substract Row " + (1 + nRowToBeMultiplied) + " from Row " + (1 + nRowToBeModified));
		}
		if (nMultiplier == 1) {
			return ("Add Row " + (1 + nRowToBeMultiplied) + " to Row " + (1 + nRowToBeModified));
		}
		if (nMultiplier < 0) {
			if ((1 / nMultiplier) == Math.round(1 / nMultiplier)) {
				return ("Divide Row " + (1 + nRowToBeMultiplied) + " by \\("
						+ float2rat(-1 / nMultiplier)
						+ "\\) and substract from Row " + (1 + nRowToBeModified));
			} else {
				return ("Multiply Row " + (1 + nRowToBeMultiplied) + " by \\("
						+ float2rat(-nMultiplier)
						+ "\\) and substract from Row " + (1 + nRowToBeModified));
			}
		} else {
			if ((1 / nMultiplier) == Math.round(1 / nMultiplier)) {
				return ("Divide Row " + (1 + nRowToBeMultiplied) + " by \\("
						+ float2rat(nMultiplier) + "\\) and add to Row " + (1 + nRowToBeModified));
			} else {
				return ("Multiply Row " + (1 + nRowToBeMultiplied) + " by \\("
						+ float2rat(nMultiplier) + "\\) and add to Row " + (1 + nRowToBeModified));
			}
		}

	}

}

/* print */
matrix.prototype.printOutput = function(oConfig) {
	/*
	 * display option: mathlook = display => display matrix (default); mathlook =
	 * inline => inline math; mathlook = none => no mathjax;
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
		oConfig.pivot = -1;
	}

	if (!oConfig.hasOwnProperty("targetRow")) {
		oConfig.targetRow = -1;
	}

	// matrix dimesion
	var nRowCount = this.rowCount();
	var nColCount = this.colCount();
	var nAugCols = this.augmentedCols;

	var sRowToDisplay = ""; // temporary row string
	var sEntryToDisplay = ""; // temporary entry string
	var sOutput = ''; // output html string

	if (oConfig.mathlook !== "none") {
		sOutput = "\\begin{array}{";
		for (var nCol = 0; nCol < nColCount; nCol++) {
			sOutput += "r";
			if ((nAugCols > 0) && (nCol + nAugCols * 1 == nColCount - 1)) {
				sOutput += "|";
			}
		}
		sOutput += "}\r\n";

		for (var nRow = 0; nRow < nRowCount; nRow++) {
			sRowToDisplay = "";
			for (var nCol = 0; nCol < nColCount; nCol++) {
				sEntryToDisplay = float2rat(this.entries[nRow][nCol],
						oConfig.mathlook);
				if ((oConfig.pivot !== 0) && (nRow == oConfig.pivot[0])) {
					if (nCol == oConfig.pivot[1]) {
						sEntryToDisplay = "\\mathbf{" + sEntryToDisplay + "}";
					}
					sEntryToDisplay = "\\color{brown}{" + sEntryToDisplay + "}";
				}
				if (nRow == oConfig.targetRow) {
					sEntryToDisplay = "\\color{blue}{" + sEntryToDisplay + "}";
				}
				sRowToDisplay += (sEntryToDisplay + "&");
			}
			sRowToDisplay = sRowToDisplay
					.substring(0, sRowToDisplay.length - 1)
					+ "\\\\ \r\n";
			sOutput += sRowToDisplay;
		}
		sOutput += "\\end{array}";
		switch (oConfig.delimeter) {
		case "(":
			sOutput = "\\(\\left(" + sOutput + "\\right)\\)";
			break;
		case "|":
			sOutput = "\\(\\left|" + sOutput + "\\right|\\)";
			break;
		case "[":
			sOutput = "\\(\\left[" + sOutput + "\\right]\\)";
			break;
		}
	} else {
		sOutput = "<table class='tbl-matrix'>";
		for (var nRow = 0; nRow < nRowCount; nRow++) {
			sOutput += "<tr class='tr-matrix'>";
			for (var nCol = 0; nCol < nColCount; nCol++) {
				sOutput += ("<td class='td-matrix'>"
						+ float2rat(this.entries[nRow][nCol], oConfig.mathlook) + "</td>");
			}
			sOutput += "</tr>";
		}
		sOutput += "</table>";
	}
	// console.log(sOutput);
	return sOutput;
}

matrix.prototype.cramer = function() {
	if (this.augmentedCols != 1) {
		writeOutputToElement("solution", "Invalid input",
				"There should be <strong>one</strong> augemented column.");
		return null;
	}
	var num_rows = this.rowCount();
	var num_cols = this.colCount() - this.augmentedCols;

	if (num_rows - num_cols !== 0) {
		writeOutputToElement("solution", "Invalid input",
				"The coefficient matrix is not square.");
		return null;
	}

	var aMatrix = [], nStepCount = 0;

	for (var row = 0; row < num_rows; row++) {
		aMatrix[row] = [];
		for (var col = 0; col < num_rows; col++) {
			aMatrix[row][col] = $("#entries_" + row + "_" + col).val();
		}
	}
	var objMatrix = new matrix(aMatrix);
	writeOutputToElement("original_matrix", "The coefficient matrix", objMatrix
			.printOutput(), "step");
	var coefDet = objMatrix.ref({
		detailed : false,
		mode : "det"
	});

	writeOutputToElement(
			"coefDet",
			"Determinant of coefficient matrix <a href=\"detail.html\" data-rel=\"dialog\" class=\"ui-btn ui-corner-all ui-btn-inline ui-icon-info ui-btn-icon-notext\">Delete</a>",
			"\\("+float2rat(coefDet)+"\\)", "step");

	if (coefDet === 0) {
		writeOutputToElement("Solution", "Cramer's rule doesn't work",
				"Coefficient matrix is not invertible", "step");
		return null;
	}

	var tempMatrix = [];
	var tempObjMatrix = [];
	var tempDet = 0;
	var aSolution = [];

	for (var tempCol = 0; tempCol < num_rows; tempCol++) {
		//console.log(tempCol);
		tempMatrix = [];

		for (var row = 0; row < num_rows; row++) {
			tempMatrix[row] = [];
			for (var col = 0; col < num_rows; col++) {
				tempMatrix[row][col] = $(
						"#entries_" + row + "_"
								+ ((tempCol == col) ? num_rows : col)).val();
			}
		}
		tempObjMatrix = new matrix(tempMatrix);
		writeOutputToElement("A" + (1 + tempCol), "The matrix \\(A_{"
				+ (1 + tempCol) + "}\\)", tempObjMatrix.printOutput(), "step");
		tempDet = tempObjMatrix.ref({
			detailed : false,
			mode : "det"
		});
		writeOutputToElement("A" + (1 + tempCol),
				"Determinant of matrix \\(A_{" + (1 + tempCol) + "}\\)",
				"\\("+float2rat(tempDet)+"\\)", "step");
		writeOutputToElement("component-" + (1 + tempCol), "Component "
				+ (1 + tempCol) + " of solution vector",
				"\\(\\displaystyle\\frac{\\det A_" + (1 + tempCol)
						+ "}{\\det A}=" + float2rat(tempDet / coefDet) + "\\)",
				"step");
		aSolution.push([ tempDet / coefDet ]);
	}
	var objSolution = new matrix(aSolution);
	//console.log(objSolution)
	writeOutputToElement("solution-vector", "Solution to system:", objSolution
			.printOutput(), "step");
}

/* characteristic poly */
matrix.prototype.char = function() {
	if (!this.isSquare()) {
		console.log("not a square matrix");
		return null;
	}
	var nSize = this.colCount(), aPolyValues = [], aTemp = [], det = 0;

	for (var x = 0; x <= nSize; x++) {
		aTemp = [];
		for (var i = 0; i < nSize; i++) {
			aTemp.push(-x);
		}
		det = this.add(matrix.diag(aTemp)).ref({
			mode : "det",
			detailed : false
		});
		console.log(this.add(matrix.diag(aTemp)).entries);
		aPolyValues.push([ x, det ]);
	}
	console.log(aPolyValues);
	return interpolate(aPolyValues);
}

/* supplement functions */
function float2rat(n, mathlook, tolerance) {
	var aux = 0,h1 = 0,h2 = 0,k1 = 0,k2 = 0,b = 0,a = 0,sign = "";
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
	} while (Math.abs(n - h1 / k1) > tolerance);

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
	}
}

function scaleMath(element) {
	var math = $(element).find(".MathJax");
	var w = math.width();
	if (w >= $(window).width()) {
		$(element).css("font-size",
				Math.floor($(window).width() / w * 95) + "%");
		MathJax.Hub.Queue([ "Typeset", MathJax.Hub, math[0] ]);
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

	MathJax.Hub.Queue([ "Typeset", MathJax.Hub, newDiv[0] ]);
	// MathJax.Hub.Typeset(sElementID);
	MathJax.Hub.Queue(function() {
		scaleMath(matrixDiv);
	});
}