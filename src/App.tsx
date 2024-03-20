import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { action as loginAction } from "./pages/LoginPage";
import { action as signupAction } from "./pages/SignupPage";
import HomePage, { loader as checkAuth } from "./pages/Home";
import { loader as removeAuth } from "./pages/LoginPage";
import ProfilePage, { loader as profileLoader } from "./pages/ProfilePage";
import Root from "./layouts/Root";
import ErrorPage from "./components/ErrorPage";
import ForgotPasswordPage, {
  action as forgotpass,
} from "./pages/ForgotPasswordPage";
import MessagesPage, {loader as messagesLoader} from "./pages/MessagesPage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LoginPage />,
      errorElement: <ErrorPage />,
      action: loginAction,
      loader: removeAuth,
    },
    { path: "/signup", element: <SignupPage />, action: signupAction },
    {
      path: "/forgot-password",
      element: <ForgotPasswordPage />,
      action: forgotpass,
    },
    {
      path: "/home",
      element: <Root />,
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <HomePage />, loader: checkAuth },
        { path: ":username", element: <ProfilePage />, loader: profileLoader },
        { path: "messages", element: <MessagesPage />, loader: messagesLoader},
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
