import React from "react";
import { Routes, Route } from "react-router-dom";
import  Navbar  from "./components/Navbar"; 
import  Dashboard  from "./components/Dashboard";
import  Login  from "./components/Login";
import Register from "./components/Register"; 
import PrivateRoute from "./components/PrivateRoute"; 
import TaskManagement from "./components/TaskManagement";
import  TeamManagement  from "./components/TeamManagement";


const handleCreateTask = () => {
  console.log("Create new task clicked!");
};

function App() {
  return (
    <div className="App">
      <Navbar /> 
      <main className="main-content">
        <Routes>
          <Route 
            path="/" 
            element={
              <PrivateRoute>
                {/* FIXED: Added the required 'onCreateTaskClick' prop */}
                <Dashboard onCreateTaskClick={handleCreateTask} />
              </PrivateRoute>
            } 
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/tasks" 
            element={
              <PrivateRoute>
                <TaskManagement />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/teams" 
            element={
              <PrivateRoute>
                <TeamManagement />
              </PrivateRoute>
            } 
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
