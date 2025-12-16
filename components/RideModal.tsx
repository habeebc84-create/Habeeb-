
import React from 'react';
import { X, Car, Bike, Navigation, ExternalLink } from 'lucide-react';

interface RideModalProps {
  isOpen: boolean;
  onClose: () => void;
  destination: string;
}

export const RideModal: React.FC<RideModalProps> = ({ isOpen, onClose, destination }) => {
  if (!isOpen) return null;

  const handleBook = (service: 'rapido' | 'uber') => {
      let url = '';
      if (service === 'rapido') {
          // Rapido web doesn't support deep linking destination via URL parameters easily.
          // Fallback to main site.
          url = 'https://www.rapido.bike/';
      } else if (service === 'uber') {
           // Redirect to Uber Universal Link with pickup set to current location and drop-off to destination
           url = `https://m.uber.com/ul/?action=setPickup&pickup=my_location&drop[formatted_address]=${encodeURIComponent(destination)}`;
      }
      window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto" onClick={onClose} />
      
      {/* Modal Content */}
      <div className="glass-panel w-full sm:max-w-md bg-slate-900 rounded-t-3xl sm:rounded-3xl p-6 pointer-events-auto animate-in slide-in-from-bottom duration-300 border-t border-white/20 sm:border">
        <div className="flex justify-between items-start mb-6">
           <div>
             <h3 className="text-lg font-bold text-white">Choose a Ride</h3>
             <p className="text-sm text-slate-400 flex items-center gap-1 mt-1">
               <Navigation size={12} /> To: <span className="text-blue-400">{destination}</span>
             </p>
           </div>
           <button onClick={onClose} className="p-1 bg-white/10 rounded-full text-white"><X size={18} /></button>
        </div>

        <div className="space-y-3">
            {/* Rapido Option */}
            <div 
                onClick={() => handleBook('rapido')}
                className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center justify-between hover:bg-white/10 cursor-pointer transition-colors group relative overflow-hidden"
            >
                <div className="flex items-center gap-4 relative z-10">
                    <div className="bg-yellow-400 p-2 rounded-lg text-black">
                        <Bike size={24} />
                    </div>
                    <div>
                        <div className="font-bold text-white flex items-center gap-2">
                            Rapido Bike <ExternalLink size={12} className="text-slate-500"/>
                        </div>
                        <div className="text-xs text-green-400">Fastest • 3 mins away</div>
                    </div>
                </div>
                <div className="text-right relative z-10">
                    <div className="font-bold text-white text-lg">₹45</div>
                    <button className="text-xs bg-yellow-400 text-black px-2 py-1 rounded font-bold opacity-0 group-hover:opacity-100 transition-opacity">BOOK</button>
                </div>
            </div>

            {/* Uber Go Option */}
            <div 
                onClick={() => handleBook('uber')}
                className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center justify-between hover:bg-white/10 cursor-pointer transition-colors group relative overflow-hidden"
            >
                <div className="flex items-center gap-4 relative z-10">
                    <div className="bg-black border border-white/20 p-2 rounded-lg text-white">
                        <Car size={24} />
                    </div>
                    <div>
                        <div className="font-bold text-white flex items-center gap-2">
                            Uber Go <ExternalLink size={12} className="text-slate-500"/>
                        </div>
                        <div className="text-xs text-slate-400">AC Ride • 8 mins away</div>
                    </div>
                </div>
                <div className="text-right relative z-10">
                    <div className="font-bold text-white text-lg">₹120</div>
                    <button className="text-xs bg-white text-black px-2 py-1 rounded font-bold opacity-0 group-hover:opacity-100 transition-opacity">BOOK</button>
                </div>
            </div>

             {/* Auto Option - Mapping to Uber Auto for simplicity */}
             <div 
                onClick={() => handleBook('uber')}
                className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center justify-between hover:bg-white/10 cursor-pointer transition-colors group relative overflow-hidden"
            >
                <div className="flex items-center gap-4 relative z-10">
                    <div className="bg-green-600 p-2 rounded-lg text-white">
                        <Car size={24} />
                    </div>
                    <div>
                        <div className="font-bold text-white flex items-center gap-2">
                            Uber Auto <ExternalLink size={12} className="text-slate-500"/>
                        </div>
                        <div className="text-xs text-slate-400">Open Air • 5 mins away</div>
                    </div>
                </div>
                <div className="text-right relative z-10">
                    <div className="font-bold text-white text-lg">₹80</div>
                    <button className="text-xs bg-green-500 text-white px-2 py-1 rounded font-bold opacity-0 group-hover:opacity-100 transition-opacity">BOOK</button>
                </div>
            </div>
        </div>

        <div className="mt-6 text-center">
            <button 
                onClick={() => {
                    // Fallback to google maps directions
                    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`, '_blank');
                }}
                className="text-sm text-blue-400 hover:text-blue-300 underline"
            >
                Open in Google Maps
            </button>
        </div>
      </div>
    </div>
  );
};
