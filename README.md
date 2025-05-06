# Prescription OCR Reader

A modern web application that extracts text from prescription images using advanced OCR technology.

## Features

- **Dual OCR Processing System**:
  - **Online Mode**: Uses Google's Gemini AI for high-quality text extraction
    - Supports both Gemini Pro Vision and Gemini 2.0 Flash models
    - Flash model provides faster processing with optimized performance
  - **Offline Mode**: Falls back to local processing using Tesseract.js when offline
  - Automatic fallback with clear warning indicators

- **Advanced Image Processing**:
  - Image preprocessing for improved text recognition
  - Support for multiple languages
  - Medical terminology recognition and enhancement

- **Batch Processing**:
  - Upload and process multiple images at once
  - Navigate through batch results easily
  - Visual indicators for AI vs. local processing

- **Rich Text Output**:
  - Detailed confidence scores
  - Medical term highlighting
  - Word-by-word recognition details
  - Export to PDF functionality

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up your Gemini API key:
   - Sign up for a Gemini API key at https://makersuite.google.com/app/apikey
   - Copy `.env.example` to `.env`
   - Add your API key to the `.env` file
   
4. Start the development server:
   ```
   npm run dev
   ```

## Configuration

The application offers several configuration options:

- **Language Selection**: Process text in multiple languages (English, Spanish, French, German)
- **Image Preprocessing**: Enable/disable automatic image enhancement
- **Medical Terms**: Enable/disable medical terminology recognition
- **OCR Source**: Choose between AI-powered OCR (online) or local processing
- **Gemini Model**: Select between Gemini Pro Vision (high accuracy) or Gemini 2.0 Flash (faster processing)

## Network Awareness

The application automatically detects your network status and adapts accordingly:

- When online, it prioritizes the Gemini AI for high-quality OCR
- When offline, it seamlessly falls back to local processing
- Clear visual indicators show which processing method is being used

## Technologies Used

- React with TypeScript
- Tesseract.js for local OCR processing
- Google Gemini API for AI-powered OCR
- Tailwind CSS for styling
- Framer Motion for animations 