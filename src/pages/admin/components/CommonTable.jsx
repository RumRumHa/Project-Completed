import { Table, Spin } from "antd";
const CommonTable = ({ columns, dataSource, loading, rowKey, pagination = false, scroll, locale, ...rest }) => (
  <Table
    columns={columns}
    dataSource={dataSource}
    rowKey={rowKey}
    loading={loading}
    pagination={pagination}
    scroll={scroll}
    locale={locale || { emptyText: loading ? <Spin /> : 'Không có dữ liệu' }}
    bordered
    {...rest}
  />
);

export default CommonTable;
