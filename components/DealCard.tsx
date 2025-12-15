
import React, { useState } from 'react';
import { GroundingChunk } from '../types';
import { MapPin, Star, ExternalLink, Calendar, Car, Zap, Percent, Gift, Sparkles, Clock, Loader2, Share2, Image as ImageIcon, Map as MapIcon, Maximize2, X } from 'lucide-react';

interface DealCardProps {
  place: GroundingChunk;
  onBook: (placeName: string, placeUri?: string) => void;
  onRide: (placeName: string) => void;
}

export const DealCard: React.FC<DealCardProps> = ({ place, onBook, onRide }) => {
  const [isBooking, setIsBooking] = useState(false);
  const [isRiding, setIsRiding] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);

  const mapData = place.maps;
  
  if (!mapData || !mapData.title || !mapData.uri) return null;

  // Generate a consistent pseudo-random image based on the title
  const seed = mapData.title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const imageUrl = `https://picsum.photos/seed/${seed}/500/300`;

  // Deterministically assign a "Deal Type" based on the seed for demo purposes
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
    setTimeout(() => {
      onRide(mapData.title!);
      setIsRiding(false);
    }, 800);
  };

  const handleBookClick = () => {
      onBook(mapData.title!, mapData.uri);
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

  // Embed URL for the map
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(mapData.title || '')}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <>
      <div className="glass-panel rounded-2xl overflow-hidden flex flex-col h-full card-3d group border border-white/10 hover:border-white/30 bg-slate-900/40">
        <div className="relative h-52 w-full overflow-hidden bg-slate-800">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10" />
          
          {/* Placeholder / Loading State */}
          {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-800 animate-pulse z-0">
                  <ImageIcon className="text-slate-700 w-10 h-10" />
              </div>
          )}

          {/* Background Image with Lazy Loading & Transition */}
          <img 
            src={imageUrl} 
            alt={mapData.title} 
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover transform group-hover:scale-110 transition-all duration-700 filter brightness-90 group-hover:brightness-100 ${imageLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-xl'}`}
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

          {/* Interactive Map Snippet */}
          <div className="mb-4 relative rounded-xl overflow-hidden border border-white/10 group/map">
            <div className="h-20 w-full bg-slate-800 relative">
               <iframe 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                scrolling="no" 
                marginHeight={0} 
                marginWidth={0} 
                src={mapEmbedUrl}
                className="opacity-60 group-hover/map:opacity-100 transition-opacity grayscale group-hover/map:grayscale-0 pointer-events-none"
               ></iframe>
               <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/map:bg-transparent transition-colors">
                  <button 
                    onClick={() => setShowMapModal(true)}
                    className="flex items-center gap-2 bg-slate-900/80 hover:bg-black text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-sm transition-transform transform group-hover/map:scale-105"
                  >
                    <Maximize2 size={12} /> Expand Map
                  </button>
               </div>
            </div>
          </div>

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
                  Book Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Map Modal */}
      {showMapModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
           <div className="w-full max-w-4xl h-[80vh] bg-slate-900 rounded-3xl overflow-hidden relative shadow-2xl border border-white/20 flex flex-col">
              <div className="p-4 bg-slate-900 border-b border-white/10 flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-lg">
                      <MapIcon size={20} className="text-white" />
                    </div>
                    <h3 className="text-white font-bold text-lg">{mapData.title}</h3>
                 </div>
                 <button 
                  onClick={() => setShowMapModal(false)}
                  className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors"
                 >
                   <X size={24} />
                 </button>
              </div>
              <div className="flex-1 bg-slate-800 relative">
                 <iframe 
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    src={mapEmbedUrl}
                    allowFullScreen
                    className="w-full h-full"
                 ></iframe>
              </div>
           </div>
        </div>
      )}
    </>
  );
};
