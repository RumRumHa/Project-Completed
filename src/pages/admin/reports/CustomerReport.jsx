import React, { useState, useEffect } from 'react';
import { Card, Row, Col, DatePicker, Spin, Table, Statistic, Avatar } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { getTopSpendingCustomers, getNewAccountsThisMonth, getInvoicesOverTime } from '../../../redux/reducers/admin/reportSlice';
import dayjs from 'dayjs';
import { formatPrice } from '../../../utils/formatPrice';
import '../../../styles/admin/report.css';

const { RangePicker } = DatePicker;

const CustomerReport = ({ type }) => {
    const dispatch = useDispatch();
    const { topSpendingCustomers, newAccounts, invoicesOverTime, loading } = useSelector((state) => state.reportAdmin);
    const [dateRange, setDateRange] = useState([dayjs().subtract(30, 'days'), dayjs()]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    useEffect(() => {
        if (dateRange[0] && dateRange[1]) {
            if (type === 'top-spending-customers') {
                dispatch(getTopSpendingCustomers({
                    from: dateRange[0].format('YYYY-MM-DD'),
                    to: dateRange[1].format('YYYY-MM-DD')
                }));
            } else if (type === 'new-accounts-this-month') {
                dispatch(getNewAccountsThisMonth({
                    month: dateRange[1].month() + 1,
                    year: dateRange[1].year(),
                    page,
                    limit
                }));
            } else if (type === 'invoices-over-time') {
                dispatch(getInvoicesOverTime({
                    from: dateRange[0].format('YYYY-MM-DD'),
                    to: dateRange[1].format('YYYY-MM-DD')
                }));
            }
        }
    }, [dispatch, dateRange, type]);

    const topSpendingColumns = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            width: 60,
            render: (_, __, index) => (page - 1) * limit + index + 1,
        },
        {
            title: 'Người dùng',
            dataIndex: 'customerName',
            key: 'customerName',
            width: 200,
        },
        {
            title: 'Tổng chi tiêu',
            dataIndex: 'totalSpent',
            key: 'totalSpent',
            width: 150,
            render: (amount) => formatPrice(amount),
            sorter: (a, b) => a.totalSpent - b.totalSpent,
        }
    ];

    const newAccountsColumns = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            width: 60,
            render: (_, __, index) => (page - 1) * limit + index + 1,
        },
        {
            title: 'Người dùng',
            dataIndex: 'fullname',
            key: 'fullname',
            width: 200,
            render: (text, record) => (
                <div className="user-info">
                    <Avatar src={record.avatar} />
                    <span>{text}</span>
                </div>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 200,
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
            width: 150,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 150,
            render: (date) => dayjs(date).format('DD/MM/YYYY'),
            sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
            defaultSortOrder: 'descend'
        }
    ];

    const getTotalSpent = () => {
        return topSpendingCustomers?.reduce((sum, item) => sum + item.totalSpent, 0) || 0;
    };


    const getTotalInvoices = () => {
        return invoicesOverTime?.reduce((sum, item) => sum + item.invoiceCount, 0) || 0;
    };

    const getTotalInvoiceRevenue = () => {
        return invoicesOverTime?.reduce((sum, item) => sum + item.total, 0) || 0;
    };

    return (
        <div className="report-container">
            <Row gutter={[16, 16]} className='report-container-row'>
                <Col span={24}>
                    <Card>
                        <RangePicker
                            value={dateRange}
                            onChange={setDateRange}
                            className="report-date-picker"
                        />
                    </Card>
                </Col>
            </Row>

            {type === 'top-spending-customers' && (
                <Row gutter={[16, 16]} className="report-container-row">
                    <Col span={12}>
                        <Card>
                            <Statistic
                                title="Tổng chi tiêu"
                                value={getTotalSpent()}
                                formatter={(value) => formatPrice(value)}
                            />
                        </Card>
                    </Col>
                </Row>
            )}

            {type === 'invoices-over-time' && (
                <Row gutter={[16, 16]} className="report-container-row">
                    <Col span={12}>
                        <Card>
                            <Statistic
                                title="Tổng số hóa đơn"
                                value={getTotalInvoices()}
                            />
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card>
                            <Statistic
                                title="Tổng doanh thu"
                                value={getTotalInvoiceRevenue()}
                                formatter={(value) => formatPrice(value)}
                            />
                        </Card>
                    </Col>
                </Row>
            )}

            <Spin spinning={loading}>
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Card 
                            title={
                                type === 'top-spending-customers' ? 'Top khách hàng chi tiêu nhiều' : 'Danh sách tài khoản mới'
                            }
                        >
                            <Table
                                dataSource={
                                    type === 'top-spending-customers'
                                        ? topSpendingCustomers
                                        : Array.isArray(newAccounts)
                                            ? [...newAccounts].sort((a, b) => dayjs(b.createdAt).unix() - dayjs(a.createdAt).unix())
                                            : Array.isArray(newAccounts?.data)
                                                ? [...newAccounts.data].sort((a, b) => dayjs(b.createdAt).unix() - dayjs(a.createdAt).unix())
                                                : []
                                }
                                columns={
                                    type === 'top-spending-customers' ? topSpendingColumns : newAccountsColumns
                                }
                                pagination={{
                                    current: page,
                                    pageSize: limit,
                                    showSizeChanger: true,
                                    pageSizeOptions: ['5', '10', '20', '50'],
                                    total: type === 'top-spending-customers'
                                        ? topSpendingCustomers?.length || 0
                                        : newAccounts?.total || newAccounts?.length || 0
                                }}
                                onChange={(pagination) => {
                                    setPage(pagination.current);
                                    setLimit(pagination.pageSize);
                                }}
                                scroll={{ x: 'max-content' }}
                                rowKey={
                                    type === 'top-spending-customers' ? 'customerId' :
                                    type === 'new-accounts-this-month' ? 'userId' :
                                    'date'
                                }
                            />
                        </Card>
                    </Col>
                </Row>
            </Spin>
        </div>
    );
};

export default CustomerReport; 