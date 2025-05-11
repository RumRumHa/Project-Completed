import { Table, Empty } from 'antd';
const ReportTable = ({ dataSource, columns, loading, pagination, rowKey }) => (
  <Table
    dataSource={dataSource}
    columns={columns}
    loading={loading}
    pagination={pagination}
    rowKey={rowKey}
    scroll={{ x: 'max-content' }}
    locale={{ emptyText: <Empty description="Không có dữ liệu" /> }}
  />
);
export default ReportTable;
