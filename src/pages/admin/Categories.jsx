import { Layout, Card, Space, Button, Spin, Pagination } from "antd";
import CommonFilter from "./components/CommonFilter";
import CategoryTable from "./components/CategoryTable";
import ModalCategory from "./ModalCategory";
import useCategoryLogic from "./hooks/useCategoryLogic";
import '../../styles/admin/index.css';

const { Content } = Layout;

function Category() {
  const logic = useCategoryLogic();

  return (
    <Layout className="content-container">
      <Content className="content-content">
        <Card title="Danh mục">
          <CommonFilter {...logic.filterProps} rightExtra={<Button type="primary" onClick={logic.handleAdd}>Thêm mới</Button>} />
          <Spin spinning={logic.loading}>
            <CategoryTable {...logic.tableProps} />
          </Spin>
          <div className="content-pagination">
            <Pagination {...logic.paginationProps} />
          </div>
        </Card>
        <ModalCategory {...logic.modalProps} />
      </Content>
    </Layout>
  );
}
export default Category;