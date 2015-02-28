/**
 * 
 */
	var slideCount = 0;
	var slideWidth = 0;
	var slideHeight = 0;
	var sliderUIWidth = 0;
	var currentSlide=1;
	
function setDimension(){
	
	$("#matrix_entries").empty();
	
	//	in case we are working with square matrices
	if (($("#operation").val()=="findDet")||($("#operation").val()=="inverse"))
	{
		$("#num_cols").val($("#num_rows").val());
		$("#augmented_cols").val("0");
	}
	
	num_rows=$("#num_rows").val();
	num_cols=$("#num_cols").val();
	augmented_cols =$("#augmented_cols").val();

	//	validate entries
	if ((num_rows<=0) ||(num_cols<=0)|| (augmented_cols<0)||(augmented_cols>num_cols))
		{
		alert("Invalid dimensions. Please review your input.");
		return;
		}

	
	for (row=1;row<=num_rows;row++)
	{
		for (col=1;col<=num_cols;col++)
		{
			sNewEntryName='entries[]';
			if (col>num_cols-augmented_cols)
			{
				sEntryClass="augmented";
			}
			else
			{
				sEntryClass="entry";
			}
			$("<input/>",{
			//	id: sNewEntryName,
				name: sNewEntryName,
				//pattern: '^[+-]?\\d*(.\\d*)?',
				type: "text",
				class: sEntryClass,
				value: Math.floor(Math.random()*4-2)
			}).appendTo("#matrix_entries");
		}
		$("#matrix_entries").append("<br/>");
	}
	$("<br/>",{}).appendTo("#matrix_entries");	
	$("<a/>",{
		onclick:"doCompute();",
		html: "Compute"
	}).appendTo("#matrix_entries");
	
	$("#dimensionForm").hide();
	$("#matrix_entries").show();
}

//	when matrix is submitted
$("#frmMatrix").submit(function(event){
	//	do not submit form
	event.preventDefault();
	
	//	hide input and show output
	$("#inputDiv").hide();
	$("#computeDiv").show();
	
	//	read the matrix from input 
	num_rows=$("#num_rows").val();
	num_cols=$("#num_cols").val();
	augmented_cols =$("#augmentedCols").val();	
	

	var aMatrix = [];
	var aInputMatrix = $("input[name='entries\\[\\]']");
	
	for (row=1;row<=num_rows;row++)
	{
		aMatrix[row]=[];	
		for (col=1;col<=num_cols;col++)
		{
			aMatrix[row][col]=aInputMatrix.eq((row-1)*num_cols+(col-1)).val();
		}
	}	
	
	//	new matrix object
	objMatrix = new matrix(aMatrix,augmented_cols);
//	display the matrix in output div
//	writeOutputToElement("original_matrix",objMatrix.displayEntries());		
	//	what operation
	switch ($("#operation").val())
	{
		case "Gauss":
			writeOutputToElement("computation_result",objMatrix.doGauss(),"step");
			break;
		case "Gauss-Jordan":
			writeOutputToElement("computation_result",objMatrix.doGaussJordan(),"step");
			break;
		case "findDet":
			writeOutputToElement("computation_result",objMatrix.findDet(),"step");
			break;
		case "inverse":
			writeOutputToElement("computation_result",inverse(objMatrix.entries),"step");
	}
	//initSlider();
	$("#step1").show();
})

function initSlider(){
	//	Get slider info
	slideCount = $('#slider div.step').length;
	slideWidth = $('#slider div.step').width();
	slideHeight = $('#slider div.step').height();
	sliderUIWidth = slideCount * slideWidth;
	currentSlide=1;
	
	//	Set Slider width
	$('#outputDiv').css({ width: slideWidth, height: slideHeight });
	$("#slider").css({ width: sliderUIWidth, marginLeft:0,left:0});
	//slideFirst();
}
//form control
function slideLeft(){
	if (currentSlide<slideCount)
	{
		$("#slider").animate({
			left:"-="+slideWidth
		})
		currentSlide++;
	}
	
}

function slideRight(){
	if (currentSlide>1)
	{
		$("#slider").animate({
			left:"+="+slideWidth
		})
		currentSlide--;
	}
}
function slideLast(){
	$("#slider").animate({
		left:-sliderUIWidth+slideWidth
	})
	currentSlide=slideCount;
}
function slideFirst(){
	$("#slider").animate({
		left:0
	})
	currentSlide=1;
}

//	Step control form
//	previous button
$("#previous").click(function(){
	slideRight();
//	var currStep = $("div.step:visible");
//	if (currStep.attr("id")!="step1")
//	{
//		currStep.toggle("slide");
//		currStep.prev().toggle({direction:"left",easing:"linear"});
//	}
});

//	next button
$("#next").click(function(){
	slideLeft();
//	var currStep = $("div.step:visible");
//	if (currStep.attr("id")!="computation_result")
//	{
//		currStep.toggle({easing:"linear"});
//		currStep.next().toggle({easing:"linear"});
//	}
});

//	last button
$("#last").click(function(){
	slideLast();
//	var currStep=$("div.step:visible");
//	currStep.toggle({easing:"linear"});
//	$("#computation_result").toggle({easing:"linear"});
});

//	first button
$("#first").click(function(){
	slideFirst();
//	var currStep=$("div.step:visible");
//	currStep.toggle({easing:"linear"});
//	$("#step1").toggle({easing:"linear"});
});

$("#goBack").click(function(event){
	event.preventDefault();
	$("#slider").empty();
	$("#inputDiv").show();
	$("#dimensionForm").show();
	$("#matrix_entries").hide();
	$("#computeDiv").hide();
});
