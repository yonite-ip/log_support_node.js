import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import BuildDomain from "./pages/BuildDomain";
import AnalyzeCallFlow from "./pages/AnalyzeCallFlow";
import CheckRegistration from "./pages/CheckRegistration";


const App: React.FC = () => {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<h1 className="text-4xl font-bold text-center">Welcome to FreeSWITCH Canva</h1>} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/build-domain" element={<BuildDomain />} />
            <Route path="/analyze-call-flow" element={<AnalyzeCallFlow />} />
            <Route path="/check-registraion" element={<CheckRegistration />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
