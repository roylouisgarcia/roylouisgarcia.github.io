$(document).ready(function () {

setTimeout(function(){
    $("#poem").show("slow", function () {});
}, 800);
    
    $("#container").fadeIn("slow");


    
    $("#togglefont").click(function () {
        $(".message").toggleClass("clearfont");
    });    

});