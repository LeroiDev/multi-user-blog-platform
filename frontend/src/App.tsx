import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/LoginScreen";
import RegisterScreen from "./pages/RegisterScreen";
import HomeScreen from "./pages/HomeScreen";
import PostListScreen from "./pages/PostListScreen";
import PostDetailScreen from "./pages/PostDetailScreen";
import CreatePostScreen from "./pages/CreatePostScreen";
import EditPostScreen from "./pages/EditPostScreen";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page */}
        <Route path="/" element={<HomeScreen />} />
        {/* Posts listing, detail, create */}
        <Route path="/posts" element={<PostListScreen />} />
        <Route path="/posts/new" element={<CreatePostScreen />} />
        <Route path="/posts/:id" element={<PostDetailScreen />} />
        <Route path="/posts/:id/edit" element={<EditPostScreen />} />
        {/* Authentication routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<RegisterScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
