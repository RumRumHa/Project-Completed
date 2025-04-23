import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartService } from '../../../services/user/cartService';
import { toast } from 'react-toastify';

export const fetchCartList = createAsyncThunk(
    'cart/fetchList',
    async (_, { rejectWithValue }) => {
        try {
            const data = await cartService.getCart();
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Không thể tải giỏ hàng');
        }
    }
);

export const addToCart = createAsyncThunk(
    'cart/addItem',
    async ({ productId, quantity }, { rejectWithValue }) => {
        try {
            const data = await cartService.addToCart(productId, quantity);
            toast.success('Thêm vào giỏ hàng thành công');
            return data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Không thể thêm vào giỏ hàng');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const updateCartItem = createAsyncThunk(
    'cart/updateItem',
    async ({ cartItemId, quantity }, { rejectWithValue }) => {
        try {
            const data = await cartService.updateCartItem(cartItemId, quantity);
            return data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Không thể cập nhật số lượng');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const removeCartItem = createAsyncThunk(
    'cart/removeItem',
    async (cartItemId, { rejectWithValue }) => {
        try {
            await cartService.removeFromCart(cartItemId);
            toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
            return cartItemId;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Không thể xóa sản phẩm');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const clearCart = createAsyncThunk(
    'cart/clear',
    async (_, { rejectWithValue }) => {
        try {
            await cartService.clearCart();
            toast.success('Đã xóa toàn bộ giỏ hàng');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Không thể xóa giỏ hàng');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const checkout = createAsyncThunk(
    'cart/checkout',
    async (_, { rejectWithValue }) => {
        try {
            const response = await cartService.checkout();
            return response;
        } catch (error) {
            if (error.response) {
                return rejectWithValue(error.response.data.message || 'Không thể đặt hàng');
            }
            return rejectWithValue('Lỗi kết nối, vui lòng thử lại sau');
        }
    }
);

const initialState = {
    items: [],
    loading: false,
    error: null,
    totalItems: 0,
    totalAmount: 0
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        updateTotals: (state) => {
            state.totalItems = state.items.reduce((sum, item) => sum + item.orderQuantity, 0);
            state.totalAmount = state.items.reduce((sum, item) => sum + (item.unitPrice * item.orderQuantity), 0);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCartList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCartList.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
                state.error = null;
                state.totalItems = action.payload.reduce((sum, item) => sum + item.orderQuantity, 0);
                state.totalAmount = action.payload.reduce((sum, item) => sum + (item.unitPrice * item.orderQuantity), 0);
            })
            .addCase(fetchCartList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(addToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false;
                const existingItem = state.items.find(item => item.productId === action.payload.productId);
                if (existingItem) {
                    existingItem.orderQuantity = action.payload.orderQuantity;
                } else {
                    state.items.push(action.payload);
                }
                state.error = null;
                state.totalItems = state.items.reduce((sum, item) => sum + item.orderQuantity, 0);
                state.totalAmount = state.items.reduce((sum, item) => sum + (item.unitPrice * item.orderQuantity), 0);
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(updateCartItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCartItem.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.items.findIndex(item => item.shoppingCartId === action.payload.shoppingCartId);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
                state.error = null;
                state.totalItems = state.items.reduce((sum, item) => sum + item.orderQuantity, 0);
                state.totalAmount = state.items.reduce((sum, item) => sum + (item.unitPrice * item.orderQuantity), 0);
            })
            .addCase(updateCartItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(removeCartItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeCartItem.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter(item => item.shoppingCartId !== action.payload);
                state.error = null;
                state.totalItems = state.items.reduce((sum, item) => sum + item.orderQuantity, 0);
                state.totalAmount = state.items.reduce((sum, item) => sum + (item.unitPrice * item.orderQuantity), 0);
            })
            .addCase(removeCartItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(clearCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(clearCart.fulfilled, (state) => {
                state.loading = false;
                state.items = [];
                state.error = null;
            })
            .addCase(clearCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(checkout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(checkout.fulfilled, (state) => {
                state.loading = false;
                state.items = [];
                state.error = null;
            })
            .addCase(checkout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError, updateTotals } = cartSlice.actions;
export default cartSlice.reducer; 