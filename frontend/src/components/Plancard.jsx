
import { useState, useEffect } from 'react';
import API from '../axios.js';
import { useAuth } from '../context/AuthContext';

const PlanCard = ({ plan, initialSubscribed = false, initialFollowed = false }) => {
  const { user } = useAuth(); // Get current user
  
  const [isSubscribed, setIsSubscribed] = useState(initialSubscribed);
  const [isFollowing, setIsFollowing] = useState(initialFollowed);
  const [loading, setLoading] = useState({ sub: false, follow: false });

  const trainerId = plan.trainer._id || plan.trainer;
  
  const isOwner = user?.user?.userId === trainerId;

  const handleSubscribe = async () => {
    if (isSubscribed || isOwner) return;
    if (!window.confirm(`Confirm subscription to ${plan.title} for $${plan.price}?`)) return;
    
    setLoading(prev => ({ ...prev, sub: true }));
    try {
      await API.post('/subscriptions', { planId: plan._id });
      setIsSubscribed(true);
    } catch (err) {
      if (err.response?.status === 400) setIsSubscribed(true); 
      else alert(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(prev => ({ ...prev, sub: false }));
    }
  };

  const handleFollow = async () => {
    if (isFollowing || isOwner) return;
    setLoading(prev => ({ ...prev, follow: true }));
    try {
      await API.post('/follow', { trainerId });
      setIsFollowing(true);
    } catch (err) {
       if (err.response?.status === 400) setIsFollowing(true);
       else alert(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(prev => ({ ...prev, follow: false }));
    }
  };

  if (isOwner) {
    return (
      <div className="bg-white border-2 border-blue-100 rounded-xl shadow-sm p-5 flex flex-col h-full opacity-75">
        <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-bold text-gray-900">{plan.title} (You)</h3>
            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">Owner</span>
        </div>
        <p className="text-gray-500 text-sm">You created this plan.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition p-5 flex flex-col h-full">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{plan.title}</h3>
          <p className="text-sm text-gray-500">
            by <span className="font-semibold text-blue-600">{plan.trainer.name || 'Trainer'}</span>
          </p>
        </div>
        <span className="bg-green-100 text-green-800 text-sm font-bold px-2 py-1 rounded">
          ${plan.price}
        </span>
      </div>

      <div className="flex-grow">
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {plan.description || "Subscribe to view details."}
        </p>
        <div className="text-xs text-gray-400 mb-4">Duration: {plan.duration} Days</div>
      </div>

      <div className="flex gap-2 mt-auto pt-4 border-t border-gray-100">
        <button 
          onClick={handleSubscribe}
          disabled={isSubscribed || loading.sub}
          className={`flex-1 text-sm font-semibold py-2 rounded transition text-white
            ${isSubscribed ? 'bg-green-600 cursor-default' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {loading.sub ? '...' : isSubscribed ? 'Subscribed ✓' : 'Subscribe'}
        </button>

        <button 
          onClick={handleFollow}
          disabled={isFollowing || loading.follow}
          className={`flex-1 text-sm font-semibold py-2 rounded transition
            ${isFollowing ? 'bg-gray-200 text-gray-500 cursor-default' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          {loading.follow ? '...' : isFollowing ? 'Following' : 'Follow'}
        </button>
      </div>
    </div>
  );
};

export default PlanCard;