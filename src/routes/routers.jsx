import { createBrowserRouter } from "react-router-dom";
import publicRoutes from "./publicRouters";
import privateRoutes from "./privateRouters";

const routers = createBrowserRouter([...publicRoutes, ...privateRoutes]);
export default routers;