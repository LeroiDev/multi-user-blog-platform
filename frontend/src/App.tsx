import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
// import Home from "./pages/Home";
import Login from "./pages/LoginScreen";
// import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <nav className="bg-gray-100 p-4 space-x-4">
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </nav>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="login" element={<Login />} />
        {/* <Route path="register" element={<Register />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
