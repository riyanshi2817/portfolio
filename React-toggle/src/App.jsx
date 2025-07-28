import { useState } from 'react'
import './App.css'
import './index.css'

function App() {
  const [showDetails, setShowDetails] = useState(false);
  const [darkTheme, setDarkTheme] = useState(false);

  return (
    <>
      <div className={`app-container ${darkTheme ? "dark" : "light"}`}>
        <h1>Show/Hide Details & Theme Toggle</h1>

        <button onClick={() => setShowDetails(!showDetails)}
          className={`toggle-btn ${showDetails ? "hide" : "show"}`}>
          {showDetails ? "Hide Details" : "Show Details"}
        </button>


        <button
          onClick={() => setDarkTheme(!darkTheme)}
          className={`theme-btn ${darkTheme ? "light-theme" : "dark-theme"}`}>
          Toggle {darkTheme ? "Light" : "Dark"} Theme
        </button>

        {showDetails && (
          <div className="details">
            <p>This is a demo of how you can show and hide content.</p>
          </div>
        )}

      </div>
    </>
  );
};

export default App
