import React from 'react';
import './App.css';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from "./components/Auth/Login"
import Register from './components/Auth/Register';
function App() {
  return (
    <div className='font-[poppins]'>
     
    <Register />
    <Login />
    <ToastContainer />
    </div>
  );
}

export default App;
