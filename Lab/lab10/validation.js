/* function validate()will validate form data */
function validate() {
	//var sid = document.getElementById("sid").value;
	var sid = $("#sid").val();
	//var pwd1 = document.getElementById("pwd1").value;
	var pwd1 = $("#pwd1").val();
	//var pwd2 = document.getElementById("pwd2").value;
	var pwd2 = $("#pwd2").val();
	//var uname = document.getElementById("uname").value;
	var uname = $("#uname").val();
	//var genm = document.getElementById("genm").checked;
	var genm = $("#genm").prop("checked");
	//var genf = document.getElementById("genf").checked;
	var genf = $("#genf").prop("checked");

	var errMsg = "";								/* create variable to store the error message */
	var result = true;								/* assumes no errors */
	var pattern = /^[a-zA-Z ]+$/;					/* regular expression for letters and spaces only */

	/* Rule 1, check if all required date are entered */
	if (sid == "") { //check whether User ID is empty
		errMsg += "<li>User ID cannot be empty.</li>";
	}
	if (pwd1 == "") { //check whether Password is empty
		errMsg += "<li>Password cannot be empty.</li>";
	}
	if (pwd2 == "") { //check whether re-typed Password is empty
		errMsg += "<li>Retype password cannot be empty.</li>";
	}
	if (uname == "") { //check whether User Name is empty
		errMsg += "<li>User name cannot be empty.</li>";
	}
	if ((!genm) && (!genf)) { //check whether gender is selected
		errMsg += "<li>A gender must be selected.</li>";
	}
	/* Rule 2, check if the user ID contains an @ symbol */
	if (sid.indexOf('@') == 0) {
		errMsg += "<li>User ID cannot start with an @ symbol.</li>";
	}
	if (sid.indexOf('@') < 0) {
		errMsg += "<li>User ID must contain an @ symbol.</li>";
	}
	/* Rule 3, check if password and retype password are the same */
	if (pwd1 != pwd2) {
		errMsg += "<li>Passwords do not match.</li>";
	}
	/* Rule 4, check if user name contains only letters and spaces */
	if (!uname.match(pattern)) {
		errMsg += "<li>User name contains symbols.</li>";
	}

	/* Display error message if any error(s) is/are detected */
	if (errMsg != "") {
		errMsg = "<div id='scrnOverlay'></div>"	// 8.3 Create div to cover entire page
			+ "<section id='errWin' class='window'><ul>"	// 8.4 UL + section + Close button
			+ errMsg
			+ "</ul><a href='#' id='errBtn' class='button'>Close</a></section>"; //in instruction, class ='button', but in CSS class = 'buttonrow'
		var numOfItems = (errMsg.match(/<li>/g)).length;	// 8.5 Count errors
		$("body").after(errMsg);	// 8.6 Insert immediately after body element
		$("#scrnOverlay").css("visibility", "visible");	// 8.7 Make overlay visible
		$("#errWin").css("height", numOfItems + 6 + "em");	// 8.8 Adjust height
		$("#errWin").css("margin-top", "-" + ((numOfItems + 6) / 2) + "em");	// 8.8 Centre vertically
		$("#errWin").show();	// 8.9 Make popup visible (overrides .window display:none)
		$("#errBtn").click(function() {	// 8.10 Close button removes overlay + popup
			$("#scrnOverlay").remove();
			$("#errWin").remove();
		});
		result = false;
	}
	return result;
}

/* link HTML elements to corresponding event function */
function init() {
	/* assign the <form> element to variable regForm */
	// var regForm = document.getElementById("regform");

	/* link function validate() to the onsubmit event of the form */
	// regForm.onsubmit = validate;  
	$("#regform").submit(validate);
	$(".collapse").click(toggle);
}

function toggle() {
	$(this).parent().next().slideToggle();
	if ($(this).html() == "[-]") {
		$(this).html("[+]");
	}
	else {
		$(this).html("[-]");
	}
	return false;
}

/* execute function init() once the window is loaded*/
//window.onload = init;
$(document).ready(init);