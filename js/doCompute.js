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
		$("#times").hide();
		$("#num_cols").hide();
		$("#num_cols").val($("#num_rows").val());
		$("#augmented_cols").val("0");
		$("#augmented_cols_container").hide();
		break;
	case "refresh":
		location.reload();
		break;
	break;
}

$("#inputDiv").show();
$("#operation").val(sOptName);
$("#computeDiv").hide();
}
var mySlider = $("#slider").bxSlider({
infiniteLoop : false,
//adaptiveHeight : true,
pager : false,
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
var aInputMatrix = $("input[name='entries\\[\\]']");

for (var row = 1; row <= num_rows; row++) {
	aMatrix[row] = [];
	for (var col = 1; col <= num_cols; col++) {
		aMatrix[row][col] = aInputMatrix.eq((row - 1) * num_cols + (col - 1))
				.val();
	}
}

// new matrix object
var objMatrix = new matrix(aMatrix, augmented_cols);

// display the matrix in output div
// writeOutputToElement("original_matrix",objMatrix.displayEntries());

// what operation
switch ($("#operation").val()) {
case "Gauss":
	writeOutputToElement("computation_result", "Row echelon form", objMatrix
			.doGauss(), "step");
	break;
case "Gauss-Jordan":
	writeOutputToElement("computation_result", "Reduced row echelon form",
			objMatrix.doGaussJordan(), "step");
	break;
case "findDet":
	writeOutputToElement("computation_result", "Determinant", objMatrix
			.findDet(), "step");
	break;
case "inverse":
	writeOutputToElement("computation_result", "Inverse Matrix",
			inverse(objMatrix.entries), "step");
	break;
case "transpose":
	writeOutputToElement("computation_result", "Transpose Matrix", objMatrix
			.transpose().displayEntries(), "step");
	break;
}
mySlider.reloadSlider();
initSlider();
// $("#step1").show();
};

/**
 * doCompute.js
 */
var slideCount = 0;
var slideWidth = 0;
var slideHeight = 0;
var sliderUIWidth = 0;
var currentSlide = 1;

function setDimension() {

$("#matrix_entries").empty();

// in case we are working with square matrices
if (($("#operation").val() == "findDet")
		|| ($("#operation").val() == "inverse")) {
	$("#num_cols").val($("#num_rows").val());
	$("#augmented_cols").val("0");
}

var num_rows = $("#num_rows").val();
var num_cols = $("#num_cols").val();
var augmented_cols = $("#augmented_cols").val();

// validate entries
if ((num_rows <= 0) || (num_cols <= 0) || (augmented_cols < 0)
		|| (num_cols * 1 < augmented_cols * 1)) {
	console.log(augmented_cols + "," + num_cols);
	alert("Invalid dimensions. Please review your input.");
	return;
}

for (row = 1; row <= num_rows; row++) {
	for (col = 1; col <= num_cols; col++) {
		sNewEntryName = 'entries[]';
		if (col > num_cols - augmented_cols) {
			sEntryClass = "augmented";
		} else {
			sEntryClass = "entry";
		}
		$(
				"<input/>",
				{
					// id: sNewEntryName,
					name : sNewEntryName,
					// pattern: '^[+-]?\\d*(.\\d*)?',
					type : "text",
					class : sEntryClass,
					value : (($("#rdmEntries").val() == 1) ? Math.floor(Math
							.random() * 4 - 2) : "")
				}).appendTo("#matrix_entries");
	}
	$("#matrix_entries").append("<br/>");
}

$("#dimensionForm").hide();
$("#matrix_entries_container").show();
}

function initSlider() {
if ($("#detailedSolution").val() === "0") {
	mySlider.reloadSlider();
} else {
	mySlider.destroySlider();
}
}
// form control
function slideLeft() {
if (currentSlide < slideCount) {
	$("#slider").animate({
		left : "-=" + slideWidth
	})
	currentSlide++;
}

}

function slideRight() {
if (currentSlide > 1) {
	$("#slider").animate({
		left : "+=" + slideWidth
	})
	currentSlide--;
}
}
function slideLast() {
var slideCount = mySlider.getSlideCount();
console.log(slideCount);
mySlider.goToSlide(slideCount - 1);
}
function slideFirst() {
mySlider.goToSlide(0);
}

// Step control form
// previous button
$("#previous").click(function() {
slideRight();
});

// next button
$("#next").click(function() {
slideLeft();
});

// last button
$("#last").click(function() {
slideLast();
});

// first button
$("#first").click(function() {
slideFirst();
});

$("#startOver").click(function(event) {
event.preventDefault();
$("#slider").empty();
$("#inputDiv").show();
document.getElementById("dimensionForm").reset();
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
	bxSlider.goToPrevSlide();
	break;
case 39:
	bxSlider.goToNextSlide();
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
		mode : 'horizontal',
		minSlides : 1
	});
	break;
case "portrait":
	mySlider.reloadSlider({
		infiniteLoop : false,
		pager : false,
		mode : 'horizontal',
		minSlides : 1
	});
	break;
}
})

$("#toggleSlider").tap(function() {
if ($("#detailedSolution").val() === "0") {// change to view detail
	$("#detailedSolution").val("1");
	mySlider.destroySlider();
} else {
	$("#detailedSolution").val("0");
	mySlider.reloadSlider();
}
})
/* end doCompute.js */

