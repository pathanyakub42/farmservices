import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { motion } from 'framer-motion';
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Inquiry, Tractor, Tehsil } from '../types';
import { Send, TractorIcon } from 'lucide-react';
import { submitInquiry, fetchTractors, fetchTehsils } from '../utils/supabase';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  phone: z.string().min(10, 'Phone must be at least 10 digits').max(15),
  message: z.string().optional(),
  tehsil: z.string().min(1, 'Please select a Tehsil'),
  village: z.string().min(1, 'Please select a Village'),
  interestedTractor: z.string().min(1, 'Please select a tractor model'),
});

type FormData = z.infer<typeof schema>;

export function Inquiry() {
  const [, setInquiries] = useLocalStorage<Inquiry[]>('inquiries', []);
  const [tractors, setTractors] = useLocalStorage<Tractor[]>('tractors', []);
  const [tehsils, setTehsils] = useLocalStorage<Tehsil[]>('tehsils', []);
  const [submitted, setSubmitted] = useState(false);
  const [searchParams] = useSearchParams();
  const modelFromUrl = searchParams.get('model');
  const [loading, setLoading] = useState(true);
  
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      interestedTractor: modelFromUrl || '',
      tehsil: '',
      village: '',
    }
  });

  // Fetch data from Supabase on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [tractorsData, tehsilsData] = await Promise.all([
          fetchTractors(),
          fetchTehsils(),
        ]);

        // Transform tractor data
        const transformedTractors: Tractor[] = tractorsData.map((t: any) => ({
          id: t.id,
          name: t.name,
          model: t.model,
          hp: t.hp,
          price: t.price,
          image: t.image_url,
          description: t.description,
          stock: t.stock,
          year: t.year,
        }));

        // Transform tehsil data
        const transformedTehsils: Tehsil[] = tehsilsData.map((t: any) => ({
          id: t.id,
          name: t.name,
          villages: t.villages.map((v: any) => v.name),
        }));

        setTractors(transformedTractors);
        setTehsils(transformedTehsils);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [setTractors, setTehsils]);

  // Set the model from URL when component mounts
  useEffect(() => {
    if (modelFromUrl) {
      setValue('interestedTractor', modelFromUrl);
    }
  }, [modelFromUrl, setValue]);

  // Get only available tractors (stock > 0)
  const availableTractors = useMemo(() => {
    return tractors.filter(t => t.stock > 0);
  }, [tractors]);

  const selectedTractor = watch('interestedTractor');
  const selectedTehsil = watch('tehsil');

  // Get villages for selected tehsil
  const availableVillages = useMemo(() => {
    if (!selectedTehsil) return [];
    const tehsil = tehsils.find(t => t.name === selectedTehsil);
    return tehsil?.villages || [];
  }, [selectedTehsil, tehsils]);

  // Reset village when tehsil changes
  useEffect(() => {
    setValue('village', '');
  }, [selectedTehsil, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      // Submit to Supabase
      await submitInquiry({
        name: data.name,
        phone: data.phone,
        message: data.message,
        tehsil: data.tehsil,
        village: data.village,
        interestedTractor: data.interestedTractor,
      });

      // Also store in local storage for fallback
      const newInquiry: Inquiry = {
        id: `inq-${Date.now()}`,
        ...data,
        date: new Date().toLocaleString('en-IN'),
      };
      setInquiries(prev => [newInquiry, ...prev]);
      
      reset();
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Submit error:', error);
      alert('Error submitting inquiry. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-16rem)] py-20 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-16rem)] py-20 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-orange-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <TractorIcon className="mx-auto h-16 w-16 text-red-600 mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-red-600 bg-clip-text text-transparent mb-4">
            Send Inquiry
          </h1>
          <p className="text-xl text-gray-600">
            Get in touch for tractor quotes, service, or test drives. We respond within 24 hours.
          </p>
        </motion.div>

        {submitted ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-green-100 border border-green-300 text-green-800 px-12 py-12 rounded-3xl text-center shadow-2xl"
          >
            <Send className="mx-auto h-20 w-20 mb-6 text-green-600" />
            <h2 className="text-3xl font-bold mb-4">Thank You!</h2>
            <p className="text-lg">Your inquiry has been sent. We'll contact you soon.</p>
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 md:p-12 space-y-6"
          >
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
              <input
                {...register('name')}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all shadow-sm"
                placeholder="Your name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number *</label>
              <input
                {...register('phone')}
                type="tel"
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all shadow-sm"
                placeholder="e.g. 9876543210"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
            </div>

            {/* Tehsil */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tehsil *</label>
              <select
                {...register('tehsil')}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all shadow-sm bg-white"
              >
                <option value="">-- Select Tehsil --</option>
                {tehsils.map((tehsil) => (
                  <option key={tehsil.id} value={tehsil.name}>
                    {tehsil.name}
                  </option>
                ))}
              </select>
              {errors.tehsil && <p className="text-red-500 text-sm mt-1">{errors.tehsil.message}</p>}
            </div>

            {/* Village - Only show if tehsil selected */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Village/Gaav *</label>
              <select
                {...register('village')}
                disabled={!selectedTehsil}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all shadow-sm bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">{selectedTehsil ? '-- Select Village --' : 'First select Tehsil'}</option>
                {availableVillages.map((village) => (
                  <option key={village} value={village}>
                    {village}
                  </option>
                ))}
              </select>
              {errors.village && <p className="text-red-500 text-sm mt-1">{errors.village.message}</p>}
            </div>

            {/* Tractor Model */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Interested Tractor Model *</label>
              {modelFromUrl && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-3 p-3 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl flex items-center gap-3"
                >
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-red-800">
                    You selected: <span className="font-bold">{modelFromUrl}</span> from tractors page
                  </span>
                </motion.div>
              )}
              {availableTractors.length > 0 ? (
                <select
                  {...register('interestedTractor')}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all shadow-sm bg-white"
                >
                  <option value="">-- Select a Model --</option>
                  {availableTractors.map((tractor) => (
                    <option key={tractor.id} value={tractor.model}>
                      {tractor.model} - ₹{tractor.price.toLocaleString('en-IN')} ({tractor.hp} HP) - {tractor.stock} Available
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-2xl text-yellow-800">
                  Currently no tractors in stock. Please call us directly for upcoming availability.
                </div>
              )}
              {errors.interestedTractor && <p className="text-red-500 text-sm mt-1">{errors.interestedTractor.message}</p>}
            </div>

            {/* Selected Tractor Info */}
            {selectedTractor && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-50 border border-red-100 rounded-2xl p-4"
              >
                {(() => {
                  const tractor = availableTractors.find(t => t.model === selectedTractor);
                  if (!tractor) return null;
                  return (
                    <div className="flex items-center gap-4">
                      <img src={tractor.image} alt={tractor.name} className="w-20 h-20 object-cover rounded-xl" />
                      <div>
                        <h4 className="font-semibold text-gray-900">{tractor.name}</h4>
                        <p className="text-sm text-gray-600">{tractor.hp} HP | ₹{tractor.price.toLocaleString('en-IN')}</p>
                        <p className="text-xs text-green-600 font-medium mt-1">{tractor.stock} units available</p>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            )}

            {/* Message - Optional */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Message (Optional)</label>
              <textarea
                {...register('message')}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-vertical shadow-sm font-medium"
                placeholder="Any specific requirements or questions..."
              />
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting || availableTractors.length === 0}
              whileHover={{ scale: availableTractors.length > 0 ? 1.02 : 1 }}
              whileTap={{ scale: availableTractors.length > 0 ? 0.98 : 1 }}
              className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-bold py-5 px-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center space-x-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-6 w-6" />
              <span>{isSubmitting ? 'Sending...' : 'Send Inquiry'}</span>
            </motion.button>
          </motion.form>
        )}
      </div>
    </div>
  );
}
