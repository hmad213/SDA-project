import Admin from "./pages/Admin";
import Catalog from "./pages/Catalog";
import ErrorPage from "./pages/ErrorPage";
import Home from "./pages/Home";
import Retailer from "./pages/Retailer";
import Search from "./pages/Search";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Orders from "./pages/Orders";
import ProductIndex from "./pages/ProductIndex";

const routes = [
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/retailer",
    element: <Retailer />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/admin",
    element: <Admin />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/search",
    element: <Search />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/catalog",
    element: <Catalog />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/Login",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/Signup",
    element: <Signup />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/orders",
    element: <Orders />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/product/:index",
    element: <ProductIndex />,
    errorElement: <ErrorPage />,
  },
];

export default routes;
