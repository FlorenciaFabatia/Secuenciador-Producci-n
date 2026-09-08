import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Ordenes from "../pages/Ordenes";
import Produccion from "../pages/Produccion";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/ordenes" element={<Ordenes />} />
            <Route path="/produccion" element={<Produccion />} />
        </Routes>
    );
}

export default AppRoutes;