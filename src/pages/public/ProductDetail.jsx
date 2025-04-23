import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Container, Row, Col, Image, Button, Card, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductById } from '../../redux/reducers/public/productSlice'
import { addToCart } from '../../redux/reducers/user/cartSlice'
import { addToWishlist, removeFromWishlist } from '../../redux/reducers/user/accountSlice'
import { Typography, InputNumber, Spin, Descriptions, Tag, Divider, Space, Radio, Breadcrumb } from 'antd'
import { ShoppingCartOutlined, HeartOutlined, HeartFilled, StarFilled, ClockCircleFilled, ShopOutlined, SafetyCertificateOutlined } from '@ant-design/icons'
import { formatPrice } from '../../utils/formatPrice'
import { toast } from 'react-toastify'
import Cookies from 'js-cookie'
import '../../styles/public/index.css'

const { Title, Text, Paragraph } = Typography

const IMAGE_CONFIG = {
  main: {
    width: 450,
    height: 450
  },
  thumbnail: {
    width: 120,
    height: 120,
    gap: 8
  }
}

const ProductDetail = () => {
  const { productId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(null)
  const { currentProduct: product, loading, error } = useSelector((state) => state.productPublic)
  const wishlist = useSelector(state => state.account.wishlist);
  const isInWishlist = wishlist.some(item => item.productId === parseInt(productId));
  const token = Cookies.get('token');

  useEffect(() => {
    dispatch(fetchProductById(productId))
  }, [dispatch, productId])

  useEffect(() => {
    if (product?.mainImageUrl) {
      setSelectedImage(product.mainImageUrl)
    }
  }, [product])

  const isNewProduct = () => {
    if (!product?.createdAt) return false
    const createdAt = new Date(product.createdAt)
    const now = new Date()
    const diffTime = Math.abs(now - createdAt)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7
  }

  const handleQuantityChange = (value) => {
    setQuantity(Math.min(Math.max(1, value), product?.stockQuantity || 1))
  }

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
  }

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

  if (loading) return <div className="loading"><Spin size="large" /></div>
  if (error) return <div className="loading"><Text type="danger">{error}</Text></div>
  if (!product) return <div className="loading"><Text type="secondary">Không tìm thấy sản phẩm</Text></div>

  return (
    <div className="product-detail product-detail-container">
      <div className="product-breadcrumb">
        <Breadcrumb
          items={[
            { title: 'Trang chủ' },
            { title: product.category?.categoryName },
            { title: product.productName }
          ]}
        />
      </div>

      <div className="product-content">
        <Row gutter={[32, 32]}>
          <Col xs={2} sm={2} md={2}>
            <div className="product-image-container" style={{
              gap: IMAGE_CONFIG.thumbnail.gap,
              maxHeight: IMAGE_CONFIG.main.height,
            }}>
              <div
                onClick={() => setSelectedImage(product.mainImageUrl)}
                style={{
                  width: IMAGE_CONFIG.thumbnail.width,
                  height: IMAGE_CONFIG.thumbnail.height,
                  border: selectedImage === product.mainImageUrl ? '2px solid #1890ff' : '1px solid #f0f0f0',
                  boxShadow: selectedImage === product.mainImageUrl ? '0 2px 8px rgba(24,144,255,0.15)' : 'none'
                }}
                className='product-thumbnail'
              >
                <img
                  src={product.mainImageUrl}
                  alt="main"
                  className="product-image"
                />
              </div>
              {product.images?.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  style={{
                    width: IMAGE_CONFIG.thumbnail.width,
                    height: IMAGE_CONFIG.thumbnail.height,
                    border: selectedImage === image ? '2px solid #1890ff' : '1px solid #f0f0f0',
                    boxShadow: selectedImage === image ? '0 2px 8px rgba(24,144,255,0.15)' : 'none'
                  }}
                  className='product-thumbnail'
                >
                  <img
                    src={image}
                    alt={`thumbnail-${index}`}
                    className="product-image"
                  />
                </div>
              ))}
            </div>
          </Col>

          <Col xs={5} sm={5} md={5}>
            <div style={{ 
              width: '100%',
              height: IMAGE_CONFIG.main.height,
            }}
            className="product-image-container-main">
              <Image
                src={selectedImage || product.mainImageUrl}
                alt={product.productName}
                className="product-image"
                preview={false}
              />
            </div>
            <Divider style={{ margin: '24px 0' }} />
            <div style={{ marginBottom: '24px' }}>
                <Title level={5} style={{ marginBottom: '16px' }}>Mô tả sản phẩm</Title>
                <Paragraph style={{ textAlign: 'justify' }}>
                  {product.description}
                </Paragraph>
              </div>
          </Col>
          <Col xs={5} sm={5} md={5}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Title level={3} style={{ marginBottom: '16px' }}>{product.productName}</Title>

                <Space size={[8, 8]} wrap style={{ marginBottom: '16px' }}>
                  {product.isFeatured && (
                    <Tag icon={<StarFilled />} color="warning">Nổi bật</Tag>
                  )}
                  {isNewProduct() && (
                    <Tag icon={<ClockCircleFilled />} color="processing">Mới</Tag>
                  )}
                  <Tag color={product.stockQuantity > 0 ? 'success' : 'error'}>
                    {product.stockQuantity > 0 ? 'Còn hàng' : 'Hết hàng'}
                  </Tag>
                </Space>

                <Title level={2} type="danger">
                  {formatPrice(product.unitPrice)}
                </Title>
              </div>

              <div>
                <Space direction="vertical" size="middle">
                  <div>
                    <Text type="secondary">Danh mục: </Text>
                    <Link className='text-decoration-none text-dark fw-bold' to={`/products/categories/${product.categoryId}`}>{product.categoryName}</Link>
                  </div>
                  <div>
                    <Text type="secondary">Mã sản phẩm: </Text>
                    <Text strong>{product.productId}</Text>
                  </div>
                  <div>
                    <Text type="secondary">Kho: </Text>
                    <Text strong>{product.stockQuantity} sản phẩm</Text>
                  </div>
                </Space>
              </div>

              <Divider style={{ margin: '24px 0' }} />

              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Space align="center">
                  <InputNumber
                    min={1}
                    max={product.stockQuantity}
                    value={quantity}
                    onChange={handleQuantityChange}
                    disabled={product.stockQuantity === 0}
                    addonBefore="Số lượng"
                    style={{ width: '140px' }}
                  />
                  <Text type="secondary">
                    {product.stockQuantity} sản phẩm có sẵn
                  </Text>
                </Space>

                <Space size="middle" wrap>
                  <Button
                    type="primary"
                    size="large"
                    icon={<ShoppingCartOutlined />}
                    onClick={handleAddToCart}
                    disabled={product.stockQuantity === 0}
                    style={{ 
                      height: '48px', 
                      fontSize: '16px',
                      background: '#1890ff',
                      borderRadius: '8px',
                      padding: '0 32px'
                    }}
                  >
                    Thêm vào giỏ hàng
                  </Button>
                  <Button
                    size="large"
                    icon={isInWishlist ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
                    onClick={handleAddToWishlist}
                    style={{ 
                      height: '48px',
                      borderRadius: '8px',
                      padding: '0 32px',
                    }}
                  >
                    {isInWishlist ? 'Đã yêu thích' : 'Yêu thích'}
                  </Button>
                </Space>
              </Space>
            </Space>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default ProductDetail 