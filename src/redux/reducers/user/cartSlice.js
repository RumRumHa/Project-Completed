import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartService } from '../../../services/user/cartService';
import { toast } from 'react-toastify';

/**
 * Lấy danh sách giỏ hàng
 */
export const fetchCartList = createAsyncThunk(
    'cart/fetchList',
    async (forceRefresh = false, { rejectWithValue }) => {
        try {
            const data = await cartService.getCart(forceRefresh);
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Không thể tải giỏ hàng');
        }
    }
);

/**
 * Thêm sản phẩm vào giỏ hàng
 */
export const addToCart = createAsyncThunk(
    'cart/addItem',
    async ({ productId, quantity = 1 }, { rejectWithValue, dispatch }) => {
        try {
            // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
            const isInCart = await cartService.isProductInCart(productId);
            
            const data = await cartService.addToCart(productId, quantity);
            toast.success(isInCart ? 'Cập nhật số lượng thành công' : 'Thêm vào giỏ hàng thành công');
            
            // Làm mới giỏ hàng sau khi thêm sản phẩm
            dispatch(fetchCartList(true));
            return data;
        } catch (error) {
            toast.error(error.message || 'Không thể thêm vào giỏ hàng');
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Cập nhật số lượng sản phẩm trong giỏ hàng
 */
export const updateCartItem = createAsyncThunk(
    'cart/updateItem',
    async ({ cartItemId, quantity }, { rejectWithValue, dispatch }) => {
        try {
            if (quantity <= 0) {
                return rejectWithValue('Số lượng phải lớn hơn 0');
            }
            
            const data = await cartService.updateCartItem(cartItemId, quantity);
            toast.success('Cập nhật số lượng thành công');
            
            // Làm mới giỏ hàng sau khi cập nhật
            dispatch(fetchCartList(true));
            return data;
        } catch (error) {
            toast.error(error.message || 'Không thể cập nhật số lượng');
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Xóa sản phẩm khỏi giỏ hàng
 */
export const removeCartItem = createAsyncThunk(
    'cart/removeItem',
    async (cartItemId, { rejectWithValue, dispatch }) => {
        try {
            await cartService.removeFromCart(cartItemId);
            toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
            
            // Làm mới giỏ hàng sau khi xóa sản phẩm
            dispatch(fetchCartList(true));
            return cartItemId;
        } catch (error) {
            toast.error(error.message || 'Không thể xóa sản phẩm');
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Xóa toàn bộ giỏ hàng
 */
export const clearCart = createAsyncThunk(
    'cart/clear',
    async (_, { rejectWithValue }) => {
        try {
            await cartService.clearCart();
            toast.success('Đã xóa toàn bộ giỏ hàng');
            return true;
        } catch (error) {
            toast.error(error.message || 'Không thể xóa giỏ hàng');
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Thanh toán giỏ hàng
 */
export const checkout = createAsyncThunk(
    'cart/checkout',
    async (shippingInfo = null, { rejectWithValue, dispatch }) => {
        try {
            const response = await cartService.checkout(shippingInfo);
            toast.success('Đặt hàng thành công!', {
                position: "top-right",
                autoClose: 3000
            });
            return response;
        } catch (error) {
            toast.error(error.message || 'Không thể đặt hàng');
            return rejectWithValue(error.message || 'Lỗi kết nối, vui lòng thử lại sau');
        }
    }
);

/**
 * Lấy số lượng sản phẩm trong giỏ hàng
 */
export const getCartItemCount = createAsyncThunk(
    'cart/getItemCount',
    async (_, { rejectWithValue }) => {
        try {
            return await cartService.getCartItemCount();
        } catch (error) {
            return rejectWithValue(error.message || 'Không thể lấy số lượng sản phẩm');
        }
    }
);

const initialState = {
    items: [],
    loading: false,
    error: null,
    totalItems: 0,
    totalAmount: 0,
    lastUpdated: null
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