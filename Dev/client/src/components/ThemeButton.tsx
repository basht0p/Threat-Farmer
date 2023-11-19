import { useState, useEffect } from "react";
import { Moon, Sun } from "react-bootstrap-icons";

const ThemeButton = () => {
  // Retrieve the theme from localStorage or default to 'light'
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme : "light";
  };

  // State to keep track of the current theme
  const [theme, setTheme] = useState(getInitialTheme);

  // Function to toggle the theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    // Update the theme in localStorage
    localStorage.setItem("theme", newTheme);
  };

  // Effect hook to set the theme on the <html> tag
  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
  }, [theme]);

  return (
    <div>
      {/* Your app content goes here */}

      {/* Toggle Button */}
      <button onClick={toggleTheme} className="btn" aria-label="Toggle theme">
        {theme === "light" ? <Moon /> : <Sun />}
      </button>
    </div>
  );
};

export default ThemeButton;
