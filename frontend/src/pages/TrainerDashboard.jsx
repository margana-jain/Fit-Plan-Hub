import { useState, useEffect } from 'react';
import API from '../axios.js';

const TrainerDashboard = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [editingPlan, setEditingPlan] = useState(null);

  const [formData, setFormData] = useState({
    title: '', description: '', price: '', duration: ''
  });

  useEffect(() => {
    const fetchMyPlans = async () => {
      try {
        const res = await API.get('/plans/my-plans');
        setPlans(res.data.plans);
        setLoading(false);
      } catch (err) {
        alert('Failed to load plans');
        setLoading(false);
      }
    };
    fetchMyPlans();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPlan) {
        const res = await API.patch(`/plans/${editingPlan._id}`, formData);
        
        setPlans(plans.map(p => (p._id === editingPlan._id ? res.data.plan : p)));
        alert('Plan updated successfully!');
        
        setEditingPlan(null);
      } else {
        // --- CREATE LOGIC ---
        const res = await API.post('/plans', formData);
        setPlans([...plans, res.data.plan]);
        alert('Plan created successfully!');
      }

      // Clear Form
      setFormData({ title: '', description: '', price: '', duration: '' });
      
    } catch (err) {
      alert(err.response?.data?.message || 'Operation failed');
    }
  };

  // 4. Load Data into Form for Editing
  const handleEditClick = (plan) => {
    setEditingPlan(plan);
    setFormData({
      title: plan.title,
      description: plan.description,
      price: plan.price,
      duration: plan.duration
    });
    // Scroll to top to see the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 5. Cancel Editing
  const handleCancelEdit = () => {
    setEditingPlan(null);
    setFormData({ title: '', description: '', price: '', duration: '' });
  };

  // 6. Delete Plan
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) return;
    try {
      await API.delete(`/plans/${id}`);
      setPlans(plans.filter((plan) => plan._id !== id));
    } catch (err) {
      alert('Failed to delete plan');
    }
  };

  if (loading) return <div className="text-center mt-10">Loading Dashboard...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Trainer Dashboard</h1>
        <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
          Trainer Mode
        </span>
      </div>
      
      {/* --- FORM SECTION (Dynamic: Create or Update) --- */}
      <div className={`p-6 rounded-lg shadow-md mb-10 border transition-colors ${editingPlan ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-gray-200'}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {editingPlan ? `Editing: "${editingPlan.title}"` : 'Create New Fitness Plan'}
          </h2>
          {editingPlan && (
            <button onClick={handleCancelEdit} className="text-sm text-red-600 underline">
              Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            type="text" name="title" placeholder="Plan Title" 
            value={formData.title} onChange={handleChange} required
            className="p-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input 
            type="number" name="price" placeholder="Price ($)" 
            value={formData.price} onChange={handleChange} required
            className="p-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input 
            type="number" name="duration" placeholder="Duration (Days)" 
            value={formData.duration} onChange={handleChange} required
            className="p-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <textarea 
            name="description" placeholder="Describe the workout plan..." 
            value={formData.description} onChange={handleChange} required
            className="p-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none md:col-span-2 h-24"
          />
          
          <button 
            type="submit" 
            className={`md:col-span-2 text-white font-bold py-3 rounded transition
              ${editingPlan ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {editingPlan ? 'Update Plan' : 'Publish Plan'}
          </button>
        </form>
      </div>

      {/* --- LIST SECTION --- */}
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Active Plans</h2>
      
      {plans.length === 0 ? (
        <p className="text-gray-500">You haven't created any plans yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan._id} className="bg-white border rounded-lg shadow-sm hover:shadow-md transition p-5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{plan.title}</h3>
                  <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">
                    ${plan.price}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{plan.description}</p>
                <div className="text-sm text-gray-500 mb-4">
                  Duration: <span className="font-semibold">{plan.duration} Days</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => handleEditClick(plan)}
                  className="flex-1 bg-yellow-50 text-yellow-700 border border-yellow-200 py-2 rounded hover:bg-yellow-100 transition text-sm font-semibold"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(plan._id)}
                  className="flex-1 bg-red-50 text-red-600 border border-red-200 py-2 rounded hover:bg-red-100 transition text-sm font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrainerDashboard;