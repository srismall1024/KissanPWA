import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import FarmerDashboard from "./pages/FarmerDashboard";
import BuyerDashboard from "./pages/BuyerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import PaymentPage from "./pages/PaymentPage";
import Profile from "./pages/Profile";
import FarmerOrderSlips from "./components/FarmerOrderSlips";
import OperatorOrderSlips from "./components/OperatorOrderSlips";
import Prediction from "./pages/Prediction";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/farmer-dashboard"
          element={
            <ProtectedRoute allowedRole="farmer">
              <FarmerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/buyer-dashboard"
          element={
            <ProtectedRoute allowedRole="buyer">
              <BuyerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
    path="/payment"
    element={
        <ProtectedRoute allowedRole="buyer">
            <PaymentPage />
        </ProtectedRoute>
    }
/>
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRole="operator">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
    path="/profile"
    element={<Profile />}
/>
<Route
    path="/farmer-order-slips"
    element={
        <ProtectedRoute allowedRole="farmer">
            <FarmerOrderSlips />
        </ProtectedRoute>
    }
/>
<Route
    path="/operator-order-slips"
    element={
        <ProtectedRoute allowedRole="operator">
            <OperatorOrderSlips />
        </ProtectedRoute>
    }
/>
<Route
    path="/prediction"
    element={
        <ProtectedRoute allowedRole="farmer">
            <Prediction />
        </ProtectedRoute>
    }
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;