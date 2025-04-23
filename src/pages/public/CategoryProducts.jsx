import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { fetchProductsByCategory } from "../../redux/reducers/public/productSlice";
import { Button, Space, Layout, Pagination, Spin, Card, Typography, Dropdown, Row, Col } from "antd";
import { FilterOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { Content } from "antd/es/layout/layout";
import ProductCard from "./components/ProductCard";
import '../../styles/public/index.css';

const { Text } = Typography;

const CategoryProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const { data: products, loading, total } = useSelector((state) => state.productPublic);
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(Math.max(1, parseInt(searchParams.get('page')) || 1));
  const [limit, setLimit] = useState(parseInt(searchParams.get('limit')) || 10);
  const [filterValue, setFilterValue] = useState(searchParams.get('sort') || 'all');

  const filterItems = [
    {
      key: 'all',
      label: 'Mặc định',
    },
    {
      key: 'productName_asc',
      label: 'Tên A-Z',
    },
    {
      key: 'productName_desc',
      label: 'Tên Z-A',
    },
    {
      key: 'unitPrice_asc',
      label: 'Giá thấp đến cao',
    },
    {
      key: 'unitPrice_desc',
      label: 'Giá cao đến thấp',
    },
    {
      key: 'createdAt_desc',
      label: 'Mới nhất',
    },
    {
      key: 'createdAt_asc',
      label: 'Cũ nhất',
    },
  ];

  useEffect(() => {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', page);
    if (limit !== 10) params.set('limit', limit);
    if (filterValue !== 'all') params.set('sort', filterValue);
    setSearchParams(params);

    const fetchData = async () => {
      const [sortBy, orderBy] = filterValue === 'all' 
        ? ['productName', 'asc'] 
        : filterValue.split('_');

      await dispatch(fetchProductsByCategory({ 
        categoryId, 
        params: {
          page: Math.max(1, page),
          limit,
          sortBy,
          orderBy
        }
      }));
    };

    fetchData();
  }, [dispatch, categoryId, page, limit, filterValue]);

  const handleFilter = ({ key }) => {
    setFilterValue(key);
    setPage(1);
  };

  const handlePageChange = (newPage, newLimit) => {
    const validPage = Math.max(1, newPage);
    setPage(validPage);
    if (newLimit !== limit) {
      setLimit(newLimit);
    }
    setSearchParams({
      page: validPage,
      limit: newLimit || limit,
      ...(filterValue !== 'all' && { sort: filterValue })
    });
  };

  const handleViewAllCategories = () => {
    navigate('/categories');
  };

  if (loading) return <div className="text-center py-5"><Spin size="large" /></div>;

  return (
    <Layout className="categories-page">
      <Content>
        <Card>
          <div className="mb-4">
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} md={12}>
                <h1 className="mb-0">Sản phẩm theo danh mục</h1>
              </Col>
              <Col xs={24} md={12}>
                <Space className="categories-filter-space">
                  <Button 
                    icon={<UnorderedListOutlined />}
                    onClick={handleViewAllCategories}
                  >
                    Tất cả danh mục
                  </Button>
                  <Dropdown
                    menu={{
                      items: filterItems,
                      onClick: handleFilter,
                      selectedKeys: [filterValue]
                    }}
                    placement="bottomRight"
                  >
                    <Button icon={<FilterOutlined />}>
                      Sắp xếp
                    </Button>
                  </Dropdown>
                </Space>
              </Col>
            </Row>
          </div>

          <Row gutter={[16, 16]}>
            {products?.map((product) => (
              <Col xs={24} sm={12} md={8} lg={6} key={product.productId}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>

          {products?.length === 0 && (
            <div className="text-center py-5">
              <Text type="secondary">
                Không có sản phẩm nào trong danh mục này
              </Text>
            </div>
          )}

          <div className="categories-pagination">
            <Pagination
              current={page}
              total={total}
              pageSize={limit}
              onChange={handlePageChange}
              className="categories-pagination-content"
              showSizeChanger
              pageSizeOptions={[10, 20, 30]}
            />
          </div>
        </Card>
      </Content>
    </Layout>
  );
};

export default CategoryProducts; 