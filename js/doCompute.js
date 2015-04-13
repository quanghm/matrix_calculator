function getInput(element) {
	$("#main").panel("close");
	$("#operation_title").html($(element).html());
	$("#inputDiv").show();
	$("#dimensionForm").show();
	$("#matrix_entries_container").hide();

	var sOptName = $(element).attr("id");

	switch (sOptName) {
	case "Gauss":
		$("#times").show();
		$("#num_cols").show();
		$("#augmented_cols").val("");
		$("#augmented_cols_container").show();
		break;
	case "Gauss-Jordan":
		$("#times").show();
		$("#num_cols").show();
		$("#augmented_cols").val("");
		$("#augmented_cols_container").show();
		break;
	case "transpose":
		$("#times").show();
		$("#num_cols").show();
		$("#augmented_cols").val("0");
		$("#augmented_cols_container").hide();
		break;
	case "findDet":
		$("#times").hide();
		$("#num_cols").hide();
		$("#num_cols").val($("#num_rows").val());
		$("#augmented_cols").val("0");
		$("#augmented_cols_container").hide();
		break;
	case "inverse":
	case "char":
	case "minor":
	case "Cramer":
		$("#times").hide();
		$("#num_cols").hide();
		$("#num_cols").val($("#num_rows").val());
		$("#augmented_cols").val("0");
		$("#augmented_cols_container").hide();
		break;
	case "refresh":
		location.reload();
		break;
	}

	$("#inputDiv").show();
	$("#operation").val(sOptName);
	$("#computeDiv").hide();
}
var mySlider = $("#slider").bxSlider({
	infiniteLoop : false,
	// adaptiveHeight : true,
	pager : false,
	controls : false,
	// mode : (window.innerHeight < window.innerWidth) ? 'vertical'
	// : 'horizontal',
	minSlides : 1
});
function doCompute() {
	// hide input and show output
	$("#inputDiv").hide();
	$("#slider").empty();
	$("#computeDiv").show();

	// read the matrix from input
	var num_rows = $("#num_rows").val();
	var num_cols = $("#num_cols").val();
	var augmented_cols = $("#augmented_cols").val();

	var aMatrix = [];

	for (var row = 0; row < num_rows; row++) {
		aMatrix[row] = [];
		for (var col = 0; col < num_cols; col++) {
			aMatrix[row][col] = $("#entries_" + row + "_" + col).val();
		}
	}

	// new matrix object
	var objMatrix = new matrix(aMatrix, augmented_cols);

	// display the matrix in output div
	// writeOutputToElement("original_matrix",objMatrix.displayEntries());

	// what operation
	switch ($("#operation").val()) {
	case "Gauss":
		writeOutputToElement("computation_result", "Row echelon form",
				objMatrix.ref().printOutput(), "step");
		break;
	case "Gauss-Jordan":
		writeOutputToElement("computation_result", "Reduced row echelon form",
				objMatrix.rref().printOutput(), "step");
		break;
	case "findDet":
		writeOutputToElement("computation_result", "Determinant", objMatrix
				.det(), "step");
		break;
	case "inverse":
		var inverse = objMatrix.inverse();
		if (typeof (inverse) === "string") {
			writeOutputToElement("computation_result", "Inverse Matrix",
					inverse, "step");
		} else {
			writeOutputToElement("computation_result", "Inverse Matrix",
					inverse.printOutput(), "step");
		}
		break;
	case "Cramer":
		objMatrix.cramer();
		break;
	case "transpose":
		writeOutputToElement("computation_result", "Transpose Matrix",
				objMatrix.transpose().printOutput(), "step");
		break;
	case "char":
		writeOutputToElement("computation_result","Characteristic Polynomial",objMatrix.char().toString({mathlook:MathJax}));
		break;
	}
	
	mySlider.reloadSlider();
	initSlider();
	// $("#step1").show();
};

/**
 * doCompute.js
 */

function setDimension() {

	$("#matrix_entries").empty();

	// in case we are working with square matrices
	switch ($("#operation").val()) {
	case "findDet":
	case "char":
	case "inverse":
	case "minor":
		$("#num_cols").val($("#num_rows").val());
		$("#augmented_cols").val("0");
		break;
	case "Cramer":
		$("#num_cols").val($("#num_rows").val() - (-1));
		$("#augmented_cols").val("1");
		break;
	}

	var num_rows = $("#num_rows").val();
	var num_cols = $("#num_cols").val();
	var augmented_cols = $("#augmented_cols").val();

	// validate entries
	if ((num_rows <= 0) || (num_cols <= 0) || (augmented_cols < 0)
			|| (num_cols - augmented_cols < 0)) {
		console.log(augmented_cols + "," + num_cols);
		alert("Invalid dimensions. Please review your input.");
		return;
	}

	for (var row = 0; row < num_rows; row++) {
		for (var col = 0; col < num_cols; col++) {
			$(
					"<input/>",
					{
						id : 'entries_' + row + '_' + col,
						// pattern: '^[+-]?\\d*(.\\d*)?',
						type : "text",
						class : (col >= num_cols - augmented_cols) ? "augmented"
								: "entry",
						value : (($("#rdmEntries").val() == 1) ? Math
								.floor(Math.random() * 4 - 2) : "")
					}).appendTo("#matrix_entries");
		}
		$("#matrix_entries").append("<br/>");
	}

	if ($("#operation").val() === "minor") {
		var newDiv = $("<div/>", {
			id : "minorPos",
			class : "ui-grid-a"
		});

		$("<input/>", {
			type : "number",
			class : "entry",
			id : "rowPos",
			placeholder : "Row"
		}).appendTo(newDiv);

		$("<input />", {
			type : "number",
			class : "entry",
			id : "colPos",
			placeholder : "Col"
		}).appendTo(newDiv);

		newDiv.appendTo($("#matrix_entries"));
	}

	$("#dimensionForm").hide();
	$("#matrix_entries_container").show();
}


function initSlider() {
	if ($("#detailedSolution").val() === "0") {// slider view
		mySlider.reloadSlider();
		$("#prev").removeAttr("disabled");
		$("#next").removeAttr("disabled");
	} else {
		mySlider.destroySlider();
		$("#prev").attr("disabled", "disabled");
		$("#next").attr("disabled", "disabled");

	}
}
// form control

function slideLast() {
	var slideCount = mySlider.getSlideCount();
	// console.log(slideCount);
	mySlider.goToSlide(slideCount - 1);
}
function slideFirst() {
	mySlider.goToSlide(0);
}

// Step control form
// previous button
$("#prev").click(function() {
	mySlider.goToPrevSlide();
});

// next button
$("#next").click(function() {
	mySlider.goToNextSlide();
});

// last button
$("#last").click(function() {
	slideLast();
	$("#computeDiv").animate({
		scrollTop : $("#computeDiv")[0].scrollHeight
	});
});

// first button
$("#first").click(function() {
	slideFirst();
	$("#computeDiv").animate({
		scrollTop : 0
	});
});

$("#startOver").click(function(event) {
	event.preventDefault();
	$("#slider").empty();
	$("#inputDiv").show();
	$("#dimensionForm").reset();
	$("#dimensionForm").show();
	$("#matrix_entries_container").hide();
	$("#computeDiv").hide();
});
$("#modifyEntries").click(function(envent) {
	event.preventDefault();
	$("#inputDiv").show();
	$("#matrix_entries_container").show();
	$("#computeDiv").hide();
});
$(document).keyup(function(event) {
	switch (event.which) {
	case 37:
		mySlider.goToPrevSlide();
		break;
	case 39:
		mySlider.goToNextSlide();
		break;
	}
});

$(window).on("orientationchange", function(event) {
	$("#slider").children().each(function() {
		scaleMath(this);
	});
	switch (event.orientation) {
	case "landscape":
		mySlider.reloadSlider({
			infiniteLoop : false,
			pager : false,
			controls : false,
		});
		break;
	case "portrait":
		mySlider.reloadSlider({
			infiniteLoop : false,
			pager : false,
			controls : false,
		});
		break;
	}
})

$("#toggleSlider").tap(function() {
	if ($("#detailedSolution").val() === "0") {// no slider
		$("#detailedSolution").val("1");
		mySlider.destroySlider();
		$("#prev").attr("disabled", "disabled");
		$("#next").attr("disabled", "disabled");

		// $("#outputDiv").css("padding",$("#stepCtrl").height());
	} else {
		$("#detailedSolution").val("0");
		mySlider.reloadSlider();
		$("#outputDiv").css("padding", "inherit");
		$("#prev").removeAttr("disabled");
		$("#next").removeAttr("disabled");
	}

	$("#detailedSolution").flipswitch("refresh");
})
/* end doCompute.js */

