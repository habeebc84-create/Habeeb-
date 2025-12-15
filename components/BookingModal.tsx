
import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Users, Coffee, BedDouble, Utensils, CheckCircle, Loader2, Globe, ArrowRight, ExternalLink, Search, Zap, Scissors } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  placeName: string;
  placeUri?: string;
}

type BookingType = 'dining' | 'hotel' | 'resort' | 'appointment';

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, placeName, placeUri }) => {
  const [bookingType, setBookingType] = useState<BookingType>('appointment');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Search Aggregator State
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [providerIndex, setProviderIndex] = useState(0);

  // Form State
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(1);
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');

  const providers = ["Agoda", "Booking.com", "Expedia", "Hotels.com", "Trip.com", "MakeMyTrip", "Goibibo", "Trivago"];

  useEffect(() => {
    if ((bookingType === 'hotel' || bookingType === 'resort') && isOpen) {
        setIsSearching(true);
        setSearchResults([]);
        let step = 0;
        const interval = setInterval(() => {
            setProviderIndex(prev => (prev + 1) % providers.length);
            step++;
            if (step > 15) { // Stop after simulated scan
                clearInterval(interval);
                setIsSearching(false);
                setSearchResults([
                    { name: "Agoda", price: 4500 },
                    { name: "Booking.com", price: 4700 },
                    { name: "DealSpot Direct", price: 4200, isBest: true }
                ]);
            }
        }, 150);
        return () => clearInterval(interval);
    } else {
        setIsSearching(false);
    }
  }, [bookingType, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call to shop owner
    setTimeout(() => {
        setLoading(false);
        setSuccess(true);
    }, 1500);
  };

  if (success) {
      return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <div className="glass-panel max-w-sm w-full p-8 rounded-3xl text-center animate-in zoom-in duration-300 border border-green-500/30">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="text-green-400 w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Request Sent!</h3>
                <p className="text-slate-300 mb-6">
                    Your appointment request for <span className="text-blue-400 font-semibold">{placeName}</span> has been sent directly to the shop owner.
                </p>
                <div className="bg-white/5 rounded-xl p-4 text-sm text-slate-400 mb-6">
                    You will receive a confirmation SMS shortly.
                </div>
                <button 
                    onClick={() => { setSuccess(false); onClose(); }}
                    className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                    Done
                </button>
            </div>
        </div>
      );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="glass-panel w-full max-w-lg rounded-3xl overflow-hidden relative animate-in fade-in slide-in-from-bottom-10 duration-300 border border-white/20">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-900/50">
            <div>
                <h2 className="text-xl font-bold text-white">Book Appointment</h2>
                <p className="text-sm text-blue-400 font-medium truncate max-w-[250px]">{placeName}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors">
                <X size={20} />
            </button>
        </div>

        {/* Content */}
        <div className="p-6">
            {/* Type Selector */}
            <div className="flex gap-2 mb-6 bg-black/20 p-1 rounded-xl overflow-x-auto">
                <button 
                    onClick={() => setBookingType('appointment')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${bookingType === 'appointment' ? 'bg-pink-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                    <Scissors size={14} /> Salon/Shop
                </button>
                <button 
                    onClick={() => setBookingType('dining')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${bookingType === 'dining' ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                    <Utensils size={14} /> Dining
                </button>
                <button 
                    onClick={() => setBookingType('hotel')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${bookingType === 'hotel' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                    <BedDouble size={14} /> Hotel
                </button>
            </div>

            {/* Aggregator View for Hotels/Resorts */}
            {(bookingType === 'hotel' || bookingType === 'resort') && (
                <div className="mb-6">
                    {isSearching ? (
                        <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6 flex flex-col items-center justify-center gap-4 text-center">
                             {/* H-Letter Spinner */}
                             <div className="relative w-16 h-16 flex items-center justify-center spin-3d">
                                 <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">H</div>
                                 <div className="absolute inset-0 border-2 border-blue-500/30 rounded-full animate-ping"></div>
                             </div>
                             
                             <div>
                                <div className="text-sm font-bold text-white mb-1">Scanning 50+ websites...</div>
                                <div className="text-xs text-blue-300 bg-blue-500/10 px-3 py-1 rounded-full inline-block border border-blue-500/20">
                                    Checking {providers[providerIndex]}
                                </div>
                             </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                             <div className="space-y-2 mb-4">
                                {searchResults.map((result, idx) => (
                                    <div key={idx} className={`flex justify-between items-center p-3 rounded-xl border transition-all ${result.isBest ? 'bg-green-500/10 border-green-500/30 shadow-lg shadow-green-500/10' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                                        <div className="flex items-center gap-3">
                                            {result.name === 'DealSpot Direct' ? (
                                                <div className="bg-green-500/20 p-1.5 rounded-lg"><Zap size={16} className="text-green-400" /></div>
                                            ) : (
                                                <div className="bg-slate-700 p-1.5 rounded-lg"><Globe size={16} className="text-slate-300" /></div>
                                            )}
                                            
                                            <div>
                                                <div className="text-sm font-bold text-white">{result.name}</div>
                                                {result.isBest && <div className="text-[10px] text-green-400 font-bold uppercase tracking-wider">Lowest Price</div>}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="font-bold text-white">₹{result.price}</div>
                                            
                                            {result.name === 'DealSpot Direct' ? (
                                                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-500/20">
                                                    <CheckCircle size={16} className="text-green-400" />
                                                </div>
                                            ) : (
                                                <a 
                                                    href={`https://www.google.com/search?q=${encodeURIComponent('Book ' + placeName + ' on ' + result.name)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 transition-colors"
                                                    title={`View on ${result.name}`}
                                                >
                                                    <Search size={14} className="text-blue-400" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                             
                             {placeUri && (
                                 <a 
                                    href={placeUri} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="block bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-3 transition-colors group"
                                 >
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-blue-600 p-2 rounded-lg"><Globe size={18} className="text-white"/></div>
                                            <div>
                                                <div className="font-medium text-white group-hover:text-blue-400 transition-colors">Compare on Google Hotels</div>
                                                <div className="text-xs text-slate-400">View real-time prices from Agoda, Booking.com...</div>
                                            </div>
                                        </div>
                                        <ExternalLink size={16} className="text-slate-500 group-hover:text-white" />
                                    </div>
                                 </a>
                             )}
                        </div>
                    )}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                     <div className="h-px bg-white/10 flex-1"></div>
                     <span>
                        {bookingType === 'dining' ? 'Reserve Table' : 
                         bookingType === 'appointment' ? 'Direct Appointment' : 'Book Directly'}
                     </span>
                     <div className="h-px bg-white/10 flex-1"></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1"><Calendar size={12}/> Date</label>
                        <input 
                            type="date" 
                            required
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors [color-scheme:dark]" 
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1"><Clock size={12}/> Time</label>
                        <input 
                            type="time" 
                            required
                            value={time}
                            onChange={e => setTime(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors [color-scheme:dark]" 
                        />
                    </div>
                </div>

                <div>
                     <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1"><Users size={12}/> {bookingType === 'appointment' ? 'People' : 'Guests'}</label>
                     <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-2">
                        <input 
                            type="range" 
                            min="1" 
                            max={bookingType === 'appointment' ? 5 : 20} 
                            value={guests} 
                            onChange={e => setGuests(parseInt(e.target.value))}
                            className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 ml-2"
                        />
                        <span className="w-12 text-center font-bold text-white bg-white/10 rounded-lg py-1">{guests}</span>
                     </div>
                </div>

                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Your Name</label>
                    <input 
                        type="text" 
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors" 
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">
                        {bookingType === 'appointment' ? 'Service / Style Requirements' : 'Special Requests'}
                    </label>
                    <textarea 
                        rows={2}
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        placeholder={bookingType === 'appointment' ? "Haircut, Beard Trim, Facial..." : "Window seat, anniversary, dietary needs..."}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors resize-none" 
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className={`w-full py-4 rounded-xl font-bold text-white shadow-lg mt-4 flex items-center justify-center gap-2 transition-all
                        ${bookingType === 'dining' ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:shadow-orange-500/30' : ''}
                        ${bookingType === 'hotel' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-blue-500/30' : ''}
                        ${bookingType === 'appointment' ? 'bg-gradient-to-r from-pink-600 to-purple-600 hover:shadow-pink-500/30' : ''}
                        ${bookingType === 'resort' ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-emerald-500/30' : ''}
                    `}
                >
                    {loading ? <Loader2 className="animate-spin" /> : 
                        bookingType === 'appointment' ? 'Request Appointment' : 'Confirm Booking'
                    }
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};
