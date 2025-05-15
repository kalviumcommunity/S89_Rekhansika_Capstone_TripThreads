import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import About from './pages/About';
import Home from './components/Home';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<About/>} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path='/home' element={<Home/>}/>
                

            </Routes>
        </Router>
    );
}

export default App;