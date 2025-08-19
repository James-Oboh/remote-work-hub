import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Register from "./components/Register"; 
import PrivateRoute from "./components/PrivateRoute"; // Import the new PrivateRoute component
import TaskManagement from "./components/TaskManagement"; // Assuming you have this component
import TeamManagement from "./components/TeamManagement"; // Assuming you have this component

function App() {
  return (
    <div className="App">
      {/* The Navbar should be outside the Routes so it's always visible */}
      <Navbar /> 
      <main className="main-content">
        <Routes>
          {/* Use PrivateRoute to wrap components that require authentication */}
          <Route path="/" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          {/* These routes are public and do not need to be wrapped */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* You can add other private routes here if needed */}
          <Route path="/tasks" element={
            <PrivateRoute>
              <TaskManagement />
            </PrivateRoute>
          } />
          <Route path="/teams" element={
            <PrivateRoute>
              <TeamManagement />
            </PrivateRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default App;
