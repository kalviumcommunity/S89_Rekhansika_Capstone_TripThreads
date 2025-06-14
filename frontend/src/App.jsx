import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import About from './pages/About';
import Home from './components/Home';
import Booking from './components/Bookings';
import Experience from './components/Experience';
import ChatbotAI from './components/ChatbotAI';
import Location from './components/location';
import Profile from './components/Profile';
import BookingHistory from './components/BookingHistory';
import GoogleSuccess from './pages/GoogleSuccess';
import FollowOthers from './components/FollowOthers';
import UserPosts from './components/UserPosts';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<About/>} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                 <Route path='/google-success' element={<GoogleSuccess/>}/>
                <Route path='/home' element={<Home/>}/>
                <Route path='/bookings' element={<Booking/>}/>
                <Route path='/experiences' element={<Experience/>}/>
                <Route path='/chatbox' element={<ChatbotAI/>}/>
                <Route path='/location' element={<Location/>}/>
                <Route path='/profile' element={<Profile/>}/>
                <Route path='/bookingshistory' element={<BookingHistory/>}/>
                <Route path='/follow-others' element={<FollowOthers/>}/>
                <Route path='/user/:id/posts' element={<UserPosts/>}/>
               
            </Routes>
        </Router>
    );
}

export default App;