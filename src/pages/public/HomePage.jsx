import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import Categories from './Categories'
import Products from './Products'

function HomePage() {
  return (
    <div>
      <section className="py-5 bg-light">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h1 className="display-4 fw-bold mb-4">Chào mừng đến với cửa hàng</h1>
              <p className="lead mb-4">Khám phá những sản phẩm tuyệt vời với giá cả phải chăng</p>
            </Col>
            <Col md={6}>
              <div className="bg-primary text-white p-5 rounded text-center">
                <h3>Ưu đãi đặc biệt</h3>
                <p>Kiểm tra các ưu đãi mới nhất của chúng tôi</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <section className="py-5">
        <Container>
          <div className="mt-5">
            <Categories />
          </div>
          <div className="mt-5">
            <Products />
          </div>
        </Container>
      </section>
    </div>
  )
}

export default HomePage