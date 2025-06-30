import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import HomeScreen from "./pages/HomeScreen";
import PostListScreen from "./pages/PostListScreen";
import PostDetailScreen from "./pages/PostDetailScreen";
import CreatePostScreen from "./pages/CreatePostScreen";
import EditPostScreen from "./pages/EditPostScreen";
import LoginScreen from "./pages/LoginScreen";
import RegisterScreen from "./pages/RegisterScreen";
import NotFound from "./pages/NotFound";

import { useAuthStore } from "./stores/authStore";

function App() {
  // Session Persistence: rehydrate token into store on startup
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      useAuthStore.getState().setToken(token);
    }
  }, []);

  return (
    <>
      {/* Global toast container */}
      <Toaster position="top-right" />

      <BrowserRouter>
        <Routes>
          {/* All routes wrapped in the main Layout */}
          <Route path="/" element={<Layout />}>
            {/* Public */}
            <Route index element={<HomeScreen />} />
            <Route path="login" element={<LoginScreen />} />
            <Route path="register" element={<RegisterScreen />} />
            <Route path="posts" element={<PostListScreen />} />
            <Route path="posts/:id" element={<PostDetailScreen />} />

            {/* Protected: only authenticated users */}
            <Route
              path="posts/new"
              element={
                <ProtectedRoute>
                  <CreatePostScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="posts/:id/edit"
              element={
                <ProtectedRoute>
                  <EditPostScreen />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Fallback for any other URL */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
