import { Layout, Card, Spin, Pagination } from "antd";
import OrderFilter from "./components/OrderFilter";
import OrderTable from "./components/OrderTable";
import ModalOrder from "./ModalOrder";
import useOrderLogic from "./hooks/useOrderLogic";
import '../../styles/admin/index.css';
const { Content } = Layout;

const Orders = () => {
  const logic = useOrderLogic();

  return (
    <Layout className="content-container">
      <Content className="content-content">
        <Card title="Quản lý đơn hàng">
          <OrderFilter
            filterItems={logic.filterProps.filterItems}
            filterValue={logic.filterProps.filterValue}
            onFilter={logic.filterProps.onFilter}
            sortItems={logic.filterProps.sortItems}
            sortValue={logic.filterProps.sortValue}
            onSort={logic.filterProps.onSort}
            rightExtra={logic.filterProps.rightExtra}
          />
          <Spin spinning={logic.loading}>
            <OrderTable
              data={logic.tableProps.data}
              loading={logic.tableProps.loading}
              page={logic.tableProps.page}
              limit={logic.tableProps.limit}
              onView={logic.tableProps.onView}
              onDelete={logic.tableProps.onDelete}
            />
          </Spin>
          <div className="content-pagination">
            <Pagination
              current={logic.paginationProps.current}
              pageSize={logic.paginationProps.pageSize}
              total={logic.paginationProps.total}
              showSizeChanger={logic.paginationProps.showSizeChanger}
              showTotal={logic.paginationProps.showTotal}
              onChange={logic.paginationProps.onChange}
            />
          </div>
        </Card>
        <ModalOrder
          open={logic.modalProps.open}
          onCancel={logic.modalProps.onCancel}
          data={logic.modalProps.data}
          isView={logic.modalProps.isView}
          onSuccess={logic.modalProps.onSuccess}
        />
      </Content>
    </Layout>
  );
};

export default Orders;