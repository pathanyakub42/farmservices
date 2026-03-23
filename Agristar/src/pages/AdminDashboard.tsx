import { useMemo, useState, useCallback, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Pencil, Users, Tractor as TractorIcon, X, Upload, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Inquiry, Tractor, Tehsil } from '../types';

type InventoryForm = Omit<Tractor, 'id'>;

const defaultForm: InventoryForm = {
  name: '',
  model: '',
  hp: 0,
  price: 0,
  image: '/images/tractor-placeholder.jpg',
  description: '',
  stock: 0,
};

export function AdminDashboard() {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'inquiries' | 'inventory' | 'locations'>('inquiries');
  const [tractors, setTractors] = useLocalStorage<Tractor[]>('tractors', []);
  const [inquiries] = useLocalStorage<Inquiry[]>('inquiries', []);
  const [tehsils, setTehsils] = useLocalStorage<Tehsil[]>('tehsils', []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<InventoryForm>(defaultForm);
  const [uploading, setUploading] = useState(false);
  
  // Location management state
  const [newTehsilName, setNewTehsilName] = useState('');
  const [newVillageName, setNewVillageName] = useState('');
  const [selectedTehsilForVillage, setSelectedTehsilForVillage] = useState('');

  const totalInquiriesToday = useMemo(() => {
    const today = new Date().toLocaleDateString('en-IN');
    return inquiries.filter((item) => item.date.includes(today)).length;
  }, [inquiries]);

  const openAddModal = () => {
    setEditId(null);
    setForm(defaultForm);
    setIsModalOpen(true);
  };

  const openEditModal = (tractor: Tractor) => {
    setEditId(tractor.id);
    setForm({
      name: tractor.name,
      model: tractor.model,
      hp: tractor.hp,
      price: tractor.price,
      image: tractor.image,
      description: tractor.description,
      stock: tractor.stock,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditId(null);
    setUploading(false);
  };

  const handleImageUpload = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, image: reader.result as string }));
      setUploading(false);
    };
    reader.readAsDataURL(file);
  }, []);

  const onSave = () => {
    if (!form.name.trim() || !form.model.trim() || !form.description.trim() || form.hp <= 0 || form.price <= 0) {
      alert('Please fill all required fields');
      return;
    }

    if (editId) {
      setTractors((prev) =>
        prev.map((item) =>
          item.id === editId
            ? { ...item, ...form, name: form.name.trim(), description: form.description.trim() }
            : item,
        ),
      );
    } else {
      const newTractor: Tractor = {
        id: `tractor-${Date.now()}`,
        ...form,
        name: form.name.trim(),
        description: form.description.trim(),
      };
      setTractors((prev) => [newTractor, ...prev]);
    }

    closeModal();
  };

  const deleteTractor = (id: string) => {
    if (confirm('Are you sure you want to delete this tractor?')) {
      setTractors((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Tehsil management
  const addTehsil = () => {
    if (!newTehsilName.trim()) return;
    const newTehsil: Tehsil = {
      id: `tehsil-${Date.now()}`,
      name: newTehsilName.trim(),
      villages: [],
    };
    setTehsils((prev) => [...prev, newTehsil]);
    setNewTehsilName('');
  };

  const deleteTehsil = (id: string) => {
    if (confirm('Delete this tehsil and all its villages?')) {
      setTehsils((prev) => prev.filter((t) => t.id !== id));
    }
  };

  // Village management
  const addVillage = () => {
    if (!newVillageName.trim() || !selectedTehsilForVillage) return;
    setTehsils((prev) =>
      prev.map((t) =>
        t.id === selectedTehsilForVillage
          ? { ...t, villages: [...t.villages, newVillageName.trim()] }
          : t
      )
    );
    setNewVillageName('');
  };

  const deleteVillage = (tehsilId: string, villageName: string) => {
    setTehsils((prev) =>
      prev.map((t) =>
        t.id === tehsilId
          ? { ...t, villages: t.villages.filter((v) => v !== villageName) }
          : t
      )
    );
  };

  return (
    <div className="min-h-[calc(100vh-12rem)] bg-zinc-950 text-zinc-100 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-red-400">Agristar Farm Services</p>
            <h1 className="text-3xl font-semibold">Admin Control Panel</h1>
          </div>
          <button
            onClick={logout}
            className="rounded-xl border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-800"
          >
            Logout
          </button>
        </div>

        <div className="mt-8 flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`rounded-xl px-4 py-2 text-sm transition ${
              activeTab === 'inquiries' ? 'bg-red-500 text-white' : 'bg-zinc-800 text-zinc-200'
            }`}
          >
            <Users className="mr-2 inline h-4 w-4" />
            Inquiries ({inquiries.length})
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`rounded-xl px-4 py-2 text-sm transition ${
              activeTab === 'inventory' ? 'bg-red-500 text-white' : 'bg-zinc-800 text-zinc-200'
            }`}
          >
            <TractorIcon className="mr-2 inline h-4 w-4" />
            Inventory ({tractors.length})
          </button>
          <button
            onClick={() => setActiveTab('locations')}
            className={`rounded-xl px-4 py-2 text-sm transition ${
              activeTab === 'locations' ? 'bg-red-500 text-white' : 'bg-zinc-800 text-zinc-200'
            }`}
          >
            <MapPin className="mr-2 inline h-4 w-4" />
            Tehsil/Villages ({tehsils.length})
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'inquiries' ? (
            <motion.section
              key="inquiries"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-8"
            >
              <p className="mb-4 text-sm text-zinc-400">Today's inquiries: {totalInquiriesToday}</p>
              <div className="space-y-3">
                {inquiries.length === 0 && (
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-zinc-400">No inquiries yet.</div>
                )}
                {inquiries.map((item) => (
                  <article key={item.id} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h3 className="text-lg font-medium">{item.name}</h3>
                      <span className="text-xs text-zinc-400">{item.date}</span>
                    </div>
                    <div className="mt-3 text-xs text-zinc-400 space-y-1">
                      <p><span className="text-zinc-500">Phone:</span> {item.phone}</p>
                      <p><span className="text-zinc-500">Location:</span> {item.village}, {item.tehsil}</p>
                      {item.interestedTractor && (
                        <p className="text-red-300"><span className="text-zinc-500">Interested in:</span> {item.interestedTractor}</p>
                      )}
                    </div>
                    {item.message && (
                      <p className="mt-3 text-sm text-zinc-300 border-t border-zinc-800 pt-3">{item.message}</p>
                    )}
                  </article>
                ))}
              </div>
            </motion.section>
          ) : activeTab === 'inventory' ? (
            <motion.section
              key="inventory"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-8"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-medium">Tractor Inventory</h2>
                <button
                  onClick={openAddModal}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
                >
                  <Plus className="mr-2 inline h-4 w-4" />
                  Add Tractor
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {tractors.map((tractor) => (
                  <article key={tractor.id} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
                    <img src={tractor.image} alt={tractor.name} className="h-40 w-full rounded-xl object-cover" />
                    <h3 className="mt-3 text-lg font-medium">{tractor.name}</h3>
                    <p className="mt-1 text-sm text-zinc-400">{tractor.model}</p>
                    <p className="mt-1 text-sm text-zinc-400">{tractor.description}</p>
                    <p className="mt-2 text-sm text-zinc-200">
                      {tractor.hp} HP | ₹{tractor.price.toLocaleString('en-IN')} | Stock: {tractor.stock}
                    </p>
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => openEditModal(tractor)}
                        className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-500"
                      >
                        <Pencil className="mr-1 inline h-3 w-3" />
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTractor(tractor.id)}
                        className="rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-500"
                      >
                        <Trash2 className="mr-1 inline h-3 w-3" />
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </motion.section>
          ) : (
            <motion.section
              key="locations"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tehsil Management */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                  <h2 className="text-lg font-medium mb-4">Manage Tehsils</h2>
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={newTehsilName}
                      onChange={(e) => setNewTehsilName(e.target.value)}
                      placeholder="New Tehsil name"
                      className="flex-1 rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm"
                    />
                    <button
                      onClick={addTehsil}
                      className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {tehsils.map((tehsil) => (
                      <div key={tehsil.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-800">
                        <span>{tehsil.name}</span>
                        <button
                          onClick={() => deleteTehsil(tehsil.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Village Management */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                  <h2 className="text-lg font-medium mb-4">Manage Villages</h2>
                  <select
                    value={selectedTehsilForVillage}
                    onChange={(e) => setSelectedTehsilForVillage(e.target.value)}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm mb-3"
                  >
                    <option value="">Select Tehsil</option>
                    {tehsils.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={newVillageName}
                      onChange={(e) => setNewVillageName(e.target.value)}
                      placeholder="New Village name"
                      disabled={!selectedTehsilForVillage}
                      className="flex-1 rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm disabled:opacity-50"
                    />
                    <button
                      onClick={addVillage}
                      disabled={!selectedTehsilForVillage}
                      className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {selectedTehsilForVillage && (
                      tehsils
                        .find((t) => t.id === selectedTehsilForVillage)
                        ?.villages.map((village) => (
                          <div key={village} className="flex items-center justify-between p-3 rounded-xl bg-zinc-800">
                            <span>{village}</span>
                            <button
                              onClick={() => deleteVillage(selectedTehsilForVillage, village)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-xl rounded-3xl bg-white p-6 text-zinc-900 max-h-[90vh] overflow-y-auto"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-semibold">{editId ? 'Edit Tractor' : 'Add Tractor'}</h3>
                <button onClick={closeModal} className="rounded-lg p-1 hover:bg-zinc-100">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Model Input */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Model *</label>
                  <input
                    type="text"
                    value={form.model}
                    onChange={(event) => {
                      const typedModel = event.target.value;
                      setForm((prev) => ({
                        ...prev,
                        model: typedModel,
                        name: typedModel ? `Massey Ferguson ${typedModel}` : '',
                      }));
                    }}
                    placeholder="e.g. 1035 Dost, 241 Sonaplus, etc."
                    className="w-full rounded-xl border border-zinc-300 px-3 py-2"
                  />
                  <p className="text-xs text-zinc-500 mt-1">Type model name (e.g. 1035 Dost, 241 Sonaplus, 1035 Maha Shakti, 246 Dynatrack)</p>
                </div>

                {/* Display Name */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Display Name</label>
                  <input
                    value={form.name}
                    onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                    placeholder="Full Display Name"
                    className="w-full rounded-xl border border-zinc-300 px-3 py-2"
                  />
                </div>

                {/* Image Upload */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Tractor Image</label>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <button
                        type="button"
                        className="flex items-center gap-2 rounded-xl border border-zinc-300 px-4 py-2 hover:bg-zinc-50"
                      >
                        <Upload className="h-4 w-4" />
                        {uploading ? 'Uploading...' : 'Upload Image'}
                      </button>
                    </div>
                    {form.image && form.image !== '/images/tractor-placeholder.jpg' && (
                      <img src={form.image} alt="Preview" className="h-16 w-16 rounded-lg object-cover border" />
                    )}
                  </div>
                  <p className="mt-1 text-xs text-zinc-500">Or paste image URL below</p>
                </div>

                {/* Image URL */}
                <div className="sm:col-span-2">
                  <input
                    value={form.image}
                    onChange={(event) => setForm((prev) => ({ ...prev, image: event.target.value }))}
                    placeholder="Image URL"
                    className="w-full rounded-xl border border-zinc-300 px-3 py-2"
                  />
                </div>

                {/* HP */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">HP</label>
                  <input
                    value={form.hp || ''}
                    onChange={(event) => setForm((prev) => ({ ...prev, hp: Number(event.target.value) }))}
                    placeholder="Horsepower"
                    type="number"
                    className="w-full rounded-xl border border-zinc-300 px-3 py-2"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Price (₹)</label>
                  <input
                    value={form.price || ''}
                    onChange={(event) => setForm((prev) => ({ ...prev, price: Number(event.target.value) }))}
                    placeholder="Price in INR"
                    type="number"
                    className="w-full rounded-xl border border-zinc-300 px-3 py-2"
                  />
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Stock</label>
                  <input
                    value={form.stock || ''}
                    onChange={(event) => setForm((prev) => ({ ...prev, stock: Number(event.target.value) }))}
                    placeholder="Stock Quantity"
                    type="number"
                    className="w-full rounded-xl border border-zinc-300 px-3 py-2"
                  />
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                    placeholder="Description"
                    rows={3}
                    className="w-full rounded-xl border border-zinc-300 px-3 py-2"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button onClick={closeModal} className="rounded-xl border border-zinc-300 px-4 py-2 text-sm">
                  Cancel
                </button>
                <button onClick={onSave} className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500">
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
