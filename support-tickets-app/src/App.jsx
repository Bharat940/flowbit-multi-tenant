import "./App.css";
import TicketList from "./pages/TicketsList.jsx";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import React from "react";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TicketList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
