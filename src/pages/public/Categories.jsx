import React, { useEffect } from 'react';
import { Card, Typography, Row, Col, Spin } from 'antd';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../redux/reducers/public/categorySlice';
import '../../styles/public/index.css'

const { Text } = Typography;

const Categories = () => {
  const dispatch = useDispatch();
  const { data: categories, loading, error } = useSelector((state) => state.categoryPublic);

  useEffect(() => {
    dispatch(fetchCategories({ page: 0, limit: 100 }));
  }, [dispatch]);

  if (loading) {
    return (
      <div className='loading'>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className='error'>
        {error}
      </div>
    );
  }

  return (
    <div className="categories-page">
      <Card className="mb-4">
        <h2 className='text-content'>Danh Mục Sản Phẩm</h2>
        <Row gutter={[16, 16]}>
          {categories.map((category) => (
            <Col xs={12} sm={8} md={6} lg={4} key={category.categoryId}>
              <Link className='text-decoration-none' to={`/products/categories/${category.categoryId}`}>
                <Card
                  hoverable
                  className='text-card'
                  bodyStyle={{
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%'
                  }}
                >
                  <Text
                    className='text-content-category'
                  >
                    {category.categoryName}
                  </Text>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
};

export default Categories; 