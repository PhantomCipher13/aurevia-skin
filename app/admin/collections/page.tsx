'use client';

import { motion } from 'framer-motion';
import AdminHeader from '../components/AdminHeader';

const collections = [
  { id: 1, name: 'Summer Glow Edit', products: 8, status: 'Active', gradient: 'from-[#C7A064]/40 to-[#8B7147]/20', desc: 'summer skincare' },
  { id: 2, name: 'Barrier Repair Bundle', products: 5, status: 'Active', gradient: 'from-[#D4B88B]/40 to-[#A38A60]/20' },
  { id: 3, name: 'Vitamin C Ritual', products: 3, status: 'Active', gradient: 'from-[#EAD9C3]/40 to-[#C7A064]/20' },
  { id: 4, name: 'Night Recovery Set', products: 4, status: 'Active', gradient: 'from-[#B5925A]/40 to-[#7D643E]/20' },
  { id: 5, name: 'Sensitive Skin Heroes', products: 6, status: 'Draft', gradient: 'from-[#F3E5D3]/40 to-[#D4B88B]/20' },
  { id: 6, name: 'Anti-Aging Essentials', products: 7, status: 'Active', gradient: 'from-[#9C7C4E]/40 to-[#6E5636]/20' },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function AdminCollectionsPage() {
  return (
    <div className="flex flex-col gap-8 min-h-screen font-body text-[#EAD9C3]">
      <AdminHeader 
        title="Collections" 
        action={{ label: '+ New Collection', href: '/admin/collections/new' }} 
      />
      <motion.div 
        variants={container} 
        initial="hidden" 
        animate="show" 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {collections.map((col) => (
          <motion.div 
            key={col.id} 
            variants={item} 
            className="bg-[rgba(255,255,255,0.02)] border border-[rgba(199,160,100,0.08)] rounded-xl overflow-hidden group hover:border-[#C7A064]/30 transition-colors"
          >
            <div className={`h-40 bg-gradient-to-br ${col.gradient} flex items-end p-4 relative`}>
              <div className="absolute inset-0 bg-black/10"></div>
              <span className="relative z-10 bg-black/40 px-3 py-1 rounded-full text-xs font-medium text-[#EAD9C3] backdrop-blur-sm">
                {col.status}
              </span>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <div>
                <h3 className="text-xl font-heading mb-1 text-[#EAD9C3] group-hover:text-[#C7A064] transition-colors">{col.name}</h3>
                <p className="text-[rgba(234,217,195,0.5)] text-sm">{col.products} Products</p>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <button className="flex-1 py-2 text-sm bg-transparent border border-[rgba(199,160,100,0.2)] rounded-md hover:bg-[#C7A064]/10 transition-colors">
                  Edit
                </button>
                <button className="flex-1 py-2 text-sm bg-transparent border border-[rgba(199,160,100,0.2)] rounded-md hover:bg-[#C7A064]/10 transition-colors">
                  View
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
