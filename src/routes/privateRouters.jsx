import Admin from "../layouts/AdminLayout";
import User from "../layouts/UserLayout";
import Dashboard from "../pages/admin/Dashboard";
import Categories from "../pages/admin/Categories";
import Products from "../pages/admin/Products";
import Users from "../pages/admin/Users";
import PrivateRoute from "../components/PrivateRoute";
import Orders from "../pages/admin/Orders";
import RevenueReport from "../pages/admin/reports/RevenueReport";
import ProductReport from "../pages/admin/reports/ProductReport";
import CustomerReport from "../pages/admin/reports/CustomerReport";
import Account from "../pages/user/Account";
import Cart from "../pages/user/Cart";

const privateRoutes = [
    {
        path: "/admin",
        element: <PrivateRoute>
                    <Admin />
                </PrivateRoute>,
        children: [
            {
                index: true,
                element: <Dashboard />
            },
            {
                path: "categories",
                element: <Categories />
            },
            {
                path: "products",
                element: <Products />
            },
            {
                path: "users",
                element: <Users />
            },
            {
                path: "orders",
                element: <Orders />
            },
            {
                path: "reports/sales-revenue-over-time",
                element: <RevenueReport type="sales-revenue-over-time" />
            },
            {
                path: "reports/revenue-by-category",
                element: <RevenueReport type="revenue-by-category" />
            },
            {
                path: "reports/best-seller-products",
                element: <ProductReport type="best-seller-products" />
            },
            {
                path: "reports/most-liked-products",
                element: <ProductReport type="most-liked-products" />
            },
            {
                path: "reports/top-spending-customers",
                element: <CustomerReport type="top-spending-customers" />
            },
            {
                path: "reports/new-accounts-this-month",
                element: <CustomerReport type="new-accounts-this-month" />
            },
            {
                path: "reports/invoices-over-time",
                element: <RevenueReport type="invoices-over-time" />
            }
        ]
    },
    {
        path: "/profile",
        element: <PrivateRoute>
                    <User />
                </PrivateRoute>,
        children: [
            {
                path: "account",
                element: <Account />
            },
            {
                path: "addresses",
                element: <Account defaultTab="addresses" />
            },
            {
                path: "orders",
                element: <Account defaultTab="orders" />
            },
            {
                path: "wishlist",
                element: <Account defaultTab="wishlist" />
            }
        ]
    },
    {
        path: "/",
        element: <PrivateRoute>
                    <User />
                </PrivateRoute>,
        children: [
            {
                path: "cart",
                element: <Cart />
            }
        ]
    }
];

export default privateRoutes;