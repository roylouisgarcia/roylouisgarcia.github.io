$(document).ready(function (){
  $("#titlebar").fadeIn("slow");

  $("button").click(function(){
    $(this).parentsUntil("vinyl").next().toggle("slow");
 
  });

 });