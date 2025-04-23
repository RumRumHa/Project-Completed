import { configureStore } from '@reduxjs/toolkit'
import categoryAdminReducer from '../reducers/admin/categorySlice'
import productAdminReducer from '../reducers/admin/productSlice'
import userAdminReducer from '../reducers/admin/userSlice'
import roleAdminReducer from '../reducers/admin/roleSlice'
import reportAdminReducer from '../reducers/admin/reportSlice'
import orderAdminReducer from '../reducers/admin/orderSlice'
import categoryPublicReducer from '../reducers/public/categorySlice'
import productPublicReducer from '../reducers/public/productSlice'
import authPublicReducer from '../reducers/public/authSlice'
import cartReducer from '../reducers/user/cartSlice'
import accountReducer from '../reducers/user/accountSlice'
export const store = configureStore({
  reducer: {
    categoryAdmin: categoryAdminReducer,
    productAdmin: productAdminReducer,
    userAdmin: userAdminReducer,
    roleAdmin: roleAdminReducer,
    orderAdmin: orderAdminReducer,
    reportAdmin: reportAdminReducer,
    categoryPublic: categoryPublicReducer, 
    productPublic: productPublicReducer,
    authPublic: authPublicReducer,
    cart: cartReducer,
    account: accountReducer,
  },
}) 