import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTopSpendingCustomers, getNewAccountsThisMonth, getInvoicesOverTime } from '../../../redux/reducers/admin/reportSlice';
import dayjs from 'dayjs';
import { formatPrice } from '../../../utils/formatPrice';
import '../../../styles/admin/report.css';
import DateRangeCard from '../components/DateRangeCard';
import SummaryStats from '../components/SummaryStats';
import ReportTable from '../components/ReportTable';
import { Avatar } from 'antd';

const CustomerReport = ({ type }) => {
    const dispatch = useDispatch();
    const { topSpendingCustomers, newAccounts, invoicesOverTime, loading } = useSelector((state) => state.reportAdmin);
    const [dateRange, setDateRange] = useState([dayjs().subtract(30, 'days'), dayjs()]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    // Debounced fetch logic
    const fetchData = useCallback(() => {
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
    }, [dispatch, dateRange, type, page, limit]);

    useEffect(() => {
        const timeout = setTimeout(fetchData, 200);
        return () => clearTimeout(timeout);
    }, [fetchData]);

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

    // Summary stats config
    const summaryStats = type === 'top-spending-customers' ? [
        {
            title: 'Tổng chi tiêu',
            value: topSpendingCustomers?.reduce((sum, item) => sum + item.totalSpent, 0) || 0,
            formatter: (value) => formatPrice(value)
        },
    ] : type === 'invoices-over-time' ? [
        {
            title: 'Tổng số hóa đơn',
            value: invoicesOverTime?.reduce((sum, item) => sum + item.invoiceCount, 0) || 0,
        },
        {
            title: 'Tổng doanh thu',
            value: invoicesOverTime?.reduce((sum, item) => sum + item.total, 0) || 0,
            formatter: (value) => formatPrice(value)
        },
    ] : [];

    // Table data & columns
    const tableData = type === 'top-spending-customers'
        ? topSpendingCustomers
        : Array.isArray(newAccounts)
            ? [...newAccounts].sort((a, b) => dayjs(b.createdAt).unix() - dayjs(a.createdAt).unix())
            : Array.isArray(newAccounts?.data)
                ? [...newAccounts.data].sort((a, b) => dayjs(b.createdAt).unix() - dayjs(a.createdAt).unix())
                : [];
    const tableColumns = type === 'top-spending-customers' ? topSpendingColumns : newAccountsColumns;
    const tableRowKey = type === 'top-spending-customers' ? 'customerId' : type === 'new-accounts-this-month' ? 'userId' : 'date';
    const tablePagination = {
        current: page,
        pageSize: limit,
        showSizeChanger: true,
        pageSizeOptions: ['5', '10', '20', '50'],
        total: type === 'top-spending-customers'
            ? topSpendingCustomers?.length || 0
            : newAccounts?.total || newAccounts?.length || 0,
        onChange: (current, pageSize) => {
            setPage(current);
            setLimit(pageSize);
        }
    };

    return (
        <div className="report-container">
            <DateRangeCard value={dateRange} onChange={setDateRange} loading={loading} />
            {summaryStats.length > 0 && <SummaryStats stats={summaryStats} />}
            <ReportTable
                dataSource={tableData}
                columns={tableColumns}
                loading={loading}
                pagination={tablePagination}
                rowKey={tableRowKey}
            />
        </div>
    );
};

export default CustomerReport;