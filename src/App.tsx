import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { action as loginAction } from "./pages/LoginPage";
import { action as signupAction } from "./pages/SignupPage";
import HomePage, { loader as checkAuth } from "./pages/Home";
import { loader as removeAuth } from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import Root from "./components/Root";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LoginPage />,
      action: loginAction,
      loader: removeAuth,
    },
    { path: "/signup", element: <SignupPage />, action: signupAction },
    {
      path: "/home",
      element: <Root />,
      children: [
        { index: true, element: <HomePage />,loader:checkAuth },
        { path: ":username", element: <ProfilePage /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
