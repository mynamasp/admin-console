import React from "react";
import BillForm from "./BillForm";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css"; // Assuming you have an App.css for your styles

function App() {
  return (
    <div className="App">
      <h1 className="Title text-3xl">SMART ENERGY METER - ADMIN CONSOLE</h1>
      <BillForm />
    </div>
  );
}

export default App;
