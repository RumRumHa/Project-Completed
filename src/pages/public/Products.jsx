import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchProducts, fetchFeaturedProducts, fetchNewProducts, fetchBestSellerProducts, fetchProductsByKeyword } from "../../redux/reducers/public/productSlice";
import { Button, Space, Layout, Pagination, Input, Spin, Card, Typography, Dropdown, Image, Tooltip, Row, Col } from "antd";
import { FilterOutlined, SearchOutlined, StarOutlined, FireOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { Content } from "antd/es/layout/layout";
import { useSearchParams } from "react-router-dom";
import ProductCard from "./components/ProductCard";
import '../../styles/public/index.css'
import { fetchWishlist } from "../../redux/reducers/user/accountSlice";
const { Text } = Typography;

const Products = () => {
  const dispatch = useDispatch();
  const { data, searchResults, loading, total, featuredProducts, newProducts, bestSellerProducts } = useSelector((state) => state.productPublic);
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(Math.max(1, parseInt(searchParams.get('page')) || 1));
  const [limit, setLimit] = useState(parseInt(searchParams.get('limit')) || 10);
  const [searchInput, setSearchInput] = useState(searchParams.get('keyword') || "");
  const [isSearching, setIsSearching] = useState(!!searchParams.get('keyword'));
  const [filterValue, setFilterValue] = useState(searchParams.get('sort') || 'all');
  const [productType, setProductType] = useState(searchParams.get('type') || 'all');

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

  const productTypeItems = [
    {
      key: 'all',
      label: 'Tất cả sản phẩm',
      icon: <FilterOutlined />,
    },
    {
      key: 'featured',
      label: 'Sản phẩm nổi bật',
      icon: <StarOutlined />,
    },
    {
      key: 'new',
      label: 'Sản phẩm mới',
      icon: <ClockCircleOutlined />,
    },
    {
      key: 'best-seller',
      label: 'Sản phẩm bán chạy',
      icon: <FireOutlined />,
    },
  ];
  useEffect(() => {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', page);
    if (limit !== 10) params.set('limit', limit);
    if (isSearching) params.set('keyword', searchInput);
    if (filterValue !== 'all') params.set('sort', filterValue);
    if (productType !== 'all') params.set('type', productType);
    setSearchParams(params);

    const fetchData = async () => {
      const fetchParams = { 
        page: Math.max(1, page), 
        limit, 
        ...getSortParams() 
      };
      
      if (isSearching) {
        fetchParams.keyword = searchInput;
        await dispatch(fetchProductsByKeyword(fetchParams));
      } else {
        switch (productType) {
          case 'featured':
            await dispatch(fetchFeaturedProducts(fetchParams));
            break;
          case 'new':
            await dispatch(fetchNewProducts(fetchParams));
            break;
          case 'best-seller':
            await dispatch(fetchBestSellerProducts(fetchParams));
            break;
          default:
            await dispatch(fetchProducts(fetchParams));
            break;
        }
      }
    };

    fetchData();
  }, [dispatch, page, limit, isSearching, filterValue, productType]);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [])
  const getSortParams = () => {
    if (filterValue === 'all') return {};
    const [sortBy, orderBy] = filterValue.split('_');
    return { sortBy, orderBy };
  };

  const handleSearch = () => {
    if (searchInput.trim()) {
      setIsSearching(true);
      setPage(1);
    } else {
      handleReset();
    }
  };

  const handleReset = () => {
    setSearchInput("");
    setIsSearching(false);
    setPage(1);
  };

  const handleFilter = ({ key }) => {
    setFilterValue(key);
    setPage(1);
  };

  const handleProductTypeChange = ({ key }) => {
    setProductType(key);
    setPage(1);
  };

  const getProductTypeLabel = () => {
    const selectedType = productTypeItems.find(item => item.key === productType);
    return selectedType ? selectedType.label : 'Tất cả sản phẩm';
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
      ...(searchInput && { keyword: searchInput }),
      ...(filterValue !== 'all' && { sort: filterValue }),
      ...(productType !== 'all' && { type: productType })
    });
  };

  const getCurrentProducts = () => {
    if (isSearching) return searchResults;
    switch (productType) {
      case 'featured':
        return featuredProducts;
      case 'new':
        return newProducts;
      case 'best-seller':
        return bestSellerProducts;
      default:
        return data;
    }
  };

  if (loading) return <div className="text-center py-5"><Spin size="large" /></div>;

  return (
    <Layout className="categories-page">
      <Content>
        <Card>
          <div className="mb-4">
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} md={12}>
                <h1 className="mb-0">
                  {productType === 'featured' ? 'Sản phẩm nổi bật' :
                   productType === 'new' ? 'Sản phẩm mới' :
                   productType === 'best-seller' ? 'Sản phẩm bán chạy' :
                   'Tất cả sản phẩm'}
                </h1>
              </Col>
              <Col xs={24} md={12}>
                <Space className="categories-filter-space">
                  <Dropdown
                    menu={{
                      items: productTypeItems,
                      onClick: handleProductTypeChange,
                      selectedKeys: [productType]
                    }}
                    placement="bottomRight"
                  >
                    <Button icon={<FilterOutlined />}>
                      {getProductTypeLabel()}
                    </Button>
                  </Dropdown>
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
                  <Input.Search
                    placeholder="Tìm kiếm sản phẩm..."
                    allowClear
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onSearch={handleSearch}
                    style={{ width: 300 }}
                    enterButton={<SearchOutlined />}
                  />
                  {isSearching && (
                    <Button onClick={handleReset}>Hiển thị tất cả</Button>
                  )}
                </Space>
              </Col>
            </Row>
          </div>

          {isSearching && (
            <Text style={{ display: 'block', marginBottom: 16 }}>
              Tìm thấy {total} kết quả cho "{searchInput}"
            </Text>
          )}

          <Row gutter={[16, 16]}>
            {getCurrentProducts()?.map((product) => (
              <Col xs={24} sm={12} md={8} lg={6} key={product.productId}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>

          {getCurrentProducts()?.length === 0 && (
            <div className="text-center py-5">
              <Text type="secondary">
                {isSearching 
                  ? `Không tìm thấy sản phẩm nào cho "${searchInput}"`
                  : productType !== 'all'
                  ? `Không có sản phẩm ${getProductTypeLabel().toLowerCase()}`
                  : 'Chưa có sản phẩm nào'}
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

export default Products; 