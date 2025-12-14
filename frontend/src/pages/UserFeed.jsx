import { useState, useEffect } from 'react';
import API from '../axios.js';
import PlanCard from '../components/Plancard';

const UserFeed = () => {
  const [plans, setPlans] = useState([]);
  const [mySubs, setMySubs] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [feedRes, subsRes] = await Promise.all([
          API.get('/plans/feed'),
          API.get('/subscriptions/my-subscriptions')
        ]);

        setPlans(feedRes.data.plans);
        setMySubs(subsRes.data.subscriptions);

      } catch (err) {
        console.error("Error fetching feed data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const checkSubscribed = (planId) => {
    return mySubs.some(sub => sub.plan._id === planId || sub.plan === planId);
  };

  if (loading) return <div className="p-10 text-center">Loading your personalized feed...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800">Your Personalized Feed</h1>
        <p className="text-gray-500 mt-2">Latest updates from trainers you follow.</p>
      </div>

      {plans.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <h3 className="text-xl text-gray-600 mb-2">Your feed is empty!</h3>
          <p className="text-gray-500">
            Go to the <a href="/" className="text-blue-600 underline">Home Page</a> to find and follow trainers.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <PlanCard 
              key={plan._id} 
              plan={plan}
              initialSubscribed={checkSubscribed(plan._id)}
              initialFollowed={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserFeed;