import {Routes,Route} from 'react-router-dom';import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';import Attendance from './pages/Attendance';import Employees from './pages/Employees';import Leaves from './pages/Leaves';
import WelcomePopup from './components/common/WelcomePopup';import Departments from './pages/Departments';import Shifts from './pages/Shifts';import Reports from './pages/Reports';import Settings from './pages/Settings';
export default function App(){return <><WelcomePopup/><Routes><Route element={<Layout/>}><Route index element={<Dashboard/>}/><Route path="attendance" element={<Attendance/>}/><Route path="employees" element={<Employees/>}/><Route path="leaves" element={<Leaves/>}/>
<Route path="departments" element={<Departments/>}/><Route path="shifts" element={<Shifts/>}/><Route path="reports" element={<Reports/>}/><Route path="settings" element={<Settings/>}/></Route></Routes></>}
