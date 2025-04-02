import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import TherapistDashboard from "./components/TherapistDashboard";
import Login from "./components/Login";
import Signup from "./components/Signup";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/therapist-dashboard" 
            element={
              <PrivateRoute>
                <TherapistDashboard />
              </PrivateRoute>
            } 
          />
          <Route path="*" element={<Login />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;