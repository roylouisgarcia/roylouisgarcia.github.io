/* variable Declarations*/
var firstName = "";
var secondName = "";
var invalidNameflag = 0;
var fatesComment = "I am Fate! <br> If you suddenly change your mind, click my picture and enter another person\'s name. Now, if you are ready to find out what FLAMES have in store for both of you, press \"Continue\"";


$( document ).ready(function() {
    $(".jumbotron").fadeIn("slow");
    $(".panel-body").fadeIn("slow");
    $(".panel-footer").fadeIn("slow");
});


function inputPolice(name) {
    invalidNameflag = 0;
    var patt = /[^.abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVEXYZ ]/gi;
    if (patt.test(name) || (name === "")) {
        invalidNameflag = invalidNameflag + 1;
        return "Ooops Please enter a valid name that does not have a digit, a period, or weird characters. Please, " + name + " , try again. Click Fate's picture to enter your valid name.";
    } else {
        return name;
    }
}

function processFlames(name1, name2){
    var name1L = name1.toLowerCase();
    var name2L = name2.toLowerCase();
    var pattNoSpace = / /g;
    var pattNoPeriod = /\./g;
    var name1Lwospace = name1L.replace(pattNoSpace, "");
    var name2Lwospace = name2L.replace(pattNoSpace, "");
    var name1LwospaceNperiod = name1Lwospace.replace(pattNoPeriod, "");
    var name2LwospaceNperiod = name2Lwospace.replace(pattNoPeriod, "");
    
    var name1U = name1LwospaceNperiod.split('').filter(function(item, i, ar){ return ar.indexOf(item) === i; }).join('');
    var name2U = name2LwospaceNperiod.split('').filter(function(item, i, ar){ return ar.indexOf(item) === i; }).join('');
    
    var nameboth = "";
    for (var x = 0;   x < name1U.length; x++){
        
        for (var y = 0;   y < name2U.length; y++){
        
            if (name1U[x] === name2U[y]){
                nameboth += name2U[y];
                
            }
        
        } 
        
    }
    
  
    var namebothU = nameboth.split('').filter(function(item, i, ar){ return ar.indexOf(item) === i; }).join('');
    
    var name1Counter = 0;
    var name2Counter = 0;
    var name1x, name2y, namebz;
    
    
    for (name1x = 0;   name1x < name1LwospaceNperiod.length; name1x++){
        
        for (namebz = 0;   namebz < namebothU.length; namebz++){
        
            if (name1LwospaceNperiod[name1x] === namebothU[namebz]){
                name1Counter +=1;
                
            }
        
        } 
        
    }
    
    for (name2y = 0;   name2y < name2LwospaceNperiod.length; name2y++){
        
        for (namebz = 0;   namebz < namebothU.length; namebz++){
        
            if (name2LwospaceNperiod[name2y] === namebothU[namebz]){
                name2Counter +=1;
                
            }
        
        } 
        
    }

 
    var name1CounterEvaluated = "";
    var name2CounterEvaluated = "";
    var nameBCounterEvaluated = "";
    
    switch(name1Counter%6) {
      case 1:
          name1CounterEvaluated = "<strong class=\"bigLetter\">F</strong>LAMES for <strong class=\"bigLetter\">Friends</strong>";
          break;
      case 2:
          name1CounterEvaluated = "F<strong class=\"bigLetter\">L</strong>AMES for <strong class=\"bigLetter\">Love</strong>";
           break;
      case 3:
          name1CounterEvaluated = "FL<strong class=\"bigLetter\">A</strong>MES for <strong class=\"bigLetter\">Affair</strong>";
          break;
      case 4:
          name1CounterEvaluated = "FLA<strong class=\"bigLetter\">M</strong>ES for <strong class=\"bigLetter\">Marriage</strong>";
          break;
      case 5:
          name1CounterEvaluated = "FLAM<strong class=\"bigLetter\">E</strong>S for <strong class=\"bigLetter\">Enemies</strong>";
          break;
        case 0:
          name1CounterEvaluated = "FLAME<strong class=\"bigLetter\">S</strong> for <strong class=\"bigLetter\">Social</strong>";
          break;
    }
    
    switch(name2Counter%6) {
      case 1:
          name2CounterEvaluated = "<strong class=\"bigLetter\">F</strong>LAMES for <strong class=\"bigLetter\">Friends</strong>";
          break;
      case 2:
          name2CounterEvaluated = "F<strong class=\"bigLetter\">L</strong>AMES for <strong class=\"bigLetter\">Love</strong>";
           break;
      case 3:
          name2CounterEvaluated = "FL<strong class=\"bigLetter\">A</strong>MES for <strong class=\"bigLetter\">Affair</strong>";
          break;
      case 4:
          name2CounterEvaluated = "FLA<strong class=\"bigLetter\">M</strong>ES for <strong class=\"bigLetter\">Marriage</strong>";
          break;
      case 5:
          name2CounterEvaluated = "FLAM<strong class=\"bigLetter\">E</strong>S for <strong class=\"bigLetter\">Enemies</strong>";
          break;
        case 0:
          name2CounterEvaluated = "FLAME<strong class=\"bigLetter\">S</strong> for <strong class=\"bigLetter\">Social</strong>";
          break;
    }
    switch((name1Counter+name2Counter)%6) {
      case 1:
          nameBCounterEvaluated = "be <strong class=\"bigLetter\">friends</strong> to";
          break;
      case 2:
          nameBCounterEvaluated = "to <strong class=\"bigLetter\">love</strong>";
           break;
      case 3:
          nameBCounterEvaluated = "have an <strong class=\"bigLetter\"> affair </strong> with";
          break;
      case 4:
          nameBCounterEvaluated = "be <strong class=\"bigLetter\"> married </strong> to ";
          break;
      case 5:
          nameBCounterEvaluated = "be <strong class=\"bigLetter\">enemies</strong> of ";
          break;
        case 0:
          nameBCounterEvaluated = "be <strong class=\"bigLetter\">social</strong> to ";
          break;
    }
    
   

  /*  document.getElementById("invalidNameFlag").innerHTML = 'name1L: ' + name1L + '<br>name2L: ' + name2L + '<br>name1Lwospace: ' + name1Lwospace + '<br>name2Lwospace: ' + name2Lwospace + '<br>name1LwospaceNperiod: ' + name1LwospaceNperiod + '<br>name2LwospaceNperiod:'+ name2LwospaceNperiod + '<br>nameboth: ' + nameboth + '<br>namebothU: '+ namebothU + '<br>name1Counter: '+ name1Counter + '<br>name2Counter: '+ name2Counter + '<br>name1CounterEvaluated: ' + name1CounterEvaluated + '<br>name2CounterEvaluated: ' + name2CounterEvaluated + '<br>nameBCounterEvaluated: '  + nameBCounterEvaluated + '<br>'; */
    
    document.getElementById("fatesComment").innerHTML = name1 + " and " + name2 + ". You're bound to "  + nameBCounterEvaluated + 'each other!<br>';
    
    document.getElementById("yourname").innerHTML = name1;
    document.getElementById("lover1").innerHTML ='<br>' + 'common letters: ' + name1Counter + '<br>' + "result: " + name1CounterEvaluated + '<br>';
    document.getElementById("person2").innerHTML = name2;
    document.getElementById("lover2").innerHTML ='<br>' + 'common letters: ' + name2Counter + '<br>' + "result: " + name2CounterEvaluated + '<br>';

}





$("#submit").on("click", function () {
    $(".container").show("slow");
    $(".panel-default").hide("slow");
    document.getElementById("fatesComment").innerHTML = fatesComment;
    firstName = document.getElementById("p1Name").value;
    secondName = document.getElementById("p2Name").value;
    document.getElementById("lover1").innerHTML = inputPolice(firstName);
    document.getElementById("lover2").innerHTML = inputPolice(secondName);
    if (invalidNameflag > 0) {
        $("#continuebtn").prop("disabled", true);
    } else {
        $("#continuebtn").prop("disabled", false);
    }
   // document.getElementById("invalidNameFlag").innerHTML = invalidNameflag + firstName + secondName;
});


$("#cupid").on("click", function () {
    $(".container").hide("slow");
    $(".panel-default").show("slow");
    document.getElementById("demo").innerHTML = fatesComment;
    document.getElementById("p1Name").innerHTML = "";
    document.getElementById("p2Name").innerHTML = "";
    document.getElementById("lover1").innerHTML = "";
    document.getElementById("lover2").innerHTML = "";
    invalidNameflag = 0;
   // document.getElementById("invalidNameFlag").innerHTML = invalidNameflag + firstName + secondName;
});


$("#continuebtn").on("click", function () {
    document.getElementById("fatesComment").innerHTML = "Here is your future.. ";
    document.getElementById("lover1").innerHTML = firstName;
    document.getElementById("lover2").innerHTML = secondName;
    $("#finishbtn").fadeIn("slow");
    $("#continuebtn").hide("slow");
    $("#cupid").hide("slow");
    processFlames(firstName, secondName);

});
