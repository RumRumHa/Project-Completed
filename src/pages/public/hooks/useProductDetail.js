import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { fetchProductById } from '../../../redux/reducers/public/productSlice';
import { addToCart } from '../../../redux/reducers/user/cartSlice';
import { addToWishlist, fetchWishlist, removeFromWishlist } from '../../../redux/reducers/user/accountSlice';
import { toast } from 'react-toastify';

export default function useProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const { currentProduct: product, loading, error } = useSelector((state) => state.productPublic);
  const wishlist = useSelector(state => state.account.wishlist);
  const isInWishlist = wishlist.some(item => item.productId === parseInt(productId));
  const token = Cookies.get('token');

  useEffect(() => {
    dispatch(fetchProductById(productId));
  }, [dispatch, productId]);

  useEffect(() => {
    if (product?.mainImageUrl) {
      setSelectedImage(product.mainImageUrl);
    }
  }, [product]);
  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const isNewProduct = () => {
    if (!product?.createdAt) return false;
    const createdAt = new Date(product.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - createdAt);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  const handleQuantityChange = (value) => {
    setQuantity(Math.min(Math.max(1, value), product?.stockQuantity || 1));
  };

  const handleAddToCart = async () => {
    if (!token) {
      toast.info('Vui lòng đăng nhập để thêm vào giỏ hàng');
      navigate('/login');
      return;
    }
    try {
      await dispatch(addToCart({ productId, quantity })).unwrap();
    } catch (error) {
      toast.error(error || 'Có lỗi xảy ra');
    }
  };

  const handleAddToWishlist = async () => {
    if (!token) {
      toast.info('Vui lòng đăng nhập để thêm vào danh sách yêu thích');
      navigate('/login');
      return;
    }
    try {
      if (isInWishlist) {
        const wishlistItem = wishlist.find(item => item.productId === parseInt(productId));
        await dispatch(removeFromWishlist(wishlistItem.wishListId)).unwrap();
        toast.success('Đã xóa khỏi danh sách yêu thích');
      } else {
        await dispatch(addToWishlist(parseInt(productId))).unwrap();
        toast.success('Đã thêm vào danh sách yêu thích');
      }
    } catch (error) {
      toast.error(error || 'Có lỗi xảy ra');
    }
  };

  return {
    product,
    loading,
    error,
    quantity,
    setQuantity,
    selectedImage,
    setSelectedImage,
    isNewProduct,
    handleQuantityChange,
    handleAddToCart,
    handleAddToWishlist,
    isInWishlist,
    wishlist
  };
}
