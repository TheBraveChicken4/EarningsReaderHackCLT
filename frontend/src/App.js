import './App.css';
import Navbar from './Components/Navbar'
import { BrowserRouter,Routes, Route } from 'react-router-dom';
import Homepage from './Components/Homepage.jsx';
import Comparison from './Components/Comparison.jsx';


function App() {
  return (
      <div className="App">
        <BrowserRouter>
        <Navbar/>
        <Routes>
            <Route path='/' element={<Homepage/>} />
            <Route path='/compare' element={<Comparison/>} />
        </Routes>
        </BrowserRouter>
      </div>
  );
}

export default App;
