import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import LandingPage from './pages/LandingPage';
import MedicineListing from './pages/MedicineListing';
import PrescriptionScanner from './pages/PrescriptionScanner';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <CartProvider>
        <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 flex flex-col">
          <Header />
          
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/medicines" element={<MedicineListing />} />
              <Route path="/scanner" element={<PrescriptionScanner />} />
            </Routes>
          </main>
          
          <Footer />
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;