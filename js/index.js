// Slideshow state, declared up front so it's never in the temporal dead
// zone regardless of when/where an init function ends up getting called from.
let moocSlideIndex = 0;
let moocSlides = [];
let hartnellCurrentSlideIndex = 0;
let hartnellSlides = [];
let skillsCurrentSlideIndex = 0;
let skillsSlides = [];
let interestsCurrentSlideIndex = 0;
let interestsSlides = [];

/* =========================================================================
   PROJECTS SECTION -- capability tabs

   Five folder tabs, each a data-driven slideshow (Academic keeps its own
   school sub-tabs and is left alone). One config, PROJECT_TABS, names each
   tab's content class, folder-tab id, URL hash, DOM id prefix, and data
   array. A single generic slideshow engine (createSlideshow) serves all
   the data-driven tabs, replacing the two near-identical engines that used
   to drive "Current Sites" and "Featured Projects".

   Data arrays (securityData / productData / personalData) are defined lower
   in this file, keyed into PROJECT_DATA; nothing here runs until after the
   whole file has parsed (the initial render is deferred a tick from
   $(document).ready), so forward references resolve fine.
   ========================================================================= */

const PROJECT_TABS = [
  { tab: 'link2Security', section: 'security', hash: '#security', ids: 'security', data: 'securityData' },
  { tab: 'link2Product',  section: 'product',  hash: '#product',  ids: 'product',  data: 'productData' },
  { tab: 'link2Academic', section: 'academic', hash: '#academic' },
  { tab: 'link2Personal', section: 'personal', hash: '#personal', ids: 'personal', data: 'personalData' },
];
const PROJECT_TAB_ORDER = PROJECT_TABS.map(function (t) { return t.tab; });
const DEFAULT_PROJECT_TAB = 'link2Security';
const _slideshows = {};   // ids -> slideshow controller, built lazily

// Map an inbound URL hash to a folder-tab id.
function projectTabForHash(hash) {
  const h = (hash || '').toLowerCase();
  const m = PROJECT_TABS.filter(function (t) { return t.hash === h; })[0];
  return m ? m.tab : null;
}

// Build a tab's slideshow the first time it is revealed. PROJECT_DATA is
// defined lower in the file (with the data arrays); this only runs after
// the deferred initial render, by which point it's assigned.
function ensureSlideshow(ids) {
  if (!ids || _slideshows[ids]) return;
  const data = (typeof PROJECT_DATA !== 'undefined') ? PROJECT_DATA[ids] : null;
  if (!Array.isArray(data)) return;
  _slideshows[ids] = createSlideshow(ids, data);
}

// Show one project tab, hide the rest; keep folder-tab `active` state, the
// Academic sub-panels, and the mobile grid order in sync.
function showProjectTab(tabId) {
  PROJECT_TABS.forEach(function (t) {
    if (t.tab === tabId) {
      $('.' + t.section).show('fast', function () { ensureSlideshow(t.ids); });
      $('#' + t.tab).addClass('active');
    } else {
      $('.' + t.section).hide('fast');
      $('#' + t.tab).removeClass('active');
    }
  });
  $('#hartnell, #csumb').hide('fast');
  // Academic opens on the graduate degree (M.S., Information Assurance &
  // Security) -- the most job-relevant credential -- rather than a blank
  // panel that needs a click to reveal anything.
  if (tabId === 'link2Academic') {
    $('#capella').show('fast');
    $('#graduate').css('opacity', '1');
    $('#associate, #bachelors').css('opacity', '.6');
  } else {
    $('#capella').hide('fast');
    $('#associate, #bachelors, #graduate').css('opacity', '1');
  }
  hideAcademicProjects();
  hideLyricsProjects();
  updateMobileTabOrder(tabId);
}

function hideAllProjectTabs() {
  PROJECT_TABS.forEach(function (t) {
    $('.' + t.section).hide('fast');
    $('#' + t.tab).removeClass('active');
  });
  $('#hartnell, #csumb, #capella').hide('fast');
  $('#associate, #bachelors, #graduate').css('opacity', '1');
  hideAcademicProjects();
  hideLyricsProjects();
}

// Hide helpers -- top-level so showProjectTab()/hideAllProjectTabs() (also
// top-level) can call them.
function hideAcademicProjects() {
  $('#hartnellprojects, #hartnellcourses, #csumbprojects, #csumbcourses, #capellaprojects, #capellacourses').hide('fast');
  $('#hartnellcoursesbtn, #hartnellprojectsbtn, #csumbcoursesbtn, #csumbprojectsbtn, #capellacoursesbtn, #capellaprojectsbtn')
    .removeClass('totiebtnActive');
}
function hideLyricsProjects() {
  $('#angellyrics, #uulitinlyrics, #moonlyrics').hide('fast');
}

// Mobile tab grid order: the active tab always lands in the bottom-left
// slot; the rest keep their relative order. Sets a data-pos attribute a
// mobile-only media query maps to CSS `order` (inert on desktop).
function updateMobileTabOrder(activeId) {
  var others = PROJECT_TAB_ORDER.filter(function (id) { return id !== activeId; });
  var slots = [1, 2, 3, 4, 5];
  var activeSlot = PROJECT_TAB_ORDER.length <= 4 ? 3 : 4;
  slots.splice(activeSlot - 1, 1);
  var positions = {};
  positions[activeId] = activeSlot;
  others.forEach(function (id, i) { positions[id] = slots[i]; });
  PROJECT_TAB_ORDER.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.setAttribute('data-pos', positions[id]);
  });
}

/* ---- generic slideshow engine -----------------------------------------
   `ids` is a DOM id prefix; a tab's markup provides:
     #<ids>Slides  #<ids>Thumbs  #<ids>Current  #<ids>Total  #<ids>Prev  #<ids>Next
   Each data item: { title, image, url | (siteUrl & githubUrl),
                     description?, readMore?, isBertelsmann? }
--------------------------------------------------------------------- */
function createSlideshow(ids, data) {
  const slidesEl = document.getElementById(ids + 'Slides');
  const thumbsEl = document.getElementById(ids + 'Thumbs');
  if (!slidesEl || !thumbsEl) {
    console.error('Slideshow containers not found for "' + ids + '"');
    return null;
  }
  const currentEl = document.getElementById(ids + 'Current');
  const totalEl = document.getElementById(ids + 'Total');
  slidesEl.innerHTML = '';
  thumbsEl.innerHTML = '';

  let index = 0;
  const slides = [];

  // --- accessibility: name the carousel region, add a polite status line
  // screen readers announce on each slide change, and wire arrow keys.
  const region = slidesEl.closest('.certifications-slideshow-container');
  let statusEl = null;
  if (region) {
    region.setAttribute('role', 'group');
    region.setAttribute('aria-roledescription', 'carousel');
    if (!region.getAttribute('aria-label')) {
      const hdr = region.parentElement && region.parentElement.querySelector('.projectheader');
      region.setAttribute('aria-label', (hdr ? hdr.textContent.trim() : ids) + ' projects');
    }
    statusEl = document.createElement('div');
    statusEl.className = 'sr-only';
    statusEl.setAttribute('aria-live', 'polite');
    region.appendChild(statusEl);
    region.addEventListener('keydown', function (e) {
      if (!e.target.closest('.cert-nav-btn, .cert-thumb')) return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(index - 1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); show(index + 1); }
    });
  }

  const styleBtn = function (a, bg, hover) {
    a.style.cssText = 'display:inline-block;margin:5px;padding:10px 20px;background-color:' + bg +
      ';color:#fff;text-decoration:none;border-radius:5px;font-weight:bold;transition:background-color .3s ease';
    a.onmouseover = function () { a.style.backgroundColor = hover; };
    a.onmouseout = function () { a.style.backgroundColor = bg; };
  };

  data.forEach(function (item, i) {
    const primaryUrl = item.siteUrl || item.url || null;

    const slide = document.createElement('div');
    slide.className = 'cert-slides';
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', (i + 1) + ' of ' + data.length);
    const content = document.createElement('div');
    content.className = 'cert-slide-content';

    const h = document.createElement('h2');
    h.textContent = item.title;
    h.style.cssText = 'text-align:center;margin-bottom:15px;color:#333;font-size:20px;font-weight:bold';
    content.appendChild(h);

    if (item.image) {
      const img = document.createElement('img');
      img.src = item.image;
      img.alt = item.title;
      img.style.cssText = 'max-width:100%;height:auto;display:block;margin:0 auto';
      img.onerror = function () { console.error('Failed to load image:', item.image); };
      content.appendChild(img);
    }

    if (item.description) {
      const p = document.createElement('p');
      p.textContent = item.description;
      p.style.cssText = 'margin-top:20px;text-align:justify;line-height:1.6';
      content.appendChild(p);
    }

    // Scannable "built with + what it shows" line -- the thing a recruiter reads.
    if (item.stack || item.shows) {
      const meta = document.createElement('div');
      meta.className = 'project-meta';
      [['Built with', item.stack], ['Shows', item.shows]].forEach(function (pair) {
        if (!pair[1]) return;
        const row = document.createElement('p');
        const label = document.createElement('span');
        label.className = 'pm-label';
        label.textContent = pair[0];
        row.appendChild(label);
        row.appendChild(document.createTextNode(' ' + pair[1]));
        meta.appendChild(row);
      });
      if (meta.children.length) content.appendChild(meta);
    }

    const btnRow = document.createElement('div');
    btnRow.style.cssText = 'text-align:center;margin:15px 0';

    if (item.isBertelsmann) {
      const a = document.createElement('a');
      a.href = '#';
      a.textContent = 'View Projects';
      a.onclick = function (e) { e.preventDefault(); showBertelsmannProjects(); };
      styleBtn(a, '#007bff', '#0056b3');
      btnRow.appendChild(a);
    } else if (primaryUrl) {
      const a = document.createElement('a');
      a.href = primaryUrl;
      if (primaryUrl.indexOf('http') === 0) { a.target = '_blank'; a.rel = 'noopener'; }
      a.textContent = item.siteUrl ? 'View Project'
        : (item.url && item.url.indexOf('github.com') > -1 ? 'View on GitHub' : 'View Site');
      styleBtn(a, '#007bff', '#0056b3');
      btnRow.appendChild(a);
    }
    if (item.githubUrl) {
      const g = document.createElement('a');
      g.href = item.githubUrl;
      g.target = '_blank';
      g.rel = 'noopener';
      g.textContent = 'View on GitHub';
      styleBtn(g, '#24292e', '#000');
      btnRow.appendChild(g);
    }
    if (item.articleUrl) {
      const r = document.createElement('a');
      r.href = item.articleUrl;
      r.target = '_blank';
      r.rel = 'noopener';
      r.textContent = item.articleLabel || 'Read the Article';
      styleBtn(r, '#6f42c1', '#59359a');
      btnRow.appendChild(r);
    }

    let moreEl = null;
    if (item.readMore) {
      const more = document.createElement('button');
      more.textContent = 'Read More';
      more.className = 'project-btn project-btn-readmore';
      btnRow.appendChild(more);
      moreEl = document.createElement('div');
      moreEl.className = 'cert-read-more-content';
      moreEl.style.cssText = 'display:none;margin-top:20px;padding:20px;background-color:#f8f9fa;border:1px solid #dee2e6;border-radius:8px;line-height:1.6;text-align:justify';
      moreEl.textContent = item.readMore;
      more.onclick = function () {
        const hidden = moreEl.style.display === 'none';
        moreEl.style.display = hidden ? 'block' : 'none';
        more.textContent = hidden ? 'Show Less' : 'Read More';
      };
    }

    if (btnRow.children.length) content.appendChild(btnRow);
    if (moreEl) content.appendChild(moreEl);

    slide.appendChild(content);
    slidesEl.appendChild(slide);
    slides.push(slide);

    // Thumbnail is a real <button> -- focusable, Enter/Space activatable,
    // and named for screen readers.
    const thumb = document.createElement('button');
    thumb.type = 'button';
    thumb.className = 'cert-thumb';
    if (item.image) {
      const timg = document.createElement('img');
      timg.src = item.image;
      timg.alt = '';
      timg.onerror = function () { console.error('Failed to load thumbnail:', item.image); };
      thumb.appendChild(timg);
    } else {
      // Imageless card (e.g. a work role) -- show an initials tile, not a broken img.
      thumb.classList.add('cert-thumb-text');
      thumb.textContent = item.title.replace(/[^A-Za-z0-9 ]/g, ' ')
        .split(/\s+/).filter(Boolean).slice(0, 3).map(function (w) { return w[0]; }).join('').toUpperCase();
    }
    thumb.setAttribute('aria-label', 'Show slide ' + (i + 1) + ': ' + item.title);
    thumb.onclick = function () { show(i); };
    thumbsEl.appendChild(thumb);
  });

  function show(n) {
    if (!slides.length) return;
    index = (n + slides.length) % slides.length;
    slides.forEach(function (s, i) {
      const on = i === index;
      s.style.display = on ? 'block' : 'none';
      s.setAttribute('aria-hidden', on ? 'false' : 'true');
    });
    Array.prototype.forEach.call(thumbsEl.querySelectorAll('.cert-thumb'), function (t, i) {
      const on = i === index;
      t.classList.toggle('current-cert-thumb', on);
      if (on) t.setAttribute('aria-current', 'true'); else t.removeAttribute('aria-current');
    });
    if (currentEl) currentEl.innerText = index + 1;
    if (totalEl) totalEl.innerText = slides.length;
    if (statusEl) {
      const t = data[index] && data[index].title ? ': ' + data[index].title : '';
      statusEl.textContent = 'Slide ' + (index + 1) + ' of ' + slides.length + t;
    }
  }

  const prev = document.getElementById(ids + 'Prev');
  const next = document.getElementById(ids + 'Next');
  if (prev) { prev.type = 'button'; prev.setAttribute('aria-label', 'Previous slide'); prev.onclick = function () { show(index - 1); }; }
  if (next) { next.type = 'button'; next.setAttribute('aria-label', 'Next slide'); next.onclick = function () { show(index + 1); }; }

  show(0);
  return { show: show };
}

// =========================================================================
// PROJECTS DATA -- one array per data-driven capability tab. Item shape:
//   { title, image, url | (siteUrl & githubUrl),
//     articleUrl?, articleLabel?,
//     stack?, shows?, description?, readMore?, isBertelsmann? }
// `stack` (tech) and `shows` (what it demonstrates / the role) render as a
// small scannable block on each slide -- the line a recruiter reads.
// =========================================================================

// --- Security -----------------------------------------------------------
const securityData = [
  {
    title: "Deliberate Cybersecurity",
    image: "./images/currentsites/deliberatecybersecurity.jpg",
    url: "https://deliberatecybersecurity.com",
    shows: "Turning security practice into plain-language guidance people actually follow.",
    description: "The editorial companion to DMSecurityX -- free, plain-language security writing."
  },
  {
    title: "DMSecurityX",
    image: "./images/currentsites/dmsecurityx-1.jpg",
    url: "https://dmsecurityx.com",
    shows: "Taking a security-guidance product from architecture through content and SEO, and keeping it running.",
    description: "A security-guidance product for small businesses and creators: no jargon, actionable steps."
  },
  {
    title: "Bertelsmann Technology Scholarship - Enterprise Security Nanodegree",
    image: "specialization/images/Bertelsmann_nanodegree_enterprisesecurity.jpg",
    stack: "Azure (Sentinel, Entra, Intune, Defender for Endpoint) · ELK · SIEM/SOAR · EDR/IDS",
    shows: "Working hands-on across Zero Trust architecture, DMZ/VPN network defense, defense-in-depth, and the NIST 800-61r2 / TIC 3.0 frameworks.",
    description: "An enterprise security nanodegree taken for the hands-on cloud-security labs: threat assessment, security architecture, and incident response across an Azure + ELK environment.",
    readMore: "Technologies Used: Microsoft Azure services (Virtual Networks, Entra, Sentinel, Intune, Defender for Endpoint), ELK Stack (Elasticsearch, Logstash, Kibana, Filebeat), SIEM/SOAR platforms, EDR/IDS technologies. Key Features: Network defenses with DMZs and VPNs, Zero Trust security architecture, defense-in-depth strategies, compliance alignment with NIST 800-61r2 and TIC 3.0. Learning Outcomes: Enterprise security frameworks, threat assessment methodologies, cloud security implementation, risk management practices.",
    isBertelsmann: true
  },
  {
    title: "Student Information Systems Analyst - CSUMB",
    image: "./images/currentsites/sis-analyst-csumb.jpg",
    stack: "IAM / RBAC · access governance · least privilege · user lifecycle · dev/prod change control · FERPA",
    shows: "Access-governance work on a system of record: role-based access control design, user provisioning and deprovisioning, access-certification audits, row-level security over student PII, and controlled dev-to-production release of security config.",
    description: "Staff analyst role at California State University, Monterey Bay -- owning identity and access management for the PeopleSoft ERP that holds every student's records.",
    readMore: "Identity & Access Management (IAM) and Role-Based Access Control (RBAC): mapped business roles to permission sets on the principle of least privilege, and ran the full user lifecycle -- provisioning, changes, and deprovisioning. Access governance & compliance: prepared the system for audits with access-certification matrix reports against FERPA and institutional policy. Data privacy: implemented row-level security so managers saw only their own records, protecting student PII. Change control: promoted security configuration from development to production through a controlled release process. Support: Tier-3 escalation point for complex access and permission anomalies, resolved from root cause."
  },
  {
    title: "Raspberry Pi / Kali Linux Pentest Lab",
    image: "images/personal/raspberrypi.png",
    stack: "Raspberry Pi 3 Model B · Kali Linux · headless SSH · GPIO I/O",
    shows: "Running a self-hosted, low-power penetration-testing lab -- headless Kali over SSH, always on hand, plus hardware I/O experiments.",
    description: "A pocket-sized full computer that runs off a phone charger: Kali's pentest toolset kept close, and a sandbox for physical-computing projects."
  }
];

// --- Product & Full-Stack ----------------------------------------------
const productData = [
  {
    title: "Deliberately Deliberate",
    image: "./images/currentsites/deliberatelydeliberate.jpg",
    url: "https://deliberatelydeliberate.com",
    stack: "Hand-coded static site, migrating to WordPress + Elementor Pro",
    shows: "Running a multi-product ecosystem end to end: concept, front and back end, security architecture, SEO, and content.",
    description: "The umbrella for a connected set of products and writing built on one idea: choose on purpose."
  },
  {
    title: "Digitally (MyDigitally)",
    image: "./images/currentsites/mydigitally_1.jpg",
    url: "https://mydigitally.app",
    articleUrl: "https://nostradmsx.com/the-encrypted-credential-vault-zero-knowledge-security-at-mydigitally-app/",
    stack: "Next.js 14 (App Router, RSC) · React 18 · TypeScript · Supabase (Postgres, Auth, Storage, RLS) · Vercel",
    shows: "Building a full-stack app with row-level security, proof-of-ownership verification, and estate-planning exports -- solo.",
    description: "A vault to document, protect, and sell your digital assets."
  },
  {
    title: "Circal (TryCircal)",
    image: "./images/currentsites/trycircal_calendar.jpg",
    url: "https://trycircal.app",
    articleUrl: "https://nostradmsx.com/name-change-from-mycalendone-to-circal/",
    stack: "Next.js 15 (App Router) · NextAuth v5 · Prisma · Supabase (Postgres) · Tailwind · Vercel",
    shows: "Turning sleep, meal, and body-clock signals into a daily focus prediction.",
    description: "An energy-aware calendar that color-codes your day by predicted focus. Blueprints, Calendar, Insights, and Settings views."
  },
  {
    title: "Deliberate Digital Legacy",
    image: "./images/currentsites/deliberate-digital-legacy.jpg",
    url: "https://deliberate-digital-legacy.com",
    stack: "Single hand-coded HTML file · CSS Grid · no JS, no build",
    shows: "Shipping a zero-dependency marketing site; companion app scoped (iOS port planned).",
    description: "Helping people secure and pass on their digital lives on purpose."
  },
  {
    title: "Deliberate Learners - Tools",
    image: "./images/currentsites/deliberatelearners-tools.jpg",
    url: "https://deliberatelearners.com/tools",
    stack: "Vanilla JS · Web APIs, no framework",
    shows: "Enforcing a learning rule in the browser -- Watch and Recall makes you produce for as long as you consumed.",
    description: "The tools layer of Deliberate Learners."
  },
  {
    title: "Rhythm Brown Box",
    image: "./images/featured/drummachine.png",
    siteUrl: "./portfolioentries/personal/rhythmbrownbox/index.html",
    githubUrl: "https://github.com/roylouisgarcia/rhythmbrownbox",
    stack: "ES modules · Vite · Vitest · Web Audio API · Web Worker · zero runtime deps",
    shows: "Rebuilding a project from an audit -- BDD/TDD, CI, keyboard + screen-reader access, dependency hygiene, single-file build.",
    description: "A browser drum machine shown across three versions -- a deliberate engineering-rigor sample."
  }
];

// --- Personal --------------------------------------------------------
const personalData = [
  {
    title: "NostradmsX",
    image: "./images/currentsites/nostradmsx.jpg?v=2",
    url: "https://nostradmsx.com",
    stack: "WordPress (self-hosted) · Yoast SEO",
    shows: "Writing up the reasoning and trade-offs behind every product on this page.",
    description: "My personal blog: half build log, half field notes."
  },
  {
    title: "Deliberate Learners",
    image: "./images/currentsites/deliberatelearners.jpg",
    url: "https://deliberatelearners.com",
    stack: "Vanilla JS · Web APIs, no framework",
    shows: "Turning a personal learning method into a product built around a real feedback loop.",
    description: "Built on the idea that consuming isn't learning until you produce against it -- and its first tool, Watch and Recall."
  },
  {
    title: "Video Pitch Adjuster GUI",
    image: "images/currentsites/video-pitch-shifter.png",
    githubUrl: "https://github.com/roylouisgarcia/videopitchshifter",
    articleUrl: "https://nostradmsx.com/a-singers-dilemma-solved-by-nostradmsx-video-pitch-shifter/",
    stack: "Python · Tkinter · FFMPEG · subprocess",
    shows: "Wrapping a media pipeline -- extract, pitch-shift, remux -- in a desktop GUI.",
    description: "A GUI that uses FFMPEG to shift the pitch of a video's audio."
  },
  {
    title: "Flames Calculator - Input",
    image: "./images/featured/flames.png",
    url: "https://github.com/roylouisgarcia/flames",
    stack: "HTML · CSS · JS (ported across several languages)",
    shows: "Coding the same one-page game several ways to compare the languages.",
    description: "A FLAMES relationship-name game -- the input screen."
  },
  {
    title: "Flames Calculator - Results",
    image: "./images/featured/flames2.png",
    url: "https://github.com/roylouisgarcia/flames",
    stack: "HTML · CSS · JS",
    shows: "Building the results screen of the same exercise.",
    description: "FLAMES -- the results screen."
  }
];

// ids -> data array, for ensureSlideshow(). `const` globals aren't window
// properties, so PROJECT_TABS can't look them up by name; this map does.
const PROJECT_DATA = {
  security: securityData,
  product: productData,
  personal: personalData,
};

$(document).ready(function(){

    // Set default state - all project tabs hidden
    hideAllProjectTabs();
    // Defer the initial tab render a tick. This ready() callback runs
    // synchronously during parse (script at end of <body>); the deferred
    // render's .show(...complete) callback builds a slideshow that reads a
    // data array (securityData etc.) declared lower in this file. One tick
    // lets the whole file finish so those forward references resolve.
    setTimeout(function () {
      var t = projectTabForHash(window.location.hash);
      showProjectTab(t || DEFAULT_PROJECT_TAB);
    }, 0);

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
      } else if (hash === '#projects' || projectTabForHash(hash)) {
        // Hide specialization section and its jumbotron when navigating to projects
        $('#specialization').hide('fast');
        $('.jumbotron-before-specialization').hide('fast');
        showProjectTab(projectTabForHash(hash) || DEFAULT_PROJECT_TAB);
        hash = '#projects';  // scroll target + address bar stay generic
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
    
  // Bind the five capability folder-tabs (config: PROJECT_TABS, top of file).
  PROJECT_TABS.forEach(function (t) {
    $('#' + t.tab).on('click', function () { showProjectTab(t.tab); });
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
        hideAllProjectTabs();
        PROJECT_TABS.forEach(function (t) { $('#' + t.tab).addClass('btnNonActive'); });
        hideLyricsProjects();
        hideSpecializationSection();
    }

    function hideSpecializationSection(){
        $("#specialization").hide("fast", function(){});
        $(".jumbotron-before-specialization").hide("fast", function(){});
    }

     // Kept as a thin wrapper -- other code (and the Academic school sub-tabs)
     // still call showAcademicTab().
     function showAcademicTab(){ showProjectTab('link2Academic'); }



// MOOC / Specialization slideshow functionality
// (moocSlideIndex/moocSlides declared at the top of the file)

const moocData = [
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
// Ordered security-first, then full-stack, then supporting skills -- matches
// the way Projects is now organized. Terms are kept literal so an ATS or a
// recruiter scanning for "IAM", "RBAC", "Next.js", etc. finds them verbatim.
const skillsData = [
    {
        title: "Security & Identity / Access Management",
        icon: "🔒",
        skills: [
            "Identity & Access Management (IAM) and Role-Based Access Control (RBAC): mapping business roles to permission sets on the principle of least privilege",
            "User lifecycle management — provisioning, changes, and deprovisioning",
            "Access governance &amp; compliance: access-certification audits, matrix reporting, FERPA regulatory support",
            "Row-level security and PII protection on systems of record",
            "Application security: OWASP Top 10, authentication and session security, dependency hygiene",
            "Defense-in-depth and Zero Trust architecture; DMZ / VPN network defense",
            "SIEM / SOAR with Azure Sentinel and the Elastic Stack (ELK); EDR / IDS",
            "Incident response aligned to NIST 800-61r2; penetration testing with Kali Linux"
        ]
    },
    {
        title: "Full-Stack Product Development",
        icon: "🚀",
        skills: [
            "Own the full product lifecycle: concept, front and back end, security architecture, SEO, and content — mostly solo",
            "Next.js (App Router, React Server Components, Server Actions), React, and TypeScript",
            "Supabase (Postgres, Auth, Storage, Row-Level Security), Prisma, NextAuth; deployed on Vercel",
            "Third-party integration: OAuth, Google Calendar API, REST",
            "Engineering rigor: BDD / TDD, CI, WCAG accessibility, zero-dependency builds",
            "Shipped and maintain a live product ecosystem — see the <a href='#product'>Product &amp; Full-Stack</a> and <a href='#security'>Security</a> tabs above (Digitally, Circal, DMSecurityX, and related tools)"
        ]
    },
    {
        title: "Cloud & Infrastructure",
        icon: "☁️",
        skills: [
            "Microsoft Azure: Entra ID, Intune, Defender for Endpoint, Sentinel, Virtual Networks",
            "Some AWS cloud services; Vercel for application hosting",
            "Linux and Windows Server administration; hardware installation, upgrades, and patching",
            "Account and access-control-list (ACL) management; security-policy implementation",
            "Change-management procedures that ease audit and compliance"
        ]
    },
    {
        title: "Web Development & SEO",
        icon: "🌐",
        skills: [
            "Static and dynamic web design and development",
            "Usability testing and accessibility standards (WCAG)",
            "Search engine optimization and web analytics",
            "Customization of open-source platforms: WordPress, Joomla, Drupal; cPanel, Shopify",
            "Social media for branding and marketing"
        ]
    },
    {
        title: "Programming",
        icon: "💻",
        skills: [
            "Procedural, object-oriented, modular, and functional programming",
            "Efficient, reusable code; time-saving tooling and IDE extensions",
            "Continuous adoption of newer language features and practices",
            "Across coursework and projects: JavaScript / TypeScript, Python, PHP, Java (Android), C++, Lua, Bash"
        ]
    },
    {
        title: "Data & Analytics",
        icon: "📊",
        skills: [
            "Exploring datasets to produce business intelligence for decisions",
            "Social media data mining to optimize site and channel strategy",
            "Sentiment analysis, data visualization, business metrics and insights"
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

    // Accessibility: name the region and add a polite status line.
    const skillsRegion = slidesContainer.closest('.skills-slideshow-container');
    if (skillsRegion) {
        skillsRegion.setAttribute('role', 'group');
        skillsRegion.setAttribute('aria-roledescription', 'carousel');
        skillsRegion.setAttribute('aria-label', 'Skills');
        if (!document.getElementById('skillsStatus')) {
            const st = document.createElement('div');
            st.id = 'skillsStatus';
            st.className = 'sr-only';
            st.setAttribute('aria-live', 'polite');
            skillsRegion.appendChild(st);
        }
    }

    skillsData.forEach((skill, index) => {
        // Create slide div
        const slideDiv = document.createElement('div');
        slideDiv.classList.add('skills-slides');
        slideDiv.style.display = 'none'; // Explicitly hide all slides initially
        slideDiv.setAttribute('role', 'group');
        slideDiv.setAttribute('aria-roledescription', 'slide');
        slideDiv.setAttribute('aria-label', (index + 1) + ' of ' + skillsData.length + ': ' + skill.title);

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

        // Create thumbnail -- a real <button> so it takes keyboard focus and
        // activates with Enter/Space. No title attribute: the label is already
        // visible text below, and a redundant title is what triggers the
        // native tooltip that can get stuck open after a tap.
        const thumb = document.createElement('button');
        thumb.type = 'button';
        thumb.classList.add('skills-thumb');
        thumb.setAttribute('aria-label', 'Show ' + skill.title + ' skills');

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
        const on = i === skillsCurrentSlideIndex;
        slide.style.display = on ? 'flex' : 'none';
        slide.setAttribute('aria-hidden', on ? 'false' : 'true');
    });

    // Update thumbnail highlighting
    const thumbnails = document.querySelectorAll('.skills-thumb');
    console.log('Found', thumbnails.length, 'Skills thumbnails');

    thumbnails.forEach((thumb, i) => {
        const on = i === skillsCurrentSlideIndex;
        thumb.classList.toggle('skills-current-thumb', on);
        if (on) thumb.setAttribute('aria-current', 'true'); else thumb.removeAttribute('aria-current');
    });

    const skillsStatus = document.getElementById('skillsStatus');
    if (skillsStatus && skillsData[skillsCurrentSlideIndex]) {
        skillsStatus.textContent = 'Slide ' + (skillsCurrentSlideIndex + 1) + ' of ' +
            skillsSlides.length + ': ' + skillsData[skillsCurrentSlideIndex].title;
    }

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
// Inbound deep links: #security #product #academic #personal. The rest of the
// site only acts on the URL hash when a nav-bar link is clicked; this handles
// it on load / hashchange too -- open the matching Projects tab and scroll the
// section into view. Runs last so it wins over the first ready()'s deferred
// default-tab render.
$(document).ready(function () {
    function goToProjectTab(tabId) {
        var section = document.getElementById('projects');
        if (!section || !document.getElementById(tabId)) return;
        $('#specialization, .jumbotron-before-specialization').hide();
        showProjectTab(tabId);
        $('html, body').animate({ scrollTop: $(section).offset().top - 60 }, 700);
    }
    function checkHash() {
        var tabId = projectTabForHash(window.location.hash);
        if (tabId) goToProjectTab(tabId);
    }
    setTimeout(checkHash, 0);
    $(window).on('hashchange', checkHash);
});
