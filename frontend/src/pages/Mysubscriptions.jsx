import { useState, useEffect } from 'react';
import API from '../axios.js';

const MySubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubs = async () => {
      try {
        const res = await API.get('/subscriptions/my-subscriptions');
        setSubscriptions(res.data.subscriptions);
        console.log(res.data.subscriptions);
      } catch (err) {
        console.error("Error fetching subscriptions", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubs();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading subscriptions...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">My Subscriptions</h1>

      {subscriptions.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <p className="text-gray-500">You haven't subscribed to any plans yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subscriptions.map((sub) => (
            <div key={sub._id} className="bg-white border border-green-200 rounded-xl shadow-sm p-5 flex flex-col h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg">
                ACTIVE
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{sub.plan.title}</h3>
              <p className="text-sm text-gray-500 mb-4">
                Trainer: {sub.plan.trainer?.name || 'Unknown'}
              </p>
              
              <div className="mt-auto">
                <p className="text-gray-600 text-sm">{sub.plan.description || "No description."}</p>
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                   <span className="font-bold text-lg">${sub.plan.price}</span>
                   <span className="text-xs text-gray-400">{sub.plan.duration} Days Access</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MySubscriptions;