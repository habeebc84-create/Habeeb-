
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Loader2, Navigation, ShoppingBag, Info, LogOut, Menu, Zap, LayoutGrid, Star, ArrowRight, User, Building2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { searchDeals } from './services/geminiService';
import { DealResult, LocationState } from './types';
import { DealCard } from './components/DealCard';
import { SenderModal } from './components/SenderModal';
import { RideModal } from './components/RideModal';
import { ReviewSection } from './components/ReviewSection';

// High quality realistic images for the landing page
const SHOPPER_LANDING_IMAGES = [
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1573855619003-97b4799dcd8b?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=1600&auto=format&fit=crop"
];

const SELLER_LANDING_IMAGES = [
    "https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1472851294608-415105022054?q=80&w=1600&auto=format&fit=crop"
];

type AppView = 'landing' | 'shopper' | 'seller_dashboard' | 'reviews';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('landing');
  
  // Search State
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState<LocationState | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DealResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Modals state
  const [rideModalConfig, setRideModalConfig] = useState<{isOpen: boolean, dest: string}>({ isOpen: false, dest: '' });
  
  // Image Rotation State (Every 1 minute)
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    // Rotate images every 1 minute (60000ms)
    const interval = setInterval(() => {
      setImageIndex((prev) => prev + 1);
    }, 60000); 
    
    return () => clearInterval(interval);
  }, []);

  const currentShopperImage = SHOPPER_LANDING_IMAGES[imageIndex % SHOPPER_LANDING_IMAGES.length];
  const currentSellerImage = SELLER_LANDING_IMAGES[imageIndex % SELLER_LANDING_IMAGES.length];

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => {
          console.warn("Location access denied or failed", err);
          setLocationError("Enable location");
        }
      );
    } else {
      setLocationError("No Geolocation");
    }
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const data = await searchDeals(query, location);
      setResult(data);
    } catch (err) {
      setError("Failed to fetch deals.");
    } finally {
      setLoading(false);
    }
  };

  const handleBook = (placeName: string) => {
    alert(`Booking initiated for ${placeName}!`);
  };

  const handleRide = (placeName: string) => {
    setRideModalConfig({ isOpen: true, dest: placeName });
  };

  const handleLogout = () => {
    setView('landing');
    setResult(null);
    setQuery('');
  };

  // --- RENDER: LANDING PAGE ---
  if (view === 'landing') {
    return (
      <div className="h-screen w-screen overflow-hidden flex flex-col md:flex-row relative bg-black">
        {/* SHOPPER SIDE */}
        <div 
          onClick={() => setView('shopper')}
          className="relative flex-1 h-1/2 md:h-full cursor-pointer group landing-card overflow-hidden perspective-1000"
        >
           {/* Background Image with Slow Zoom */}
           <img 
              key={`shopper-${imageIndex}`} // Key change triggers animation
              src={currentShopperImage} 
              alt="Shopper Background" 
              className="absolute inset-0 w-full h-full object-cover animate-in fade-in duration-1000 transform scale-100 group-hover:scale-110 transition-transform duration-[20s] ease-linear"
           />
           {/* Glass Overlay */}
           <div className="absolute inset-0 bg-blue-900/60 backdrop-blur-[2px] group-hover:bg-blue-900/40 transition-all duration-700" />
           <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80" />

           {/* 3D Floating Content */}
           <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 preserve-3d">
              <div className="icon-3d-container floating-3d mb-6 relative">
                 <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-30 rounded-full" />
                 <div className="relative bg-white/10 backdrop-blur-xl border border-white/30 p-8 rounded-3xl shadow-2xl shadow-blue-500/30 transform transition-transform group-hover:rotate-y-12">
                    <User size={64} className="text-white drop-shadow-lg" />
                 </div>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-glow transform translate-z-10 group-hover:translate-y-[-10px] transition-transform">
                I am a Shopper
              </h2>
              <p className="text-blue-100 max-w-sm text-lg font-light opacity-80 group-hover:opacity-100 transition-opacity">
                Discover hidden local gems, exclusive deals, and book rides instantly.
              </p>
              
              <div className="mt-8 px-8 py-3 bg-white/20 backdrop-blur-md border border-white/40 rounded-full text-white font-bold flex items-center gap-2 group-hover:bg-white group-hover:text-blue-900 transition-all shadow-lg hover:shadow-blue-500/50">
                Enter Marketplace <ArrowRight size={18} />
              </div>
           </div>
        </div>

        {/* SELLER SIDE */}
        <div 
          onClick={() => setView('seller_dashboard')}
          className="relative flex-1 h-1/2 md:h-full cursor-pointer group landing-card overflow-hidden perspective-1000 border-t md:border-t-0 md:border-l border-white/20"
        >
           {/* Background Image with Slow Zoom */}
           <img 
              key={`seller-${imageIndex}`}
              src={currentSellerImage} 
              alt="Seller Background" 
              className="absolute inset-0 w-full h-full object-cover animate-in fade-in duration-1000 transform scale-100 group-hover:scale-110 transition-transform duration-[20s] ease-linear"
           />
           {/* Glass Overlay */}
           <div className="absolute inset-0 bg-emerald-900/60 backdrop-blur-[2px] group-hover:bg-emerald-900/40 transition-all duration-700" />
           <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80" />

           {/* 3D Floating Content */}
           <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 preserve-3d">
              <div className="icon-3d-container floating-3d mb-6 relative" style={{ animationDelay: '0.5s' }}>
                 <div className="absolute inset-0 bg-emerald-500 blur-3xl opacity-30 rounded-full" />
                 <div className="relative bg-white/10 backdrop-blur-xl border border-white/30 p-8 rounded-3xl shadow-2xl shadow-emerald-500/30 transform transition-transform group-hover:rotate-y-[-12deg]">
                    <Building2 size={64} className="text-white drop-shadow-lg" />
                 </div>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-glow transform translate-z-10 group-hover:translate-y-[-10px] transition-transform">
                I am a Seller
              </h2>
              <p className="text-emerald-100 max-w-sm text-lg font-light opacity-80 group-hover:opacity-100 transition-opacity">
                Manage your shop, post flash deals, and reach customers nearby.
              </p>

              <div className="mt-8 px-8 py-3 bg-white/20 backdrop-blur-md border border-white/40 rounded-full text-white font-bold flex items-center gap-2 group-hover:bg-white group-hover:text-emerald-900 transition-all shadow-lg hover:shadow-emerald-500/50">
                Manage Shop <ArrowRight size={18} />
              </div>
           </div>
        </div>
        
        {/* Center Logo */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
          <div className="bg-black/50 backdrop-blur-lg border border-white/10 p-4 rounded-full shadow-2xl">
            <ShoppingBag className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER: SELLER DASHBOARD ---
  if (view === 'seller_dashboard') {
    return <SenderModal isOpen={true} onClose={handleLogout} isPage={true} />;
  }

  // --- RENDER: SHOPPER VIEW ---
  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-pink-500 selection:text-white pb-20">
      {/* Navigation */}
      <nav className="glass-panel sticky top-4 mx-4 rounded-2xl z-40 mt-4 border border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2" onClick={handleLogout} role="button">
              <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-lg">
                <ShoppingBag className="text-white h-6 w-6" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white hidden sm:block">DealSpot</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 text-xs font-medium text-slate-300">
                <MapPin size={12} className="text-emerald-400" />
                {locationError ? locationError : "Using GPS Location"}
              </div>

              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setView('reviews')} 
                  className={`p-2 rounded-xl transition-colors ${view === 'reviews' ? 'bg-white/20 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
                >
                  <Star size={20} />
                </button>
                <button 
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="Logout / Exit"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {view === 'reviews' ? (
          <ReviewSection />
        ) : (
          <div className="space-y-8">
             {/* Search Hero */}
             <div className="text-center space-y-4 max-w-2xl mx-auto mb-12">
               <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
                  Find the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-500">best deals</span> nearby.
               </h1>
               
               <form onSubmit={handleSearch} className="relative group">
                 <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-pink-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
                 <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                     <Search className="h-5 w-5 text-slate-400" />
                   </div>
                   <input
                     type="text"
                     className="block w-full pl-12 pr-4 py-4 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all shadow-xl"
                     placeholder="Search for 'coffee deals', 'gym offers', 'spa discounts'..."
                     value={query}
                     onChange={(e) => setQuery(e.target.value)}
                   />
                   <button 
                    type="submit" 
                    className="absolute right-2 top-2 bottom-2 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors flex items-center"
                    disabled={loading}
                   >
                     {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Search"}
                   </button>
                 </div>
               </form>
             </div>

             {/* Results Grid */}
             {error && (
               <div className="glass-panel border-red-500/20 bg-red-500/5 p-4 rounded-xl text-red-200 text-center">
                 {error}
               </div>
             )}

             {result && (
               <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                 {result.places.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {result.places.map((place, index) => (
                        <DealCard 
                          key={index} 
                          place={place} 
                          onBook={handleBook}
                          onRide={handleRide}
                        />
                      ))}
                    </div>
                 ) : (
                    <div className="text-center py-12">
                       <Info className="mx-auto h-12 w-12 text-slate-500 mb-4" />
                       <h3 className="text-lg font-medium text-white">No local deals found</h3>
                       <p className="text-slate-400">Try searching for a different category or area.</p>
                       <div className="mt-6 bg-white/5 p-6 rounded-xl text-left max-w-2xl mx-auto border border-white/10">
                          <h4 className="text-sm font-bold text-blue-400 mb-2 uppercase tracking-wider">AI Insight</h4>
                          <ReactMarkdown className="prose prose-invert prose-sm max-w-none text-slate-300">
                            {result.text}
                          </ReactMarkdown>
                       </div>
                    </div>
                 )}
               </div>
             )}
          </div>
        )}
      </main>

      {/* Ride Modal */}
      <RideModal 
        isOpen={rideModalConfig.isOpen}
        onClose={() => setRideModalConfig({ ...rideModalConfig, isOpen: false })}
        destination={rideModalConfig.dest}
      />
    </div>
  );
};

export default App;
