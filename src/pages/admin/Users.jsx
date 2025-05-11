import { Layout, Card, Spin, Pagination, Button } from "antd";
import ModalUser from "./ModalUser";
import useUserLogic from "./hooks/useUserLogic";
import CommonFilter from "./components/CommonFilter";
import UserTable from "./components/UserTable";
import '../../styles/admin/index.css';
const { Content } = Layout;
function Users() {
  const logic = useUserLogic();
  return (
    <Layout className="content-container">
      <Content className="content-content">
        <Card title="Quản lý người dùng">
          <CommonFilter {...logic.filterProps} rightExtra={<Button type="primary" onClick={logic.handleAdd}>Thêm người dùng</Button>} />
          <Spin spinning={logic.loading}>
            <UserTable {...logic.tableProps} />
          </Spin>
          <div className="content-pagination">
            <Pagination {...logic.paginationProps} />
          </div>
        </Card>
        <ModalUser {...logic.modalProps} />
      </Content>
    </Layout>
  );
}

export default Users;