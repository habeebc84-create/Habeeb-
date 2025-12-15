
import React from 'react';
import { X, User, Building2 } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (type: 'user' | 'shop') => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="glass-panel w-full max-w-3xl rounded-3xl overflow-hidden relative animate-in fade-in zoom-in duration-300 flex flex-col md:flex-row min-h-[500px]">
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 text-white bg-black/40 hover:bg-black/60 rounded-full transition-colors"
        >
            <X size={20} />
        </button>

        {/* Shopper Side */}
        <div 
            onClick={() => onLogin('user')}
            className="relative flex-1 group cursor-pointer overflow-hidden border-r border-white/10"
        >
            <img 
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600" 
                alt="Shopper" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/40 to-transparent group-hover:bg-blue-900/20 transition-colors" />
            
            <div className="absolute bottom-0 left-0 p-8 w-full transform transition-transform duration-500 group-hover:-translate-y-4">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-xl">
                    <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-blue-500/40">
                        <User size={24} className="text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-2">I'm a Shopper</h3>
                    <p className="text-slate-200 text-sm">Find the best deals, book rides, and explore local gems.</p>
                </div>
            </div>
        </div>

        {/* Shop Owner Side */}
        <div 
            onClick={() => onLogin('shop')}
            className="relative flex-1 group cursor-pointer overflow-hidden"
        >
            <img 
                src="https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=600" 
                alt="Shop Owner" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
            />
             <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/90 via-emerald-900/40 to-transparent group-hover:bg-emerald-900/20 transition-colors" />
            
             <div className="absolute bottom-0 left-0 p-8 w-full transform transition-transform duration-500 group-hover:-translate-y-4">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-xl">
                    <div className="bg-emerald-600 w-12 h-12 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/40">
                        <Building2 size={24} className="text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-2">I'm a Seller</h3>
                    <p className="text-slate-200 text-sm">Post deals, manage inventory, and grow your business.</p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};
