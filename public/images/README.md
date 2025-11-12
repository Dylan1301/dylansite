# Globe Fallback Image

## Required File

**globe_fallback.jpg** (1920x1080 or larger)
- Static image of Earth globe focused on Australia
- Used as mobile fallback (no 3D rendering on mobile)

## Quick Options

### Option 1: Use a stock photo
1. Search Unsplash for "earth globe australia"
   - https://unsplash.com/s/photos/earth-globe
2. Download a high-quality image showing Australia
3. Rename to `globe_fallback.jpg`
4. Place in this directory

### Option 2: Screenshot from Google Earth
1. Open Google Earth Web
2. Rotate to show Australia/Melbourne
3. Take a screenshot
4. Crop to 1920x1080
5. Save as `globe_fallback.jpg`

### Option 3: NASA Image
1. Visit https://epic.gsfc.nasa.gov/
2. Download a DSCOVR EPIC image showing Australia
3. Resize and save as `globe_fallback.jpg`

## Temporary Placeholder

For development, any image will work. You can use:
- A solid color gradient (blue to black)
- Any space/Earth image
- The default Next.js placeholder

The image should be:
- At least 1920x1080px
- JPG format (for smaller file size)
- Optimized for web (< 500KB)

