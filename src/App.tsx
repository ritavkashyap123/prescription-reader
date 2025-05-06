import Header from './components/Header';
import MainCard from './components/MainCard';
import Footer from './components/Footer';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 flex flex-col">
        <Header />
        
        <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
          <section className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-3">
              Extract Text from Prescriptions
            </h1>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Our AI-powered OCR tool helps pharmacists digitize prescriptions quickly and accurately.
              Upload an image, and we'll convert it to editable text.
            </p>
          </section>
          
          <MainCard />
        </main>
        
        <Footer />
      </div>
    </CartProvider>
  );
}

export default App;