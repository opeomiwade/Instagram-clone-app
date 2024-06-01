import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import { CircularProgress } from "@mui/material";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const HomePage = lazy(() => import("./pages/Home"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const ErrorPage = lazy(() => import("./components/ErrorPage"));
const Root = lazy(() => import("./layouts/Root"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const MessagesPage = lazy(() => import("./pages/MessagesPage"));
const PostPage = lazy(() => import("./pages/PostPage"));

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Suspense
          fallback={
            <div className="flex h-screen justify-center items-center">
              <CircularProgress />
            </div>
          }
        >
          <LoginPage />
        </Suspense>
      ),
      errorElement: <ErrorPage />,
      action: async (args) => {
        const module = await import("./pages/LoginPage");
        return module.action(args);
      },
      loader: async () => {
        const module = await import("./pages/LoginPage");
        return module.loader();
      },
    },
    {
      path: "/signup",
      element: (
        <Suspense
          fallback={
            <div className="flex h-screen justify-center items-center">
              <CircularProgress />
            </div>
          }
        >
          <SignupPage />
        </Suspense>
      ),
      action: async (args) => {
        const module = await import("./pages/SignupPage");
        return module.action(args);
      },
    },
    {
      path: "/forgot-password",
      element: (
        <Suspense
          fallback={
            <div className="flex h-screen justify-center items-center">
              <CircularProgress />
            </div>
          }
        >
          <ForgotPasswordPage />
        </Suspense>
      ),
      action: async (args) => {
        const module = await import("./pages/ForgotPasswordPage");
        return module.action(args);
      },
    },
    {
      path: "/p/:postId",
      element: (
        <Suspense
          fallback={
            <div className="flex h-screen justify-center items-center">
              <CircularProgress />
            </div>
          }
        >
          <PostPage />
        </Suspense>
      ),
      errorElement: <ErrorPage />,
      loader: async (args) => {
        const module = await import("./pages/PostPage");
        return module.loader(args);
      },
    },
    {
      path: "/home",
      element: (
          <Root />
      ),
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: (
            <Suspense
              fallback={
                <div className="flex h-screen justify-center items-center">
                  <CircularProgress />
                </div>
              }
            >
              <HomePage />
            </Suspense>
          ),
          loader: async () => {
            const module = await import("./pages/Home");
            return module.loader();
          },
        },
        {
          path: ":username",
          element: (
            <Suspense
              fallback={
                <div className="flex h-screen justify-center items-center">
                  <CircularProgress />
                </div>
              }
            >
              <ProfilePage />
            </Suspense>
          ),
          loader: async (args) => {
            const module = await import("./pages/ProfilePage");
            return module.loader(args);
          },
        },
        {
          path: "messages",
          element: (
            <Suspense
              fallback={
                <div className="flex h-screen justify-center items-center">
                  <CircularProgress />
                </div>
              }
            >
              <MessagesPage />
            </Suspense>
          ),
          loader: async () => {
            const module = await import("./pages/MessagesPage");
            return module.loader();
          },
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
