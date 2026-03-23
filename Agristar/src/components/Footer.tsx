import { Link } from 'react-router-dom';
import { Tractor, Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';

export function Footer() {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="bg-gradient-to-r from-red-600 to-orange-500 text-white py-12 mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <motion.div variants={itemVariants} className="flex flex-col items-center md:items-start md:text-left space-y-4">
          <div className="flex items-center space-x-2">
            <Tractor className="h-10 w-10" />
            <span className="text-2xl font-bold">Agristar</span>
          </div>
          <p className="text-sm opacity-90 max-w-xs">
            Your Trusted Massey Ferguson & TAFE Dealer in Tarapur, Anand, Gujarat. Powering your farm with premium tractors.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-4">
          <h3 className="text-lg font-semibold">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:opacity-80 transition-opacity">Home</Link></li>
            <li><Link to="/tractors" className="hover:opacity-80 transition-opacity">Tractors</Link></li>
            <li><Link to="/inquiry" className="hover:opacity-80 transition-opacity">Inquiry</Link></li>
          </ul>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-4">
          <h3 className="text-lg font-semibold">Contact</h3>
          <div className="space-y-3 text-sm">
            <p className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Tarapur, Anand, Gujarat, India</span>
            </p>
            <p className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>+91 98765 43210</span>
            </p>
            <p className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>info@agristar.co.in</span>
            </p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="https://facebook.com/MasseyTarapur" className="p-2 rounded-lg bg-white/20 hover:bg-white/40 transition-all">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="p-2 rounded-lg bg-white/20 hover:bg-white/40 transition-all">
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </motion.div>
      </div>
      <div className="border-t border-white/20 mt-8 pt-6 text-center text-sm opacity-75">
        &copy; 2026 Agristar Farm Services. All rights reserved.
      </div>
    </motion.footer>
  );
}