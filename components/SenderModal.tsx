
import React, { useState } from 'react';
import { X, Store, Tag, Clock, Zap, Truck, CreditCard, Star, Upload, IndianRupee, MapPin, ArrowLeft } from 'lucide-react';

interface SenderModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPage?: boolean; // New prop to determine if it renders as a page or modal
}

type Tab = 'deal' | 'delivery' | 'reviews';

export const SenderModal: React.FC<SenderModalProps> = ({ isOpen, onClose, isPage = false }) => {
  const [activeTab, setActiveTab] = useState<Tab>('deal');
  
  // Deal State
  const [dealType, setDealType] = useState('standard');
  const [productImage, setProductImage] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');

  // Delivery State
  const [deliveryRadius, setDeliveryRadius] = useState(5);
  const [paymentModes, setPaymentModes] = useState({
    upi: true,
    cash: true,
    card: false,
    wallet: false
  });

  if (!isOpen) return null;

  // Mock Reviews Data
  const reviews = [
    { id: 1, user: "Rahul K.", rating: 5, comment: "Amazing discounts on coffee!", date: "2m ago" },
    { id: 2, user: "Sarah M.", rating: 4, comment: "Good service but crowded.", date: "1h ago" },
    { id: 3, user: "John D.", rating: 5, comment: "Best local shop in the area.", date: "1d ago" },
  ];

  const togglePayment = (mode: keyof typeof paymentModes) => {
    setPaymentModes(prev => ({ ...prev, [mode]: !prev[mode] }));
  };

  const Content = (
    <div className={`glass-panel bg-slate-900/95 rounded-2xl w-full ${isPage ? 'h-full border-none rounded-none' : 'max-w-2xl shadow-2xl border border-white/20 min-h-[600px]'} animate-in fade-in zoom-in duration-200 flex flex-col md:flex-row overflow-hidden`}>
      
      {/* Sidebar Navigation */}
      <div className={`w-full md:w-64 bg-black/20 border-r border-white/10 p-6 flex flex-col gap-2 ${isPage ? 'md:w-80' : ''}`}>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Store className="text-blue-400" /> My Shop
          </h2>
          
          <button 
              onClick={() => setActiveTab('deal')}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === 'deal' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
          >
              <Tag size={18} /> Deals & Products
          </button>

          <button 
              onClick={() => setActiveTab('delivery')}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === 'delivery' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
          >
              <Truck size={18} /> Delivery & Pay
          </button>

          <button 
              onClick={() => setActiveTab('reviews')}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === 'reviews' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
          >
              <Star size={18} /> Reviews
          </button>
          
          <div className="mt-auto pt-6 border-t border-white/10">
              <button onClick={onClose} className="flex items-center gap-3 p-3 text-red-400 hover:bg-red-500/10 rounded-xl w-full transition-colors">
                  {isPage ? <ArrowLeft size={18} /> : <X size={18} />}
                  {isPage ? 'Back to Home' : 'Close'}
              </button>
          </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 overflow-y-auto max-h-[80vh] md:max-h-full">
          
          {/* === DEAL TAB === */}
          {activeTab === 'deal' && (
              <div className="space-y-6 animate-in slide-in-from-right duration-300">
                  <div>
                      <h3 className="text-2xl font-bold text-white mb-1">Post New Offer</h3>
                      <p className="text-slate-400 text-sm">Create an attractive deal for nearby customers.</p>
                  </div>

                  <div className="flex bg-black/40 p-1 rounded-xl">
                      <button 
                      onClick={() => setDealType('standard')}
                      className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${dealType === 'standard' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                      >
                      Standard
                      </button>
                      <button 
                      onClick={() => setDealType('flash')}
                      className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${dealType === 'flash' ? 'bg-red-600 text-white shadow-red-900/50 shadow' : 'text-slate-400 hover:text-white'}`}
                      >
                      <Zap size={14} className="inline mr-1"/> Flash Sale
                      </button>
                  </div>

                  <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                           <div>
                              <label className="block text-xs font-medium text-slate-400 mb-1">Original Price</label>
                              <div className="relative">
                                  <IndianRupee size={14} className="absolute left-3 top-3.5 text-slate-500" />
                                  <input 
                                      type="number" 
                                      value={originalPrice}
                                      onChange={e => setOriginalPrice(e.target.value)}
                                      className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-blue-500"
                                      placeholder="0.00"
                                  />
                              </div>
                           </div>
                           <div>
                              <label className="block text-xs font-medium text-slate-400 mb-1">Offer Price</label>
                              <div className="relative">
                                  <IndianRupee size={14} className="absolute left-3 top-3.5 text-green-500" />
                                  <input 
                                      type="number" 
                                      value={offerPrice}
                                      onChange={e => setOfferPrice(e.target.value)}
                                      className="w-full pl-8 pr-4 py-3 bg-white/5 border border-green-500/50 rounded-xl text-green-400 outline-none focus:border-green-400 font-bold"
                                      placeholder="0.00"
                                  />
                              </div>
                           </div>
                      </div>

                      <div>
                           <label className="block text-xs font-medium text-slate-400 mb-1">Product Image URL</label>
                           <div className="flex gap-2">
                              <input 
                                  type="text" 
                                  value={productImage}
                                  onChange={e => setProductImage(e.target.value)}
                                  placeholder="https://..."
                                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-blue-500 text-sm"
                              />
                              <button className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                                  <Upload size={18} className="text-white" />
                              </button>
                           </div>
                      </div>

                      {dealType === 'flash' && (
                          <div className="flex items-center gap-2 text-red-300 text-xs bg-red-900/20 p-3 rounded-lg border border-red-500/20">
                              <Clock size={14} />
                              <span>Expires automatically in 60 minutes. High urgency!</span>
                          </div>
                      )}
                      
                      <button 
                          className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl font-bold text-white shadow-lg shadow-blue-900/30 hover:scale-[1.02] transition-transform"
                          onClick={() => { alert("Deal Published!"); onClose(); }}
                      >
                          Publish Deal
                      </button>
                  </div>
              </div>
          )}

          {/* === DELIVERY TAB === */}
          {activeTab === 'delivery' && (
              <div className="space-y-6 animate-in slide-in-from-right duration-300">
                  <div>
                      <h3 className="text-2xl font-bold text-white mb-1">Delivery & Payments</h3>
                      <p className="text-slate-400 text-sm">Configure how customers reach you.</p>
                  </div>

                  <div className="bg-white/5 border border-white/10 p-5 rounded-xl space-y-4">
                      <div className="flex justify-between items-center mb-2">
                          <span className="text-white font-medium flex items-center gap-2"><MapPin size={16} /> Delivery Radius</span>
                          <span className="text-blue-400 font-bold">{deliveryRadius} km</span>
                      </div>
                      <input 
                          type="range" 
                          min="1" 
                          max="20" 
                          value={deliveryRadius} 
                          onChange={(e) => setDeliveryRadius(parseInt(e.target.value))}
                          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                      <p className="text-xs text-slate-500">Customers within this range can see "Delivery Available".</p>
                  </div>

                  <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
                      <h4 className="text-white font-medium mb-4 flex items-center gap-2"><CreditCard size={16} /> Accepted Payment Modes</h4>
                      <div className="grid grid-cols-2 gap-3">
                          <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${paymentModes.upi ? 'bg-green-600/20 border-green-500/50' : 'bg-black/20 border-white/10'}`}>
                              <input type="checkbox" checked={paymentModes.upi} onChange={() => togglePayment('upi')} className="accent-green-500 w-4 h-4"/>
                              <span className="text-white text-sm">UPI / GPay</span>
                          </label>
                          <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${paymentModes.cash ? 'bg-green-600/20 border-green-500/50' : 'bg-black/20 border-white/10'}`}>
                              <input type="checkbox" checked={paymentModes.cash} onChange={() => togglePayment('cash')} className="accent-green-500 w-4 h-4"/>
                              <span className="text-white text-sm">Cash</span>
                          </label>
                          <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${paymentModes.card ? 'bg-green-600/20 border-green-500/50' : 'bg-black/20 border-white/10'}`}>
                              <input type="checkbox" checked={paymentModes.card} onChange={() => togglePayment('card')} className="accent-green-500 w-4 h-4"/>
                              <span className="text-white text-sm">Debit/Credit Card</span>
                          </label>
                      </div>
                  </div>
              </div>
          )}

          {/* === REVIEWS TAB === */}
          {activeTab === 'reviews' && (
              <div className="space-y-6 animate-in slide-in-from-right duration-300">
                  <div className="flex justify-between items-end">
                      <div>
                          <h3 className="text-2xl font-bold text-white mb-1">Customer Reviews</h3>
                          <p className="text-slate-400 text-sm">Feedback from verified buyers.</p>
                      </div>
                      <div className="text-right">
                           <div className="text-3xl font-bold text-white">4.8</div>
                           <div className="flex text-yellow-400 text-xs">★★★★★</div>
                      </div>
                  </div>

                  <div className="space-y-4">
                      {reviews.map((review) => (
                          <div key={review.id} className="bg-white/5 border border-white/10 p-4 rounded-xl">
                              <div className="flex justify-between items-start mb-2">
                                  <div className="flex items-center gap-2">
                                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
                                          {review.user.charAt(0)}
                                      </div>
                                      <div>
                                          <div className="text-white font-medium text-sm">{review.user}</div>
                                          <div className="flex text-yellow-400 text-[10px]">
                                              {Array.from({ length: review.rating }).map((_, i) => (
                                                  <span key={i}>★</span>
                                              ))}
                                          </div>
                                      </div>
                                  </div>
                                  <span className="text-xs text-slate-500">{review.date}</span>
                              </div>
                              <p className="text-slate-300 text-sm pl-10">"{review.comment}"</p>
                          </div>
                      ))}
                  </div>
              </div>
          )}

      </div>
    </div>
  );

  if (isPage) {
    return (
      <div className="w-full h-screen bg-slate-900">
        {Content}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 overflow-y-auto">
      {Content}
    </div>
  );
};
