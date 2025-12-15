
import React, { useState } from 'react';
import { GroundingChunk } from '../types';
import { MapPin, Star, ExternalLink, Calendar, Car, Zap, Percent, Gift, Sparkles, Clock, Loader2, Share2 } from 'lucide-react';

interface DealCardProps {
  place: GroundingChunk;
  onBook: (placeName: string) => void;
  onRide: (placeName: string) => void;
}

export const DealCard: React.FC<DealCardProps> = ({ place, onBook, onRide }) => {
  const [isBooking, setIsBooking] = useState(false);
  const [isRiding, setIsRiding] = useState(false);

  const mapData = place.maps;
  
  if (!mapData || !mapData.title || !mapData.uri) return null;

  // Generate a consistent pseudo-random image based on the title
  const seed = mapData.title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const imageUrl = `https://picsum.photos/seed/${seed}/500/300`;

  // Deterministically assign a "Deal Type" based on the seed for demo purposes
  // In a real app, this would come from the backend/AI response per item
  const dealTypes = [
    { label: '50% OFF', sub: 'Limited Time', icon: Percent, gradient: 'from-blue-600 via-indigo-600 to-blue-600', shadow: 'shadow-blue-500/40' },
    { label: 'BUY 1 GET 1', sub: 'Free', icon: Gift, gradient: 'from-purple-600 via-pink-600 to-purple-600', shadow: 'shadow-pink-500/40' },
    { label: 'FLASH DEAL', sub: 'Ends Soon', icon: Zap, gradient: 'from-red-600 via-orange-500 to-red-600', shadow: 'shadow-red-500/40' },
    { label: 'FREE DRINK', sub: 'With Order', icon: Sparkles, gradient: 'from-emerald-500 via-teal-500 to-emerald-500', shadow: 'shadow-emerald-500/40' },
    { label: 'LAST MINUTE', sub: '2 Spots Left', icon: Clock, gradient: 'from-amber-500 via-yellow-500 to-amber-500', shadow: 'shadow-amber-500/40' },
  ];
  
  const deal = dealTypes[seed % dealTypes.length];
  const DealIcon = deal.icon;

  const handleRideClick = () => {
    if (isRiding) return;
    setIsRiding(true);
    // Simulate loading/preparing ride options
    setTimeout(() => {
      onRide(mapData.title!);
      setIsRiding(false);
    }, 1000);
  };

  const handleBookClick = () => {
    if (isBooking) return;
    setIsBooking(true);
    // Simulate booking request
    setTimeout(() => {
      onBook(mapData.title!);
      setIsBooking(false);
    }, 1000);
  };

  const handleShare = async () => {
    const shareData = {
      title: `Deal at ${mapData.title}`,
      text: `Check out this deal: ${deal.label} (${deal.sub}) at ${mapData.title}!`,
      url: mapData.uri || window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <div className="glass-panel rounded-2xl overflow-hidden flex flex-col h-full card-3d group border border-white/10 hover:border-white/30">
      <div className="relative h-52 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10" />
        
        {/* Background Image with Zoom Effect */}
        <img 
          src={imageUrl} 
          alt={mapData.title} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 filter brightness-90 group-hover:brightness-100"
        />
        
        {/* Dynamic Deal Badge */}
        <div className="absolute top-4 right-4 z-20">
          <div className="relative group/badge">
            <div className={`absolute inset-0 bg-gradient-to-r ${deal.gradient} rounded-xl blur opacity-60 group-hover/badge:opacity-100 transition-opacity duration-500`}></div>
            <div className={`relative bg-gradient-to-r ${deal.gradient} text-white p-1 pr-3 rounded-xl shadow-lg ${deal.shadow} flex items-center gap-2 border border-white/20 overflow-hidden`}>
              <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
                <DealIcon size={16} className="text-white fill-white/20" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xs font-bold tracking-wider">{deal.label}</span>
                <span className="text-[10px] opacity-90 font-medium">{deal.sub}</span>
              </div>
              
              {/* Shimmer Effect */}
              <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover/badge:animate-shiny" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow relative z-20 -mt-6">
        {/* Title Card */}
        <div className="glass-panel bg-slate-900/60 backdrop-blur-xl rounded-xl p-4 mb-4 border border-white/10 shadow-xl">
           <h3 className="text-lg font-bold text-white mb-1 line-clamp-1 text-glow tracking-wide">{mapData.title}</h3>
           <div className="flex items-center text-slate-300 text-xs font-medium">
            <MapPin size={12} className="mr-1 text-blue-400" />
            <span className="line-clamp-1 opacity-80">0.8 miles away • Open Now</span>
          </div>
        </div>

        {mapData.placeAnswerSources?.reviewSnippets && mapData.placeAnswerSources.reviewSnippets.length > 0 && (
          <div className="mb-4 bg-white/5 p-3 rounded-lg border border-white/5 backdrop-blur-sm group-hover:bg-white/10 transition-colors">
            <div className="flex items-start">
              <Star size={12} className="text-yellow-400 mt-1 mr-2 flex-shrink-0 fill-current" />
              <p className="text-xs text-slate-300 italic line-clamp-2 leading-relaxed">
                "{mapData.placeAnswerSources.reviewSnippets[0].content}"
              </p>
            </div>
          </div>
        )}

        <div className="mt-auto space-y-2">
           {/* Ride Button */}
           <button 
            onClick={handleRideClick}
            disabled={isRiding}
            className="w-full flex items-center justify-center px-3 py-2.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 font-bold text-sm rounded-xl hover:brightness-110 transition-all shadow-lg shadow-orange-500/20 active:scale-95 disabled:opacity-80 disabled:cursor-wait"
          >
            {isRiding ? (
                <Loader2 size={16} className="mr-2 animate-spin text-slate-900" />
            ) : (
                <Car size={16} className="mr-2" />
            )}
            {isRiding ? 'Finding Rides...' : 'Ride There'}
          </button>

          <div className="flex gap-2">
            <a 
                href={mapData.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm font-medium rounded-xl transition-all flex items-center justify-center"
                title="Open in Maps"
            >
                <ExternalLink size={18} />
            </a>

            <button
                onClick={handleShare}
                className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm font-medium rounded-xl transition-all flex items-center justify-center"
                title="Share Deal"
            >
                <Share2 size={18} />
            </button>

            <button 
                onClick={handleBookClick}
                disabled={isBooking}
                className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white border border-blue-500/50 text-sm font-medium rounded-xl transition-all shadow-lg shadow-blue-600/20 disabled:opacity-80 disabled:cursor-wait"
            >
                {isBooking ? (
                    <Loader2 size={16} className="mr-2 animate-spin text-white" />
                ) : (
                    <Calendar size={16} className="mr-2" />
                )}
                {isBooking ? 'Booking...' : 'Book Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
