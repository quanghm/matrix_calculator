/**
 * 
 */
function polynomial(aCoef) {
	var oThis = this;
	this.coefs = [];

	for (var i = 0; i < aCoef.length; i++) {
		this.coefs.push(aCoef[i]);
	}

	return oThis;
}

polynomial.prototype.deg = function() {
	return this.coefs.length - 1;
}

polynomial.prototype.toString = function(oConfig) {
	oConfig = (typeof oConfig === "undefined") ? {} : oConfig;
	var x = (oConfig.hasOwnProperty("x")) ? oConfig.x : "x";
	var math = (oConfig.hasOwnProperty("mathlook")) ? oConfig.mathlook : "none";
	var result = (this.coefs[0] === 0) ? "" : ((math==="none")?this.coefs[0]:(float2rat(this.coefs[0])));
	var sPower;

	for (var mono = 1; mono < this.coefs.length; mono++) {
		sPower = (mono === 1) ? x
				: (x + ((math === "none") ? ("<sup>" + mono + "</sup>")
						: ("^{" + mono+"}")));
		if (this.coefs[mono] > 0) {
			result += "+";
		}
		switch (this.coefs[mono]) {
		case 0:
			break;
		case 1:
			result += sPower;
			break;
		case -1:
			result += "-" + sPower;
			break;
		default:
			result += (math==="none")?this.coefs[mono]:(float2rat(this.coefs[mono])) + sPower;
			break;
		}
	}
	if (result.charAt(0)==="+"){result=result.substring(1)}
	if (math==="MathJax"){result="\\("+result+"\\)"}
	return result;
}

polynomial.prototype.add = function(newPoly) {
	var newDeg = (this.coefs.length > newPoly.coefs.length) ? this.coefs.length
			: newPoly.coefs.length;

	var aNewCoefs = [];

	for (var i = 0; i < newDeg; i++) {
		aNewCoefs[i] = ((this.coefs[i] === undefined) ? 0 : this.coefs[i])
				+ ((newPoly.coefs[i] === undefined) ? 0 : newPoly.coefs[i]);
	}
	return new polynomial(aNewCoefs);
}

polynomial.prototype.multiply = function(newPoly) {
	if (typeof newPoly === "number") {
		newPoly = new polynomial([ newPoly ]);
	}
	var aProduct = [], maxDeg = this.deg() * newPoly.deg();

	for (var newDeg = 0; newDeg <= maxDeg; newDeg++) {
		aProduct[newDeg] = 0;
		for (var i = 0; i <= newDeg; i++) {
			aProduct[newDeg] += ((this.coefs[i] === undefined) ? 0
					: this.coefs[i])
					* ((newPoly.coefs[newDeg - i] === undefined) ? 0
							: newPoly.coefs[newDeg - i]);
		}
	}
	return new polynomial(aProduct);
}

polynomial.prototype.value = function(x) {
	var result = 0, mono = this.coefs.length;

	while (mono--) {
		result *= x;
		result += this.coefs[mono];
	}
	return result;
}

polynomial.prototype.derivative = function() {
	var aNewCoefs = [];

	var deg = this.coefs.length;

	while (--deg > -1) {

	}
}
interpolate = function(aValues) {
	var vandermonde = [], tempPower = 1;

	// create augmented Vandermonde matrix
	for (var key = 0; key < aValues.length; key++) {
		vandermonde[key] = [];
		tempPower = 1;
		for (var power = 0; power < aValues.length; power++) {
			vandermonde[key].push(tempPower);
			tempPower *= aValues[key][0];
		}
		vandermonde[key].push(aValues[key][1]);
	}
	var oMatrix = new matrix(vandermonde, 1);
	oMatrix = oMatrix.rref({
		detailed : false,
		jordan : true
	});
	var aResult = [];

	for (var key = 0; key < aValues.length; key++) {
		//console.log("coef: "+float2rat(oMatrix.entries[key][aValues.length],{mode:"number"}));
		aResult.push(float2rat(oMatrix.entries[key][aValues.length],{mode:"number"}));
	}
	return new polynomial(aResult);
}