import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import accountService from '../../../services/user/accountService';
import Cookies from 'js-cookie';
import { OrderStatus } from '../../../enums/OrderStatus';

export const fetchAccountInfo = createAsyncThunk(
    'account/fetchInfo',
    async (_, { rejectWithValue }) => {
        try {
            const token = Cookies.get('token');
            const data = await accountService.getAccountInfo(token);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Không thể tải thông tin tài khoản');
        }
    }
);
export const updateAccountInfo = createAsyncThunk(
    'account/updateInfo',
    async (formData, { rejectWithValue }) => {
        try {
            const token = Cookies.get('token');
            const data = await accountService.updateAccountInfo(formData, token);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Cập nhật thông tin thất bại');
        }
    }
);
export const changePassword = createAsyncThunk(
    'account/changePassword',
    async (passwordData, { rejectWithValue }) => {
        try {
            const token = Cookies.get('token');
            await accountService.changePassword(passwordData, token);
            return true;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Đổi mật khẩu thất bại');
        }
    }
);
export const fetchAddresses = createAsyncThunk(
    'account/fetchAddresses',
    async (_, { rejectWithValue }) => {
        try {
            const token = Cookies.get('token');
            const data = await accountService.getAddresses(token);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Không thể tải danh sách địa chỉ');
        }
    }
);
export const fetchAddressById = createAsyncThunk(
    'account/fetchAddressById',
    async (addressId, { rejectWithValue }) => {
        try {
            const token = Cookies.get('token');
            const data = await accountService.getAddressById(addressId, token);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Không thể tải thông tin địa chỉ');
        }
    }
);
export const updateAddress = createAsyncThunk(
    'account/updateAddress',
    async (addressData, { rejectWithValue }) => {
        try {
            const token = Cookies.get('token');
            const data = await accountService.updateAddress(addressData, token);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Cập nhật địa chỉ thất bại');
        }
    }
);
export const addAddress = createAsyncThunk(
    'account/addAddress',
    async (addressData, { rejectWithValue }) => {
        try {
            const token = Cookies.get('token');
            const data = await accountService.addAddress(addressData, token);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Thêm địa chỉ thất bại');
        }
    }
);
export const deleteAddress = createAsyncThunk(
    'account/deleteAddress',
    async (addressId, { rejectWithValue }) => {
        try {
            const token = Cookies.get('token');
            await accountService.deleteAddress(addressId, token);
            return addressId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Xóa địa chỉ thất bại');
        }
    }
);
export const setDefaultAddress = createAsyncThunk(
    'account/setDefaultAddress',
    async (addressId, { rejectWithValue }) => {
        try {
            const token = Cookies.get('token');
            await accountService.setDefaultAddress(addressId, token);
            return addressId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Xóa địa chỉ thất bại');
        }
    }
);
export const fetchWishlist = createAsyncThunk(
    'account/fetchWishlist',
    async (_, { rejectWithValue }) => {
        try {
            const token = Cookies.get('token');
            const data = await accountService.getWishlist(token);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Không thể tải danh sách yêu thích');
        }
    }
);
export const addToWishlist = createAsyncThunk(
    'account/addToWishlist',
    async (productId, { rejectWithValue }) => {
        try {
            const token = Cookies.get('token');
            const data = await accountService.addToWishlist(productId, token);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Không thể thêm vào danh sách yêu thích');
        }
    }
);
export const removeFromWishlist = createAsyncThunk(
    'account/removeFromWishlist',
    async (wishListId, { rejectWithValue }) => {
        try {
            const token = Cookies.get('token');
            await accountService.removeFromWishlist(wishListId, token);
            return wishListId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Không thể xóa khỏi danh sách yêu thích');
        }
    }
);
export const fetchOrderHistory = createAsyncThunk(
    'account/fetchOrderHistory',
    async (_, { rejectWithValue }) => {
        try {
            const token = Cookies.get('token');
            const data = await accountService.getOrderHistory(token);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Không thể tải lịch sử đơn hàng');
        }
    }
);
export const fetchOrderDetail = createAsyncThunk(
    'account/fetchOrderDetail',
    async (serialNumber, { rejectWithValue }) => {
        try {
            const token = Cookies.get('token');
            const data = await accountService.getOrderDetail(serialNumber, token);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Không thể tải chi tiết đơn hàng');
        }
    }
);
export const fetchOrdersByStatus = createAsyncThunk(
    'account/fetchOrdersByStatus',
    async (status, { rejectWithValue }) => {
        try {
            const token = Cookies.get('token');
            const data = await accountService.getOrdersByStatus(status, token);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Không thể tải danh sách đơn hàng');
        }
    }
);
export const cancelOrder = createAsyncThunk(
    'account/cancelOrder',
    async (orderId, { rejectWithValue }) => {
        try {
            const token = Cookies.get('token');
            await accountService.cancelOrder(orderId, token);
            return orderId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Không thể hủy đơn hàng');
        }
    }
);
const initialState = {
    accountInfo: null,
    addresses: [],
    wishlist: [],
    orders: [],
    currentOrder: null,
    selectedAddress: null,
    loading: false,
    error: null
};

const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearCurrentOrder: (state) => {
            state.currentOrder = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch account info
            .addCase(fetchAccountInfo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAccountInfo.fulfilled, (state, action) => {
                state.loading = false;
                state.accountInfo = action.payload;
            })
            .addCase(fetchAccountInfo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update account info
            .addCase(updateAccountInfo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateAccountInfo.fulfilled, (state, action) => {
                state.loading = false;
                state.accountInfo = action.payload;
            })
            .addCase(updateAccountInfo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch addresses
            .addCase(fetchAddresses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAddresses.fulfilled, (state, action) => {
                state.loading = false;
                state.addresses = action.payload;
            })
            .addCase(fetchAddresses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch address by id
            .addCase(fetchAddressById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAddressById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedAddress = action.payload;
            })
            .addCase(fetchAddressById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Add address
            .addCase(addAddress.fulfilled, (state, action) => {
                state.addresses.push(action.payload);
            })

            // Update address
            .addCase(updateAddress.fulfilled, (state, action) => {
                const index = state.addresses.findIndex(address => address.addressId === action.payload.addressId);
                if (index !== -1) {
                    state.addresses[index] = action.payload;
                }
            })

            // Delete address
            .addCase(deleteAddress.fulfilled, (state, action) => {
                state.addresses = state.addresses.filter(address => address.addressId !== action.payload);
            })

            // Fetch wishlist
            .addCase(fetchWishlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.wishlist = action.payload;
            })
            .addCase(fetchWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Add to wishlist
            .addCase(addToWishlist.fulfilled, (state, action) => {
                state.wishlist.push(action.payload);
            })

            // Remove from wishlist
            .addCase(removeFromWishlist.fulfilled, (state, action) => {
                state.wishlist = state.wishlist.filter(item => item.wishListId !== action.payload);
            })

            // Fetch order history
            .addCase(fetchOrderHistory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrderHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchOrderHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch order detail
            .addCase(fetchOrderDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrderDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.currentOrder = action.payload;
            })
            .addCase(fetchOrderDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch orders by status
            .addCase(fetchOrdersByStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrdersByStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchOrdersByStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Cancel order
            .addCase(cancelOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(cancelOrder.fulfilled, (state, action) => {
                state.loading = false;
                const order = state.orders.find(o => o.orderId === action.payload);
                if (order) {
                    order.orderStatus = OrderStatus.CANCEL;
                }
            })
            .addCase(cancelOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError, clearCurrentOrder } = accountSlice.actions;
export default accountSlice.reducer; 