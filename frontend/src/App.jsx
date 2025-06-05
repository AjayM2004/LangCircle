
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import { Route, Routes, Navigate } from "react-router";
import ChatPage from "./pages/ChatPage";
import CallPage from "./pages/CallPage";
import NotificationPage from "./pages/NotificationPage";
import OnboardingPage from "./pages/OnboardingPage";
import toast, { Toaster } from "react-hot-toast";
import PageLoader from "./components/PageLoader";
import Layout from "./components/Layout";
import "stream-chat-react/dist/css/v2/index.css";
import useAuthUser from "./hooks/useAuthUser.js";
import { useThemeStore } from "./store/useThemeStore.js";
import FriendPage from "./pages/FriendPage.jsx";
function App() {
  const { isLoading, authUser } = useAuthUser();
  const isAuthenticated = Boolean(authUser);
  const {theme,setTheme} = useThemeStore();  
  // Assuming inOnBoarding means "user is still in onboarding process"
  // So isOnboarded should be the opposite - user has completed onboarding
  const isOnboarded = authUser?.inOnBoarding;
  
  console.log("Auth User:", authUser);
  console.log("Is Authenticated:", isAuthenticated);
  console.log("Is Onboarded:", isOnboarded);
  console.log("inOnBoarding flag:", authUser?.inOnBoarding);
  
  if (isLoading) return <PageLoader />;
  
  return (
    <div className="h-screen" data-theme={theme}>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSideBar={true}>
                <HomePage/>
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
         <Route
          path="/friends"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSideBar={true}>
                <FriendPage/>
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <LoginPage />
            ) : (
              <Navigate to={isOnboarded ? "/" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/signup"
          element={!isAuthenticated ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/chat/:id"
           element={
            isAuthenticated && isOnboarded ? (
              <Layout showSideBar={false}>
                <ChatPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/call/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSideBar={false}>
                <CallPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/notifications"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSideBar={true}>
                <NotificationPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/onboarding"
          element={
            isAuthenticated && !isOnboarded ? (
              <OnboardingPage />
            ) : (
              <Navigate to={isAuthenticated ? "/" : "/login"} />
            )
          }
        />
      </Routes>
      <Toaster />
    </div>
  );
}
export default App;
