import { Layout, Card, Spin, Pagination, Button } from "antd";
import ProductFilter from "./components/ProductFilter";
import ProductTable from "./components/ProductTable";
import ModalProduct from "./ModalProduct";
import useProductLogic from "./hooks/useProductLogic";
import '../../styles/admin/index.css';

const { Content } = Layout;

const Products = () => {
  const logic = useProductLogic();

  return (
    <Layout className="content-container">
      <Content className="content-content">
        <Card title="Quản lý sản phẩm">
          <ProductFilter {...logic.filterProps} rightExtra={<Button type="primary" onClick={logic.handleAdd}>Thêm sản phẩm</Button>} />
          <Spin spinning={logic.loading}>
            <ProductTable {...logic.tableProps} />
          </Spin>
          <div className="content-pagination">
            <Pagination {...logic.paginationProps} />
          </div>
        </Card>
        <ModalProduct {...logic.modalProps} categories={logic.categories} />
      </Content>
    </Layout>
  );
};

export default Products;