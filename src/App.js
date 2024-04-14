import React from "react";

import { BrowserRouter as Router } from "react-router-dom";
import { Routes ,Route } from 'react-router-dom';
import { ToastContainer, Slide } from 'react-toastify';

//Pages that we've written
import BillForm from "./Pages/BillForm/BillForm";
import Login from "./Pages/Login/Login";

//More boiler plate
import "react-datepicker/dist/react-datepicker.css";
import "./App.css"; // Assuming you have an App.css for your styles

function App() {
  return (
    <Router>
      {/* <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Login</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
          </ul>
        </nav>
      </div> */}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<BillForm />}/>        
      </Routes>
    </Router>
  );
}

export default App;