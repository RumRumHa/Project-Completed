import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Container, Navbar, Nav, Row, Col, Badge, Dropdown, Image, Button } from 'react-bootstrap'
import { Cart3, Person, QuestionCircle, BoxArrowInRight, BoxArrowRight, Truck, Trash } from 'react-bootstrap-icons'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../redux/reducers/public/authSlice'
import { fetchCartList, removeCartItem, updateCartItem, updateTotals } from '../redux/reducers/user/cartSlice'
import { toast } from 'react-toastify'
import Cookies from 'js-cookie'
import { formatPrice } from '../utils/formatPrice'
import { Popover, Button as AntButton } from 'antd'
import { HeartOutlined } from '@ant-design/icons'
import '../styles/user/index.css'

function UserLayout() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const token = Cookies.get('token')
  const user = token ? JSON.parse(Cookies.get('user') || '{}') : null
  const { items: cartItems, totalItems } = useSelector((state) => state.cart)

  useEffect(() => {
    if (token) {
      dispatch(fetchCartList())
    }
  }, [dispatch, token])

  useEffect(() => {
    if (cartItems.length > 0) {
      dispatch(updateTotals())
    }
  }, [dispatch, cartItems])

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Đăng xuất thành công!');
    navigate('/');
  }

  const handleUpdateQuantity = async (cartItemId, quantity) => {
    try {
      await dispatch(updateCartItem({ cartItemId, quantity })).unwrap()
      dispatch(updateTotals())
    } catch (error) {
      toast.error(error || 'Không thể cập nhật số lượng')
    }
  }

  const handleRemoveItem = async (cartItemId) => {
    try {
      await dispatch(removeCartItem(cartItemId)).unwrap()
      dispatch(updateTotals())
    } catch (error) {
      toast.error(error || 'Không thể xóa sản phẩm')
    }
  }

  const cartContent = (
    <div className="cart-content">
      {cartItems.length === 0 ? (
        <div className="text-center py-3">
          <Cart3 size={32} className="text-muted mb-2" />
          <p className="mb-0">Giỏ hàng trống</p>
        </div>
      ) : (
        <>
          <div className='cart-content-body'>
            {cartItems.map((item) => (
              <div key={item.shoppingCartId} className="d-flex align-items-center gap-2 mb-2 p-2 border-bottom">
                {item.mainImageUrl && item.mainImageUrl.length > 0 ? (
                  <Image
                    src={item.mainImageUrl}
                    alt={item.productName}
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                  />
                ) : (
                  <div className='cart-content-image'>
                    <Cart3 size={20} className="text-muted" />
                  </div>
                )}
                <div className="flex-grow-1">
                  <p className="mb-1 fw-bold">{item.productName}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <small>{formatPrice(item.unitPrice)}</small>
                    <div className="d-flex align-items-center gap-2">
                      <AntButton
                        size="small"
                        onClick={() => handleUpdateQuantity(item.shoppingCartId, item.orderQuantity - 1)}
                        disabled={item.orderQuantity <= 1}
                      >
                        -
                      </AntButton>
                      <span>{item.orderQuantity}</span>
                      <AntButton
                        size="small"
                        onClick={() => handleUpdateQuantity(item.shoppingCartId, item.orderQuantity + 1)}
                      >
                        +
                      </AntButton>
                      <AntButton
                        type="text"
                        danger
                        size="small"
                        onClick={() => handleRemoveItem(item.shoppingCartId)}
                        icon={<Trash size={16} />}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="pt-3 border-top">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span>Tổng tiền:</span>
              <span className="fw-bold">
                {formatPrice(cartItems.reduce((sum, item) => sum + item.unitPrice * item.orderQuantity, 0))}
              </span>
            </div>
            <Button
              as={Link}
              to="/cart"
              variant="primary"
              className="w-100"
            >
              Xem giỏ hàng
            </Button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar bg="light" variant="light" className="py-2 border-bottom">
        <Container>
          <Row className="w-100 align-items-center">
            <Col>
              <span className="text-muted">Chào mừng đến với cửa hàng</span>
            </Col>
            <Col className="text-end">
              <Nav className="d-inline-flex gap-3">
                <Nav.Link href="/help" className="text-dark">
                  <QuestionCircle className="me-1" />
                  Trợ giúp
                </Nav.Link>
                <Nav.Link href="/profile/orders" className="text-dark">
                  <Truck className="me-1" />
                  Theo dõi đơn hàng
                </Nav.Link>
                {!token ? (
                  <>
                    <Nav.Link as={Link} to="/login" className="text-dark">
                      <BoxArrowInRight className="me-1" />
                      Đăng nhập
                    </Nav.Link>
                    <Nav.Link as={Link} to="/register" className="text-dark">
                      <BoxArrowRight className="me-1" />
                      Đăng ký
                    </Nav.Link>
                  </>
                ) : (
                  <Dropdown align="end">
                    <Dropdown.Toggle variant="link" className="text-dark nav-link" id="user-dropdown">
                      <Person className="me-1" />
                      Xin chào, {user?.fullname}!
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item as={Link} to="/profile/account">
                        <Person className="me-2" />
                        Tài Khoản Của Tôi
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to="/profile/orders">
                        <Truck className="me-2" />
                        Đơn Mua
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to="/profile/wishlist">
                        <HeartOutlined className="me-2" />
                        Yêu thích
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item onClick={handleLogout}>
                        <BoxArrowRight className="me-2" />
                        Đăng Xuất
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
              </Nav>
            </Col>
          </Row>
        </Container>
      </Navbar>

      <Navbar bg="white" expand="lg" className="shadow-sm py-3">
        <Container>
          <Row className="w-100 align-items-center justify-content-between">
            <Col xs={12} md={3} className="text-center text-md-start mb-3 mb-md-0">
              <Navbar.Brand as={Link} to="/" className="text-primary fs-3 fw-bold">
                Logo
              </Navbar.Brand>
            </Col>
            
            <Col xs={12} md="auto" className="text-end">
              <Nav className="d-inline-flex gap-3 ms-auto">
                <Popover
                  content={cartContent}
                  title="Giỏ hàng"
                  trigger="hover"
                  placement="bottomRight"
                  arrow={true}
                >
                  <Nav.Link as={Link} to="/cart" className="text-dark position-relative">
                    <Cart3 size={20} />
                    {totalItems > 0 && (
                      <Badge bg="danger" className="position-absolute top-0 start-100 translate-middle rounded-circle nav-badge">
                        {totalItems}
                      </Badge>
                    )}
                  </Nav.Link>
                </Popover>
              </Nav>
            </Col>
          </Row>
        </Container>
      </Navbar>

      <Navbar bg="white" expand="lg" className="border-bottom">
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto">
              <Nav.Link as={Link} to="/" className="px-3">Trang chủ</Nav.Link>
              <Nav.Link as={Link} to="/products" className="px-3">Sản phẩm</Nav.Link>
              <Nav.Link as={Link} to="/categories" className="px-3">Danh mục</Nav.Link>
              <Nav.Link as={Link} to="/products?type=new" className="px-3">Hàng mới về</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main className="flex-grow-1 bg-light py-4">
        <Container>
          <Outlet />
        </Container>
      </main>

      <footer className="bg-dark text-white py-5">
        <Container>
          <Row>
            <Col md={4} className="mb-4 mb-md-0">
              <h3 className="h5 mb-3">Về chúng tôi</h3>
              <Nav className="flex-column">
                <Nav.Link href="#about" className="text-white-50">Giới thiệu</Nav.Link>
                <Nav.Link href="#careers" className="text-white-50">Tuyển dụng</Nav.Link>
                <Nav.Link href="#contact" className="text-white-50">Liên hệ</Nav.Link>
              </Nav>
            </Col>
            <Col md={4} className="mb-4 mb-md-0">
              <h3 className="h5 mb-3">Hỗ trợ khách hàng</h3>
              <Nav className="flex-column">
                <Nav.Link href="#help" className="text-white-50">Hướng dẫn mua hàng</Nav.Link>
                <Nav.Link href="#return-policy" className="text-white-50">Chính sách đổi trả</Nav.Link>
                <Nav.Link href="#privacy" className="text-white-50">Chính sách bảo mật</Nav.Link>
              </Nav>
            </Col>
            <Col md={4}>
              <h3 className="h5 mb-3">Kết nối với chúng tôi</h3>
              <Nav className="flex-column">
                <Nav.Link href="#" className="text-white-50">Facebook</Nav.Link>
                <Nav.Link href="#" className="text-white-50">Instagram</Nav.Link>
                <Nav.Link href="#" className="text-white-50">Youtube</Nav.Link>
              </Nav>
            </Col>
          </Row>
          <Row className="mt-4 pt-4 border-top border-secondary">
            <Col className="text-center text-white-50">
              © 2025 Rum Đại Ca. All rights reserved.
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  )
}

export default UserLayout