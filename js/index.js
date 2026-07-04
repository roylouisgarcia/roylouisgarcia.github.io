$(document).ready(function(){
    
    // Set default state - all project tabs hidden
    hideAllProjectTabs();
 
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
        showFeaturedTab();
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
    
  // Featured tab removed - content moved to Personal section
  /*
  $("#link2Featured").click(function(){  
    $(".featured").show("fast", function(){
      // Initialize the featured slideshow if not already done
      if (!window.featuredInitialized) {
        initializeFeaturedSlideshow();
        window.featuredInitialized = true;
      }
    });  
    $(".academic").hide("fast", function(){});
    $(".professional").hide("fast", function(){});
    $(".personal").hide("fast", function(){});
    $(".certifications").hide("fast", function(){});
    $("#link2Featured").addClass("active");
    $("#link2Academic").removeClass("active");
    $("#link2Professional").removeClass("active");
    $("#link2Personal").removeClass("active");
    $("#link2Certifications").removeClass("active");  
  });
  */    
    
  
  $("#link2Academic").click(function(){    
    $(".featured").hide("fast", function(){});  
    $(".academic").show("fast", function(){});
    $(".professional").hide("fast", function(){});
    $(".personal").hide("fast", function(){});
    $(".certifications").hide("fast", function(){});
    $("#link2Featured").removeClass("active");  
    $("#link2Academic").addClass("active");
    $("#link2Professional").removeClass("active");
    $("#link2Personal").removeClass("active");
    $("#link2Certifications").removeClass("active");  
  });

  $("#link2Professional").click(function(){
    $(".featured").hide("fast", function(){});      
    $(".academic").hide("fast", function(){});
    $(".professional").show("fast", function(){});
    $(".personal").hide("fast", function(){});
    $(".certifications").hide("fast", function(){});
    $("#link2Featured").removeClass("active");      
    $("#link2Academic").removeClass("active");
    $("#link2Professional").addClass("active");
    $("#link2Personal").removeClass("active");
    $("#link2Certifications").removeClass("active");       
  });

  $("#link2Personal").click(function(){    
    $(".featured").hide("fast", function(){});      
    $(".academic").hide("fast", function(){});
    $(".professional").hide("fast", function(){});
    $(".personal").show("fast", function(){
      // Initialize the featured slideshow if not already done (since it's now in Personal section)
      if (!window.featuredInitialized) {
        initializeFeaturedSlideshow();
        window.featuredInitialized = true;
      }
      // Automatically show personal details and update button text
      $("#personalDetails").show("fast", function(){
        $("#personalDetailsBtn").text("HIDE DETAILS");
      });
    });
    $(".certifications").hide("fast", function(){});
    $("#link2Featured").removeClass("active");      
    $("#link2Academic").removeClass("active");
    $("#link2Professional").removeClass("active");
    $("#link2Personal").addClass("active");
    $("#link2Certifications").removeClass("active");       
  });

  $("#link2Certifications").click(function(){    
    $(".featured").hide("fast", function(){});      
    $(".academic").hide("fast", function(){});
    $(".professional").hide("fast", function(){});
    $(".personal").hide("fast", function(){});
    $(".certifications").show("fast", function(){
      // Initialize the certifications slideshow if not already done
      if (!window.certificationsInitialized) {
        initializeCertificationsSlideshow();
        window.certificationsInitialized = true;
      }
    });
    $("#link2Featured").removeClass("active");      
    $("#link2Academic").removeClass("active");
    $("#link2Professional").removeClass("active");
    $("#link2Personal").removeClass("active");
    $("#link2Certifications").addClass("active");       
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
        $(".featured").hide("slow", function(){});
        $(".academic").hide("slow", function(){}); // Hide Academic by default now
        $(".professional").hide("slow", function(){});
        $(".personal").hide("slow", function(){});
        $("#link2Featured").addClass("btnNonActive");
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
        $(".featured").hide("fast", function(){});
        $(".academic").hide("fast", function(){});
        $(".professional").hide("fast", function(){});
        $(".personal").hide("fast", function(){});
        $(".certifications").hide("fast", function(){});
        $("#link2Featured").removeClass("active");
        $("#link2Academic").removeClass("active");
        $("#link2Professional").removeClass("active");
        $("#link2Personal").removeClass("active");
        $("#link2Certifications").removeClass("active");
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

     function showAcademicTab(){
        $(".featured").hide("fast", function(){});
        $(".academic").show("fast", function(){});
        $(".professional").hide("fast", function(){});
        $(".personal").hide("fast", function(){});
        $(".certifications").hide("fast", function(){});
        $("#link2Featured").removeClass("active");
        $("#link2Academic").addClass("active");
        $("#link2Professional").removeClass("active");
        $("#link2Personal").removeClass("active");
        $("#link2Certifications").removeClass("active");
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

     function showFeaturedTab(){
        $(".featured").hide("fast", function(){});
        $(".academic").hide("fast", function(){});
        $(".professional").hide("fast", function(){});
        $(".personal").hide("fast", function(){});
        $(".certifications").show("fast", function(){
          // Initialize the certifications slideshow if not already done
          if (!window.certificationsInitialized) {
            initializeCertificationsSlideshow();
            window.certificationsInitialized = true;
          }
        });
        $("#link2Featured").removeClass("active");
        $("#link2Academic").removeClass("active");
        $("#link2Professional").removeClass("active");
        $("#link2Personal").removeClass("active");
        $("#link2Certifications").addClass("active");
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

// Certifications Slideshow functionality
let currentCertSlideIndex = 0;
let certSlides = [];
let certificationsData = [];
let certsProjectsMapping = {};

// Load and parse meta_html_css.txt to create title-to-image mapping
function loadCertsProjectsMapping() {
  return fetch('./meta_html_css.txt')
    .then(response => response.text())
    .then(content => {
      const lines = content.split('\n');
      let currentEntry = {};
      
      lines.forEach(line => {
        line = line.trim();
        if (line.startsWith('Name:')) {
          // Save previous entry if complete
          if (currentEntry.name && currentEntry.app) {
            certsProjectsMapping[currentEntry.name.toLowerCase()] = currentEntry.app.replace('certs_project/', 'certs_projects/');
          }
          currentEntry = { name: line.substring(5).trim() };
        } else if (line.startsWith('app:')) {
          currentEntry.app = line.substring(4).trim();
        } else if (line.startsWith('url:')) {
          currentEntry.url = line.substring(4).trim();
        } else if (line === '' && currentEntry.name && currentEntry.app) {
          // End of entry
          certsProjectsMapping[currentEntry.name.toLowerCase()] = currentEntry.app.replace('certs_project/', 'certs_projects/');
          currentEntry = {};
        }
      });
      
      // Don't forget the last entry
      if (currentEntry.name && currentEntry.app) {
        certsProjectsMapping[currentEntry.name.toLowerCase()] = currentEntry.app.replace('certs_project/', 'certs_projects/');
      }
      
      console.log('Loaded certs projects mapping:', certsProjectsMapping);
      return certsProjectsMapping;
    })
    .catch(error => {
      console.error('Error loading meta_html_css.txt:', error);
      return {};
    });
}

// Function to find matching image for a project title
function findImageForTitle(title) {
  const lowerTitle = title.toLowerCase();
  
  // Direct title matches
  for (const [mappedTitle, imagePath] of Object.entries(certsProjectsMapping)) {
    if (lowerTitle === mappedTitle) {
      return imagePath;
    }
  }
  
  // Specific matches for Meta/Coursera HTML CSS project
  if (lowerTitle.includes('meta') && (lowerTitle.includes('html') || lowerTitle.includes('css'))) {
    return 'certs_projects/readme_wholepicture.jpg'; // Use the Little Lemon image for Meta HTML/CSS
  }
  
  // Specific matches based on project keywords
  if (lowerTitle.includes('python') && lowerTitle.includes('windows')) {
    return 'certs_projects/00_helloworld_code.png'; // Generic programming image
  }
  
  if (lowerTitle.includes('android') && lowerTitle.includes('court')) {
    return 'certs_projects/Capture.PNG'; // Generic mobile app image
  }
  

  
  // Ultimate fallback - use a generic project image
  return 'certs_projects/meta_web_development.png';
}

// Function to format Read More content from text file into HTML
function formatReadMoreContent(content) {
  if (!content) return '';
  
  // Parse the content to extract structured information
  let formattedContent = '';
  
  // Check if the content contains structured information with semicolons
  if (content.includes('Technologies Used:') && content.includes(';')) {
    // Parse structured content like "Technologies Used: HTML5, CSS3, Flexbox, Grid Layout; Key Features: ..."
    const sections = content.split(';').map(s => s.trim());
    
    sections.forEach(section => {
      if (section.includes('Technologies Used:')) {
        const tech = section.replace('Technologies Used:', '').trim();
        formattedContent += `
          <h4 style="color: #007bff; margin-bottom: 15px; text-align: left;">Technologies Used</h4>
          <p style="text-align: left; font-size: inherit; line-height: inherit;"><strong>${tech}</strong></p>
        `;
      } else if (section.includes('Key Features:')) {
        const features = section.replace('Key Features:', '').trim();
        formattedContent += `
          <h4 style="color: #007bff; margin-bottom: 15px; margin-top: 20px; text-align: left;">Key Features</h4>
          <p style="text-align: left; font-size: inherit; line-height: inherit;">${features}</p>
        `;
      } else if (section.includes('Learning Outcomes:')) {
        const outcomes = section.replace('Learning Outcomes:', '').trim();
        formattedContent += `
          <h4 style="color: #007bff; margin-bottom: 15px; margin-top: 20px; text-align: left;">Learning Outcomes</h4>
          <p style="text-align: left; font-size: inherit; line-height: inherit;">${outcomes}</p>
        `;
      }
    });
  } else {
    // For unstructured content, format as a general project overview
    let cleanContent = content
      .replace(/\n\n/g, '</p><p style="margin: 10px 0; line-height: 1.6; text-align: justify;">')
      .replace(/\n/g, ' ')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    formattedContent = `
      <h4 style="color: #007bff; margin-bottom: 15px; text-align: left;">Project Overview</h4>
      <p style="margin: 10px 0; line-height: 1.6; text-align: justify;">${cleanContent}</p>
    `;
  }
  
  return formattedContent;
}

// Function to get additional project information for Read More content
function getAdditionalProjectInfo(title) {
  const lowerTitle = title.toLowerCase();
  
  // Match based on project title keywords
  if (lowerTitle.includes('meta') && (lowerTitle.includes('html') || lowerTitle.includes('css'))) {
    return `
      <h4 style="color: #007bff; margin-bottom: 15px; text-align: left;">Technologies Used</h4>
      <p style="text-align: left; font-size: inherit; line-height: inherit;"><strong>HTML5, CSS3, Flexbox, Grid Layout</strong></p>
      
      <h4 style="color: #007bff; margin-bottom: 15px; margin-top: 20px; text-align: left;">Key Features</h4>
      <ul style="margin-left: 20px; text-align: left; font-size: inherit; line-height: inherit;">
        <li>Responsive design</li>
        <li>Semantic HTML</li>
        <li>Modern CSS techniques</li>
      </ul>
      
      <h4 style="color: #007bff; margin-bottom: 15px; margin-top: 20px; text-align: left;">Learning Outcomes</h4>
      <p style="text-align: left; font-size: inherit; line-height: inherit;">Advanced CSS selectors, animations, and responsive web design principles</p>
    `;
  }
  
  if (lowerTitle.includes('python') && lowerTitle.includes('windows')) {
    return `
      <h4 style="color: #007bff; margin-bottom: 15px; text-align: left;">Technologies Used</h4>
      <p style="text-align: left; font-size: inherit; line-height: inherit;"><strong>Python, Windows API, ctypes library</strong></p>
      
      <h4 style="color: #007bff; margin-bottom: 15px; margin-top: 20px; text-align: left;">Key Features</h4>
      <ul style="margin-left: 20px; text-align: left; font-size: inherit; line-height: inherit;">
        <li>Direct system calls</li>
        <li>Process management</li>
        <li>Native Windows integration</li>
      </ul>
      
      <h4 style="color: #007bff; margin-bottom: 15px; margin-top: 20px; text-align: left;">Learning Outcomes</h4>
      <p style="text-align: left; font-size: inherit; line-height: inherit;">Low-level programming, system architecture, API interaction</p>
    `;
  }
  
  if (lowerTitle.includes('android') && lowerTitle.includes('court')) {
    return `
      <h4 style="color: #007bff; margin-bottom: 15px; text-align: left;">Technologies Used</h4>
      <p style="text-align: left; font-size: inherit; line-height: inherit;"><strong>Java, Android SDK, XML Layouts</strong></p>
      
      <h4 style="color: #007bff; margin-bottom: 15px; margin-top: 20px; text-align: left;">Key Features</h4>
      <ul style="margin-left: 20px; text-align: left; font-size: inherit; line-height: inherit;">
        <li>Interactive UI</li>
        <li>State management</li>
        <li>Basketball scoring system</li>
      </ul>
      
      <h4 style="color: #007bff; margin-bottom: 15px; margin-top: 20px; text-align: left;">Learning Outcomes</h4>
      <p style="text-align: left; font-size: inherit; line-height: inherit;">Mobile app development, Android lifecycle, UI/UX design</p>
    `;
  }
  
  // Default content for other projects
  return `
    <h4 style="color: #007bff; margin-bottom: 15px; text-align: left;">Project Details</h4>
    <p style="text-align: left; font-size: inherit; line-height: inherit;">This project showcases various programming concepts and technologies. Click "View on GitHub" to explore the source code and learn more about the implementation details.</p>
    
    <h4 style="color: #007bff; margin-bottom: 15px; margin-top: 20px; text-align: left;">Explore More</h4>
    <p style="text-align: left; font-size: inherit; line-height: inherit;">Visit the GitHub repository to see the complete codebase, documentation, and additional project information.</p>
  `;
}

// Parse mooc_projects.txt content into structured data
function parseMoocProjectsData(content) {
  const projects = [];
  const lines = content.split('\n');
  let currentProject = {};
  
  lines.forEach(line => {
    line = line.trim();
    
    if (line === '') {
      // Empty line might indicate end of project
      if (currentProject.title && currentProject.githubUrl && currentProject.image1) {
        projects.push({...currentProject});
      }
      // Reset for potential new project
      if (Object.keys(currentProject).length > 3) {
        currentProject = {};
      }
    } else if (line.includes(':')) {
      const colonIndex = line.indexOf(':');
      const key = line.substring(0, colonIndex).trim().toLowerCase();
      const value = line.substring(colonIndex + 1).trim();
      
      if (key === 'title') {
        // Start of new project
        if (currentProject.title && currentProject.githubUrl && currentProject.image1) {
          projects.push({...currentProject});
        }
        currentProject = { title: value };
      } else if (key === 'github url') {
        currentProject.githubUrl = value;
      } else if (key === 'image 1') {
        currentProject.image1 = value;
      } else if (key === 'image 2') {
        currentProject.image2 = value;
      } else if (key === 'description') {
        currentProject.description = value;
      } else if (key === 'actual site') {
        currentProject.actualSite = value;
      } else if (key === 'read more' || key === 'read more:') {
        currentProject.readMore = value;
      }
    }
  });
  
  // Don't forget the last project
  if (currentProject.title && currentProject.githubUrl && currentProject.image1) {
    projects.push(currentProject);
  }
  
  console.log('Parsed projects:', projects);
  console.log('Projects with images:', projects.map(p => ({ title: p.title, image1: p.image1, image2: p.image2 })));
  return projects;
}

// Load certifications data from mooc_projects.txt
function loadCertificationsData() {
  console.log('Loading certifications data...');
  
  // First load the certs projects mapping
  loadCertsProjectsMapping()
    .then(() => {
      // Then load the mooc projects data
      return fetch('./mooc_projects.txt');
    })
    .then(response => {
      console.log('Fetch response:', response);
      return response.text();
    })
    .then(content => {
      console.log('File content loaded, length:', content.length);
      certificationsData = parseMoocProjectsData(content);
      console.log('Loaded certifications data:', certificationsData);
      loadCertSlides();
    })
    .catch(error => {
      console.error('Error loading mooc_projects.txt:', error);
    });
}

// Load slides dynamically based on parsed data
function loadCertSlides() {
  const slidesContainer = document.getElementById('certificationsSlides');
  const thumbnailContainer = document.getElementById('certThumbnailContainer');
  
  if (!slidesContainer || !thumbnailContainer) {
    console.error('Certifications slideshow containers not found');
    return;
  }

  console.log('Loading certification slides:', certificationsData.length, 'projects');

  // Clear existing content
  slidesContainer.innerHTML = '';
  thumbnailContainer.innerHTML = '';
  certSlides = [];

  certificationsData.forEach((project, index) => {
    // Determine which image to use:
    // 1. If project.image1 exists and is not empty, use it
    // 2. Otherwise, fallback to findImageForTitle
    let localImage;
    
    if (project.image1 && project.image1.trim() !== '' && project.image1 !== '#') {
      localImage = project.image1;
    } else {
      localImage = findImageForTitle(project.title);
    }
    
    console.log(`Project "${project.title}":`, {
      image1: project.image1,
      image2: project.image2,
      finalImage: localImage
    });
    
    // Create slide
    const slideDiv = document.createElement('div');
    slideDiv.classList.add('cert-slides');

    // Create slide content
    const slideContent = document.createElement('div');
    slideContent.classList.add('cert-slide-content');
    
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
    img.src = localImage; // Use local image instead of project.image1
    img.style.cursor = 'pointer';
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    img.style.display = 'block';
    img.style.margin = '0 auto';
    img.title = 'Click to view GitHub repository';
    img.onerror = function() {
      console.error('Failed to load image:', localImage);
      
      // Try fallback: if it was using project.image1, try findImageForTitle
      if (localImage === project.image1) {
        const fallbackImage = findImageForTitle(project.title);
        console.log(`Trying fallback image for "${project.title}": ${fallbackImage}`);
        
        if (fallbackImage !== localImage) {
          img.src = fallbackImage;
          return; // Let the new image try to load
        }
      }
      
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
      placeholder.style.cursor = 'pointer';
      placeholder.onclick = () => window.open(project.githubUrl, '_blank');
      img.parentNode.replaceChild(placeholder, img);
    };
    img.onclick = () => window.open(project.githubUrl, '_blank');
    slideContent.appendChild(img);
    
    const descElement = document.createElement('p');
    descElement.textContent = project.description;
    descElement.style.marginTop = '20px';
    descElement.style.textAlign = 'justify';
    descElement.style.lineHeight = '1';
    descElement.style.fontSize = '12px';
    descElement.style.color = '#555';
    
    // Add responsive styling for smaller devices
    descElement.style.cssText += `
      @media (max-width: 768px) {
        font-size: 12px !important;
        line-height: 1 !important;
        text-align: left !important;
        padding: 0 12px !important;
      }
      @media (max-width: 480px) {
        font-size: 13px !important;
        line-height: 1.4 !important;
        padding: 0 5px !important;
      }
    `;
    
    slideContent.appendChild(descElement);
    
    // Add GitHub link button and Read More button
    const linkContainer = document.createElement('div');
    linkContainer.classList.add('project-btn-container');
    
    const githubLink = document.createElement('a');
    githubLink.href = project.githubUrl;
    githubLink.target = '_blank';
    
    // Special handling for Bertelsmann nanodegree
    if (project.title.includes('Bertelsmann')) {
        githubLink.textContent = 'See Projects';
        githubLink.href = '#'; // Since we're not linking to GitHub
        githubLink.addEventListener('click', function(e) {
            e.preventDefault();
            // Create and show the Bertelsmann projects div
            showBertelsmannProjects();
        });
    } else {
        githubLink.textContent = 'View on GitHub';
    }
    
    githubLink.classList.add('project-btn', 'project-btn-github');
    
    const readMoreBtn = document.createElement('button');
    readMoreBtn.textContent = 'Read More';
    readMoreBtn.classList.add('project-btn', 'project-btn-readmore');
    
    linkContainer.appendChild(githubLink);
    
    // Add "See Demo" button for Coursera/Meta HTML and CSS project
    if (project.title && project.title.toLowerCase().includes('coursera/meta html and css')) {
        const demoLink = document.createElement('a');
        demoLink.href = 'https://roylouisgarcia.github.io/meta-coursera-html-css-project/';
        demoLink.target = '_blank';
        demoLink.textContent = 'See Demo';
        demoLink.classList.add('project-btn', 'project-btn-demo');
        linkContainer.appendChild(demoLink);
    }
    
    linkContainer.appendChild(readMoreBtn);
    slideContent.appendChild(linkContainer);

    // Create the Read More content div (initially hidden)
    const readMoreContent = document.createElement('div');
    readMoreContent.classList.add('cert-read-more-content');
    readMoreContent.style.display = 'none';
    readMoreContent.style.marginTop = '20px';
    readMoreContent.style.padding = '20px';
    readMoreContent.style.backgroundColor = '#f8f9fa';
    readMoreContent.style.border = '1px solid #dee2e6';
    readMoreContent.style.borderRadius = '8px';
    readMoreContent.style.lineHeight = '1.6';
    
    // Add responsive styling for smaller devices
    readMoreContent.style.cssText += `
      @media (max-width: 768px) {
        padding: 15px 10px !important;
        font-size: 14px !important;
        line-height: 1.5 !important;
      }
      @media (max-width: 480px) {
        padding: 10px 5px !important;
        font-size: 13px !important;
        line-height: 1.4 !important;
      }
    `;
    
    // Get additional info for this project
    const additionalInfo = project.readMore ? formatReadMoreContent(project.readMore) : getAdditionalProjectInfo(project.title);
    readMoreContent.innerHTML = additionalInfo;
    
    slideContent.appendChild(readMoreContent);
    
    // Add click event to toggle the read more content
    readMoreBtn.onclick = function() {
      if (readMoreContent.style.display === 'none') {
        readMoreContent.style.display = 'block';
        readMoreBtn.textContent = 'Show Less';
      } else {
        readMoreContent.style.display = 'none';
        readMoreBtn.textContent = 'Read More';
      }
    };
    
    slideDiv.appendChild(slideContent);
    slidesContainer.appendChild(slideDiv);

    // Create thumbnail using the same local image
    const thumb = document.createElement('img');
    thumb.src = localImage; // Use local image for thumbnail too
    thumb.classList.add('cert-thumb');
    thumb.style.cursor = 'pointer';
    thumb.title = project.title + ' - Click to view slide or Ctrl+Click for GitHub';
    thumb.onerror = function() {
      console.error('Failed to load thumbnail:', localImage);
      
      // Try fallback: if it was using project.image1, try findImageForTitle
      if (localImage === project.image1) {
        const fallbackImage = findImageForTitle(project.title);
        console.log(`Trying fallback thumbnail for "${project.title}": ${fallbackImage}`);
        
        if (fallbackImage !== localImage) {
          thumb.src = fallbackImage;
          return; // Let the new image try to load
        }
      }
      
      // Create a simple text thumbnail if image fails
      const textThumb = document.createElement('div');
      textThumb.classList.add('cert-thumb');
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
      textThumb.title = project.title + ' - Click to view slide or Ctrl+Click for GitHub';
      textThumb.textContent = project.title.substring(0, 8) + '...';
      textThumb.onclick = (event) => {
        if (event.ctrlKey || event.metaKey) {
          window.open(project.githubUrl, '_blank');
        } else {
          setCurrentCertSlide(index);
        }
      };
      thumb.parentNode.replaceChild(textThumb, thumb);
    };
    thumb.onclick = (event) => {
      if (event.ctrlKey || event.metaKey) {
        window.open(project.githubUrl, '_blank');
      } else {
        setCurrentCertSlide(index);
      }
    };
    thumbnailContainer.appendChild(thumb);

    certSlides.push(slideDiv);
  });

  console.log('Loaded', certSlides.length, 'certification slides');
  updateCertSlideCounter();
  
  // Show first slide
  if (certSlides.length > 0) {
    showCertSlide(0);
  }
}

function showCertSlide(index) {
  console.log('showCertSlide called with index:', index, 'certSlides.length:', certSlides.length);
  
  if (index >= certSlides.length) {
    currentCertSlideIndex = 0;
  } else if (index < 0) {
    currentCertSlideIndex = certSlides.length - 1;
  } else {
    currentCertSlideIndex = index;
  }

  console.log('Setting currentCertSlideIndex to:', currentCertSlideIndex);

  certSlides.forEach((slide, i) => {
    if (i === currentCertSlideIndex) {
      slide.style.display = 'block';
      slide.classList.add('active');
    } else {
      slide.style.display = 'none';
      slide.classList.remove('active');
    }
  });
  
  // Update thumbnail highlighting
  const thumbnails = document.querySelectorAll('.cert-thumb');
  console.log('Found', thumbnails.length, 'certification thumbnails');
  
  thumbnails.forEach((thumb, i) => {
    if (i === currentCertSlideIndex) {
      thumb.classList.add('current-cert-thumb');
      console.log('Highlighting certification thumbnail', i);
    } else {
      thumb.classList.remove('current-cert-thumb');
    }
  });
  
  updateCertSlideCounter();
}

function nextCertSlide() {
  showCertSlide(currentCertSlideIndex + 1);
}

function prevCertSlide() {
  showCertSlide(currentCertSlideIndex - 1);
}

function setCurrentCertSlide(index) {
  // Close any open panels and modals
  closeFeaturedSectionPanels();
  
  // Scroll to Featured heading
  scrollToFeaturedHeading();
  
  showCertSlide(index);
}

// Function to close all open panels and modals in the Featured section
function closeFeaturedSectionPanels() {
  // Close Bertelsmann modal if open
  const bertelsmannModal = document.getElementById('bertelsmannProjectsModal');
  if (bertelsmannModal) {
    bertelsmannModal.remove();
  }
  
  // Close professional details panel if open
  if ($("#professionalDetails").is(":visible")) {
    $("#professionalDetails").hide("fast");
    $("#professionalDetailsbtn").text("CLICK HERE FOR MORE DETAILS");
  }
  
  // Close personal details panel if open
  if ($("#personalDetails").is(":visible")) {
    $("#personalDetails").hide("fast");
    $("#personalDetailsBtn").text("CLICK HERE FOR MORE DETAILS");
  }
  
  // Close all open Read More content in Featured section
  const readMoreContents = document.querySelectorAll('.cert-read-more-content');
  readMoreContents.forEach(content => {
    if (content.style.display === 'block') {
      content.style.display = 'none';
      // Find the corresponding Read More button and reset its text
      const slide = content.closest('.cert-slide');
      if (slide) {
        const readMoreBtn = slide.querySelector('.project-btn-readmore');
        if (readMoreBtn) {
          readMoreBtn.textContent = 'Read More';
        }
      }
    }
  });
}

// Function to scroll to Featured heading
function scrollToFeaturedHeading() {
  const featuredHeader = $(".certifications .projectheader:contains('Featured')");
  if (featuredHeader.length > 0) {
    $('html, body').animate({
      scrollTop: featuredHeader.offset().top - 100
    }, 500);
  }
}

function updateCertSlideCounter() {
  const currentSlideEl = document.getElementById('certCurrentSlide');
  const totalSlidesEl = document.getElementById('certTotalSlides');
  if (currentSlideEl && totalSlidesEl) {
    currentSlideEl.innerText = currentCertSlideIndex + 1;
    totalSlidesEl.innerText = certSlides.length.toString();
  }
}

// Initialize the certifications slideshow
function initializeCertificationsSlideshow() {
  console.log('Initializing certifications slideshow');
  
  // Load the data and slides
  loadCertificationsData();
}

// Featured slideshow variables
let currentFeaturedSlideIndex = 0;
let featuredSlides = [];

// Featured projects data - based on the original static grid layout
const featuredProjectsData = [
  {
    title: "Rhythm Brown Box",
    image: "./images/featured/drummachine.png",
    url: "https://roylouisgarcia.github.io/portfolio/portfolioentries/currentprojects/rhythmbrownbox/"
  },
  {
    title: "Recorded Bliss",
    image: "./images/featured/recordedbliss.png",
    url: "https://roylouisgarcia.github.io/portfolio/portfolioentries/rb/"
  },
  {
    title: "Summer Beads",
    image: "./images/featured/summerbeads.png",
    url: "https://roylouisgarcia.github.io/portfolio/portfolioentries/personal/summerbeads/"
  },
  {
    title: "Rock Paper Scissors",
    image: "./images/featured/rockerpaperscissors.png",
    url: "https://roylouisgarcia.github.io/portfolio/portfolioentries/currentprojects/rockpaperscissors/"
  },
  {
    title: "Heathwood Hardware Inc. (HHI)",
    image: "./images/featured/hhi.png",
    url: "https://roylouisgarcia.github.io/portfolio/portfolioentries/academic/hhi/index.html"
  },
  {
    title: "Flames Calculator - Input",
    image: "./images/featured/flames.png",
    url: "https://roylouisgarcia.github.io/portfolio/portfolioentries/currentprojects/flames/"
  },
  {
    title: "Flames Calculator - Results ",
    image: "./images/featured/flames2.png",
    url: "https://roylouisgarcia.github.io/portfolio/portfolioentries/currentprojects/flames/"
  },
  {
    title: "League of Legends - LUA template generator for LeaguePedia",
    image: "./images/featured/form2lua.png",
    url: "https://roylouisgarcia.github.io/portfolio/portfolioentries/personal/form2lua/"
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
    img.style.cursor = 'pointer';
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    img.style.display = 'block';
    img.style.margin = '0 auto';
    img.title = 'Click to view project';
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
      placeholder.style.cursor = 'pointer';
      placeholder.onclick = () => window.open(project.url, '_blank');
      img.parentNode.replaceChild(placeholder, img);
    };
    img.onclick = () => window.open(project.url, '_blank');
    slideContent.appendChild(img);
    
    // Add link button
    const linkContainer = document.createElement('div');
    linkContainer.style.textAlign = 'center';
    linkContainer.style.marginTop = '10px';
    linkContainer.style.marginBottom = '10px';
    
    const projectLink = document.createElement('a');
    projectLink.href = project.url;
    projectLink.target = '_blank';
    projectLink.textContent = 'View Project';
    projectLink.style.display = 'inline-block';
    projectLink.style.padding = '10px 20px';
    projectLink.style.backgroundColor = '#007bff';
    projectLink.style.color = 'white';
    projectLink.style.textDecoration = 'none';
    projectLink.style.borderRadius = '5px';
    projectLink.style.transition = 'background-color 0.3s ease';
    projectLink.onmouseover = () => projectLink.style.backgroundColor = '#0056b3';
    projectLink.onmouseout = () => projectLink.style.backgroundColor = '#007bff';
    
    linkContainer.appendChild(projectLink);
    slideContent.appendChild(linkContainer);
    
    slideDiv.appendChild(slideContent);
    slidesContainer.appendChild(slideDiv);

    // Create thumbnail
    const thumb = document.createElement('img');
    thumb.src = project.image;
    thumb.classList.add('featured-thumb');
    thumb.style.cursor = 'pointer';
    thumb.title = project.title + ' - Click to view slide or Ctrl+Click to open project';
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
      textThumb.title = project.title + ' - Click to view slide or Ctrl+Click to open project';
      textThumb.textContent = project.title.substring(0, 8) + '...';
      textThumb.onclick = (event) => {
        if (event.ctrlKey || event.metaKey) {
          window.open(project.url, '_blank');
        } else {
          setCurrentFeaturedSlide(index);
        }
      };
      thumb.parentNode.replaceChild(textThumb, thumb);
    };
    thumb.onclick = (event) => {
      if (event.ctrlKey || event.metaKey) {
        window.open(project.url, '_blank');
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
let hartnellCurrentSlideIndex = 0;
let hartnellSlides = [];

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
let skillsCurrentSlideIndex = 0;
let skillsSlides = [];

// Skills data
const skillsData = [
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
            "multilayered security and risk mitigation"
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
        thumb.title = skill.title;
        
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
let interestsCurrentSlideIndex = 0;
let interestsSlides = [];

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

        // Add toggle button if applicable
        if (interest.hasToggle) {
            const toggleBtn = document.createElement('button');
            toggleBtn.classList.add('totiebtn', 'inline-block');
            toggleBtn.textContent = interest.toggleText;
            toggleBtn.id = `books-toggle-${index}`;
            toggleBtn.onclick = () => toggleAdditionalImages(index);
            buttonsP.appendChild(toggleBtn);
        }

        if (interest.link || interest.hasToggle) {
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
        thumb.title = interest.title;
        
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