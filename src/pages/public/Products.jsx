import { Button, Input, Typography, Dropdown } from "antd";
import { FilterOutlined, SearchOutlined, UnorderedListOutlined } from "@ant-design/icons";
import '../../styles/public/index.css'
import ProductListSection from "./components/ProductListSection";
import useProductList from "./hooks/useProductList";
const { Text } = Typography;

const Products = () => {
  const {
    products,
    loading,
    total,
    page,
    setPage,
    limit,
    setLimit,
    filterValue,
    setFilterValue,
    productType,
    setProductType,
    searchInput,
    setSearchInput,
    isSearching,
    setIsSearching,
    handleFilter,
    handleProductTypeChange,
    handleSearch,
    handleReset,
    handlePageChange,
    getProductTypeLabel,
    categoryId,
    navigate,
    productTypeItems,
    filterItems,
  } = useProductList();

  const extraFilterBar = (
    <>
      {categoryId ? (
        <Button icon={<UnorderedListOutlined />} onClick={() => navigate('/categories')}>
          Tất cả danh mục
        </Button>
      ) : (
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
      )}
      {!categoryId && (
        <Input.Search
          placeholder="Tìm kiếm sản phẩm..."
          allowClear
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onSearch={handleSearch}
          style={{ width: 300 }}
          enterButton={<SearchOutlined />}
        />
      )}
      {!categoryId && isSearching && (
        <Button onClick={handleReset}>Hiển thị tất cả</Button>
      )}
    </>
  );

  let emptyText = 'Chưa có sản phẩm nào';
  let sectionTitle = 'Tất cả sản phẩm';
  if (categoryId) {
    emptyText = 'Không có sản phẩm nào trong danh mục này';
    sectionTitle = 'Sản phẩm theo danh mục';
  } else {
    if (isSearching) {
      emptyText = `Không tìm thấy sản phẩm nào cho "${searchInput}"`;
    } else if (productType !== 'all') {
      emptyText = `Không có sản phẩm ${getProductTypeLabel().toLowerCase()}`;
    }
    sectionTitle =
      productType === 'featured' ? 'Sản phẩm nổi bật' :
      productType === 'new' ? 'Sản phẩm mới' :
      productType === 'best-seller' ? 'Sản phẩm bán chạy' :
      'Tất cả sản phẩm';
  }

  return (
    <div className="categories-page">
      {isSearching && (
        <Text style={{ display: 'block', marginBottom: 16 }}>
          Tìm thấy {total} kết quả cho "{searchInput}"
        </Text>
      )}
      <ProductListSection
        title={sectionTitle}
        products={products}
        loading={loading}
        total={total}
        filterItems={filterItems}
        filterValue={filterValue}
        onFilterChange={handleFilter}
        page={page}
        limit={limit}
        onPageChange={handlePageChange}
        emptyText={emptyText}
        extraFilterBar={extraFilterBar}
      />
    </div>
  );
};

export default Products; 