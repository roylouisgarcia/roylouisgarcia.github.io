var userChoice = "";
var computerChoice = "";
var playerScore = 0;
var computerScore = 0;
var userIcon = "";
var computerIcon = "";



var showScores = function (){
  var playerScoreButton = "Player: ";
  var computerScoreButton = "Computer: "; 
  var x = 0, y = 0; 
  for (var i = 0; i < playerScore; i++){
      y = i+1;
      playerScoreButton += '<button type="button" id="rock" class="btn btn-primary" disabled>'+ y +'</button>';
  }  
  document.getElementById("playerScoreButton").innerHTML = playerScoreButton;
  

  for (var i = 0; i < computerScore; i++){
      x = i+1;
      computerScoreButton += '<button type="button" id="rock" class="btn btn-success" disabled>'+ x +'</button>';
  }  
  document.getElementById("computerScoreButton").innerHTML = computerScoreButton;  
    

if (playerScore >= 10){
   document.getElementById("score").innerHTML = "<h3><strong>You</strong> are the Winner, Thank you for playing!</h3>";
   $("#reset").fadeIn("slow");
   $("#playmore").prop('disabled', true);

}
if (computerScore >= 10){
   document.getElementById("score").innerHTML = "<h3>Better luck next time. <strong>Computer</strong> won!</h3>";
   $("#reset").fadeIn("slow");
   $("#playmore").prop('disabled', true);
}

};

var startGame = function (){
    computerChoice = Math.random();
    if (computerChoice > 0 && computerChoice <= 0.33 ) {
	    computerChoice = "rock";
      computerIcon = '<image class="computerIcon" src="./images/rock1.png"/>';
    } else if (computerChoice >= 0.34 && computerChoice <= 0.67)  {
	    computerChoice = "paper";
      computerIcon = '<image class="computerIcon" src="./images/paper1.png"/>';
    } else {
	  computerChoice = "scissors";
      computerIcon = '<image class="computerIcon" src="./images/scissors1.png"/>';
    } 
 
};


$( "#rock" ).click(function() {
 userChoice = "rock";
 userIcon = '<image  class="handIcon" src="./images/rock2.png"/>'; 
 document.getElementById("winner").innerHTML =  compare(userChoice, computerChoice);
 document.getElementById("playerHand").innerHTML = userIcon;
 document.getElementById("computerHand").innerHTML = computerIcon;
 showScores();
  $("#rock").prop('disabled', true);
  $("#paper").prop('disabled', true);
  $("#scissors").prop('disabled', true);
  $("#playmore").prop('disabled', false); 
  $("#playmore").fadeIn("slow");
});

$( "#scissors" ).click(function() {
  userChoice ="scissors";
  userIcon = '<image class="handIcon" src="./images/scissors2.png"/>';
  document.getElementById("winner").innerHTML = compare(userChoice, computerChoice);
  document.getElementById("playerHand").innerHTML = userIcon;
  document.getElementById("computerHand").innerHTML = computerIcon;
     showScores();
  $("#rock").prop('disabled', true);
  $("#paper").prop('disabled', true);
  $("#scissors").prop('disabled', true);
   $("#playmore").prop('disabled', false);
   $("#playmore").fadeIn("slow");

});

$( "#paper" ).click(function() {
  userChoice ="paper";
  userIcon = '<image class="handIcon" src="./images/paper2.png"/>';
  document.getElementById("winner").innerHTML = compare(userChoice, computerChoice);
  document.getElementById("playerHand").innerHTML = userIcon;
 document.getElementById("computerHand").innerHTML = computerIcon; 
     showScores();
    $("#rock").prop('disabled', true);
    $("#paper").prop('disabled', true);
    $("#scissors").prop('disabled', true);
    $("#playmore").prop('disabled', false);
   $("#playmore").fadeIn("slow");

});  
  
$( "#playmore" ).click(function() {
  if ((playerScore < 10)&&(computerScore < 10)){
    document.getElementById("score").innerHTML= "";
    $("#rock").prop('disabled', false);
    $("#paper").prop('disabled', false);
    $("#scissors").prop('disabled', false);
    showScores();  
    startGame();
  }  
});  

$( "#reset" ).click(function() {
  document.getElementById("winner").innerHTML= "";
  document.getElementById("score").innerHTML= "";
  document.getElementById("playerScoreButton").innerHTML= "";
  document.getElementById("computerScoreButton").innerHTML= ""; 
  document.getElementById("playerHand").innerHTML= "";
  document.getElementById("computerHand").innerHTML= ""; 
  $("#rock").prop('disabled', false);
  $("#paper").prop('disabled', false);
  $("#scissors").prop('disabled', false);
  $("#playmore").prop('disabled', true);
  playerScore = 0;
  computerScore = 0;
  startGame();
  $("#playmore").fadeOut("slow");
  $("#reset").fadeOut("slow");

});  

var compare = function (choice1, choice2){
    
  if (choice1 === choice2) {
        return '<image class="refIcon" src="./images/tiescoreref.png"/>';
    }else if (choice1 === "rock"){
        if (choice2 === "scissors"){
            playerScore++;
            return '<image class="refIcon" src="./images/playerscoreref.png"/>';
        }else{
            computerScore++;
            return '<image class="refIcon" src="./images/computerscoreref.png"/>';
        }
    }else if (choice1 === "paper"){
        if (choice2 === "rock"){
            playerScore++;
            return '<image class="refIcon" src="./images/playerscoreref.png"/>';
    
        }else{
            computerScore++;
            return '<image class="refIcon" src="./images/computerscoreref.png"/>';
  
        }
    }else if (choice1 === "scissors"){
        if (choice2 === "rock"){
            computerScore++;
            return '<image class="refIcon" src="./images/computerscoreref.png"/>';

        }else{
            playerScore++;
            return '<image class="refIcon" src="./images/playerscoreref.png"/>';

        }
    }
};


startGame();