import {Routes, Route} from 'react-router-dom';
import Login from '../components/pages/Login'
import Dashboard from '../components/pages/Dashboard'
import Inventory from '../components/pages/Inventory';

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element ={<Login />} />
            <Route path="/dashboard" element ={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
         </Routes>
    );
}