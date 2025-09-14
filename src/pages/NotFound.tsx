import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.info(
      "404 Info: HashRouter route not found:",
      location.pathname,
      "Hash:",
      window.location.hash
    );
    
    // Auto redirect to home after 3 seconds for better UX
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [location.pathname, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        <p className="text-sm text-gray-500 mb-4">Redirecting to home in 3 seconds...</p>
        <button 
          onClick={() => navigate("/")}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Return to Home Now
        </button>
      </div>
    </div>
  );
};

export default NotFound;
