import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import About from './pages/About';
import Home from './components/Home';
import Booking from './components/Bookings';
import Experience from './components/Experience';
import ChatbotAI from './components/ChatbotAI';
import Location from './components/location';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<About/>} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path='/home' element={<Home/>}/>
                <Route path='/bookings' element={<Booking/>}/>
                <Route path='/experiences' element={<Experience/>}/>
                <Route path='/chatbox' element={<ChatbotAI/>}/>
                <Route path='/location' element={<Location/>}/>
            </Routes>
        </Router>
    );
}

export default App;