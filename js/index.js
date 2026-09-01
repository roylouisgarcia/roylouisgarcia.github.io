// Slideshow state, declared up front so it's never in the temporal dead
// zone regardless of when/where an init function ends up getting called
// from (a $(document).ready() callback can fire synchronously as soon as
// it's registered if the document is already parsed -- which it is here,
// since this script loads at the end of <body> -- so anything called from
// early in this file must not depend on a `let`/`const` declared later on).
let currentSitesSlideIndex = 0;
let currentSitesSlides = [];
let moocSlideIndex = 0;
let moocSlides = [];
let currentFeaturedSlideIndex = 0;
let featuredSlides = [];
let hartnellCurrentSlideIndex = 0;
let hartnellSlides = [];
let skillsCurrentSlideIndex = 0;
let skillsSlides = [];
let interestsCurrentSlideIndex = 0;
let interestsSlides = [];

$(document).ready(function(){

    // Set default state - all project tabs hidden
    hideAllProjectTabs();
    // Defer the initial "Current" tab render by a tick. This ready() callback
    // runs synchronously during parse (the <script> sits at the end of
    // <body>), and showCurrentSitesTab()'s .show(..., complete) callback can
    // fire synchronously straight into loadCurrentSitesSlides(), which reads
    // `currentSitesData` -- a const declared further down this file and still
    // in the temporal dead zone at that moment. The ReferenceError it threw
    // aborted the rest of this block, so the project-tab click handlers below
    // never bound. One tick lets the whole file finish initializing first.
    setTimeout(showCurrentSitesTab, 0);

 $(".navbar a, footer a[href='#myPage']").on('click', function(event) {

    // Auto-hide mobile menu after 3 seconds on smaller devices
    if ($(window).width() <= 768) {
      setTimeout(function() {
        $('.navbar-collapse').collapse('hide');
      }, 3000);
    }

    if (this.hash !== "") {

      event.preventDefault();

      var hash = this.hash;

      // Handle specialization section visibility
      if (hash === '#specialization') {
        // Show specialization section and its jumbotron
        $('#specialization').show('fast');
        $('.jumbotron-before-specialization').show('fast');
        // Hide all project tabs when going to specialization
        hideAllProjectTabs();
      } else if (hash === '#projects') {
        // Hide specialization section and its jumbotron when navigating to projects
        $('#specialization').hide('fast');
        $('.jumbotron-before-specialization').hide('fast');
        // Show Featured tab when going to projects
        showCurrentSitesTab();
      } else {
        // Hide specialization section and its jumbotron when navigating to other sections
        $('#specialization').hide('fast');
        $('.jumbotron-before-specialization').hide('fast');
        // Hide all project tabs when going to other sections
        hideAllProjectTabs();
      }

      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 900, function(){
   
        window.location.hash = hash;
      });
    } else {
      // Handle external links (like COURSES) - hide all project tabs
      hideAllProjectTabs();
    }
     
    defaultAbout();
  });
    
    // Books toggle now handled by interests slideshow
    // $("#books-toggle").click(function(){
    //     $(".books").toggle("fast", function(){}); 
    // });
    
    $("#professionalDetailsbtn").click(function(){
        $("#professionalDetails").toggle("fast", function(){
            // Update button text based on visibility
            if ($("#professionalDetails").is(":visible")) {
                $("#professionalDetailsbtn").text("HIDE DETAILS");
            } else {
                $("#professionalDetailsbtn").text("CLICK HERE FOR MORE DETAILS");
            }
        }); 
    });
    
    $("#personalDetailsBtn").click(function(){
        $("#personalDetails").toggle("fast", function(){
            // Update button text based on visibility
            if ($("#personalDetails").is(":visible")) {
                $("#personalDetailsBtn").text("HIDE DETAILS");
            } else {
                $("#personalDetailsBtn").text("CLICK HERE FOR MORE DETAILS");
            }
        }); 
    });
    
  $("#link2Academic").click(function(){
    $(".academic").show("fast", function(){});
    $(".professional").hide("fast", function(){});
    $(".personal").hide("fast", function(){});
    $(".currentsites").hide("fast", function(){});
    $("#link2Academic").addClass("active");
    $("#link2Professional").removeClass("active");
    $("#link2Personal").removeClass("active");
    $("#link2CurrentSites").removeClass("active");
    updateMobileTabOrder('link2Academic');
  });

  $("#link2Professional").click(function(){
    $(".academic").hide("fast", function(){});
    $(".professional").show("fast", function(){});
    $(".personal").hide("fast", function(){});
    $(".currentsites").hide("fast", function(){});
    $("#link2Academic").removeClass("active");
    $("#link2Professional").addClass("active");
    $("#link2Personal").removeClass("active");
    $("#link2CurrentSites").removeClass("active");
    updateMobileTabOrder('link2Professional');
  });

  $("#link2Personal").click(function(){
    $(".academic").hide("fast", function(){});
    $(".professional").hide("fast", function(){});
    $(".personal").show("fast", function(){
      // Initialize the featured slideshow if not already done
      if (!window.featuredInitialized) {
        initializeFeaturedSlideshow();
        window.featuredInitialized = true;
      }
    });
    $(".currentsites").hide("fast", function(){});
    $("#link2Academic").removeClass("active");
    $("#link2Professional").removeClass("active");
    $("#link2Personal").addClass("active");
    $("#link2CurrentSites").removeClass("active");
    updateMobileTabOrder('link2Personal');
  });

  $("#link2CurrentSites").click(function(){
    $(".academic").hide("fast", function(){});
    $(".professional").hide("fast", function(){});
    $(".personal").hide("fast", function(){});
    $(".currentsites").show("fast", function(){
      // Initialize the Current Sites slideshow if not already done
      if (!window.currentSitesInitialized) {
        initializeCurrentSitesSlideshow();
        window.currentSitesInitialized = true;
      }
    });
    $("#link2Academic").removeClass("active");
    $("#link2Professional").removeClass("active");
    $("#link2Personal").removeClass("active");
    $("#link2CurrentSites").addClass("active");
    updateMobileTabOrder('link2CurrentSites');
  });

  $("#associate").click(function () {
      $("#associate").css("opacity", "1");
      $("#bachelors").css("opacity", ".6");
      $("#graduate").css("opacity", ".6");
      $("#hartnell").show("fast", function () {});
      $("#csumb").hide("fast", function () {});
      $("#capella").hide("fast", function () {});
      hideAcademicProjects();
  });

  $("#bachelors").click(function () {
      $("#associate").css("opacity", ".6");
      $("#bachelors").css("opacity", "1");
      $("#graduate").css("opacity", ".6");  
      $("#hartnell").hide("fast", function () {});
      $("#csumb").show("fast", function () {});
      $("#capella").hide("fast", function () {});
      hideAcademicProjects();
  });

  $("#graduate").click(function () {
      $("#associate").css("opacity", ".6");
      $("#bachelors").css("opacity", ".6");
      $("#graduate").css("opacity", "1");  
      $("#hartnell").hide("fast", function () {});
      $("#csumb").hide("fast", function () {});
      $("#capella").show("fast", function () {});
      hideAcademicProjects();
  });
    
    
  $("#boyimage").click(function(){
      $("#adultimage").css("opacity", ".6");
      $("#teenagerimage").css("opacity", ".6");
      $("#boyimage").css("opacity", "1");
      $(".adult").hide("slow", function(){});
      $(".boy").show("slow", function(){});
      $(".teenager").hide("slow", function(){});
  });
  
    $("#teenagerimage").click(function(){
      $("#teenagerimage").css("opacity", "1");    
      $("#adultimage").css("opacity", ".6");
      $("#boyimage").css("opacity", ".6");    
      $(".adult").hide("slow", function(){});
      $(".boy").hide("slow", function(){});
      $(".teenager").show("slow", function(){});
  });
    $("#adultimage").click(function(){
      $("#adultimage").css("opacity", "1");    
      $("#boyimage").css("opacity", ".6");
      $("#teenagerimage").css("opacity", ".6");
      $(".adult").show("slow", function(){});
      $(".boy").hide("slow", function(){});
      $(".teenager").hide("slow", function(){});
    });
    
    $("#hartnellcoursesbtn").click(function(){
       $("#hartnellcourses").toggle("fast");
       $("#hartnellcoursesbtn").toggleClass("totiebtnActive");
       // Close projects panel if it's open
       $("#hartnellprojects").hide("fast");
       $("#hartnellprojectsbtn").removeClass("totiebtnActive");
    });
    
    $("#hartnellprojectsbtn").click(function(){
       $("#hartnellprojects").toggle("fast");
       $("#hartnellprojectsbtn").toggleClass("totiebtnActive");
       // Close courses panel if it's open
       $("#hartnellcourses").hide("fast");
       $("#hartnellcoursesbtn").removeClass("totiebtnActive");
    });
    
    $("#csumbcoursesbtn").click(function(){
       $("#csumbcourses").toggle("fast");
       $("#csumbcoursesbtn").toggleClass("totiebtnActive");
       // Close projects panel if it's open
       $("#csumbprojects").hide("fast");
       $("#csumbprojectsbtn").removeClass("totiebtnActive");
    });
    
    $("#csumbprojectsbtn").click(function(){
       $("#csumbprojects").toggle("fast");
       $("#csumbprojectsbtn").toggleClass("totiebtnActive");
       // Close courses panel if it's open
       $("#csumbcourses").hide("fast");
       $("#csumbcoursesbtn").removeClass("totiebtnActive");
    });
    
    $("#capellacoursesbtn").click(function(){
       $("#capellacourses").toggle("fast");
       $("#capellacoursesbtn").toggleClass("totiebtnActive");
       // Close projects panel if it's open
       $("#capellaprojects").hide("fast");
       $("#capellaprojectsbtn").removeClass("totiebtnActive");
    });
    
    $("#capellaprojectsbtn").click(function(){
       $("#capellaprojects").toggle("fast");
       $("#capellaprojectsbtn").toggleClass("totiebtnActive");
       // Close courses panel if it's open
       $("#capellacourses").hide("fast");
       $("#capellacoursesbtn").removeClass("totiebtnActive");
    });    
    $("#nostradmsxbtn").click(function(){
       $("#nostradmsxdiv").show("fast", function(){});
       $("#redboxdiv").hide("fast", function(){});
       $("#nostradmsxbtn").addClass("totiebtnActive", function(){});
       $("#redboxbtn").removeClass("totiebtnActive", function(){});    
    });
    $("#redboxbtn").click(function(){
       $("#nostradmsxdiv").hide("fast", function(){});
       $("#redboxdiv").show("fast", function(){});
       $("#redboxbtn").addClass("totiebtnActive", function(){});
       $("#nostradmsxbtn").removeClass("totiebtnActive", function(){});          
    });
    
   $("#btn_angel").click(function(){
       $("#angellyrics").show("fast", function(){});
       $("#uulitinlyrics").hide("fast", function(){});
       $("#moonlyrics").hide("fast", function(){});         
    });
    
   $("#btn_uulitin").click(function(){
       $("#angellyrics").hide("fast", function(){});
       $("#uulitinlyrics").show("fast", function(){});
       $("#moonlyrics").hide("fast", function(){});    
    });
    
   $("#btn_moon").click(function(){
       $("#angellyrics").hide("fast", function(){});
       $("#uulitinlyrics").hide("fast", function(){});
       $("#moonlyrics").show("fast", function(){});     
    });        
 
    
  $(window).scroll(function() {
    $(".slideanim").each(function(){
      var pos = $(this).offset().top;

      var winTop = $(window).scrollTop();
        if (pos < winTop + 600) {
          $(this).addClass("slide");
        }
    });
  });
    
    
   function defaultAbout(){
        $("#adultimage").css("opacity", "1");    
        $("#boyimage").css("opacity", "1");
        $("#teenagerimage").css("opacity", "1");
        $(".adult").hide("slow", function(){});
        $(".boy").hide("slow", function(){});
        $(".teenager").hide("slow", function(){});
   }
    
    function defaultProjects(){
        $(".academic").hide("slow", function(){}); // Hide Academic by default now
        $(".professional").hide("slow", function(){});
        $(".personal").hide("slow", function(){});
        $("#link2Academic").addClass("btnNonActive"); // Academic button inactive by default
        $("#link2Professional").addClass("btnNonActive");
        $("#link2Personal").addClass("btnNonActive"); 
        $("#hartnell").hide("fast", function () {});
        $("#csumb").hide("fast", function () {});
        $("#capella").hide("fast", function () {});
        $("#associate").css("opacity", "1");
        $("#bachelors").css("opacity", "1");
        $("#graduate").css("opacity", "1"); 
        hideFeaturedProjects();
        hideAcademicProjects();
        hideProProjects();
        hideLyricsProjects();
        hideSpecializationSection();
    }
    
    function hideSpecializationSection(){
        $("#specialization").hide("fast", function(){});
        $(".jumbotron-before-specialization").hide("fast", function(){});
    }
    
     function hideFeaturedProjects(){
        $("#nostradmsxdiv").hide("fast", function(){});
        $("#redboxdiv").hide("fast", function(){});
        $("#nostradmsxbtn").removeClass("totiebtnActive", function(){});
        $("#redboxbtn").removeClass("totiebtnActive", function(){});    
     }
    
    function hideAcademicProjects(){
        $("#hartnellprojects").hide("fast", function(){});
        $("#hartnellcourses").hide("fast", function(){});
        $("#csumbprojects").hide("fast", function(){});
        $("#csumbcourses").hide("fast", function(){}); 
        $("#capellaprojects").hide("fast", function(){});
        $("#capellacourses").hide("fast", function(){});
        $("#hartnellcoursesbtn").removeClass("totiebtnActive", function(){});
        $("#hartnellprojectsbtn").removeClass("totiebtnActive", function(){});     
        $("#csumbcoursesbtn").removeClass("totiebtnActive", function(){});
        $("#csumbprojectsbtn").removeClass("totiebtnActive", function(){});             
        $("#capellacoursesbtn").removeClass("totiebtnActive", function(){});
        $("#capellaprojectsbtn").removeClass("totiebtnActive", function(){});             

    }
    
     function hideProProjects(){
        $("#nostradmsxdiv").hide("fast", function(){});
        $("#redboxdiv").hide("fast", function(){});
        $("#nostradmsxbtn").removeClass("totiebtnActive", function(){});
        $("#redboxbtn").removeClass("totiebtnActive", function(){});    
     }

     // Click outside handler for professional project showcases
     $(document).on('click', function(e) {
        // Check if click is outside the showcase divs and buttons
        if (!$(e.target).closest('#nostradmsxdiv, #redboxdiv, #nostradmsxbtn, #redboxbtn').length) {
            // If either showcase is currently visible, hide them
            if ($("#nostradmsxdiv").is(":visible") || $("#redboxdiv").is(":visible")) {
                hideProProjects();
            }
        }
     });
    
     function hideLyricsProjects(){    
       $("#angellyrics").hide("fast", function(){});
       $("#uulitinlyrics").hide("fast", function(){});
       $("#moonlyrics").hide("fast", function(){});
     }

     function hideAllProjectTabs(){
        $(".academic").hide("fast", function(){});
        $(".professional").hide("fast", function(){});
        $(".personal").hide("fast", function(){});
        $(".currentsites").hide("fast", function(){});
        $("#link2Academic").removeClass("active");
        $("#link2Professional").removeClass("active");
        $("#link2Personal").removeClass("active");
        $("#link2CurrentSites").removeClass("active");
        $("#hartnell").hide("fast", function () {});
        $("#csumb").hide("fast", function () {});
        $("#capella").hide("fast", function () {});
        $("#associate").css("opacity", "1");
        $("#bachelors").css("opacity", "1");
        $("#graduate").css("opacity", "1");
        hideFeaturedProjects();
        hideAcademicProjects();
        hideProProjects();
        hideLyricsProjects();
     }

     // On the mobile 2x2 tab grid, the currently active tab always sits in
     // grid position 3 (bottom-left) -- the other three keep their normal
     // relative order across the remaining positions. Sets a data-pos
     // attribute that a mobile-only media query maps to CSS `order`;
     // outside that breakpoint the attribute is inert.
     function updateMobileTabOrder(activeId){
        var baseOrder = ['link2CurrentSites', 'link2Academic', 'link2Professional', 'link2Personal'];
        var others = baseOrder.filter(function(id){ return id !== activeId; });
        var positions = {};
        positions[others[0]] = 1;
        positions[others[1]] = 2;
        positions[activeId] = 3;
        positions[others[2]] = 4;
        baseOrder.forEach(function(id){
          var el = document.getElementById(id);
          if (el) el.setAttribute('data-pos', positions[id]);
        });
     }

     function showAcademicTab(){
        $(".academic").show("fast", function(){});
        $(".professional").hide("fast", function(){});
        $(".personal").hide("fast", function(){});
        $(".currentsites").hide("fast", function(){});
        $("#link2Academic").addClass("active");
        $("#link2Professional").removeClass("active");
        $("#link2Personal").removeClass("active");
        $("#link2CurrentSites").removeClass("active");
        updateMobileTabOrder('link2Academic');
        $("#hartnell").hide("fast", function () {});
        $("#csumb").hide("fast", function () {});
        $("#capella").hide("fast", function () {});
        $("#associate").css("opacity", "1");
        $("#bachelors").css("opacity", "1");
        $("#graduate").css("opacity", "1");
        hideFeaturedProjects();
        hideAcademicProjects();
        hideProProjects();
        hideLyricsProjects();
     }

     function showCurrentSitesTab(){
        $(".academic").hide("fast", function(){});
        $(".professional").hide("fast", function(){});
        $(".personal").hide("fast", function(){});
        $(".currentsites").show("fast", function(){
          // Initialize the Current Sites slideshow if not already done
          if (!window.currentSitesInitialized) {
            initializeCurrentSitesSlideshow();
            window.currentSitesInitialized = true;
          }
        });
        $("#link2Academic").removeClass("active");
        $("#link2Professional").removeClass("active");
        $("#link2Personal").removeClass("active");
        $("#link2CurrentSites").addClass("active");
        updateMobileTabOrder('link2CurrentSites');
        $("#hartnell").hide("fast", function () {});
        $("#csumb").hide("fast", function () {});
        $("#capella").hide("fast", function () {});
        $("#associate").css("opacity", "1");
        $("#bachelors").css("opacity", "1");
        $("#graduate").css("opacity", "1");
        hideFeaturedProjects();
        hideAcademicProjects();
        hideProProjects();
        hideLyricsProjects();
     }

// Current Sites slideshow functionality
// (currentSitesSlideIndex/currentSitesSlides declared at the top of the file)

// Current Sites data - screenshots from images/currentsites
const currentSitesData = [
  { title: "Deliberately Deliberate", image: "./images/currentsites/deliberatelydeliberate.jpg", url: "https://deliberatelydeliberate.com" },
  {
    title: "Bertelsmann Technology Scholarship - Enterprise Security Nanodegree",
    image: "specialization/images/Bertelsmann_nanodegree_enterprisesecurity.jpg",
    description: "Advanced enterprise security nanodegree program focusing on cybersecurity frameworks, threat assessment, and security architecture design. Comprehensive coverage of enterprise-level security protocols and implementation strategies. If you want a guide for turning a scholarship MOOC like this into real, applied skill instead of just a certificate, that's exactly what I built DeliberateLearners.com to teach.",
    readMore: "Technologies Used: Microsoft Azure services (Virtual Networks, Entra, Sentinel, Intune, Defender for Endpoint), ELK Stack (Elasticsearch, Logstash, Kibana, Filebeat), SIEM/SOAR platforms, EDR/IDS technologies. Key Features: Network defenses with DMZs and VPNs, Zero Trust security architecture, defense-in-depth strategies, compliance alignment with NIST 800-61r2 and TIC 3.0. Learning Outcomes: Enterprise security frameworks, threat assessment methodologies, cloud security implementation, risk management practices.",
    isBertelsmann: true
  },
  { title: "NostradmsX - Personal Blog", image: "./images/currentsites/nostradmsx.jpg", url: "https://nostradmsx.com" },
  { title: "Deliberate Cybersecurity", image: "./images/currentsites/deliberatecybersecurity.jpg", url: "https://deliberatecybersecurity.com" },
  { title: "Deliberate Digital Legacy", image: "./images/currentsites/deliberate-digital-legacy.jpg", url: "https://deliberate-digital-legacy.com" },
  { title: "Deliberate Learners", image: "./images/currentsites/deliberatelearners.jpg", url: "https://deliberatelearners.com" },
  { title: "Deliberate Learners - Tools", image: "./images/currentsites/deliberatelearners-tools.jpg", url: "https://deliberatelearners.com/tools" },
  { title: "DMSecurityX", image: "./images/currentsites/dmsecurityx-1.jpg", url: "https://dmsecurityx.com" },
  { title: "DMSecurityX", image: "./images/currentsites/dmsecurityx-2.jpg", url: "https://dmsecurityx.com" },
  { title: "DMSecurityX", image: "./images/currentsites/dmsecurityx-3.jpg", url: "https://dmsecurityx.com" },
  { title: "TryCircal - Blueprints", image: "./images/currentsites/trycircal_blueprints.jpg", url: "https://trycircal.app" },
  { title: "TryCircal - Calendar", image: "./images/currentsites/trycircal_calendar.jpg", url: "https://trycircal.app" },
  { title: "TryCircal - Insights", image: "./images/currentsites/trycircal_insights.jpg", url: "https://trycircal.app" },
  { title: "TryCircal - Settings", image: "./images/currentsites/trycircal_settings.jpg", url: "https://trycircal.app" },
  { title: "MyDigitally", image: "./images/currentsites/mydigitally_1.jpg", url: "https://mydigitally.app" },
  { title: "MyDigitally", image: "./images/currentsites/mydigitally_2.jpg", url: "https://mydigitally.app" },
  { title: "MyDigitally", image: "./images/currentsites/mydigitally_3.jpg", url: "https://mydigitally.app" },
  { title: "MyDigitally", image: "./images/currentsites/mydigitally_4.jpg", url: "https://mydigitally.app" },
  { title: "MyDigitally", image: "./images/currentsites/mydigitally_5.jpg", url: "https://mydigitally.app" }
];

// Load Current Sites slides dynamically
function loadCurrentSitesSlides() {
  const slidesContainer = document.getElementById('currentSitesSlides');
  const thumbnailContainer = document.getElementById('currentSitesThumbnailContainer');

  if (!slidesContainer || !thumbnailContainer) {
    console.error('Current Sites slideshow containers not found');
    return;
  }

  // Clear existing content
  slidesContainer.innerHTML = '';
  thumbnailContainer.innerHTML = '';
  currentSitesSlides = [];

  currentSitesData.forEach((site, index) => {
    // Create slide
    const slideDiv = document.createElement('div');
    slideDiv.classList.add('cert-slides');

    const slideContent = document.createElement('div');
    slideContent.classList.add('cert-slide-content');

    const titleElement = document.createElement('h2');
    titleElement.textContent = site.title;
    titleElement.style.textAlign = 'center';
    titleElement.style.marginBottom = '20px';
    titleElement.style.color = '#333';
    slideContent.appendChild(titleElement);

    const img = document.createElement('img');
    img.src = site.image;
    img.style.cursor = 'pointer';
    img.title = site.isBertelsmann ? 'Click to see the projects' : 'Click to visit ' + site.title;
    img.onerror = function() {
      console.error('Failed to load image:', site.image);
    };
    img.onclick = () => {
      if (site.isBertelsmann) {
        showBertelsmannProjects();
      } else {
        window.open(site.url, '_blank');
      }
    };
    slideContent.appendChild(img);

    if (site.description) {
      const descElement = document.createElement('p');
      descElement.textContent = site.description;
      descElement.style.marginTop = '20px';
      descElement.style.textAlign = 'justify';
      descElement.style.lineHeight = '1.6';
      slideContent.appendChild(descElement);
    }

    const linkContainer = document.createElement('div');
    linkContainer.style.textAlign = 'center';
    linkContainer.style.marginTop = '20px';

    const siteLink = document.createElement('a');
    if (site.isBertelsmann) {
      siteLink.href = '#';
      siteLink.textContent = 'View Projects';
      siteLink.addEventListener('click', function(e) {
        e.preventDefault();
        showBertelsmannProjects();
      });
    } else {
      siteLink.href = site.url;
      siteLink.target = '_blank';
      siteLink.rel = 'noopener';
      siteLink.textContent = 'View Site';
    }
    siteLink.style.display = 'inline-block';
    siteLink.style.padding = '10px 20px';
    siteLink.style.backgroundColor = '#007bff';
    siteLink.style.color = 'white';
    siteLink.style.textDecoration = 'none';
    siteLink.style.borderRadius = '5px';
    siteLink.style.fontWeight = 'bold';
    siteLink.style.transition = 'background-color 0.3s ease';
    siteLink.style.marginRight = '10px';
    siteLink.onmouseover = () => siteLink.style.backgroundColor = '#0056b3';
    siteLink.onmouseout = () => siteLink.style.backgroundColor = '#007bff';

    linkContainer.appendChild(siteLink);

    let readMoreDetails = null;
    let readMoreBtn = null;
    if (site.readMore) {
      readMoreBtn = document.createElement('button');
      readMoreBtn.textContent = 'Read More';
      readMoreBtn.classList.add('project-btn', 'project-btn-readmore');
      linkContainer.appendChild(readMoreBtn);
    }

    slideContent.appendChild(linkContainer);

    if (site.readMore) {
      readMoreDetails = document.createElement('div');
      readMoreDetails.classList.add('cert-read-more-content');
      readMoreDetails.style.display = 'none';
      readMoreDetails.style.marginTop = '20px';
      readMoreDetails.style.padding = '20px';
      readMoreDetails.style.backgroundColor = '#f8f9fa';
      readMoreDetails.style.border = '1px solid #dee2e6';
      readMoreDetails.style.borderRadius = '8px';
      readMoreDetails.style.lineHeight = '1.6';
      readMoreDetails.style.textAlign = 'justify';
      readMoreDetails.textContent = site.readMore;
      slideContent.appendChild(readMoreDetails);

      readMoreBtn.onclick = function() {
        const isHidden = readMoreDetails.style.display === 'none';
        readMoreDetails.style.display = isHidden ? 'block' : 'none';
        readMoreBtn.textContent = isHidden ? 'Show Less' : 'Read More';
      };
    }

    slideDiv.appendChild(slideContent);
    slidesContainer.appendChild(slideDiv);

    // Create thumbnail
    const thumb = document.createElement('img');
    thumb.src = site.image;
    thumb.classList.add('cert-thumb');
    thumb.title = site.isBertelsmann
      ? site.title + ' - Click to view slide or Ctrl+Click to see the projects'
      : site.title + ' - Click to view slide or Ctrl+Click to visit site';
    thumb.onclick = (event) => {
      if (event.ctrlKey || event.metaKey) {
        if (site.isBertelsmann) {
          showBertelsmannProjects();
        } else {
          window.open(site.url, '_blank');
        }
      } else {
        setCurrentSitesSlide(index);
      }
    };
    thumbnailContainer.appendChild(thumb);

    currentSitesSlides.push(slideDiv);
  });

  updateCurrentSitesSlideCounter();

  if (currentSitesSlides.length > 0) {
    showCurrentSitesSlide(0);
  }
}

function showCurrentSitesSlide(index) {
  if (index >= currentSitesSlides.length) {
    currentSitesSlideIndex = 0;
  } else if (index < 0) {
    currentSitesSlideIndex = currentSitesSlides.length - 1;
  } else {
    currentSitesSlideIndex = index;
  }

  currentSitesSlides.forEach((slide, i) => {
    slide.style.display = i === currentSitesSlideIndex ? 'block' : 'none';
  });

  const thumbnails = document.querySelectorAll('#currentSitesThumbnailContainer .cert-thumb');
  thumbnails.forEach((thumb, i) => {
    thumb.classList.toggle('current-cert-thumb', i === currentSitesSlideIndex);
  });

  updateCurrentSitesSlideCounter();
}

function nextCurrentSitesSlide() {
  showCurrentSitesSlide(currentSitesSlideIndex + 1);
}

function prevCurrentSitesSlide() {
  showCurrentSitesSlide(currentSitesSlideIndex - 1);
}

function setCurrentSitesSlide(index) {
  showCurrentSitesSlide(index);
}

function updateCurrentSitesSlideCounter() {
  const currentSlideEl = document.getElementById('currentSitesCurrentSlide');
  const totalSlidesEl = document.getElementById('currentSitesTotalSlides');
  if (currentSlideEl && totalSlidesEl) {
    currentSlideEl.innerText = currentSitesSlideIndex + 1;
    totalSlidesEl.innerText = currentSitesSlides.length.toString();
  }
}

// Initialize the Current Sites slideshow
function initializeCurrentSitesSlideshow() {
  loadCurrentSitesSlides();

  const nextBtn = document.getElementById('currentSitesNextBtn');
  const prevBtn = document.getElementById('currentSitesPrevBtn');
  if (nextBtn) nextBtn.onclick = nextCurrentSitesSlide;
  if (prevBtn) prevBtn.onclick = prevCurrentSitesSlide;
}

// MOOC / Specialization slideshow functionality
// (moocSlideIndex/moocSlides declared at the top of the file)

const moocData = [
  {
    title: "Video Pitch Adjuster GUI",
    image: "images/currentsites/video-pitch-shifter.png",
    githubUrl: "https://github.com/roylouisgarcia/videopitchshifter",
    description: "A user-friendly GUI application that uses FFMPEG to adjust the pitch of audio in video files. This application extracts audio from video, adjusts the pitch by a specified amount, and merges the adjusted audio back with the original video.",
    readMore: "Technologies Used: Python, Tkinter (GUI), FFMPEG (audio/video processing), subprocess module. Key Features: User-friendly graphical interface, audio extraction from video files, pitch adjustment capabilities, automatic audio-video merging, file selection dialogs. Learning Outcomes: GUI development with Tkinter, multimedia processing with FFMPEG, Python subprocess management, audio signal processing concepts."
  },
  {
    title: "Coursera/Meta HTML and CSS in Depth",
    image: "https://raw.githubusercontent.com/roylouisgarcia/meta-coursera-html-css-project/main/images/readme_wholepicture.jpg",
    githubUrl: "https://github.com/roylouisgarcia/meta-coursera-html-css-project/tree/main",
    actualSite: "https://roylouisgarcia.github.io/meta-coursera-html-css-project/",
    description: "The project is a portfolio website as part of the Meta Front-End Developer Specialization course on Coursera, specifically for the HTML & CSS module.",
    readMore: "Technologies Used: HTML5, CSS3, Flexbox, Grid Layout. Key Features: Responsive design, semantic HTML, modern CSS techniques. Learning Outcomes: Advanced CSS selectors, animations, and responsive web design principles."
  },
  {
    title: "Android Programming - Court Counter",
    image: "https://raw.githubusercontent.com/roylouisgarcia/ABNProject2/master/Capture.PNG",
    githubUrl: "https://github.com/roylouisgarcia/ABNProject2",
    description: "As part of the Grow With Google Challenge Scholarship course hosted in Udacity, this project explores the concept of Android XML Layouts and Java Programming.",
    readMore: "Technologies Used: Java, Android SDK, XML Layouts. Key Features: Interactive UI, state management, basketball scoring system. Learning Outcomes: Mobile app development, Android lifecycle, UI/UX design."
  },
  {
    title: "Exploring Python and Windows API",
    image: "https://raw.githubusercontent.com/roylouisgarcia/python4windowsapi/main/images/00_helloworld_code.png",
    githubUrl: "https://github.com/roylouisgarcia/python4windowsapi",
    description: "A traditional HelloWorld script that explores the concept of Windows DLL, handles and the necessary parameters to call the Windows API call MessageBoxW(). A script that uses the Windows API calls or systems calls via Python Script in order to kill any Windows Process.",
    readMore: "Technologies Used: Python, Windows API, ctypes library. Key Features: Direct system calls, process management, native Windows integration. Learning Outcomes: Low-level programming, system architecture, API interaction."
  },
  {
    title: "My Coursera Certificate Slideshow",
    image: "https://github.com/roylouisgarcia/courses/raw/master/ss1.png",
    githubUrl: "https://github.com/roylouisgarcia/courses?tab=readme-ov-file",
    description: "A dynamic, interactive web application showcasing my professional development journey through various online courses and certifications from top institutions including IBM, Google, Meta, Stanford, DeepLearning.AI, and more.",
    readMore: "Technologies Used: HTML, CSS, and JavaScript. Key Features: Dynamic slideshow functionality, responsive design, interactive thumbnail navigation, professional certification showcase. Learning Outcomes: DOM manipulation, responsive web design, dynamic content loading, user interface development."
  }
];

// Load MOOC slides dynamically
function loadMoocSlides() {
  const slidesContainer = document.getElementById('moocSlidesContainer');
  const thumbnailContainer = document.getElementById('moocThumbnailContainer');

  if (!slidesContainer || !thumbnailContainer) {
    console.error('MOOC slideshow containers not found');
    return;
  }

  slidesContainer.innerHTML = '';
  thumbnailContainer.innerHTML = '';
  moocSlides = [];

  moocData.forEach((entry, index) => {
    const slideDiv = document.createElement('div');
    slideDiv.classList.add('cert-slides');

    const slideContent = document.createElement('div');
    slideContent.classList.add('cert-slide-content');

    const titleElement = document.createElement('h2');
    titleElement.textContent = entry.title;
    titleElement.style.textAlign = 'center';
    titleElement.style.marginBottom = '20px';
    titleElement.style.color = '#333';
    slideContent.appendChild(titleElement);

    const img = document.createElement('img');
    img.src = entry.image;
    img.alt = entry.title;
    img.onerror = function() {
      console.error('Failed to load image:', entry.image);
    };
    slideContent.appendChild(img);

    const descElement = document.createElement('p');
    descElement.textContent = entry.description;
    descElement.style.marginTop = '20px';
    descElement.style.textAlign = 'justify';
    descElement.style.lineHeight = '1.6';
    slideContent.appendChild(descElement);

    // Primary action + Read More buttons
    const linkContainer = document.createElement('div');
    linkContainer.classList.add('project-btn-container');

    const primaryLink = document.createElement('a');
    primaryLink.classList.add('project-btn', 'project-btn-github');
    if (entry.isBertelsmann) {
      primaryLink.href = '#';
      primaryLink.textContent = 'See Projects';
      primaryLink.addEventListener('click', function(e) {
        e.preventDefault();
        showBertelsmannProjects();
      });
    } else {
      primaryLink.href = entry.githubUrl;
      primaryLink.target = '_blank';
      primaryLink.rel = 'noopener';
      primaryLink.textContent = 'View on GitHub';
    }
    linkContainer.appendChild(primaryLink);

    if (entry.actualSite) {
      const demoLink = document.createElement('a');
      demoLink.href = entry.actualSite;
      demoLink.target = '_blank';
      demoLink.rel = 'noopener';
      demoLink.textContent = 'See Demo';
      demoLink.classList.add('project-btn', 'project-btn-demo');
      linkContainer.appendChild(demoLink);
    }

    let readMoreDetails = null;
    let readMoreBtn = null;
    if (entry.readMore) {
      readMoreBtn = document.createElement('button');
      readMoreBtn.textContent = 'Read More';
      readMoreBtn.classList.add('project-btn', 'project-btn-readmore');
      linkContainer.appendChild(readMoreBtn);
    }

    slideContent.appendChild(linkContainer);

    if (entry.readMore) {
      readMoreDetails = document.createElement('div');
      readMoreDetails.classList.add('cert-read-more-content');
      readMoreDetails.style.display = 'none';
      readMoreDetails.style.marginTop = '20px';
      readMoreDetails.style.padding = '20px';
      readMoreDetails.style.backgroundColor = '#f8f9fa';
      readMoreDetails.style.border = '1px solid #dee2e6';
      readMoreDetails.style.borderRadius = '8px';
      readMoreDetails.style.lineHeight = '1.6';
      readMoreDetails.style.textAlign = 'justify';
      readMoreDetails.textContent = entry.readMore;
      slideContent.appendChild(readMoreDetails);

      readMoreBtn.onclick = function() {
        const isHidden = readMoreDetails.style.display === 'none';
        readMoreDetails.style.display = isHidden ? 'block' : 'none';
        readMoreBtn.textContent = isHidden ? 'Show Less' : 'Read More';
      };
    }

    slideDiv.appendChild(slideContent);
    slidesContainer.appendChild(slideDiv);

    const thumb = document.createElement('img');
    thumb.src = entry.image;
    thumb.classList.add('cert-thumb');
    thumb.title = entry.title;
    thumb.onclick = () => setMoocSlide(index);
    thumbnailContainer.appendChild(thumb);

    moocSlides.push(slideDiv);
  });

  updateMoocSlideCounter();

  if (moocSlides.length > 0) {
    showMoocSlide(0);
  }
}

function showMoocSlide(index) {
  if (index >= moocSlides.length) {
    moocSlideIndex = 0;
  } else if (index < 0) {
    moocSlideIndex = moocSlides.length - 1;
  } else {
    moocSlideIndex = index;
  }

  moocSlides.forEach((slide, i) => {
    slide.style.display = i === moocSlideIndex ? 'block' : 'none';
  });

  const thumbnails = document.querySelectorAll('#moocThumbnailContainer .cert-thumb');
  thumbnails.forEach((thumb, i) => {
    thumb.classList.toggle('current-cert-thumb', i === moocSlideIndex);
  });

  updateMoocSlideCounter();
}

function nextMoocSlide() {
  showMoocSlide(moocSlideIndex + 1);
}

function prevMoocSlide() {
  showMoocSlide(moocSlideIndex - 1);
}

function setMoocSlide(index) {
  showMoocSlide(index);
}

function updateMoocSlideCounter() {
  const currentSlideEl = document.getElementById('moocCurrentSlide');
  const totalSlidesEl = document.getElementById('moocTotalSlides');
  if (currentSlideEl && totalSlidesEl) {
    currentSlideEl.innerText = moocSlideIndex + 1;
    totalSlidesEl.innerText = moocSlides.length.toString();
  }
}

// Initialize the MOOC slideshow
function initializeMoocSlideshow() {
  loadMoocSlides();

  const nextBtn = document.getElementById('moocNextBtn');
  const prevBtn = document.getElementById('moocPrevBtn');
  if (nextBtn) nextBtn.onclick = nextMoocSlide;
  if (prevBtn) prevBtn.onclick = prevMoocSlide;
}

// MOOC slideshow is always visible, so load it immediately. Called as a
// plain statement, not wrapped in $(document).ready(...): this script tag
// is the last thing in <body>, so the DOM is already fully parsed by the
// time execution reaches this line -- ready() is unnecessary here, and
// relying on it caused browser-dependent timing bugs (a ReferenceError in
// some cases, a silent no-op in Firefox) depending on exactly when each
// browser considered the document "ready".
initializeMoocSlideshow();

// Featured slideshow variables
// (currentFeaturedSlideIndex/featuredSlides declared at the top of the file)

// Featured projects data - based on the original static grid layout
const featuredProjectsData = [
  {
    title: "Rhythm Brown Box",
    image: "./images/featured/drummachine.png",
    siteUrl: "./portfolioentries/personal/rhythmbrownbox/index.html",
    githubUrl: "https://github.com/roylouisgarcia/rhythmbrownbox"
  },
  {
    title: "Recorded Bliss",
    image: "./images/featured/recordedbliss.png",
    url: "https://recordedbliss.com"
  },
  {
    title: "Summer Beads",
    image: "./images/featured/summerbeads.png",
    url: null
  },
  {
    title: "Rock Paper Scissors",
    image: "./images/featured/rockerpaperscissors.png",
    url: "https://github.com/roylouisgarcia/rockpaperscissors"
  },
  {
    title: "Heathwood Hardware Inc. (HHI)",
    image: "./images/featured/hhi.png",
    url: "https://github.com/roylouisgarcia/HeathWoodHardware"
  },
  {
    title: "Flames Calculator - Input",
    image: "./images/featured/flames.png",
    url: "https://github.com/roylouisgarcia/flames"
  },
  {
    title: "Flames Calculator - Results ",
    image: "./images/featured/flames2.png",
    url: "https://github.com/roylouisgarcia/flames"
  },
  {
    title: "League of Legends - LUA template generator for LeaguePedia",
    image: "./images/featured/form2lua.png",
    url: null
  }
];

// Load featured slides dynamically
function loadFeaturedSlides() {
  const slidesContainer = document.getElementById('featuredSlides');
  const thumbnailContainer = document.getElementById('featuredThumbnailContainer');
  
  if (!slidesContainer || !thumbnailContainer) {
    console.error('Featured slideshow containers not found');
    return;
  }

  console.log('Loading featured slides:', featuredProjectsData.length, 'projects');

  // Clear existing content
  slidesContainer.innerHTML = '';
  thumbnailContainer.innerHTML = '';
  featuredSlides = [];

  featuredProjectsData.forEach((project, index) => {
    // "View Project" target: an on-site page when the project has one
    // (siteUrl), otherwise whatever single url it provides. githubUrl, when
    // present, renders a separate "View on GitHub" button alongside it.
    const primaryUrl = project.siteUrl || project.url || null;
    const anyUrl = primaryUrl || project.githubUrl || null;

    // Create slide
    const slideDiv = document.createElement('div');
    slideDiv.classList.add('featured-slides');

    // Create slide content
    const slideContent = document.createElement('div');
    slideContent.classList.add('featured-slide-content');
    
    const titleElement = document.createElement('h2');
    titleElement.textContent = project.title;
    titleElement.style.textAlign = 'center';
    titleElement.style.marginBottom = '15px';
    titleElement.style.color = '#333';
    titleElement.style.fontSize = '20px';
    titleElement.style.fontWeight = 'bold';
    
    // Add responsive styling for titles on smaller devices
    titleElement.style.cssText += `
      @media (max-width: 768px) {
        font-size: 14px !important;
        margin-bottom: 10px !important;
      }
      @media (max-width: 480px) {
        font-size: 12px !important;
        margin-bottom: 8px !important;
      }
    `;
    
    slideContent.appendChild(titleElement);

    const img = document.createElement('img');
    img.src = project.image;
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    img.style.display = 'block';
    img.style.margin = '0 auto';
    img.onerror = function() {
      console.error('Failed to load image:', project.image);
      // Create a placeholder if image fails to load
      const placeholder = document.createElement('div');
      placeholder.style.width = '300px';
      placeholder.style.height = '200px';
      placeholder.style.backgroundColor = '#f0f0f0';
      placeholder.style.display = 'flex';
      placeholder.style.alignItems = 'center';
      placeholder.style.justifyContent = 'center';
      placeholder.style.margin = '0 auto';
      placeholder.style.border = '2px dashed #ccc';
      placeholder.style.borderRadius = '8px';
      placeholder.textContent = 'Image not available';
      if (anyUrl) {
        placeholder.style.cursor = 'pointer';
        placeholder.onclick = () => window.open(anyUrl, '_blank');
      }
      img.parentNode.replaceChild(placeholder, img);
    };
    if (primaryUrl) {
      img.style.cursor = 'pointer';
      img.title = 'Click to view project';
      img.onclick = () => window.open(primaryUrl, primaryUrl.startsWith('http') ? '_blank' : '_self');
    }
    slideContent.appendChild(img);

    if (anyUrl) {
      // Add link button(s)
      const linkContainer = document.createElement('div');
      linkContainer.style.textAlign = 'center';
      linkContainer.style.marginTop = '10px';
      linkContainer.style.marginBottom = '10px';

      const makeBtn = (label, href, bg, bgHover) => {
        const a = document.createElement('a');
        a.href = href;
        if (href.startsWith('http')) { a.target = '_blank'; a.rel = 'noopener'; }
        a.textContent = label;
        a.style.display = 'inline-block';
        a.style.margin = '5px';
        a.style.padding = '10px 20px';
        a.style.backgroundColor = bg;
        a.style.color = 'white';
        a.style.textDecoration = 'none';
        a.style.borderRadius = '5px';
        a.style.fontWeight = 'bold';
        a.style.transition = 'background-color 0.3s ease';
        a.onmouseover = () => a.style.backgroundColor = bgHover;
        a.onmouseout = () => a.style.backgroundColor = bg;
        return a;
      };

      if (primaryUrl) {
        linkContainer.appendChild(makeBtn('View Project', primaryUrl, '#007bff', '#0056b3'));
      }
      if (project.githubUrl) {
        linkContainer.appendChild(makeBtn('View on GitHub', project.githubUrl, '#24292e', '#000'));
      }

      slideContent.appendChild(linkContainer);
    }

    slideDiv.appendChild(slideContent);
    slidesContainer.appendChild(slideDiv);

    // Create thumbnail
    const thumb = document.createElement('img');
    thumb.src = project.image;
    thumb.classList.add('featured-thumb');
    thumb.style.cursor = 'pointer';
    thumb.title = project.title + (anyUrl ? ' - Click to view slide or Ctrl+Click to open project' : ' - Click to view slide');
    thumb.onerror = function() {
      console.error('Failed to load thumbnail:', project.image);
      // Create a simple text thumbnail if image fails
      const textThumb = document.createElement('div');
      textThumb.classList.add('featured-thumb');
      textThumb.style.width = '80px';
      textThumb.style.height = '60px';
      textThumb.style.backgroundColor = '#f0f0f0';
      textThumb.style.display = 'flex';
      textThumb.style.alignItems = 'center';
      textThumb.style.justifyContent = 'center';
      textThumb.style.border = '2px solid #ccc';
      textThumb.style.borderRadius = '5px';
      textThumb.style.fontSize = '10px';
      textThumb.style.color = '#666';
      textThumb.style.cursor = 'pointer';
      textThumb.title = thumb.title;
      textThumb.textContent = project.title.substring(0, 8) + '...';
      textThumb.onclick = (event) => {
        if (anyUrl && (event.ctrlKey || event.metaKey)) {
          window.open(anyUrl, '_blank');
        } else {
          setCurrentFeaturedSlide(index);
        }
      };
      thumb.parentNode.replaceChild(textThumb, thumb);
    };
    thumb.onclick = (event) => {
      if (anyUrl && (event.ctrlKey || event.metaKey)) {
        window.open(anyUrl, '_blank');
      } else {
        setCurrentFeaturedSlide(index);
      }
    };
    thumbnailContainer.appendChild(thumb);

    featuredSlides.push(slideDiv);
  });

  console.log('Loaded', featuredSlides.length, 'featured slides');
  updateFeaturedSlideCounter();
  
  // Show first slide
  if (featuredSlides.length > 0) {
    showFeaturedSlide(0);
  }
}

function showFeaturedSlide(index) {
  console.log('showFeaturedSlide called with index:', index, 'featuredSlides.length:', featuredSlides.length);
  
  if (index >= featuredSlides.length) {
    currentFeaturedSlideIndex = 0;
  } else if (index < 0) {
    currentFeaturedSlideIndex = featuredSlides.length - 1;
  } else {
    currentFeaturedSlideIndex = index;
  }

  console.log('Setting currentFeaturedSlideIndex to:', currentFeaturedSlideIndex);

  featuredSlides.forEach((slide, i) => {
    slide.style.display = i === currentFeaturedSlideIndex ? 'block' : 'none';
  });
  
  // Update thumbnail highlighting
  const thumbnails = document.querySelectorAll('.featured-thumb');
  console.log('Found', thumbnails.length, 'featured thumbnails');
  
  thumbnails.forEach((thumb, i) => {
    if (i === currentFeaturedSlideIndex) {
      thumb.classList.add('current-featured-thumb');
      console.log('Highlighting featured thumbnail', i);
    } else {
      thumb.classList.remove('current-featured-thumb');
    }
  });
  
  updateFeaturedSlideCounter();
}

function nextFeaturedSlide() {
  showFeaturedSlide(currentFeaturedSlideIndex + 1);
}

function prevFeaturedSlide() {
  showFeaturedSlide(currentFeaturedSlideIndex - 1);
}

function setCurrentFeaturedSlide(index) {
  showFeaturedSlide(index);
}

function updateFeaturedSlideCounter() {
  const currentSlideEl = document.getElementById('featuredCurrentSlide');
  const totalSlidesEl = document.getElementById('featuredTotalSlides');
  if (currentSlideEl && totalSlidesEl) {
    currentSlideEl.innerText = currentFeaturedSlideIndex + 1;
    totalSlidesEl.innerText = featuredSlides.length.toString();
  }
}

// Initialize the featured slideshow
function initializeFeaturedSlideshow() {
  console.log('Initializing featured slideshow');
  
  // Load the featured slides
  loadFeaturedSlides();
}

});


// Hide .adult, .teenager, .boy when clicking outside #about
$(document).on('mousedown touchstart', function(event) {
  var $about = $('#about');
  if ($about.length && !$about.is(event.target) && $about.has(event.target).length === 0) {
    $('.adult, .teenager, .boy').hide('slow');
  }
});

// Font toggle functionality
$(document).ready(function() {
  // About section font toggle
  $('#about-font-toggle').on('click', function() {
    var $aboutSection = $('#about');
    var $toggleBtn = $(this);
    var $toggleText = $toggleBtn.find('.toggle-text');
    
    // Add transition class to all text elements in about section
    $aboutSection.addClass('transitioning');
    
    if ($aboutSection.hasClass('typewriter-mode')) {
      // Switch to handwritten mode
      $aboutSection.removeClass('typewriter-mode').addClass('handwritten-mode');
      
      // Apply handwritten class to all text elements within about section
      $aboutSection.find('h3, p, .writing, .typewriter').removeClass('typewriter').addClass('handwritten');
      $aboutSection.find('.postit-summary').removeClass('typewriter').addClass('handwritten');
      
      $toggleText.text('Typewriter');
    } else {
      // Switch to typewriter mode
      $aboutSection.removeClass('handwritten-mode').addClass('typewriter-mode');
      
      // Apply typewriter class to all text elements within about section
      $aboutSection.find('h3, p, .writing, .handwritten').removeClass('handwritten').addClass('typewriter');
      $aboutSection.find('.postit-summary').removeClass('handwritten').addClass('typewriter');
      
      $toggleText.text('Handwritten');
    }
    
    // Remove transition class after animation
    setTimeout(function() {
      $aboutSection.removeClass('transitioning');
    }, 300);
  });
  
  // Generic function to add font toggles to other handwritten elements
  function addFontToggle(selector, containerId) {
    var $container = $(containerId);
    var $element = $(selector);
    
    if ($element.length && $container.length) {
      // Create toggle button
      var toggleHtml = '<div class="font-toggle-container">' +
                      '<button class="font-toggle-btn generic-font-toggle" data-target="' + selector + '" title="Toggle between handwritten and typewriter font">' +
                      '<i class="fa fa-font"></i> <span class="toggle-text">Typewriter</span>' +
                      '</button>' +
                      '</div>';
      
      // Add toggle button to container
      $container.prepend(toggleHtml);
    }
  }
  
  // Handle generic font toggles
  $(document).on('click', '.generic-font-toggle', function() {
    var targetSelector = $(this).data('target');
    var $target = $(targetSelector);
    var $toggleText = $(this).find('.toggle-text');
    
    // Add transition class
    $target.addClass('transitioning');
    
    if ($target.hasClass('handwritten')) {
      // Switch to typewriter
      $target.removeClass('handwritten').addClass('typewriter');
      $toggleText.text('Handwritten');
    } else {
      // Switch to handwritten
      $target.removeClass('typewriter').addClass('handwritten');
      $toggleText.text('Typewriter');
    }
    
    // Remove transition class after animation
    setTimeout(function() {
      $target.removeClass('transitioning');
    }, 300);
  });
  
  // Add font toggles to Skills and Interests sections
  if ($('#skills .handwritten').length) {
    addFontToggle('#skills .handwritten', '#skills');
  }
  
  if ($('#interests .handwritten').length) {
    addFontToggle('#interests .handwritten', '#interests');
  }

  // Hartnell Projects Slideshow functionality
initializeHartnellSlideshow();
});

// Hartnell Projects Slideshow
// (hartnellCurrentSlideIndex/hartnellSlides declared at the top of the file)

// Hartnell project data
const hartnellProjects = [
    {
        image: "images/bridge.jpg",
        title: "Physics Olympics",
        description: "My favorite was a project to build a bridge made of popsicle sticks. Feel free to visit my school's Physics Olympics' Page:",
        link: "https://www.hartnell.edu/physics-olympics",
        linkText: "Go"
    },
    {
        image: "images/academic/hartnell/hacker.jpg",
        title: "Computer Security",
        description: "Learning computer debugging and assembly language prompted my interest in computer security and forensics",
        link: null,
        linkText: null
    },
    {
        image: "images/academic/hartnell/winxp2.jpg",
        title: "Windows XP, Telnet, Virtualization",
        description: "Learning about operating systems opened up appreciation to the power of CLI or Command Line Interface. I did not give up on GUI and actually learned more about Visual Basic and web development",
        link: null,
        linkText: null
    },
    {
        image: "images/academic/hartnell/myspace.jpg",
        title: "Web Design, MySpace Customizations, Web Servers",
        description: "simple client-server applications, online portfolios, CSS and code customizations on MySpace and Soundclick. I also learned the power of web servers like LAMP systems (Linux, Apache, Mysql and Php)",
        link: null,
        linkText: null,
        additionalImage: "images/academic/hartnell/soundclick.jpg"
    }
];

// Load Hartnell slides dynamically
function loadHartnellSlides() {
    const slidesContainer = document.getElementById('hartnellSlidesContainer');
    const thumbnailContainer = document.getElementById('hartnellThumbnailContainer');
    
    if (!slidesContainer || !thumbnailContainer) {
        console.error('Hartnell slideshow containers not found');
        return;
    }

    console.log('Loading Hartnell slides:', hartnellProjects.length, 'projects');

    hartnellProjects.forEach((project, index) => {
        // Create slide div
        const slideDiv = document.createElement('div');
        slideDiv.classList.add('hartnell-slides');

        // Create image container
        const imageContainer = document.createElement('div');
        imageContainer.classList.add('hartnell-image-container');

        const img = document.createElement('img');
        img.src = project.image;
        img.alt = project.title;
        img.classList.add('hartnell-slide-image');
        img.onerror = function() {
            console.error('Failed to load Hartnell image:', project.image);
        };
        imageContainer.appendChild(img);

        // Add additional image if exists
        if (project.additionalImage) {
            const additionalImg = document.createElement('img');
            additionalImg.src = project.additionalImage;
            additionalImg.alt = project.title + " - Additional";
            additionalImg.classList.add('hartnell-slide-image', 'additional-image');
            additionalImg.onerror = function() {
                console.error('Failed to load additional Hartnell image:', project.additionalImage);
            };
            imageContainer.appendChild(additionalImg);
        }

        // Create text content container
        const textContainer = document.createElement('div');
        textContainer.classList.add('hartnell-text-container');

        const title = document.createElement('h3');
        title.textContent = project.title;
        title.classList.add('hartnell-slide-title');

        const description = document.createElement('p');
        description.classList.add('hartnell-slide-description');
        
        if (project.link) {
            description.innerHTML = project.description + ' <a class="linklight" href="' + project.link + '" target="_blank">' + project.linkText + '</a>';
        } else {
            description.textContent = project.description;
        }

        textContainer.appendChild(title);
        textContainer.appendChild(description);

        // Append image and text directly to slide (vertical layout)
        slideDiv.appendChild(imageContainer);
        slideDiv.appendChild(textContainer);
        slidesContainer.appendChild(slideDiv);

        // Create thumbnail
        const thumb = document.createElement('img');
        thumb.src = project.image;
        thumb.classList.add('hartnell-thumb');
        thumb.alt = project.title;
        thumb.title = project.title;
        thumb.onerror = function() {
            console.error('Failed to load Hartnell thumbnail:', project.image);
        };
        thumb.onclick = () => setHartnellCurrentSlide(index);
        thumbnailContainer.appendChild(thumb);

        hartnellSlides.push(slideDiv);
    });

    console.log('Loaded', hartnellSlides.length, 'Hartnell slides');
    updateHartnellSlideCounter();
}

function showHartnellSlide(index) {
    console.log('showHartnellSlide called with index:', index, 'slides.length:', hartnellSlides.length);
    
    if (index >= hartnellSlides.length) {
        hartnellCurrentSlideIndex = 0;
    } else if (index < 0) {
        hartnellCurrentSlideIndex = hartnellSlides.length - 1;
    } else {
        hartnellCurrentSlideIndex = index;
    }

    console.log('Setting hartnellCurrentSlideIndex to:', hartnellCurrentSlideIndex);

    hartnellSlides.forEach((slide, i) => {
        slide.style.display = i === hartnellCurrentSlideIndex ? 'block' : 'none';
    });
    
    // Update thumbnail highlighting
    const thumbnails = document.querySelectorAll('.hartnell-thumb');
    console.log('Found', thumbnails.length, 'Hartnell thumbnails');
    
    thumbnails.forEach((thumb, i) => {
        if (i === hartnellCurrentSlideIndex) {
            thumb.classList.add('hartnell-current-thumb');
            console.log('Highlighting Hartnell thumbnail', i);
        } else {
            thumb.classList.remove('hartnell-current-thumb');
        }
    });
    
    // Center the current thumbnail
    centerHartnellCurrentThumbnail();
    
    updateHartnellSlideCounter();
}

function centerHartnellCurrentThumbnail() {
    const thumbnailContainer = document.getElementById('hartnellThumbnailContainer');
    const thumbnails = document.querySelectorAll('.hartnell-thumb');
    
    if (thumbnails.length > 0 && hartnellCurrentSlideIndex < thumbnails.length) {
        const currentThumbnail = thumbnails[hartnellCurrentSlideIndex];
        const containerWidth = thumbnailContainer.clientWidth;
        const thumbnailWidth = currentThumbnail.offsetWidth + 10; // Including margin
        
        const thumbnailOffsetLeft = currentThumbnail.offsetLeft;
        const scrollPosition = thumbnailOffsetLeft - (containerWidth / 2) + (thumbnailWidth / 2);
        
        console.log('Centering Hartnell thumbnail', hartnellCurrentSlideIndex + 1, 'with scroll position:', scrollPosition);
        
        // Smooth scroll to the calculated position
        thumbnailContainer.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
    }
}

function nextHartnellSlide() {
    showHartnellSlide(hartnellCurrentSlideIndex + 1);
}

function prevHartnellSlide() {
    showHartnellSlide(hartnellCurrentSlideIndex - 1);
}

function setHartnellCurrentSlide(index) {
    showHartnellSlide(index);
}

function updateHartnellSlideCounter() {
    const currentSlideElement = document.getElementById('hartnellCurrentSlide');
    const totalSlidesElement = document.getElementById('hartnellTotalSlides');
    
    if (currentSlideElement && totalSlidesElement) {
        currentSlideElement.innerText = hartnellCurrentSlideIndex + 1;
        totalSlidesElement.innerText = hartnellSlides.length.toString();
    }
}

function initializeHartnellSlideshow() {
    // Add event listeners for navigation buttons
    const nextBtn = document.getElementById('hartnellNextBtn');
    const prevBtn = document.getElementById('hartnellPrevBtn');
    
    if (nextBtn) nextBtn.onclick = nextHartnellSlide;
    if (prevBtn) prevBtn.onclick = prevHartnellSlide;
    
    // Load slides and show first slide
    loadHartnellSlides();
    if (hartnellSlides.length > 0) {
        showHartnellSlide(hartnellCurrentSlideIndex);
    }
}

// Skills Slideshow
// (skillsCurrentSlideIndex/skillsSlides declared at the top of the file)

// Skills data
const skillsData = [
    {
        title: "Product & Founder",
        icon: "🚀",
        skills: [
            "Own the full product lifecycle: concept, front-end/back-end development, security architecture, SEO, and content",
            "Modern full-stack development with Next.js (App Router, Server Components, Server Actions), React, and TypeScript",
            "Supabase (Postgres, Auth, Storage, Row-Level Security) and Vercel deployment",
            "Shipped and maintain a live product ecosystem under one philosophy — see the <a href='#projects'>Current</a> tab above (Circal, Digitally, DMSecurityX, and related tools)"
        ]
    },
    {
        title: "Research, Learning and Teaching",
        icon: "📚",
        skills: [
            "Ability to sort out needed information for any task at hand from knowledge-based repositories",
            "Worked for brick-and-mortar academic institutions and distance learning environments",
            "Adapted the concept of 'Information Literacy for Lifelong Learning' (see <strong><a href='https://files.eric.ed.gov/fulltext/ED084368.pdf' target='_blank'>Malcolm Knowles book</a></strong>)",
            "Passing on knowledge to other people to enhance learning (see <strong>the power of Protege' Effect</strong> <a href='protege.pdf' target='_blank'>here</a>)",
            "Reviewed available massive open online courses and platforms by <a href='https://sites.google.com/site/reflection4learning/why-reflect' target='_blank'>reflecting as a learner</a> (also, see a study by Jack Mezirow on Reflection Triggers <a href='portfolioentries/otherpeopleswork/reflectiontriggers.pdf' target='_blank'>here</a>)"
        ]
    },
    {
        title: "Web Development",
        icon: "🌐",
        skills: [
            "Static and Dynamic Web Design and Development",
            "Usability Testings, Accessibility Standards, and Sentiment Analysis",
            "Customization of vanilla open source solutions",
            "Using existing social media for branding and marketing",
            "Search Engine Optimization and Knowledge of Web Analytics",
            "WordPress, Joomla, Drupal, CPanel, Shopify and some AWS Cloud Services"
        ]
    },
    {
        title: "Programming",
        icon: "💻",
        skills: [
            "knowledge and experience with time-saving programming tools/IDE extensions",
            "efficient programming using reusable codes from programming cookbooks",
            "progressive learner of newer programming practices",
            "procedural, object-oriented, modular and functional programming"
        ]
    },
    {
        title: "Computer Security",
        icon: "🔒",
        skills: [
            "penetration testing",
            "user account, password, authentication, directory and file system security",
            "audits and account clean ups",
            "defense-in-depth security architecture and multilayered risk mitigation",
            "OWASP Top 10 web application security principles",
            "Security Information and Event Management (SIEM) with Azure Sentinel and the Elastic Stack (ELK)",
            "FERPA regulatory compliance and audit support"
        ]
    },
    {
        title: "Data Science",
        icon: "📊",
        skills: [
            "exploration of datasets to produce business intelligence to help create business decisions",
            "using existing social media data mining to optimize website and social media strategies",
            "using various tools for sentiment analysis, data visualization, business metrics, insights, etc.."
        ]
    },
    {
        title: "Network Administration",
        icon: "🖧",
        skills: [
            "maintained Linux and Windows servers",
            "managing account creation and maintenance, access control list (ACLs), and implementing security policies",
            "promotes change management procedures to ease audit and compliance requirements",
            "Installation of hardware equipments and software upgrades and patches"
        ]
    }
	
];

// Load Skills slides dynamically
function loadSkillsSlides() {
    const slidesContainer = document.getElementById('skillsSlidesContainer');
    const thumbnailContainer = document.getElementById('skillsThumbnailContainer');
    
    if (!slidesContainer || !thumbnailContainer) {
        console.error('Skills slideshow containers not found');
        return;
    }

    console.log('Loading Skills slides:', skillsData.length, 'skills');

    skillsData.forEach((skill, index) => {
        // Create slide div
        const slideDiv = document.createElement('div');
        slideDiv.classList.add('skills-slides');
        slideDiv.style.display = 'none'; // Explicitly hide all slides initially

        // Create panel structure similar to original
        const panel = document.createElement('div');
        panel.classList.add('panel', 'panel-default', 'text-center', 'skills-panel');

        const panelHeading = document.createElement('div');
        panelHeading.classList.add('panel-heading');

        // Add title
        const title = document.createElement('h1');
        title.textContent = skill.title;
        panelHeading.appendChild(title);

        // Add skills list
        const skillsList = document.createElement('h5');
        const ul = document.createElement('ul');
        ul.classList.add('text-left', 'typewriter');
        
        skill.skills.forEach(skillItem => {
            const li = document.createElement('li');
            li.innerHTML = skillItem;
            ul.appendChild(li);
        });
        
        skillsList.appendChild(ul);
        panelHeading.appendChild(skillsList);
        panel.appendChild(panelHeading);
        slideDiv.appendChild(panel);
        slidesContainer.appendChild(slideDiv);

        // Create thumbnail
        const thumb = document.createElement('div');
        thumb.classList.add('skills-thumb');
        // No title attribute: the label is already shown as visible text
        // below, and a redundant title attribute is what triggers the
        // native browser tooltip that can get stuck open after a tap.
        
        const thumbTitle = document.createElement('span');
        thumbTitle.classList.add('skills-thumb-title');
        thumbTitle.textContent = skill.title;
        
        thumb.appendChild(thumbTitle);
        thumb.onclick = () => setSkillsCurrentSlide(index);
        thumbnailContainer.appendChild(thumb);

        skillsSlides.push(slideDiv);
    });

    console.log('Loaded', skillsSlides.length, 'Skills slides');
    updateSkillsSlideCounter();
}

function showSkillsSlide(index) {
    console.log('showSkillsSlide called with index:', index, 'slides.length:', skillsSlides.length);
    
    if (index >= skillsSlides.length) {
        skillsCurrentSlideIndex = 0;
    } else if (index < 0) {
        skillsCurrentSlideIndex = skillsSlides.length - 1;
    } else {
        skillsCurrentSlideIndex = index;
    }

    console.log('Setting skillsCurrentSlideIndex to:', skillsCurrentSlideIndex);

    skillsSlides.forEach((slide, i) => {
        if (i === skillsCurrentSlideIndex) {
            slide.style.display = 'flex';
        } else {
            slide.style.display = 'none';
        }
    });
    
    // Update thumbnail highlighting
    const thumbnails = document.querySelectorAll('.skills-thumb');
    console.log('Found', thumbnails.length, 'Skills thumbnails');
    
    thumbnails.forEach((thumb, i) => {
        if (i === skillsCurrentSlideIndex) {
            thumb.classList.add('skills-current-thumb');
            console.log('Highlighting Skills thumbnail', i);
        } else {
            thumb.classList.remove('skills-current-thumb');
        }
    });
    
    updateSkillsSlideCounter();
}

function updateSkillsSlideCounter() {
    const counter = document.getElementById('skillsSlideCounter');
    if (counter && skillsSlides.length > 0) {
        counter.textContent = `${skillsCurrentSlideIndex + 1} / ${skillsSlides.length}`;
    }
}

function skillsNextSlide() {
    showSkillsSlide(skillsCurrentSlideIndex + 1);
}

function skillsPrevSlide() {
    showSkillsSlide(skillsCurrentSlideIndex - 1);
}

function setSkillsCurrentSlide(index) {
    showSkillsSlide(index);
}

// Initialize Skills slideshow when document loads
$(document).ready(function() {
    // Initialize Skills slideshow
    if (!window.skillsInitialized) {
        loadSkillsSlides();
        if (skillsSlides.length > 0) {
            showSkillsSlide(skillsCurrentSlideIndex);
        }
        window.skillsInitialized = true;
    }
    
    // Initialize Interests slideshow
    if (!window.interestsInitialized) {
        loadInterestsSlides();
        if (interestsSlides.length > 0) {
            showInterestsSlide(interestsCurrentSlideIndex);
        }
        window.interestsInitialized = true;
    }
});

// Interests Slideshow
// (interestsCurrentSlideIndex/interestsSlides declared at the top of the file)

// Interests data
const interestsData = [
    {
        title: "Printed Books I Own",
        icon: "📚",
        mainImage: "images/books/books.jpg",
        additionalImages: [
            "images/books/books2.jpg",
            "images/books/books3.jpg", 
            "images/books/books4.jpg"
        ],
        description: "NOTE: I own lots of electronic books that I read via my Kindle Fire tablet. In terms of subject matters, they are almost the same as the books I actually own and carry around.",
        link: "http://www.librarything.com/catalog/roylouisgarcia",
        linkText: "Go to my Online List",
        extraLinks: [
            { link: "https://nostradmsx.com/my-audiobooks/", linkText: "Go to My Audiobooks" }
        ],
        hasToggle: true,
        toggleText: "More Images Show/Hide"
    },
    {
        title: "Infographics and Visual Arts I like",
        icon: "🎨",
        mainImage: "images/books/pinterests.jpg",
        additionalImages: [],
        description: "",
        link: "https://www.pinterest.com/roylouisgarcia/",
        linkText: "Go to my Online Pinboard",
        hasToggle: false,
        toggleText: ""
    },
    {
        title: "My Radiohead Tribute page",
        icon: "🎵",
        mainImage: "images/interests/radiohead.png",
        additionalImages: [],
        description: "",
        link: "https://roylouisgarcia.github.io/radioheadtribute/",
        linkText: "Go to My Radiohead Tribute Page",
        hasToggle: false,
        toggleText: ""
    },
    {
        title: "Recorded Bliss",
        icon: "🎧",
        mainImage: "images/interests/rr.png",
        additionalImages: [],
        description: "",
        link: "https://recordedbliss.com/",
        linkText: "Go to my Recorded Bliss Site",
        hasToggle: false,
        toggleText: ""
    }
];

// Load Interests slides dynamically
function loadInterestsSlides() {
    const slidesContainer = document.getElementById('interestsSlidesContainer');
    const thumbnailContainer = document.getElementById('interestsThumbnailContainer');
    
    if (!slidesContainer || !thumbnailContainer) {
        console.error('Interests slideshow containers not found');
        return;
    }

    console.log('Loading Interests slides:', interestsData.length, 'interests');

    interestsData.forEach((interest, index) => {
        // Create slide div
        const slideDiv = document.createElement('div');
        slideDiv.classList.add('interests-slides');
        slideDiv.style.display = 'none'; // Explicitly hide all slides initially

        // Create panel structure similar to original
        const panel = document.createElement('div');
        panel.classList.add('panel', 'panel-default', 'text-center', 'interests-panel');

        const panelInterests = document.createElement('div');
        panelInterests.classList.add('panel-interests');

        // Add title
        const title = document.createElement('h1');
        title.textContent = interest.title;
        panelInterests.appendChild(title);

        // Add main image
        const mainImageP = document.createElement('p');
        const mainImg = document.createElement('img');
        mainImg.classList.add('books-default');
        mainImg.src = interest.mainImage;
        mainImg.alt = interest.title;
        mainImageP.appendChild(mainImg);
        panelInterests.appendChild(mainImageP);

        // Add additional images if they exist
        if (interest.additionalImages.length > 0) {
            interest.additionalImages.forEach(imgSrc => {
                const imgP = document.createElement('p');
                const img = document.createElement('img');
                img.classList.add('books');
                img.src = imgSrc;
                img.alt = interest.title;
                imgP.appendChild(img);
                panelInterests.appendChild(imgP);
            });
        }

        // Add buttons container
        const buttonsP = document.createElement('p');
        
        // Add main link button
        if (interest.link) {
            const linkA = document.createElement('a');
            linkA.href = interest.link;
            linkA.target = '_blank';
            
            const linkBtn = document.createElement('button');
            linkBtn.classList.add('totiebtn');
            linkBtn.textContent = interest.linkText;
            
            linkA.appendChild(linkBtn);
            buttonsP.appendChild(linkA);
        }

        // Add extra link buttons if any
        if (interest.extraLinks) {
            interest.extraLinks.forEach(extraLink => {
                const extraA = document.createElement('a');
                extraA.href = extraLink.link;
                extraA.target = '_blank';

                const extraBtn = document.createElement('button');
                extraBtn.classList.add('totiebtn');
                extraBtn.textContent = extraLink.linkText;

                extraA.appendChild(extraBtn);
                buttonsP.appendChild(extraA);
            });
        }

        // Add toggle button if applicable
        if (interest.hasToggle) {
            const toggleBtn = document.createElement('button');
            toggleBtn.classList.add('totiebtn', 'inline-block');
            toggleBtn.textContent = interest.toggleText;
            toggleBtn.id = `books-toggle-${index}`;
            toggleBtn.onclick = () => toggleAdditionalImages(index);
            buttonsP.appendChild(toggleBtn);
        }

        if (interest.link || interest.extraLinks || interest.hasToggle) {
            panelInterests.appendChild(buttonsP);
        }

        // Add description if it exists
        if (interest.description) {
            const descP = document.createElement('p');
            descP.classList.add('typewriter');
            descP.textContent = interest.description;
            panelInterests.appendChild(descP);
        }

        panel.appendChild(panelInterests);
        slideDiv.appendChild(panel);
        slidesContainer.appendChild(slideDiv);

        // Create thumbnail
        const thumb = document.createElement('div');
        thumb.classList.add('interests-thumb');
        // No title attribute: same reasoning as the Skills thumbnails --
        // the label is already visible text, and title only adds a
        // native tooltip that can get stuck open on mobile.
        
        const thumbTitle = document.createElement('span');
        thumbTitle.classList.add('interests-thumb-title');
        thumbTitle.textContent = interest.title;
        
        thumb.appendChild(thumbTitle);
        thumb.onclick = () => setInterestsCurrentSlide(index);
        thumbnailContainer.appendChild(thumb);

        interestsSlides.push(slideDiv);
    });

    console.log('Loaded', interestsSlides.length, 'Interests slides');
    updateInterestsSlideCounter();
}

function showInterestsSlide(index) {
    console.log('showInterestsSlide called with index:', index, 'slides.length:', interestsSlides.length);
    
    if (index >= interestsSlides.length) {
        interestsCurrentSlideIndex = 0;
    } else if (index < 0) {
        interestsCurrentSlideIndex = interestsSlides.length - 1;
    } else {
        interestsCurrentSlideIndex = index;
    }

    console.log('Setting interestsCurrentSlideIndex to:', interestsCurrentSlideIndex);

    interestsSlides.forEach((slide, i) => {
        if (i === interestsCurrentSlideIndex) {
            slide.style.display = 'flex';
        } else {
            slide.style.display = 'none';
        }
    });
    
    // Update thumbnail highlighting
    const thumbnails = document.querySelectorAll('.interests-thumb');
    console.log('Found', thumbnails.length, 'Interests thumbnails');
    
    thumbnails.forEach((thumb, i) => {
        if (i === interestsCurrentSlideIndex) {
            thumb.classList.add('interests-current-thumb');
            console.log('Highlighting Interests thumbnail', i);
        } else {
            thumb.classList.remove('interests-current-thumb');
        }
    });
    
    updateInterestsSlideCounter();
}

function updateInterestsSlideCounter() {
    const counter = document.getElementById('interestsSlideCounter');
    if (counter && interestsSlides.length > 0) {
        counter.textContent = `${interestsCurrentSlideIndex + 1} / ${interestsSlides.length}`;
    }
}

function interestsNextSlide() {
    showInterestsSlide(interestsCurrentSlideIndex + 1);
}

function interestsPrevSlide() {
    showInterestsSlide(interestsCurrentSlideIndex - 1);
}

function setInterestsCurrentSlide(index) {
    showInterestsSlide(index);
}

// Toggle function for additional images (specifically for books)
function toggleAdditionalImages(slideIndex) {
    const currentSlide = interestsSlides[slideIndex];
    if (currentSlide) {
        const additionalImages = currentSlide.querySelectorAll('.books');
        additionalImages.forEach(img => {
            if (img.style.display === 'none' || img.style.display === '') {
                img.style.display = 'block';
            } else {
                img.style.display = 'none';
            }
        });
    }
}

// PERFORMANCE OPTIMIZATION: Lazy Loading Implementation
$(document).ready(function() {
    // Initialize lazy loading for images
    initializeLazyLoading();
    
    // Preload critical above-the-fold images
    preloadCriticalImages();
});

function initializeLazyLoading() {
    // Only initialize if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    // Load the actual image
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    // Remove lazy class and stop observing
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        }, {
            // Start loading when image is 200px away from viewport
            rootMargin: '200px'
        });

        // Observe all images that should be lazy loaded
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers without IntersectionObserver support
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

function preloadCriticalImages() {
    // Preload hero/above-the-fold images for immediate display
    const criticalImages = [
        'images/boy.jpg',
        'images/teenager.png',
        'images/me.jpg'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Function to show Bertelsmann projects with 4 slideshows
function showBertelsmannProjects() {
    // Remove existing Bertelsmann modal if it exists
    const existingModal = document.getElementById('bertelsmannProjectsModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Create modal overlay
    const modal = document.createElement('div');
    modal.id = 'bertelsmannProjectsModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        z-index: 10000;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow-y: auto;
    `;

    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 20px;
        border-radius: 10px;
        max-width: 700px;
        width: 90%;
        max-height: 90%;
        overflow-y: auto;
        position: relative;
        margin: 20px;
    `;

    // Add responsive adjustments for smaller screens
    const mediaQueryStyle = document.createElement('style');
    mediaQueryStyle.textContent = `
        @media (max-width: 768px) {
            #bertelsmannProjectsModal .modal-content {
                width: 95% !important;
                max-width: 95% !important;
                padding: 15px !important;
                margin: 10px !important;
            }
            #bertelsmannProjectsModal .bertelsmann-slideshow {
                height: 470px !important;
            }
            #bertelsmannProjectsModal .bertelsmann-project-title {
                font-size: 16px !important;
                margin-bottom: 10px !important;
            }
        }
        @media (max-width: 480px) {
            #bertelsmannProjectsModal .modal-content {
                width: 98% !important;
                max-width: 98% !important;
                padding: 10px !important;
                margin: 5px !important;
            }
            #bertelsmannProjectsModal .bertelsmann-slideshow {
                height: 470px !important;
            }
            #bertelsmannProjectsModal .bertelsmann-project-title {
                font-size: 14px !important;
                margin-bottom: 8px !important;
            }
        }
        @media (max-width: 360px) {
            #bertelsmannProjectsModal .bertelsmann-slideshow {
                height: 470px !important;
            }
            #bertelsmannProjectsModal .bertelsmann-project-title {
                font-size: 13px !important;
            }
        }
    `;
    document.head.appendChild(mediaQueryStyle);
    modalContent.classList.add('modal-content');

    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = `
        position: absolute;
        top: 10px;
        right: 15px;
        background: none;
        border: none;
        font-size: 30px;
        cursor: pointer;
        color: #666;
        z-index: 10001;
    `;
    closeBtn.onclick = () => modal.remove();

    // Create title
    const title = document.createElement('h2');
    title.textContent = 'Bertelsmann Technology Scholarship - Enterprise Security Projects';
    title.style.cssText = `
        text-align: center;
        margin-bottom: 30px;
        color: #333;
    `;

    // Create container for the 4 projects
    const projectsContainer = document.createElement('div');
    projectsContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 30px;
        margin-bottom: 20px;
    `;

    // Project data with descriptions
    const projects = [
        { 
            name: 'Project 1', 
            folder: 'Project1',
            description: 'Comprehensive enterprise security framework analysis covering threat assessment methodologies, risk evaluation protocols, and security architecture design principles. This project demonstrates advanced understanding of cybersecurity fundamentals and practical implementation strategies.'
        },
        { 
            name: 'Project 2', 
            folder: 'Project2',
            description: 'Advanced network security implementation focusing on intrusion detection systems, firewall configuration, and security monitoring protocols. Explores real-world security scenarios and defensive measures against common attack vectors.'
        },
        { 
            name: 'Project 3', 
            folder: 'Project3',
            description: 'Enterprise security policy development and compliance framework design. Covers security governance, risk management procedures, and regulatory compliance requirements for enterprise-level security implementations.'
        },
        { 
            name: 'Project 4', 
            folder: 'Project4',
            description: 'Cybersecurity incident response and digital forensics analysis. Demonstrates practical skills in security breach investigation, evidence collection, and incident mitigation strategies for enterprise environments.'
        }
    ];

    // Create each project slideshow
    projects.forEach((project, index) => {
        const projectDiv = document.createElement('div');
        projectDiv.style.cssText = `
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            background: #f9f9f9;
        `;

        const projectTitle = document.createElement('h3');
        projectTitle.textContent = project.name;
        projectTitle.style.cssText = `
            text-align: center;
            margin-bottom: 15px;
            color: #333;
            font-size: 18px;
        `;
        projectTitle.classList.add('bertelsmann-project-title');

        const slideshowContainer = document.createElement('div');
        slideshowContainer.style.cssText = `
            position: relative;
            width: 100%;
            height: 470px;
            overflow: hidden;
            border-radius: 5px;
            margin-bottom: 15px;
        `;
        slideshowContainer.classList.add('bertelsmann-slideshow');

        const slideshowId = `bertelsmann-project-${index + 1}`;
        slideshowContainer.id = slideshowId;

        // Create slideshow wrapper
        const slidesWrapper = document.createElement('div');
        slidesWrapper.style.cssText = `
            display: flex;
            transition: transform 0.3s ease;
            height: 100%;
        `;

        // Get images for this project
        const images = getBertelsmannProjectImages(project.folder);
        
        images.forEach((imagePath, imgIndex) => {
            const slide = document.createElement('div');
            slide.style.cssText = `
                min-width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 10px;
            `;

            const img = document.createElement('img');
            img.src = imagePath;
            img.style.cssText = `
                width: 80%;
                height: 450px;
                object-fit: contain;
            `;
            img.alt = `${project.name} - Image ${imgIndex + 1}`;

            slide.appendChild(img);
            slidesWrapper.appendChild(slide);
        });

        // Add navigation buttons if there are multiple images
        if (images.length > 1) {
            const prevBtn = document.createElement('button');
            prevBtn.innerHTML = '&#10094;';
            prevBtn.style.cssText = `
                position: absolute;
                left: 10px;
                top: 50%;
                transform: translateY(-50%);
                background: rgba(0,0,0,0.5);
                color: white;
                border: none;
                padding: 10px;
                cursor: pointer;
                border-radius: 3px;
                z-index: 100;
            `;

            const nextBtn = document.createElement('button');
            nextBtn.innerHTML = '&#10095;';
            nextBtn.style.cssText = `
                position: absolute;
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
                background: rgba(0,0,0,0.5);
                color: white;
                border: none;
                padding: 10px;
                cursor: pointer;
                border-radius: 3px;
                z-index: 100;
            `;

            // Add slide counter
            const slideCounter = document.createElement('div');
            slideCounter.style.cssText = `
                position: absolute;
                bottom: 10px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0,0,0,0.5);
                color: white;
                padding: 5px 10px;
                border-radius: 3px;
                font-size: 12px;
            `;
            slideCounter.textContent = `1 / ${images.length}`;

            let currentSlide = 0;

            const updateSlideshow = () => {
                slidesWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
                slideCounter.textContent = `${currentSlide + 1} / ${images.length}`;
            };

            prevBtn.onclick = () => {
                currentSlide = currentSlide > 0 ? currentSlide - 1 : images.length - 1;
                updateSlideshow();
            };

            nextBtn.onclick = () => {
                currentSlide = currentSlide < images.length - 1 ? currentSlide + 1 : 0;
                updateSlideshow();
            };

            slideshowContainer.appendChild(prevBtn);
            slideshowContainer.appendChild(nextBtn);
            slideshowContainer.appendChild(slideCounter);
        }

        slideshowContainer.appendChild(slidesWrapper);
        
        // Create project description
        const projectDescription = document.createElement('p');
        projectDescription.textContent = project.description;
        projectDescription.style.cssText = `
            margin-top: 15px;
            margin-bottom: 0;
            color: #555;
            line-height: 1.6;
            font-size: 14px;
            text-align: justify;
        `;
        
        projectDiv.appendChild(projectTitle);
        projectDiv.appendChild(slideshowContainer);
        projectDiv.appendChild(projectDescription);
        projectsContainer.appendChild(projectDiv);
    });

    // Assemble modal
    modalContent.appendChild(closeBtn);
    modalContent.appendChild(title);
    modalContent.appendChild(projectsContainer);
    modal.appendChild(modalContent);

    // Add click outside to close
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    };

    // Add to document
    document.body.appendChild(modal);
}

// Helper function to get images for each Bertelsmann project
function getBertelsmannProjectImages(projectFolder) {
    const basePath = 'certs_projects/Udacity/';
    
    // Define images for each project folder
    const projectImages = {
        'Project1': [
            'Project1-page-01.jpg', 'Project1-page-02.jpg', 'Project1-page-03.jpg', 'Project1-page-04.jpg',
            'Project1-page-05.jpg', 'Project1-page-06.jpg', 'Project1-page-07.jpg', 'Project1-page-12.jpg',
            'Project1-page-13.jpg', 'Project1-page-18.jpg', 'Project1-page-20.jpg', 'Project1-page-21.jpg',
            'Project1-page-23.jpg', 'Project1-page-24.jpg', 'Project1-page-26.jpg', 'Project1-page-27.jpg',
            'Project1-page-29.jpg', 'Project1-page-30.jpg', 'Project1-page-31.jpg', 'Project1-page-32.jpg',
            'Project1-page-33.jpg', 'Project1-page-35.jpg', 'Project1-page-36.jpg', 'Project1-page-37.jpg',
            'Project1-page-38.jpg', 'Project1-page-39.jpg', 'Project1-page-43.jpg', 'Project1-page-44.jpg',
            'Project1-page-45.jpg', 'Project1-page-46.jpg', 'Project1-page-49.jpg', 'Project1-page-50.jpg',
            'Project1-page-51.jpg', 'Project1-page-52.jpg', 'Project1-page-53.jpg', 'Project1-page-55.jpg',
            'Project1-page-56.jpg', 'Project1-page-60.jpg', 'Project1-page-61.jpg', 'Project1-page-62.jpg',
            'Project1-page-63.jpg'
        ],
        'Project2': [
            'Project2-page-01.jpg', 'Project2-page-08.jpg', 'Project2-page-09.jpg', 'Project2-page-10.jpg',
            'Project2-page-16.jpg', 'Project2-page-18.jpg', 'Project2-page-19.jpg', 'Project2-page-20.jpg',
            'Project2-page-23.jpg', 'Project2-page-25.jpg'
        ],
        'Project3': [
            'Project3-page-01.jpg', 'Project3-page-10.jpg', 'Project3-page-15.jpg', 'Project3-page-17.jpg',
            'Project3-page-18.jpg', 'Project3-page-19.jpg', 'Project3-page-20.jpg', 'Project3-page-21.jpg',
            'Project3-page-23.jpg', 'Project3-page-24.jpg', 'Project3-page-25.jpg', 'Project3-page-26.jpg'
        ],
        'Project4': [
            'Project4-page-01.jpg', 'Project4-page-08.jpg', 'Project4-page-09.jpg', 'Project4-page-10.jpg',
            'Project4-page-11.jpg', 'Project4-page-12.jpg', 'Project4-page-14.jpg', 'Project4-page-15.jpg',
            'Project4-page-16.jpg', 'Project4-page-18.jpg', 'Project4-page-19.jpg', 'Project4-page-20.jpg',
            'Project4-page-21.jpg', 'Project4-page-22.jpg', 'Project4-page-27.jpg'
        ]
    };

    const images = projectImages[projectFolder] || [];
    return images.map(filename => `${basePath}${projectFolder}/${filename}`);
}

// ---------------------------------------------------------------------------
// Inbound deep link: "#personal"
//
// Standalone project pages (e.g. the RhythmBrownBox hub under
// portfolioentries/personal/rhythmbrownbox/) link back here with
// https://roy.deliberatelearners.com/#personal so a visitor lands on
// Projects > Personal, where that project sits. The rest of the site only
// acts on the URL hash when a nav-bar link is clicked, not on load, so a bare
// "#projects" would show the default "Current" tab -- this opens the Personal
// tab and scrolls the Projects section into view. Runs last (registered at
// end of file), after the tab click handlers are bound in the first ready().
$(document).ready(function () {
    function goPersonal() {
        var section = document.getElementById('projects');
        if (!section || !document.getElementById('link2Personal')) return;
        $('#specialization, .jumbotron-before-specialization').hide();
        $('#link2Personal').trigger('click');
        $('html, body').animate({ scrollTop: $(section).offset().top - 60 }, 700);
    }
    function checkHash() {
        if ((window.location.hash || '').toLowerCase() === '#personal') goPersonal();
    }
    // Deferred so it runs after the initial "Current" tab render (also
    // setTimeout'd in the first ready() above) -- otherwise that render fires
    // last and clobbers the Personal tab this just selected.
    setTimeout(checkHash, 0);
    $(window).on('hashchange', checkHash);
});
