import { useState, useEffect } from 'react';
import API from '../axios.js';
import PlanCard from '../components/Plancard';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [mySubs, setMySubs] = useState([]);
  const [myFollowing, setMyFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const plansRes = await API.get('/plans');
        setPlans(plansRes.data.plans);

        if (user) {
          const [subsRes, followRes] = await Promise.all([
            API.get('/subscriptions/my-subscriptions'),
            API.get('/follow/following')
          ]);
          setMySubs(subsRes.data.subscriptions);
          setMyFollowing(followRes.data.following);
        }
      } catch (err) {
        console.error("Error loading marketplace data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const checkSubscribed = (planId) => {
    return mySubs.some(sub => sub.plan._id === planId || sub.plan === planId);
  };

  const checkFollowing = (trainerId) => {
    return myFollowing.some(f => f.following._id === trainerId || f.following === trainerId);
  };

  if (loading) return <div className="p-10 text-center">Loading marketplace...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-12 py-10 bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl text-white shadow-lg">
        <h1 className="text-4xl font-bold mb-4">Find Your Perfect Fitness Plan</h1>
        <p className="text-blue-100 text-lg">Browse plans from top trainers and start your journey.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <PlanCard 
            key={plan._id} 
            plan={plan}
            initialSubscribed={checkSubscribed(plan._id)}
            initialFollowed={checkFollowing(plan.trainer._id || plan.trainer)}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;