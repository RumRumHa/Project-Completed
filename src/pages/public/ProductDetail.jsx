import React from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, Image, Button } from 'react-bootstrap'
import { Typography, InputNumber, Spin, Tag, Divider, Space, Breadcrumb } from 'antd'
import { ShoppingCartOutlined, HeartOutlined, HeartFilled, StarFilled, ClockCircleFilled } from '@ant-design/icons'
import { formatPrice } from '../../utils/formatPrice'
import useProductDetail from './hooks/useProductDetail'
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
  const {
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
  } = useProductDetail();
  
  if (loading) return <div className="loading"><Spin size="large" /></div>
  if (error) return <div className="loading"><Text type="danger">{error}</Text></div>
  if (!product) return <div className="loading"><Text type="secondary">Không tìm thấy sản phẩm</Text></div>

  return (
    <div className="product-detail product-detail-container">
      <div className="product-breadcrumb">
        <Breadcrumb
          items={[
            { title: 'Trang chủ' },
            { title: product?.categoryName },
            { title: product?.productName }
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