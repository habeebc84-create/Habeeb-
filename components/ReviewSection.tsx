
import React, { useState } from 'react';
import { Star, Send, ThumbsUp } from 'lucide-react';

export const ReviewSection: React.FC = () => {
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="text-center py-16 animate-in fade-in zoom-in duration-500">
                <div className="bg-green-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/50">
                    <ThumbsUp size={40} className="text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Thanks for the feedback!</h3>
                <p className="text-slate-400 mt-2">We appreciate your help in making DealSpot better.</p>
                <button 
                    onClick={() => {
                        setSubmitted(false);
                        setReview('');
                        setRating(0);
                    }} 
                    className="mt-6 text-blue-400 hover:text-blue-300 underline"
                >
                    Write another review
                </button>
            </div>
        );
    }

    return (
        <div className="glass-panel p-8 rounded-2xl max-w-2xl mx-auto border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-2 text-center">Rate Your Experience</h2>
            <p className="text-slate-400 text-center mb-8">Tell us about the deals you found today.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex justify-center gap-2 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="transition-transform hover:scale-110 focus:outline-none"
                        >
                            <Star 
                                size={32} 
                                className={`${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-600'} transition-colors`} 
                            />
                        </button>
                    ))}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Your Review</label>
                    <textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder="Was the location easy to find? Was the deal valid?"
                        className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none h-32 resize-none"
                        required
                    />
                </div>

                <button 
                    type="submit"
                    disabled={rating === 0}
                    className="w-full bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold py-4 rounded-xl shadow-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    <Send size={18} />
                    Submit Review
                </button>
            </form>
        </div>
    );
};
