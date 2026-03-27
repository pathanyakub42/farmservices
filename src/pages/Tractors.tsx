import { motion } from 'framer-motion';
import { Tractor as TractorIcon, Search, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Tractor } from '../types';

export function Tractors() {
  const [tractors] = useLocalStorage<Tractor[]>('tractors', []);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filteredTractors = tractors.filter((tractor) => {
    const matchesSearch = tractor.name.toLowerCase().includes(search.toLowerCase()) || 
                         tractor.model.toLowerCase().includes(search.toLowerCase());
    const matchesStockFilter = filter === 'in-stock' ? tractor.stock > 0 : 
                               filter === 'out-of-stock' ? tractor.stock === 0 : true;
    return matchesSearch && matchesStockFilter;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-[calc(100vh-16rem)] py-20 bg-gradient-to-b from-slate-50 via-white to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <TractorIcon className="mx-auto h-16 w-16 text-red-600 mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
            Agristar Inventory
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Live updates on available Massey Ferguson tractors. Premium models: 1035 Dost, 241 Sonaplus, 1035 Maha Shakti, 246 Dynatrack
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by model name..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all shadow-sm"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-6 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
          >
            <option value="all">All Tractors</option>
            <option value="in-stock">In Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Total Models', value: tractors.length },
            { label: 'In Stock', value: tractors.filter(t => t.stock > 0).length },
            { label: 'Out of Stock', value: tractors.filter(t => t.stock === 0).length },
            { label: 'Total Units', value: tractors.reduce((acc, t) => acc + t.stock, 0) },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center"
            >
              <p className="text-3xl font-bold text-red-600">{stat.value}</p>
              <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Grid */}
        {filteredTractors.length === 0 ? (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-2xl text-gray-500 py-20"
          >
            No tractors match your filter.
          </motion.p>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {filteredTractors.map((tractor) => (
              <motion.div
                key={tractor.id}
                variants={cardVariants}
                whileHover={{ y: -15, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className={`group bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-3xl border-2 transition-all duration-500 cursor-pointer hover:-rotate-1 ${
                  tractor.stock > 0 ? 'border-green-200 hover:border-green-400' : 'border-red-200 hover:border-red-400'
                }`}
              >
                <div className="overflow-hidden bg-gradient-to-br from-gray-50 to-white relative">
                  <img 
                    src={tractor.image} 
                    alt={tractor.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  {tractor.stock === 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-red-600 text-white px-4 py-2 rounded-full font-bold text-lg transform -rotate-12">
                        OUT OF STOCK
                      </span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    {tractor.stock > 0 ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500 rounded-full text-xs font-semibold text-white">
                        <CheckCircle className="h-3 w-3" />
                        Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-500 rounded-full text-xs font-semibold text-white">
                        <XCircle className="h-3 w-3" />
                        Unavailable
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-red-600 uppercase tracking-wider">{tractor.model}</span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      tractor.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      Stock: {tractor.stock}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{tractor.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{tractor.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <p className="text-2xl font-bold text-gray-900">{tractor.hp}</p>
                      <p className="text-xs text-gray-500 uppercase">Horsepower</p>
                    </div>
                    <div className="bg-red-50 rounded-xl p-3 text-center">
                      <p className="text-lg font-bold text-red-600">₹{tractor.price.toLocaleString('en-IN')}</p>
                      <p className="text-xs text-gray-500 uppercase">Price</p>
                    </div>
                  </div>

                  <button
                    onClick={() => tractor.stock > 0 && navigate(`/inquiry?model=${encodeURIComponent(tractor.model)}`)}
                    disabled={tractor.stock === 0}
                    className={`block w-full text-center py-3 rounded-xl font-semibold transition-all ${
                      tractor.stock > 0 
                        ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white hover:from-red-700 hover:to-orange-600' 
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {tractor.stock > 0 ? 'Inquire Now' : 'Notify Me When Available'}
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
