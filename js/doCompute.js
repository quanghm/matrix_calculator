/**
 * 
 */
$("#btnSetDim").click(function(event){
//	event.preventDefault();
	$("#matrix_entries").empty();
	num_rows=$("#num_rows").val();
	num_cols=$("#num_cols").val();
	augmented_cols =$("#augmentedCols").val();
	$("<input/>",{
		id: "augmented_Cols",
		name: "augmented_Cols",
		type: "hidden",
		value: augmented_cols
	}).appendTo("#matrix_entries");

	for (row=1;row<=num_rows;row++)
	{
		for (col=1;col<=num_cols;col++)
		{
			//sNewEntryName="e["+row+"]["+col+"]";
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
				value: Math.floor(rand(-2,2))
			}).appendTo("#matrix_entries");
		}
		$("#matrix_entries").append("<br/>");
	}
})

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
	switch ($("#operationType").val())
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
	initSlider();
})

function initSlider(){
	$("#step1").toggleClass("stepshow");
}

//	Step control form
//	previous button
$("#previous").click(function(){
	var currStep = $("div.stepshow");
	if (currStep.attr("id")!="step1")
	{
		currStep.toggleClass("stepshow");
		currStep.prev	().toggleClass("stepshow");
	}
});

//	next button
$("#next").click(function(){
	var currStep = $("div.stepshow");
	if (currStep.attr("id")!="computation_result")
	{
		currStep.toggleClass("stepshow");
		currStep.next().toggleClass("stepshow");
	}
});

//	last button
$("#last").click(function(){
	var currStep=$("div.stepshow");
	currStep.toggleClass("stepshow");
	$("#computation_result").toggleClass("stepshow");
});

//	first button
$("#first").click(function(){
	var currStep=$("div.stepshow");
	currStep.toggleClass("stepshow");
	$("#step1").toggleClass("stepshow");	
});

$("#goBack").click(function(event){
	event.preventDefault();
	$("#slider").empty();
	$("#inputDiv").show();
	$("#computeDiv").hide();
})