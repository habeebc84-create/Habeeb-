
import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Users, CheckCircle, Loader2, Globe, ExternalLink } from 'lucide-react';

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
  
  // Form State
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // Simple heuristic to guess type based on name
  useEffect(() => {
    const lowerName = placeName.toLowerCase();
    if (lowerName.includes('hotel') || lowerName.includes('inn') || lowerName.includes('lodge') || lowerName.includes('stay')) {
        setBookingType('hotel');
    } else if (lowerName.includes('resort') || lowerName.includes('villa') || lowerName.includes('retreat')) {
        setBookingType('resort');
    } else if (lowerName.includes('cafe') || lowerName.includes('restaurant') || lowerName.includes('bistro') || lowerName.includes('bar') || lowerName.includes('kitchen')) {
        setBookingType('dining');
    } else {
        setBookingType('appointment');
    }
  }, [placeName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
        setLoading(false);
        setSuccess(true);
    }, 1500);
  };

  const handleExternalBooking = (platform: string) => {
      const query = encodeURIComponent(placeName);
      let url = '';
      
      switch (platform) {
          case 'google':
              url = `https://www.google.com/travel/hotels?q=${query}`;
              break;
          case 'booking':
              url = `https://www.booking.com/searchresults.html?ss=${query}`;
              break;
          case 'agoda':
              url = `https://www.agoda.com/search?text=${query}`;
              break;
          case 'mmt':
              url = `https://www.makemytrip.com/hotels/hotel-listing/?searchText=${query}`; 
              break;
      }
      
      if (url) window.open(url, '_blank');
  };

  if (!isOpen) return null;

  const isHotelOrResort = bookingType === 'hotel' || bookingType === 'resort';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-lg rounded-2xl bg-slate-900 border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex justify-between items-center bg-white/5">
            <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    {success ? <CheckCircle className="text-green-500" /> : <Calendar className="text-blue-500" />}
                    {success ? 'Booking Confirmed' : 'Request Booking'}
                </h2>
                <p className="text-sm text-slate-400 mt-1">at <span className="text-blue-300 font-semibold">{placeName}</span></p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors">
                <X size={20} />
            </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-6">
            {!success ? (
                <>
                    {/* Booking Type Selector */}
                    <div className="flex bg-black/40 p-1 rounded-xl">
                        {(['dining', 'hotel', 'resort', 'appointment'] as BookingType[]).map((type) => (
                            <button
                                key={type}
                                onClick={() => setBookingType(type)}
                                className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all capitalize ${bookingType === type ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>

                    {/* === External Booking Links for Hotels === */}
                    {isHotelOrResort && (
                        <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 animate-in slide-in-from-top duration-300">
                            <h3 className="text-sm font-bold text-blue-200 mb-3 flex items-center gap-2">
                                <Globe size={16} /> Instant Online Booking
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                <button 
                                    onClick={() => handleExternalBooking('google')}
                                    className="flex items-center justify-center gap-2 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group"
                                >
                                    <span className="font-bold text-white text-sm">Google</span>
                                    <ExternalLink size={12} className="text-slate-400 group-hover:text-white" />
                                </button>
                                <button 
                                    onClick={() => handleExternalBooking('booking')}
                                    className="flex items-center justify-center gap-2 p-3 bg-[#003580]/80 hover:bg-[#003580] border border-white/10 rounded-xl transition-all shadow-lg"
                                >
                                    <span className="font-bold text-white text-sm">Booking.com</span>
                                </button>
                                <button 
                                    onClick={() => handleExternalBooking('agoda')}
                                    className="flex items-center justify-center gap-2 p-3 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-xl transition-all"
                                >
                                    <span className="font-bold text-white text-sm">Agoda</span>
                                </button>
                                <button 
                                    onClick={() => handleExternalBooking('mmt')}
                                    className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-red-600 to-red-500 hover:brightness-110 border border-white/10 rounded-xl transition-all"
                                >
                                    <span className="font-bold text-white text-sm">MakeMyTrip</span>
                                </button>
                            </div>
                            <div className="flex items-center gap-2 mt-4 text-[10px] text-slate-400 justify-center uppercase tracking-widest font-semibold">
                                <div className="h-px bg-white/10 flex-1"></div>
                                OR CONTACT PROPERTY
                                <div className="h-px bg-white/10 flex-1"></div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Date</label>
                                <div className="relative">
                                    <Calendar size={14} className="absolute left-3 top-3.5 text-slate-500" />
                                    <input 
                                        type="date" 
                                        required
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full pl-9 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-blue-500 text-sm [color-scheme:dark]"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Time</label>
                                <div className="relative">
                                    <Clock size={14} className="absolute left-3 top-3.5 text-slate-500" />
                                    <input 
                                        type="time" 
                                        required
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        className="w-full pl-9 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-blue-500 text-sm [color-scheme:dark]"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">
                                {isHotelOrResort ? 'Guests' : 'Party Size'}
                            </label>
                            <div className="relative">
                                <Users size={14} className="absolute left-3 top-3.5 text-slate-500" />
                                <select 
                                    value={guests}
                                    onChange={(e) => setGuests(parseInt(e.target.value))}
                                    className="w-full pl-9 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-blue-500 text-sm appearance-none"
                                >
                                    {[1,2,3,4,5,6,7,8,9,10].map(num => (
                                        <option key={num} value={num} className="bg-slate-900">{num} People</option>
                                    ))}
                                    <option value="11" className="bg-slate-900">10+ Group</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-4 pt-2 border-t border-white/10">
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Your Name</label>
                                <input 
                                    type="text" 
                                    required
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-blue-500 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Phone Number</label>
                                <input 
                                    type="tel" 
                                    required
                                    placeholder="+91 98765 43210"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-blue-500 text-sm"
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl font-bold text-white shadow-lg shadow-blue-900/30 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Send Request'}
                        </button>
                    </form>
                </>
            ) : (
                <div className="text-center py-10 animate-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/50">
                        <CheckCircle size={40} className="text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Request Sent!</h3>
                    <p className="text-slate-400 mb-8 max-w-xs mx-auto">
                        We've sent your request to <strong>{placeName}</strong>. You will receive a confirmation call or SMS shortly.
                    </p>
                    <button 
                        onClick={onClose}
                        className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-white font-medium transition-colors"
                    >
                        Close
                    </button>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};
