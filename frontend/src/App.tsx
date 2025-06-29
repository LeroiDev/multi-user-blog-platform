import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import HomeScreen from "./pages/HomeScreen";
import PostListScreen from "./pages/PostListScreen";
import PostDetailScreen from "./pages/PostDetailScreen";
import CreatePostScreen from "./pages/CreatePostScreen";
import EditPostScreen from "./pages/EditPostScreen";
import LoginScreen from "./pages/LoginScreen";
import RegisterScreen from "./pages/RegisterScreen";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* All routes share the Layout */}
        <Route path="/" element={<Layout />}>
          {/* The index route renders HomeScreen */}
          <Route index element={<HomeScreen />} />

          {/* CRUD routes */}
          <Route path="posts" element={<PostListScreen />} />
          <Route path="posts/new" element={<CreatePostScreen />} />
          <Route path="posts/:id" element={<PostDetailScreen />} />
          <Route path="posts/:id/edit" element={<EditPostScreen />} />

          {/* Auth routes */}
          <Route path="login" element={<LoginScreen />} />
          <Route path="register" element={<RegisterScreen />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
