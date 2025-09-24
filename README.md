# Prajapati Avasaan Nondh Generator

A web application for generating memorial/obituary notices in Gujarati language, similar to traditional Prajapati community memorial notices.

## Features

- **User-friendly form** for entering memorial details
- **Portrait upload** with automatic circular cropping
- **Gujarati text rendering** with proper fonts
- **Watermark pattern** overlay matching traditional design
- **High-quality image generation** using HTML5 Canvas
- **One-click download** of generated memorial notice
- **Responsive design** that works on desktop and mobile

## How to Use

1. **Open the application** by opening `index.html` in your web browser
2. **Fill out the form** with the following details:
   - Deceased person's name
   - Age at time of passing
   - Current address
   - Date of demise
   - Funeral date and time
   - Funeral location
   - Contact person details (up to 2 contacts)
   - Upload a portrait photo
3. **Click "Generate Memorial Notice"** to create the image
4. **Download the image** using the download button

## Form Fields

- **Deceased Name (અવસાન થયેલનું નામ)**: Full name of the deceased
- **Age (વય)**: Age at time of passing
- **Current Address (હાલનું સરનામું)**: Complete address
- **Date of Demise (અવસાનની તારીખ)**: Date when the person passed away
- **Funeral Date (સ્મશાનયાત્રાની તારીખ)**: Date of funeral ceremony
- **Funeral Time (સમય)**: Time of funeral ceremony
- **Funeral Location (સ્થળ)**: Location where funeral will take place
- **Contact Person 1 & 2**: Names and phone numbers for family contacts
- **Portrait**: Upload a clear photo of the deceased

## Technical Details

- Built with vanilla HTML, CSS, and JavaScript
- Uses HTML5 Canvas for image generation
- Incorporates Google Fonts (Noto Sans Gujarati) for proper Gujarati text rendering
- Generates high-resolution images (800x1000 pixels)
- Supports common image formats for portrait upload

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## File Structure

```
avsan-nondh/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## Usage Notes

- The application works entirely in the browser - no server required
- Generated images are saved as PNG files
- Portrait images are automatically cropped to circular format
- All text is rendered in Gujarati script with proper formatting
- The watermark pattern matches traditional Prajapati memorial notices

## Customization

The application can be easily customized by modifying:

- Colors and styling in `styles.css`
- Text formatting and layout in `script.js`
- Form fields in `index.html`

## License

This project is open source and available for community use.
