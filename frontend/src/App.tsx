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
        <Route path="/" element={<Layout />}>
          {/* “index” renders at “/” */}
          <Route index element={<HomeScreen />} />

          {/* Posts list at “/posts” */}
          <Route path="posts" element={<PostListScreen />} />

          {/* Create new post */}
          <Route path="posts/new" element={<CreatePostScreen />} />

          {/* Post detail */}
          <Route path="posts/:id" element={<PostDetailScreen />} />

          {/* Edit post */}
          <Route path="posts/:id/edit" element={<EditPostScreen />} />

          {/* Authentication */}
          <Route path="login" element={<LoginScreen />} />
          <Route path="register" element={<RegisterScreen />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
