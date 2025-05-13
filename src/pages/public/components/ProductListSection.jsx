import React from 'react';
import { Card, Row, Col, Pagination, Spin, Typography, Space, Dropdown, Button } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import ProductCard from './ProductCard';

const { Text } = Typography;

/**
 * Props:
 * - title: tiêu đề section
 * - products: mảng sản phẩm
 * - loading: trạng thái loading
 * - total: tổng số sản phẩm
 * - filterItems: mảng filter/sort
 * - filterValue: giá trị filter hiện tại
 * - onFilterChange: hàm xử lý đổi filter
 * - page, limit, onPageChange: phân trang
 * - emptyText: text khi không có sản phẩm
 * - extraFilterBar: phần tử bổ sung trên filter bar (ví dụ nút "Tất cả danh mục")
 */
function ProductListSection({
  title,
  products = [],
  loading = false,
  total = 0,
  filterItems = [],
  filterValue = 'all',
  onFilterChange,
  page = 1,
  limit = 10,
  onPageChange,
  emptyText = 'Không có sản phẩm nào',
  extraFilterBar = null,
  showPagination = true,
  isSearching = false,
  searchInput = '',
}) {
  return (
    <Card>
      {title && <h1 className="mb-0">{title}</h1>}
      <div className="mb-4">
        {isSearching && (
          <Text style={{ display: 'block', marginBottom: 16 }}>
            Tìm thấy {total} kết quả cho "{searchInput}"
          </Text>
        )}
        <Space className="categories-filter-space">
          {extraFilterBar}
          {filterItems.length > 0 && (
            <Dropdown
              menu={{
                items: filterItems,
                onClick: onFilterChange,
                selectedKeys: [filterValue],
              }}
              placement="bottomRight"
            >
              <Button icon={<FilterOutlined />}>Sắp xếp</Button>
            </Dropdown>
          )}
        </Space>
      </div>
      {loading ? (
        <div className="text-center py-5"><Spin size="large" /></div>
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {products.map((product) => (
              <Col xs={24} sm={12} md={8} lg={6} key={product.productId}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
          {products.length === 0 && (
            <div className="text-center py-5">
              <Text type="secondary">{emptyText}</Text>
            </div>
          )}
          {showPagination && (
            <div className="categories-pagination">
              <Pagination
                current={page}
                total={total}
                pageSize={limit}
                onChange={onPageChange}
                className="categories-pagination-content"
                showSizeChanger
                pageSizeOptions={[10, 20, 30]}
              />
            </div>
          )}
        </>
      )}
    </Card>
  );
}

export default ProductListSection;
