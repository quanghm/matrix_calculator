/**
 * 
 */
function setDimension(){
	$("#matrix_entries").empty();
	num_rows=$("#num_rows").val();
	num_cols=$("#num_cols").val();
	augmented_cols =$("#augmented_cols").val();

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
	writeOutputToElement("original_matrix",objMatrix.displayEntries());		
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
	$("#step1").show();
}

//	Step control form
//	previous button
$("#previous").click(function(){
	var currStep = $("div.step:visible");
	if (currStep.attr("id")!="step1")
	{
		currStep.hide();
		currStep.prev().show();
	}
});

//	next button
$("#next").click(function(){
	var currStep = $("div.step:visible");
	if (currStep.attr("id")!="computation_result")
	{
		currStep.hide();//animate({width:'toggle'},350);
		currStep.next().show();//animate({width:'toggle'},350);
	}
});

//	last button
$("#last").click(function(){
	var currStep=$("div.step:visible");
	currStep.hide();
	$("#computation_result").show();
});

//	first button
$("#first").click(function(){
	var currStep=$("div.step:visible");
	currStep.hide();
	$("#step1").show();
});

$("#goBack").click(function(event){
	event.preventDefault();
	$("#slider").empty();
	$("#inputDiv").show();
	$("#dimensionForm").show();
	$("#matrix_entries").hide();
	$("#computeDiv").hide();
})