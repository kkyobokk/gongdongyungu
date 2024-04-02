import {BrowserRouter, Routes, Route, useNavigate} from 'react-router-dom';
import Login from './component/Login';
import SignUp from './component/Signup';
import MainPage from './component/BundlePage';
import Notfound from './component/Notfound';
import { CookiesProvider } from 'react-cookie';
import './App.css';

function App() {
  return (
    <CookiesProvider>
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
    </CookiesProvider>


  );
}

export default App;