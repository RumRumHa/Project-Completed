import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store/index.js'
import routers from './routes/routers.jsx'
import { ToastContainer } from 'react-toastify'
import "antd/dist/reset.css";

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <ToastContainer />
    <RouterProvider router={routers} />
  </Provider>
)