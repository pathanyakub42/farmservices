import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Tractor, Play } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Tractor as TractorType } from '../types';

export function Home() {
  const [allTractors] = useLocalStorage<TractorType[]>('tractors', []);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  
  // Get featured tractors (first 4 from available models)
  const featuredTractors = allTractors.slice(0, 4);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <motion.div 
          style={{ y }}
          className="absolute inset-0 bg-gradient-to-b from-red-600/20 to-orange-500/30"
        />
        <div 
          className="relative h-screen bg-cover bg-center bg-fixed" 
          style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('/images/hero.jpg')` }}
        >
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative z-10 flex flex-col h-full justify-center items-center text-center text-white px-4 max-w-4xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent drop-shadow-2xl"
            >
              Empower Your Farm
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-xl md:text-2xl mb-8 max-w-2xl opacity-90"
            >
              Premium Massey Ferguson & TAFE Tractors from Agristar Farm Services. 
              Superior power, reliability, and service in Tarapur, Anand.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                to="/tractors"
                className="group bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 flex items-center space-x-2"
              >
                <span>Explore Tractors</span>
                <Play className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/inquiry"
                className="border-2 border-white/50 hover:border-white text-white px-8 py-4 rounded-xl font-semibold text-lg backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
              >
                Get Quote
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Tractors */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent mb-6">
              Featured Tractors
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our premium Massey Ferguson models: 1035 Dost, 241 Sonaplus, 1035 Maha Shakti, 246 Dynatrack. Live stock updates available.
            </motion.p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredTractors.length > 0 ? featuredTractors.map((tractor) => (
              <motion.div
                key={tractor.id}
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="group cursor-pointer bg-white rounded-3xl shadow-xl hover:shadow-2xl overflow-hidden border border-gray-100 hover:border-red-200 transition-all duration-500"
              >
                <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden relative">
                  <img 
                    src={tractor.image} 
                    alt={tractor.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {tractor.stock > 0 && (
                    <span className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {tractor.stock} in Stock
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1">{tractor.model}</p>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{tractor.name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <span>{tractor.hp} HP</span>
                    <span>₹{tractor.price.toLocaleString('en-IN')}</span>
                  </div>
                  <Link to={`/inquiry?model=${encodeURIComponent(tractor.model)}`} className="block w-full text-center bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition-all">
                    Inquire Now
                  </Link>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">Loading featured tractors...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About Agristar Farm Services
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-gray-600 mb-8">
              Authorized dealer for Massey Ferguson and TAFE tractors in Tarapur, Anand. 
              We provide genuine parts, expert service, and financing options to boost your farming productivity.
            </motion.p>
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-2xl">
                <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-orange-500 rounded-xl flex items-center justify-center">
                  <Tractor className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Premium Quality</h4>
                  <p className="text-sm text-gray-600">100% Genuine Parts</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <img 
              src="/images/showroom.jpg" 
              alt="Showroom"
              className="w-full rounded-3xl shadow-2xl"
            />
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-orange-500 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Ready to Power Up Your Farm?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xl mb-8 opacity-90"
          >
            Contact us for best deals, test drives, and personalized service.
          </motion.p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/inquiry" className="bg-white text-red-600 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all shadow-2xl hover:shadow-3xl">
              Send Inquiry
            </Link>
            <Link to="/tractors" className="border-2 border-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all">
              View Inventory
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}