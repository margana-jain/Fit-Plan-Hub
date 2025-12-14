import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/TrainerDashboard';
import Feed from './pages/UserFeed';
import Home from './pages/Home';
import MySubscriptions from './pages/Mysubscriptions'; 

function App() {
  return (
    <Router>
      <Navbar /> 
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/trainer-dashboard" element={<Dashboard />} />
          <Route path="/my-subscriptions" element={<MySubscriptions />} />
          <Route path="/feed" element={<Feed />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;