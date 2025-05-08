import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Sparkles, Users, Pill, Zap, Heart, Star } from 'lucide-react';

const Hero = () => (
  <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-primary-100 to-purple-50 py-20">
    {/* Animated background elements */}
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -top-24 -right-24 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div
        className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [90, 0, 90],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full mb-6 shadow-sm"
          >
            <span className="text-primary-600 font-medium">✨ Your Health, Simplified</span>
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6 leading-tight">
            Your Digital <span className="text-primary-600 relative">
              Prescription
              <motion.div
                className="absolute -bottom-2 left-0 w-full h-2 bg-primary-200 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              />
            </span> Assistant
          </h1>
          <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
            Transform your prescription management with AI-powered scanning, 
            instant medicine search, and seamless ordering. No more paper hassles! 🚀
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/scanner"
              className="group inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-primary-600 hover:bg-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Scan Prescription
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/medicines"
              className="group inline-flex items-center justify-center px-6 py-3 border border-neutral-300 text-base font-medium rounded-xl text-neutral-700 bg-white hover:bg-neutral-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Browse Medicines
              <Pill className="ml-2 h-5 w-5 text-primary-600" />
            </Link>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative"
        >
          <div className="relative aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Digital prescription"
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
          {/* Floating stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="absolute -bottom-6 -right-6 bg-white rounded-xl p-4 shadow-xl"
          >
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Users className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-600">Active Users</p>
                <p className="text-lg font-bold text-neutral-900">10K+</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  </section>
);

const About = () => (
  <section className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">
            Why Choose <span className="text-primary-600">Prescriptioner</span>?
          </h2>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
            We're revolutionizing the way you manage prescriptions with cutting-edge technology
            and a user-friendly approach. No more paper chaos! 📱✨
          </p>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            icon: <Sparkles className="h-8 w-8 text-primary-600" />,
            title: "AI-Powered Scanning",
            description: "Our advanced OCR technology accurately reads and digitizes your prescriptions in seconds. Magic! ✨"
          },
          {
            icon: <Shield className="h-8 w-8 text-primary-600" />,
            title: "Secure & Private",
            description: "Your medical information is encrypted and protected with enterprise-grade security. Your secrets are safe with us! 🔒"
          },
          {
            icon: <Users className="h-8 w-8 text-primary-600" />,
            title: "Pharmacy Network",
            description: "Access a vast network of trusted pharmacies and get your medicines delivered. Easy peasy! 🏪"
          }
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group p-6 rounded-2xl bg-neutral-50 hover:bg-neutral-100 transition-all duration-300 hover:shadow-lg"
          >
            <div className="mb-4 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">{feature.title}</h3>
            <p className="text-neutral-600">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const Services = () => (
  <section className="py-20 bg-gradient-to-br from-neutral-50 to-primary-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">
            Our <span className="text-primary-600">Services</span>
          </h2>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
            Everything you need for hassle-free prescription management and medicine ordering.
            We've got your back! 💪
          </p>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          {
            icon: <Zap className="h-6 w-6 text-primary-600" />,
            title: "Prescription Scanning",
            description: "Upload and digitize your prescriptions instantly"
          },
          {
            icon: <Pill className="h-6 w-6 text-primary-600" />,
            title: "Medicine Search",
            description: "Find medicines from our extensive database"
          },
          {
            icon: <Star className="h-6 w-6 text-primary-600" />,
            title: "Price Comparison",
            description: "Compare prices across different pharmacies"
          },
          {
            icon: <Heart className="h-6 w-6 text-primary-600" />,
            title: "Home Delivery",
            description: "Get your medicines delivered to your doorstep"
          }
        ].map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group p-6 rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="mb-4 p-3 bg-primary-50 rounded-xl inline-block group-hover:scale-110 transition-transform duration-300">
              {service.icon}
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">{service.title}</h3>
            <p className="text-neutral-600">{service.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const MedicineCompanies = () => (
  <section className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">
            Trusted <span className="text-primary-600">Medicine Companies</span>
          </h2>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
            We partner with leading pharmaceutical companies to ensure you get the best quality medicines.
            Quality is our priority! 🏆
          </p>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          'Sun Pharma', 'Cipla', 'Dr. Reddy\'s', 'Lupin',
          'Zydus', 'Intas', 'Mankind', 'Alkem', 'Torrent',
          'GlaxoSmithKline', 'Pfizer', 'Novartis'
        ].map((company, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group p-6 rounded-2xl bg-neutral-50 flex items-center justify-center hover:bg-neutral-100 transition-all duration-300 hover:shadow-lg"
          >
            <span className="text-lg font-medium text-neutral-700 group-hover:text-primary-600 transition-colors">
              {company}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const LandingPage = () => {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <MedicineCompanies />
    </>
  );
};

export default LandingPage; 