'use client';

import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import AdminHeader from '../components/AdminHeader';

interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  product_collections?: { count: number }[] | any;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 }
};

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    is_active: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('collections')
        .select(`
          id, name, slug, description, image_url, is_active, created_at,
          product_collections(count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCollections(data || []);
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenModal = (collection?: Collection) => {
    if (collection) {
      setEditingId(collection.id);
      setFormData({
        name: collection.name,
        slug: collection.slug,
        description: collection.description || '',
        is_active: collection.is_active
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        slug: '',
        description: '',
        is_active: true
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    if (!editingId) {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      setFormData((prev) => ({ ...prev, name, slug }));
    } else {
      setFormData((prev) => ({ ...prev, name }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingId) {
        const { error } = await supabase
          .from('collections')
          .update({
            name: formData.name,
            slug: formData.slug,
            description: formData.description,
            is_active: formData.is_active
          })
          .eq('id', editingId);
        
        if (error) throw error;
        showToast('Collection updated successfully', 'success');
      } else {
        const { error } = await supabase
          .from('collections')
          .insert([{
            name: formData.name,
            slug: formData.slug,
            description: formData.description,
            is_active: formData.is_active
          }]);
        
        if (error) throw error;
        showToast('Collection created successfully', 'success');
      }
      
      handleCloseModal();
      fetchCollections();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete the "${name}" collection?`)) return;

    try {
      const { error } = await supabase
        .from('collections')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      showToast('Collection deleted successfully', 'success');
      fetchCollections();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const getProductCount = (col: Collection) => {
    if (Array.isArray(col.product_collections)) {
      return col.product_collections[0]?.count || 0;
    }
    return col.product_collections?.count || 0;
  };

  return (
    <div className="flex flex-col gap-8 min-h-screen font-body text-[#EAD9C3]">
      <AdminHeader 
        title="Collections" 
        action={{ label: '+ New Collection', onClick: () => handleOpenModal() }} 
      />

      <div className="px-8 pb-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-pulse text-[#C7A064]">Loading collections...</div>
          </div>
        ) : collections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 border border-dashed border-[rgba(199,160,100,0.2)] rounded-2xl bg-[rgba(255,255,255,0.01)]">
            <h3 className="text-xl font-heading text-[#EAD9C3] mb-2">No collections yet</h3>
            <p className="text-[rgba(234,217,195,0.5)] mb-6 text-sm">Create your first collection to start organizing products.</p>
            <button 
              onClick={() => handleOpenModal()}
              className="px-6 py-3 bg-[#C7A064] text-white rounded-xl text-sm font-semibold tracking-wider uppercase hover:shadow-[0_4px_16px_rgba(199,160,100,0.2)] transition-all"
            >
              + New Collection
            </button>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants} 
            initial="hidden" 
            animate="show" 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {collections.map((col) => (
              <motion.div 
                key={col.id} 
                variants={itemVariants} 
                className="bg-[rgba(28,20,16,0.5)] border border-[rgba(199,160,100,0.08)] rounded-xl overflow-hidden group hover:border-[#C7A064]/30 transition-all flex flex-col"
              >
                <div className="h-40 bg-gradient-to-br from-[#1C1410] to-[#0D0B09] flex items-center justify-center relative overflow-hidden border-b border-[rgba(199,160,100,0.08)]">
                  {col.image_url ? (
                    <img src={col.image_url} alt={col.name} className="w-full h-full object-cover opacity-80" />
                  ) : (
                    <span className="text-[rgba(199,160,100,0.2)] font-heading text-2xl">{col.name.charAt(0)}</span>
                  )}
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute top-4 right-4 z-10 flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${col.is_active ? 'bg-[#C7A064]/20 text-[#C7A064] border border-[#C7A064]/30' : 'bg-black/40 text-[rgba(234,217,195,0.6)] border border-[rgba(255,255,255,0.1)]'}`}>
                      {col.is_active ? 'Active' : 'Draft'}
                    </span>
                  </div>
                </div>
                
                <div className="p-5 flex flex-col flex-grow gap-4 bg-[#0D0B09]">
                  <div className="flex-grow">
                    <h3 className="text-xl font-heading mb-1 text-[#EAD9C3] group-hover:text-[#C7A064] transition-colors">{col.name}</h3>
                    <p className="text-[rgba(234,217,195,0.5)] text-sm mb-3">/{col.slug}</p>
                    <p className="text-[rgba(234,217,195,0.7)] text-sm line-clamp-2 mb-4">
                      {col.description || 'No description provided.'}
                    </p>
                    <p className="text-[rgba(199,160,100,0.8)] text-sm font-medium">
                      {getProductCount(col)} Products
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3 pt-4 border-t border-[rgba(199,160,100,0.08)]">
                    <button 
                      onClick={() => handleOpenModal(col)}
                      className="flex-1 py-2 text-sm text-[#EAD9C3] bg-transparent border border-[rgba(199,160,100,0.2)] rounded-lg hover:bg-[#C7A064]/10 hover:border-[#C7A064]/40 transition-all"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(col.id, col.name)}
                      className="flex-1 py-2 text-sm text-red-400 bg-transparent border border-red-900/30 rounded-lg hover:bg-red-500/10 hover:border-red-500/30 transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="relative w-full max-w-lg bg-[#1C1410] border border-[rgba(199,160,100,0.2)] rounded-2xl shadow-2xl overflow-hidden z-10"
            >
              <div className="px-6 py-4 border-b border-[rgba(199,160,100,0.1)] flex justify-between items-center bg-[#0D0B09]">
                <h2 className="text-xl font-heading text-[#C7A064]">
                  {editingId ? 'Edit Collection' : 'New Collection'}
                </h2>
                <button 
                  onClick={handleCloseModal}
                  className="text-[rgba(234,217,195,0.5)] hover:text-[#EAD9C3] transition-colors p-1"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
                <div>
                  <label className="block text-sm font-medium text-[rgba(234,217,195,0.7)] mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleNameChange}
                    className="w-full bg-[#0D0B09] border border-[rgba(199,160,100,0.2)] rounded-xl px-4 py-2.5 text-[#EAD9C3] focus:outline-none focus:border-[#C7A064] transition-colors"
                    placeholder="e.g. Summer Glow"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[rgba(234,217,195,0.7)] mb-1">Slug</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    className="w-full bg-[#0D0B09] border border-[rgba(199,160,100,0.2)] rounded-xl px-4 py-2.5 text-[#EAD9C3] focus:outline-none focus:border-[#C7A064] transition-colors"
                    placeholder="e.g. summer-glow"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[rgba(234,217,195,0.7)] mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-[#0D0B09] border border-[rgba(199,160,100,0.2)] rounded-xl px-4 py-2.5 text-[#EAD9C3] focus:outline-none focus:border-[#C7A064] transition-colors resize-none"
                    placeholder="Brief description of the collection..."
                  />
                </div>

                <div className="flex items-center gap-3 mt-2">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={formData.is_active}
                    onClick={() => setFormData({...formData, is_active: !formData.is_active})}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.is_active ? 'bg-[#C7A064]' : 'bg-[rgba(199,160,100,0.2)]'}`}
                  >
                    <span 
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.is_active ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                  </button>
                  <span className="text-sm text-[rgba(234,217,195,0.8)]">
                    {formData.is_active ? 'Active (Visible to customers)' : 'Draft (Hidden)'}
                  </span>
                </div>

                <div className="flex gap-3 mt-4 pt-4 border-t border-[rgba(199,160,100,0.1)]">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 py-3 bg-transparent border border-[rgba(199,160,100,0.2)] rounded-xl text-[#EAD9C3] font-medium hover:bg-[#C7A064]/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 bg-[#C7A064] text-white rounded-xl font-medium hover:bg-[#b38f5a] transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : (editingId ? 'Update' : 'Create')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className={`fixed bottom-8 left-1/2 z-50 px-6 py-3 rounded-full text-sm font-medium shadow-2xl border ${
              toast.type === 'success' 
                ? 'bg-[#1C1410] border-[#C7A064]/30 text-[#C7A064]' 
                : 'bg-[#1C1410] border-red-500/30 text-red-400'
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
