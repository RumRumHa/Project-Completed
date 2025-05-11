import UserLayout from '../layouts/UserLayout'
import Home from '../pages/public/HomePage'
import Products from '../pages/public/Products'
import ProductDetail from '../pages/public/ProductDetail'
import Register from '../pages/public/Register'
import Login from '../pages/public/Login'
import Categories from '../pages/public/Categories'

const publicRoutes = [
    {   
        path: '/', 
        element: <UserLayout />, 
        children: [
            { index: true, element: <Home /> },
            { path: 'products', element: <Products /> },
            { path: 'categories', element: <Categories /> },
            { path: 'products/categories/:categoryId', element: <Products /> },
            { path: 'products/:productId', element: <ProductDetail /> },
        ]
    },
    {
        path: '/register',
        element: <Register />
    },
    {
        path: '/login',
        element: <Login />
    }
]

export default publicRoutes