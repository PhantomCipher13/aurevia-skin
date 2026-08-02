'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import AdminHeader from '../components/AdminHeader';

const mediaItems = [
  { id: 1, path: '/images/product-radiance-serum.png', name: 'product-radiance-serum.png', size: '1.2 MB', type: 'image' },
  { id: 2, path: '/images/product-cloud-cream.png', name: 'product-cloud-cream.png', size: '845 KB', type: 'image' },
  { id: 3, path: '/images/product-barrier-mist.png', name: 'product-barrier-mist.png', size: '1.5 MB', type: 'image' },
  { id: 4, path: '/images/product-night-oil.png', name: 'product-night-oil.png', size: '920 KB', type: 'image' },
  { id: 5, path: '/images/product-vitamin-c-serum.jpg', name: 'product-vitamin-c-serum.jpg', size: '1.1 MB', type: 'image' },
  { id: 6, path: '/images/product-retinol-serum.jpg', name: 'product-retinol-serum.jpg', size: '1.4 MB', type: 'image' },
  { id: 7, path: '/images/product-eye-cream.jpg', name: 'product-eye-cream.jpg', size: '650 KB', type: 'image' },
  { id: 8, path: '/images/product-toner.jpg', name: 'product-toner.jpg', size: '890 KB', type: 'image' },
  { id: 9, path: '/images/journal-morning.png', name: 'journal-morning.png', size: '2.1 MB', type: 'image' },
  { id: 10, path: '/images/journal-hydration.png', name: 'journal-hydration.png', size: '1.8 MB', type: 'image' },
  { id: 11, path: '/images/journal-barrier.png', name: 'journal-barrier.png', size: '1.9 MB', type: 'image' },
  { id: 12, path: '/images/journal-night.png', name: 'journal-night.png', size: '2.0 MB', type: 'image' },
];

const filters = ['All', 'Images', 'Videos', 'Documents'];

export default function AdminMediaPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selected, setSelected] = useState<number[]>([]);

  const toggleSelection = (id: number) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const clearSelection = () => setSelected([]);

  return (
    <div className="flex flex-col gap-8 min-h-screen font-body text-[#EAD9C3] pb-24 relative">
      <AdminHeader 
        title="Media Library" 
        action={{ 
          label: 'Upload Files', 
          onClick: () => console.log('Upload clicked') 
        }} 
      />

      {/* Upload Zone */}
      <div className="w-full border-2 border-dashed border-[rgba(199,160,100,0.3)] rounded-xl bg-[rgba(255,255,255,0.02)] p-12 flex flex-col items-center justify-center text-center hover:bg-[rgba(199,160,100,0.05)] transition-colors cursor-pointer group">
        <svg className="w-10 h-10 text-[rgba(234,217,195,0.5)] group-hover:text-[#C7A064] transition-colors mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        <p className="text-lg mb-1 text-[#EAD9C3]">Drop files here or click to upload</p>
        <p className="text-sm text-[rgba(234,217,195,0.5)]">Supports JPG, PNG, WebP, MP4</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 border-b border-[rgba(199,160,100,0.08)] pb-4">
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 text-sm rounded-full transition-colors ${activeFilter === filter ? 'bg-[#C7A064] text-[#0E0A07] font-medium' : 'bg-transparent text-[rgba(234,217,195,0.5)] hover:text-[#EAD9C3] hover:bg-[rgba(255,255,255,0.05)]'}`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {mediaItems.map((item) => {
          const isSelected = selected.includes(item.id);
          return (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key={item.id} 
              className={`relative group bg-[rgba(255,255,255,0.02)] rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-200 ${isSelected ? 'border-[#C7A064]' : 'border-[rgba(199,160,100,0.08)] hover:border-[#C7A064]/50'}`}
              onClick={() => toggleSelection(item.id)}
            >
              <div className="aspect-square relative bg-[#0E0A07]">
                <Image src={item.path} alt={item.name} fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                
                {/* Checkbox Overlay */}
                <div className={`absolute top-3 right-3 w-5 h-5 rounded border flex items-center justify-center transition-all ${isSelected ? 'bg-[#C7A064] border-[#C7A064]' : 'border-[rgba(234,217,195,0.5)] bg-black/40 opacity-0 group-hover:opacity-100'}`}>
                  {isSelected && <svg className="w-3 h-3 text-[#0E0A07]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </div>
              </div>
              <div className="p-3 border-t border-[rgba(199,160,100,0.08)]">
                <p className="text-sm truncate text-[#EAD9C3]">{item.name}</p>
                <p className="text-xs text-[rgba(234,217,195,0.5)] mt-1">{item.size}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Bottom Action Bar */}
      <AnimatePresence>
        {selected.length > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 lg:ml-32 bg-[#1A1512] border border-[#C7A064]/30 shadow-2xl rounded-2xl px-6 py-4 flex items-center gap-6 z-50"
          >
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#C7A064]/20 text-[#C7A064] text-xs font-medium">{selected.length}</span>
              <span className="text-sm text-[#EAD9C3]">Selected</span>
            </div>
            <div className="w-px h-6 bg-[rgba(199,160,100,0.2)]"></div>
            <div className="flex items-center gap-3">
              <button onClick={clearSelection} className="text-sm text-[rgba(234,217,195,0.5)] hover:text-[#EAD9C3] px-3 py-2 transition-colors">Cancel</button>
              <button className="text-sm text-[#EAD9C3] bg-[rgba(199,160,100,0.1)] hover:bg-[rgba(199,160,100,0.2)] border border-[rgba(199,160,100,0.3)] rounded-md px-4 py-2 transition-colors">Copy URL</button>
              <button className="text-sm text-red-400 bg-red-400/10 hover:bg-red-400/20 border border-red-400/30 rounded-md px-4 py-2 transition-colors">Delete</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
