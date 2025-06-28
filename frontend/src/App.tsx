import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/LoginScreen";
import RegisterScreen from "./pages/RegisterScreen";
import PostListScreen from "./pages/PostListScreen";
import PostDetailScreen from "./pages/PostDetailScreen";

function App() {
  return (
    <BrowserRouter>
      <nav className="bg-gray-100 p-4 space-x-4">
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </nav>
      <Routes>
        <Route path="/" element={<PostListScreen />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<RegisterScreen />} />
        <Route path="/posts/:id" element={<PostDetailScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
