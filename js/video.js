var video_player = document.getElementById("video_player");
var video = video_player.getElementsByTagName("video")[0];
var video_links = video_player.getElementsByTagName("figcaption")[0];
var source = video.getElementsByTagName("source");
var link_list = [];
var path = '/media/';
var currentVid = 0;
var allLnks = video_links.children;
var lnkNum = allLnks.length;

video.removeAttribute("controls");
video.removeAttribute("poster");


function playVid(index) {
		video_links.children[index].classList.add("currentvid");
		source[0].src = path + link_list[index] + ".mp4";
		currentVid = index;
		video.load();
		video.play();
}
    
for (var i=0; i<lnkNum; i++) {
		var filename = allLnks[i].href;
		link_list[i] = filename.match(/([^\/]+)(?=\.\w+$)/)[0];
			(function(index){
				allLnks[i].onclick = function(i){
					i.preventDefault();
						for (var i=0; i<lnkNum; i++) {
							allLnks[i].classList.remove("currentvid");
						}
					playVid(index);
				}
		})(i);
}
    
 video.addEventListener('ended', function () {
	allLnks[currentVid].classList.remove("currentvid");
	if ((currentVid + 1) >= lnkNum) {
		nextVid = 0;
	} else {
		nextVid = currentVid+1; 
	}
	playVid(nextVid);
})
    
video.addEventListener('mouseenter', 
	function() {
		video.setAttribute("controls","true");
})
    
video.addEventListener('mouseleave', function() {
		video.removeAttribute("controls");
})

