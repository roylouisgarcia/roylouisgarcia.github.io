let currentSlideIndex = 0;
let slides = [];

// Image filenames array - moved outside for global access
const imageFilenames = [
    "specialization/images/ibm_specialization_ibmcybersecurityanalyst.jpg",
    "specialization/images/ibm_specialization_securityanalystfundamentals.jpg",
    "specialization/images/ibm_specialization_devopsandsoftwareengineering.jpg",
    "specialization/images/ibm_specialization_devopscloudandagilefoundations.jpg",
    "specialization/images/ibm_specialization_ibmdatawarehouseengineer.jpg",
    "specialization/images/imperialcollegelondon_specialization_mathematicsformachinelearning.jpg",
    "specialization/images/infosec_specialization_advpythonscripting4cybersecurity.jpg",
    "specialization/images/deeplearningai_specialization_nlp.jpg",
    "specialization/images/stanfordonline_specialization_machinelearning.jpg",
    "specialization/images/dukeuniversity_specialization_pythonbashandsql4dataengineering.jpg",
    "specialization/images/johnhopkinsuniversity_specialization_datascience.jpg",
    "specialization/images/learnlinuxadministration.png",
    "specialization/images/learnlinuxin5days.png",
    "specialization/images/linuxintherealworld.png",
    "specialization/images/Bertelsmann_nanodegree_enterprisesecurity.jpg",
    "specialization/images/google_nanodegree_androidbasics.jpg",
    "specialization/images/udacity_nanodegree_intro2cybersecurity.jpg"
];

// Certificate verification URLs - add the actual URLs for each certificate
const verificationUrls = {
    "specialization/images/ibm_specialization_ibmcybersecurityanalyst.jpg": "https://coursera.org/verify/specialization/TCBK8AVMN5BQ",
    "specialization/images/ibm_specialization_securityanalystfundamentals.jpg": "https://coursera.org/verify/specialization/4MFFATRXDHAB",
    "specialization/images/ibm_specialization_devopsandsoftwareengineering.jpg": "https://coursera.org/verify/specialization/WLTQLH326CS4",
    "specialization/images/ibm_specialization_devopscloudandagilefoundations.jpg": "https://coursera.org/verify/specialization/BDN6GQW9C2E2",
    "specialization/images/ibm_specialization_ibmdatawarehouseengineer.jpg": "https://coursera.org/verify/specialization/YD2GVW2SPMMM",
    "specialization/images/imperialcollegelondon_specialization_mathematicsformachinelearning.jpg": "https://coursera.org/verify/specialization/M2M2BFJGYGBY",
    "specialization/images/infosec_specialization_advpythonscripting4cybersecurity.jpg": "https://coursera.org/verify/specialization/3HSMQ7UJC34N",
    "specialization/images/deeplearningai_specialization_nlp.jpg": "https://coursera.org/verify/specialization/YLMRHXVTLD99",
    "specialization/images/stanfordonline_specialization_machinelearning.jpg": "https://coursera.org/verify/specialization/SBTRWCR5DS8W",
    "specialization/images/dukeuniversity_specialization_pythonbashandsql4dataengineering.jpg": "https://coursera.org/verify/specialization/5WTD6LEKYDVA",
    "specialization/images/johnhopkinsuniversity_specialization_datascience.jpg": "https://coursera.org/verify/specialization/LKJX5VJVGZ9V",
    "specialization/images/learnlinuxadministration.png": "https://courses.linuxtrainingacademy.com/courses/",
    "specialization/images/learnlinuxin5days.png": "https://courses.linuxtrainingacademy.com/courses/",
    "specialization/images/linuxintherealworld.png": "https://courses.linuxtrainingacademy.com/courses/",
    "specialization/images/Bertelsmann_nanodegree_enterprisesecurity.jpg": "https://www.udacity.com/certificate/e/62640e82-dc54-11ee-9eea-67f288b7f50b",
    "specialization/images/google_nanodegree_androidbasics.jpg": "https://www.udacity.com/certificate/e/22856ce2-4732-11e8-9f3e-bffc91fad5a2",
    "specialization/images/udacity_nanodegree_intro2cybersecurity.jpg": "https://www.udacity.com/certificate/e/2ae2c3b8-c38c-11ed-9ad5-9773f6e4bbe3"
};

// Function to open verification URL
function openVerificationUrl(filename) {
    const url = verificationUrls[filename];
    if (url) {
        window.open(url, '_blank');
    } else {
        console.log('No verification URL found for:', filename);
    }
}

// Load images dynamically based on filenames
function loadSlides() {
    const slidesContainer = document.getElementById('slidesContainer');
    const thumbnailContainer = document.getElementById('thumbnailContainer');
    
    if (!slidesContainer || !thumbnailContainer) {
        console.error('Slideshow containers not found');
        return;
    }

    console.log('Loading slides:', imageFilenames.length, 'images');

    imageFilenames.forEach((filename, index) => {
        const slideDiv = document.createElement('div');
        slideDiv.classList.add('slides');

        const img = document.createElement('img');
        img.src = filename;
        img.style.cursor = 'pointer';
        img.title = 'Click to verify certificate';
        img.onerror = function() {
            console.error('Failed to load image:', filename);
        };
        img.onload = function() {
            console.log('Successfully loaded image:', filename);
        };
        img.onclick = () => openVerificationUrl(filename);
        slideDiv.appendChild(img);
        slidesContainer.appendChild(slideDiv);

        const thumb = document.createElement('img');
        thumb.src = filename;
        thumb.classList.add('thumb');
        thumb.style.cursor = 'pointer';
        thumb.title = 'Click to verify certificate or view slide';
        thumb.onerror = function() {
            console.error('Failed to load thumbnail:', filename);
        };
        thumb.onclick = (event) => {
            // Check if Ctrl/Cmd key is pressed for verification, otherwise show slide
            if (event.ctrlKey || event.metaKey) {
                openVerificationUrl(filename);
            } else {
                setCurrentSlide(index);
            }
        };
        thumbnailContainer.appendChild(thumb);

        slides.push(slideDiv);
    });

    console.log('Loaded', slides.length, 'slides');
    updateSlideCounter();
}

function showSlide(index) {
    console.log('showSlide called with index:', index, 'slides.length:', slides.length);
    
    if (index >= slides.length) {
        currentSlideIndex = 0;
    } else if (index < 0) {
        currentSlideIndex = slides.length - 1;
    } else {
        currentSlideIndex = index;
    }

    console.log('Setting currentSlideIndex to:', currentSlideIndex);

    slides.forEach((slide, i) => {
        slide.style.display = i === currentSlideIndex ? 'block' : 'none';
    });
    
    // Update thumbnail highlighting
    const thumbnails = document.querySelectorAll('.thumb');
    console.log('Found', thumbnails.length, 'thumbnails');
    
    thumbnails.forEach((thumb, i) => {
        if (i === currentSlideIndex) {
            thumb.classList.add('current-thumb');
            // Check if this is a specialization certificate
            const filename = imageFilenames[i];
            if (filename.includes('specialization')) {
                thumb.classList.add('specialization');
            }
            console.log('Highlighting thumbnail', i);
        } else {
            thumb.classList.remove('current-thumb');
            thumb.classList.remove('specialization');
        }
    });
    
    // Center the current thumbnail
    centerCurrentThumbnail();
    
    updateSlideCounter();
}

function centerCurrentThumbnail() {
    const thumbnailContainer = document.getElementById('thumbnailContainer');
    const thumbnails = document.querySelectorAll('.thumb');
    
    if (thumbnails.length > 0 && currentSlideIndex < thumbnails.length) {
        const currentThumbnail = thumbnails[currentSlideIndex];
        const containerWidth = thumbnailContainer.clientWidth;
        const thumbnailWidth = currentThumbnail.offsetWidth + 10; // Including margin
        
        let scrollPosition;
        
        // For thumbnails 1-4 (indices 0-3), use right justification to center them
        if (currentSlideIndex <= 3) {
            // Right justify: scroll to show thumbnails from the right side
            // This will center thumbnails 1-4 by showing them aligned to the right
            const totalThumbnailsWidth = thumbnails.length * thumbnailWidth;
            const rightJustifyPosition = totalThumbnailsWidth - containerWidth;
            
            // For the first few thumbnails, we want to show them centered
            // by positioning them so they appear in the center of the visible area
            const visibleThumbnailsCount = Math.floor(containerWidth / thumbnailWidth);
            const centerOffset = (visibleThumbnailsCount - 1) / 2;
            const targetPosition = currentSlideIndex - centerOffset;
            
            scrollPosition = Math.max(0, targetPosition * thumbnailWidth);
            
            // If we're near the beginning, ensure we don't scroll past the right edge
            scrollPosition = Math.min(scrollPosition, Math.max(0, totalThumbnailsWidth - containerWidth));
        } else {
            // For thumbnails 5+ (index 4+), use normal centering
            const thumbnailOffsetLeft = currentThumbnail.offsetLeft;
            scrollPosition = thumbnailOffsetLeft - (containerWidth / 2) + (thumbnailWidth / 2);
        }
        
        console.log('Centering thumbnail', currentSlideIndex + 1, 'with scroll position:', scrollPosition);
        
        // Smooth scroll to the calculated position
        thumbnailContainer.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
    }
}

function nextSlide() {
    showSlide(currentSlideIndex + 1);
}

function prevSlide() {
    showSlide(currentSlideIndex - 1);
}

function setCurrentSlide(index) {
    showSlide(index);
}

function updateSlideCounter() {
    document.getElementById('currentSlide').innerText = currentSlideIndex + 1;
    document.getElementById('totalSlides').innerText = slides.length.toString();
}

document.getElementById('nextBtn').onclick = nextSlide;
document.getElementById('prevBtn').onclick = prevSlide;

// Initialize the slideshow immediately and also on window load
function initializeSlideshow() {
    loadSlides();
    showSlide(currentSlideIndex);
}

// Use multiple initialization methods to ensure it works
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSlideshow);
} else {
    // DOM is already ready
    initializeSlideshow();
}

// Also keep the window.onload as backup
window.addEventListener('load', function() {
    // Only initialize if slides haven't been loaded yet
    if (slides.length === 0) {
        initializeSlideshow();
    }
});
