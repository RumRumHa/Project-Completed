import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getBestSellerProducts, getMostLikedProducts } from '../../../redux/reducers/admin/reportSlice';
import dayjs from 'dayjs';
import { formatPrice } from '../../../utils/formatPrice';
import '../../../styles/admin/report.css';
import DateRangeCard from '../components/DateRangeCard';
import SummaryStats from '../components/SummaryStats';
import ReportTable from '../components/ReportTable';

const ProductReport = ({ type }) => {
    const dispatch = useDispatch();
    const { bestSellerProducts, mostLikedProducts, loading } = useSelector((state) => state.reportAdmin);
    const [dateRange, setDateRange] = useState([dayjs().subtract(30, 'days'), dayjs()]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    // Debounced fetch logic
    const fetchData = useCallback(() => {
        if (dateRange[0] && dateRange[1]) {
            if (type === 'best-seller-products') {
                dispatch(getBestSellerProducts({
                    from: dateRange[0].format('YYYY-MM-DD'),
                    to: dateRange[1].format('YYYY-MM-DD')
                }));
            } else if (type === 'most-liked-products') {
                dispatch(getMostLikedProducts({
                    from: dateRange[0].format('YYYY-MM-DD'),
                    to: dateRange[1].format('YYYY-MM-DD')
                }));
            }
        }
    }, [dispatch, dateRange, type]);

    useEffect(() => {
        const timeout = setTimeout(fetchData, 200);
        return () => clearTimeout(timeout);
    }, [fetchData]);

    const bestSellerColumns = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            width: 60,
            render: (_, __, index) => (page - 1) * limit + index + 1,
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'productName',
            key: 'productName',
            width: 200,
        },
        {
            title: 'Số lượng bán',
            dataIndex: 'totalQuantity',
            key: 'totalQuantity',
            width: 120,
            sorter: (a, b) => a.totalQuantity - b.totalQuantity,
        },
        {
            title: 'Doanh thu',
            dataIndex: 'totalRevenue',
            key: 'totalRevenue',
            width: 150,
            render: (revenue) => formatPrice(revenue),
            sorter: (a, b) => a.totalRevenue - b.totalRevenue,
        }
    ];

    const mostLikedColumns = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            width: 60,
            render: (_, __, index) => (page - 1) * limit + index + 1,
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'productName',
            key: 'productName',
            width: 200,
        },
        {
            title: 'Số lượt thích',
            dataIndex: 'totalLikes',
            key: 'totalLikes',
            width: 120,
            sorter: (a, b) => a.totalLikes - b.totalLikes,
        }
    ];

    // Summary stats config
    const summaryStats = type === 'best-seller-products' ? [
        {
            title: 'Tổng doanh thu',
            value: bestSellerProducts?.reduce((sum, item) => sum + item.totalRevenue, 0) || 0,
            formatter: (value) => formatPrice(value)
        },
        {
            title: 'Tổng số lượng bán',
            value: bestSellerProducts?.reduce((sum, item) => sum + item.totalQuantity, 0) || 0,
        },
    ] : type === 'most-liked-products' ? [
        {
            title: 'Tổng số lượt thích',
            value: mostLikedProducts?.reduce((sum, item) => sum + item.totalLikes, 0) || 0,
        }
    ] : [];

    // Table data & columns
    const tableData = type === 'best-seller-products' ? bestSellerProducts : mostLikedProducts;
    const tableColumns = type === 'best-seller-products' ? bestSellerColumns : mostLikedColumns;
    const tableRowKey = 'productId';
    const tablePagination = {
        current: page,
        pageSize: limit,
        showSizeChanger: true,
        pageSizeOptions: ['5', '10', '20', '50'],
        total: tableData?.length || 0,
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

export default ProductReport;