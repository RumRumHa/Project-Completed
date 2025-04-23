import React from 'react'
import { Card, Button, Badge } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, Cart3 } from 'react-bootstrap-icons'
import { StarFilled, ClockCircleFilled } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { addToWishlist, removeFromWishlist } from '../../../redux/reducers/user/accountSlice'
import { addToCart } from '../../../redux/reducers/user/cartSlice'
import { toast } from 'react-toastify'
import Cookies from 'js-cookie'
import '../../../styles/public/index.css'
import { formatPrice } from '../../../utils/formatPrice'

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlist = useSelector(state => state.account.wishlist);
  const isInWishlist = wishlist.some(item => item.productId === product.productId);
  const token = Cookies.get('token');


    console.log("ww", wishlist);
  const handleToggleWishlist = async () => {
    if (!token) {
      toast.info('Vui lòng đăng nhập để thêm vào danh sách yêu thích');
      navigate('/login');
      return;
    }

    try {
      if (isInWishlist) {
        const wishlistItem = wishlist.find(item => item.productId === product.productId);
        await dispatch(removeFromWishlist(wishlistItem.wishListId)).unwrap();
        toast.success('Đã xóa khỏi danh sách yêu thích');
      } else {
        await dispatch(addToWishlist(product.productId)).unwrap();
        toast.success('Đã thêm vào danh sách yêu thích');
      }
    } catch (error) {
      toast.error(error || 'Có lỗi xảy ra');
    }
  };

  const handleAddToCart = async () => {
    if (!token) {
      toast.info('Vui lòng đăng nhập để thêm vào giỏ hàng');
      navigate('/login');
      return;
    }

    try {
      await dispatch(addToCart({ productId: product.productId, quantity: 1 })).unwrap();
    } catch (error) {
      toast.error(error || 'Có lỗi xảy ra');
    }
  };

  const isNewProduct = () => {
    const createdAt = new Date(product.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - createdAt);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  }

  return (
    <Card className="h-100">
      <div className="position-relative">
        <Card.Img
          variant="top"
          src={product.mainImageUrl}
          alt={product.productName}
          className="product-image"
        />
        <Button
          variant="link"
          className="position-absolute top-0 end-0 p-2"
          onClick={handleToggleWishlist}
        >
          <Heart
            size={24}
            color={isInWishlist ? 'red' : 'white'}
            className='heart-icon'
          />
        </Button>
        <div className="position-absolute top-0 start-0 p-2 d-flex gap-1">
          {product.isFeatured && (
            <Badge bg="warning" className="d-flex align-items-center">
              <StarFilled className='star-icon' />
              Nổi bật
            </Badge>
          )}
          {isNewProduct() && (
            <Badge bg="primary" className="d-flex align-items-center">
              <ClockCircleFilled className='clock-icon' />
              Mới
            </Badge>
          )}
        </div>
      </div>
      <Card.Body className="d-flex flex-column">
        <Card.Title className="mb-2">
          <Link
            to={`/products/${product.productId}`}
            className="text-decoration-none text-dark"
          >
            {product.productName}
          </Link>
        </Card.Title>
        <Card.Text className="text-muted small mb-2">
          {product.description?.substring(0, 30)}...
        </Card.Text>
        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div>
              <span className="fw-bold">
                {formatPrice(product.unitPrice)}
              </span>
            </div>
            <Badge bg={product.stockQuantity > 0 ? "success" : "danger"} className="ms-2">
              {product.stockQuantity > 0 ? 'Còn hàng' : 'Hết hàng'}
            </Badge>
          </div>
          <Button
            variant="primary"
            className="w-100"
            disabled={product.stockQuantity === 0}
            onClick={handleAddToCart}
          >
            <Cart3 className="me-2" />
            Thêm vào giỏ
          </Button>
        </div>
      </Card.Body>
    </Card>
  )
}

export default ProductCard 