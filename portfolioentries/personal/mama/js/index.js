$(document).ready(function () {

setTimeout(function(){
    $("#letter").show("slow", function () {});
}, 800);
    
    $("#container").fadeIn("slow");
    

    $("#btnpoem").click(function () {
        $("#poem").show("slow", function () {});
        $("#letter").hide("slow", function () {});        
        $("#psnote").hide("slow", function () {});
    });
    

    $("#btnletter").click(function () {
        $("#poem").hide("slow", function () {});
        $("#letter").show("slow", function () {});        
        $("#psnote").hide("slow", function () {});
    });

    $("#btnpsnote").click(function () {
        $("#poem").hide("slow", function () {});
        $("#letter").hide("slow", function () {});        
        $("#psnote").show("slow", function () {});
    });
    
    $("#togglefont").click(function () {
        $(".message").toggleClass("clearfont");
    });    

});