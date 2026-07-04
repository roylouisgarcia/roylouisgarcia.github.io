# Portfolio Performance Optimization Guide

## 1. VIDEO OPTIMIZATION (Priority 1 - 75MB+ reduction possible)

### Current Issues:
- pinkhearts.mp4: 54MB
- rgb.mp4: 20MB  
- ss.gif: 18MB
- sonydatatiles.mp4: 7MB
- linux.mp4: 5MB

### Solutions:

#### A. Compress Videos
```bash
# Use FFmpeg to compress videos (reduce by 80-90%)
ffmpeg -i pinkhearts.mp4 -vcodec libx264 -crf 28 -preset fast pinkhearts_optimized.mp4
ffmpeg -i rgb.mp4 -vcodec libx264 -crf 28 -preset fast rgb_optimized.mp4
```

#### B. Convert Large GIFs to Video
```bash
# Convert ss.gif (18MB) to MP4 (likely ~2MB)
ffmpeg -i ss.gif -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" ss.mp4
```

#### C. Implement Lazy Loading for Videos
```html
<!-- Add to HTML -->
<video controls preload="none" poster="video-thumbnail.jpg">
  <source src="optimized-video.mp4" type="video/mp4">
</video>
```

## 2. IMAGE OPTIMIZATION (Priority 2 - 15MB+ reduction)

### Large Images Found:
- Screenshot from 2017-03-28 05-40-40.png: 3.1MB
- paramethod.gif: 3MB
- kaliraspberrypi.jpg: 2.7MB
- kaliraspberrypicloseup.jpg: 2.7MB
- childhood.png: 1.6MB
- teenager.png: 1.3MB

### Solutions:

#### A. Compress Images
```bash
# For JPEG images (use 70-80% quality)
# For PNG images (use tools like TinyPNG)
```

#### B. Convert to WebP Format
```html
<picture>
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Description">
</picture>
```

#### C. Implement Responsive Images
```html
<img src="small.jpg" 
     srcset="small.jpg 480w, medium.jpg 768w, large.jpg 1200w"
     sizes="(max-width: 480px) 480px, (max-width: 768px) 768px, 1200px"
     alt="Description">
```

## 3. FONT OPTIMIZATION (Priority 3 - 500KB+ reduction)

### Current Font Files:
- letterpressed.ttf: 322KB
- jd.ttf: 134KB
- HomemadeApple.ttf: 108KB
- Plus 5 more fonts

### Solutions:

#### A. Use Google Fonts Instead
```html
<!-- Replace local fonts with optimized web fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
```

#### B. Font Display Optimization
```css
@font-face {
  font-family: 'CustomFont';
  src: url('font.woff2') format('woff2');
  font-display: swap; /* Prevents invisible text during font load */
}
```

## 4. CODE OPTIMIZATION (Priority 4 - 150KB reduction)

### Current Large Files:
- index.js: 73KB
- style.css: 73KB

### Solutions:

#### A. Minify JavaScript and CSS
```javascript
// Use tools like UglifyJS for JS and cssnano for CSS
// Can reduce file sizes by 30-50%
```

#### B. Remove Unused Code
- Remove unused CSS rules
- Remove unused JavaScript functions
- Remove unused font imports

#### C. Split Code
```html
<!-- Load critical CSS inline -->
<style>
  /* Critical above-the-fold CSS here */
</style>

<!-- Load rest of CSS asynchronously -->
<link rel="preload" href="style.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
```

## 5. LOADING STRATEGY IMPROVEMENTS

### A. Implement Lazy Loading
```javascript
// For images
document.addEventListener('DOMContentLoaded', function() {
  const images = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
});
```

### B. Preload Critical Resources
```html
<link rel="preload" href="critical.css" as="style">
<link rel="preload" href="hero-image.jpg" as="image">
```

### C. Defer Non-Critical JavaScript
```html
<script src="non-critical.js" defer></script>
```

## EXPECTED RESULTS

### Before Optimization:
- Total Size: ~95MB+
- Load Time: 10-30+ seconds on slow connections

### After Optimization:
- Total Size: ~15-20MB
- Load Time: 2-5 seconds on slow connections
- **80%+ reduction in file sizes**

## IMPLEMENTATION PRIORITY:

1. **Compress/optimize videos** (75MB → ~8MB) - 67MB saved
2. **Compress images** (15MB → ~3MB) - 12MB saved  
3. **Switch to web fonts** (500KB → ~50KB) - 450KB saved
4. **Minify code** (150KB → ~75KB) - 75KB saved
5. **Implement lazy loading** - Improves perceived performance

Total potential savings: **~80MB (85% reduction)**
