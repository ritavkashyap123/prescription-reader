# Prescriptioner

A modern web application that helps users manage prescriptions, search for medicines, and order them online.

![Prescriptioner](https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80)

## 🚀 Features

### 🔍 Prescription Scanner
- **AI-Powered OCR Technology**: Quickly digitize paper prescriptions
- **Dual Processing System**:
  - **Online Mode**: Uses Google's Gemini AI for high-quality text extraction
  - **Offline Mode**: Falls back to local processing using Tesseract.js when offline
- **Advanced Image Processing**:
  - Image preprocessing for improved text recognition
  - Medical terminology recognition and enhancement
  - Support for multiple languages
- **Batch Processing**: Upload and process multiple prescriptions at once

### 💊 Medicine Catalog
- **Extensive Database**: Browse through hundreds of medicines from various brands
- **Advanced Filtering**:
  - Search by name or brand
  - Filter by dosage form (tablets, syrups, etc.)
  - Filter by price range
  - Filter by brand
- **Detailed Information**:
  - Medicine descriptions
  - Dosage instructions
  - Pricing information
  - Brand details

### 🛒 Shopping Experience
- **Cart Functionality**: Add medicines to cart with just one click
- **Visual Feedback**: Clear indicators for items in cart
- **Responsive Design**: Optimal shopping experience on all devices
- **Animated Interface**: Modern, interactive UI with smooth transitions

### 💫 Modern UI/UX
- **GenZ-Friendly Design**: Contemporary aesthetics with vibrant interactions
- **Micro-Animations**: Engaging motion design throughout the application
- **Responsive Layout**: Seamless experience across all device sizes
- **Accessibility**: Designed with accessibility best practices in mind

## 🛠️ Technologies Used

- **Frontend**:
  - React with TypeScript
  - Tailwind CSS for styling
  - Framer Motion for animations
  - Lucide React for icons
  - React Router for navigation
  
- **OCR Processing**:
  - Google Gemini API for AI-powered OCR
  - Tesseract.js for offline processing
  
- **State Management**:
  - Context API for cart management
  - React hooks for component state

## 🏗️ Project Structure

- **Pages**:
  - Landing Page: Introduction to the application
  - Medicine Listing: Browse and filter medicines
  - Prescription Scanner: Upload and process prescriptions
  
- **Components**:
  - Header: Navigation and cart access
  - Footer: Site information and links
  - Medicine Cards: Display medicine information
  - Cart: Manage selected medicines
  - Image Uploader: Handle prescription image uploads
  - Text Display: Show extracted prescription text

## 📋 Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/prescriptioner.git
   cd prescriptioner
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Add your Gemini API key if using AI-powered OCR

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## 📱 Usage

- **Finding Medicines**: Use the search bar and filters on the Medicine Listing page
- **Scanning Prescriptions**: Visit the Prescription Scanner page and upload an image
- **Adding to Cart**: Click "Add to Cart" on any medicine card
- **Viewing Cart**: Click the cart icon in the header

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
