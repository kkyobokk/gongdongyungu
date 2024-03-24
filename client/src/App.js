import {BrowserRouter, Routes, Route, useNavigate} from 'react-router-dom';
import Login from './component/Login';
import SignUp from './component/Signup';
import MainPage from './component/MainPage';
import Notfound from './component/Notfound';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="contain">
        <Routes>
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<SignUp/>}/>
          <Route path="/test" element={<MainPage/>}/>
          <Route path="*" element={<Notfound></Notfound>}/>
        </Routes>
      </div>
    </BrowserRouter>

  );
}

export default App;