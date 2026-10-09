import {BrowserRouter,Routes,Route,Navigate} from 'react-router-dom';
import {AuthProvider} from './context/AuthContext';
import Protected from './components/Protected';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Import from './pages/Import';
import Feedback from './pages/Feedback';
import Reports from './pages/Reports';
import Topics from './pages/Topics';
import Features from './pages/Features';
import Trends from './pages/Trends';
export default function App()
{
    return <AuthProvider><BrowserRouter><Routes><Route path="/login" element={<Login/>}/>
<Route path="/register" element={<Register/>}/><Route path="*" element={<Protected><Routes><Route path="/" element={<Dashboard/>}/>
<Route path="/import" element={<Import/>}/>
<Route path="/feedback" element={<Feedback/>}/>
<Route path="/topics" element={<Topics/>}/>
<Route path="/features" element={<Features/>}/>
<Route path="/trends" element={<Trends/>}/>
<Route path="/reports" element={<Reports/>}/>
<Route path="*" element={<Navigate to="/"/>}/>
</Routes></Protected>}/></Routes>
</BrowserRouter></AuthProvider>
}
