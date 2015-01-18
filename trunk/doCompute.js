/**
 * 
 */
$("#matrix_dim").submit(function(event){
	event.preventDefault();
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
				value: Math.floor(rand(0,2))
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
//	//	display the matrix in output div
	writeOutputToElement("original_matrix",objMatrix.displayEntries());		
	//	what operation
//	writeOutputToElement("step0",objMatrix.multiplyRow(1,x));
//	writeOutputToElement("step1",objMatrix.addMultipleOfRow(2,1,1.2));
//	writeOutputToElement("step2",objMatrix.displayEntries());		
//	writeOutputToElement("step3",objMatrix.interchangeRows(2,1));
//	writeOutputToElement("step4",objMatrix.displayEntries());		
	
	objMatrix.doGauss();
//	writeOutputToElement("Test",objMatrix.findNextPivot(1,1));

	//	display result
	//	$("#outputDiv").append(eleOutput);
})
$("#frmResult").submit(function(event){
	event.preventDefault();
	$("#outputDiv").empty();
	$("#inputDiv").show();
	$("#computeDiv").hide();
})