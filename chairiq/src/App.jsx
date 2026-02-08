import React from "react";
import Routes from "./Routes";
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <div className="min-h-screen">
          <Routes />
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;