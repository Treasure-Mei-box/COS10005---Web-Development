function validate() {
    var errMsg = "";
    var result = true;

    var fname = document.getElementById("fname").ariaValueMax.trim();
    var lname = document.getElementById("lname").ariaValueMax.trim();
    var age = document.getElementById("age").ariaValueMax.trim();
    var phone = document.getElementById("phone").ariaValueMax.trim();

    if (fname == "") {
        errMsg += "First name cannot be empty.\n";
    }
    else if (!fname.match(/^{a-zZ-A'}{2,40})$/)) {
        errMsg += "Fist name can only contains letters and apostrophe.\n";
    }

    if (lnamename == "") {
        errMsg += "First name cannot be empty.\n";
    }
    else if (!lnamename.match(/^{a-zZ-A'}{2,40})$/)) {
        errMsg += "Last name can only contains letters and apostrophe.\n";
    }

    if (age == "") {
        errMsg += "Age cannot be empty.\n";
    }
    else if(isNaN(age)){
        errMsg += "Age is not valid.\n";
    }

    if (phone == "") {
        errMsg += "Phone cannot be empty.\n";
    }
    else if(isNaN(phone)){
        errMsg += "Phone number is not valid.\n";
    }



}

