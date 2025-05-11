import React, { useState, useEffect, useCallback } from 'react';
import { Card, Row, Col, Statistic, Spin, Table } from 'antd';
import { Line, Pie } from '@ant-design/plots';
import { useSelector, useDispatch } from 'react-redux';
import { getSalesRevenueOverTime, getRevenueByCategory, getInvoicesOverTime } from '../../../redux/reducers/admin/reportSlice';
import dayjs from 'dayjs';
import '../../../styles/admin/report.css';
import { formatPrice } from '../../../utils/formatPrice';
import DateRangeCard from '../components/DateRangeCard';
import SummaryStats from '../components/SummaryStats';
import ReportTable from '../components/ReportTable';

const RevenueReport = ({ type }) => {
    const dispatch = useDispatch();
    const { salesRevenue, revenueByCategory, invoicesOverTime, loading } = useSelector((state) => state.reportAdmin);
    const [dateRange, setDateRange] = useState([dayjs().subtract(30, 'days'), dayjs()]);

    const fetchData = useCallback(() => {
        if (dateRange[0] && dateRange[1]) {
            if (type === 'sales-revenue-over-time') {
                dispatch(getSalesRevenueOverTime({
                    from: dateRange[0].format('YYYY-MM-DD'),
                    to: dateRange[1].format('YYYY-MM-DD')
                }));
            } else if (type === 'revenue-by-category') {
                dispatch(getRevenueByCategory({
                    from: dateRange[0].format('YYYY-MM-DD'),
                    to: dateRange[1].format('YYYY-MM-DD')
                }));
            } else if (type === 'invoices-over-time') {
                dispatch(getInvoicesOverTime({
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

    const formatCurrency = (amount) => {
        return formatPrice(amount);
    };

    const renderRevenueChart = () => {
        const data = salesRevenue?.map(item => ({
            date: dayjs(item.date).format('DD/MM/YYYY'),
            totalRevenue: item.totalRevenue
        })) || [];

        const config = {
            data,
            xField: 'date',
            yField: 'totalRevenue',
            smooth: true,
            lineStyle: {
                stroke: '#1890ff',
                lineWidth: 2,
            },
            point: {
                size: 4,
                shape: 'circle',
                style: {
                    fill: '#1890ff',
                    stroke: '#fff',
                    lineWidth: 2,
                },
            },
            tooltip: {
                formatter: (datum) => {
                    return {
                        name: 'Doanh thu',
                        value: formatCurrency(datum.totalRevenue)
                    };
                },
            },
            yAxis: {
                label: {
                    formatter: (value) => formatCurrency(value)
                }
            }
        };

        return <Line {...config} />;
    };

    const renderRevenueByCategory = () => {
        const data = revenueByCategory?.map(item => ({
            type: item.categoryName,
            value: item.totalRevenue
        })) || [];

        const config = {
            data,
            angleField: 'value',
            colorField: 'type',
            radius: 0.8,
            label: {
                type: 'outer',
                content: '{name} {percentage}',
            },
            tooltip: {
                formatter: (datum) => {
                    return {
                        name: datum.type,
                        value: formatCurrency(datum.value)
                    };
                },
            },
            interactions: [
                {
                    type: 'element-active',
                },
            ],
        };

        return <Pie {...config} />;
    };

    const invoiceColumns = [
        {
            title: 'Ngày',
            dataIndex: 'date',
            key: 'date',
            render: (date) => dayjs(date).format('DD/MM/YYYY'),
            width: 120,
            sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
        },
        {
            title: 'Số lượng hóa đơn',
            dataIndex: 'invoiceCount',
            key: 'invoiceCount',
            width: 150,
            sorter: (a, b) => a.invoiceCount - b.invoiceCount,
        },
        {
            title: 'Tổng doanh thu',
            dataIndex: 'total',
            key: 'total',
            render: (revenue) => formatCurrency(revenue),
            width: 200,
            sorter: (a, b) => a.total - b.total,
        }
    ];

    const totalRevenue = salesRevenue?.reduce((sum, item) => sum + item.totalRevenue, 0) || 0;
    const totalInvoices = invoicesOverTime?.reduce((sum, item) => sum + item.invoiceCount, 0) || 0;
    const averageOrderValue = totalInvoices > 0 ? totalRevenue / totalInvoices : 0;

    return (
        <div className="report-container">
            <Row gutter={[16, 16]} className="report-container-row">
                <Col span={24}>
                    <DateRangeCard
                        value={dateRange}
                        onChange={setDateRange}
                    />
                </Col>
            </Row>

            {type === 'sales-revenue-over-time' && (
    <>
        <SummaryStats
            stats={[
                { title: 'Tổng doanh thu', value: totalRevenue, formatter: (v) => formatCurrency(v) },
                { title: 'Tổng số hóa đơn', value: totalInvoices },
                { title: 'Giá trị đơn hàng trung bình', value: averageOrderValue, formatter: (v) => formatCurrency(v) }
            ]}
        />
        <Spin spinning={loading}>
            <Row gutter={[16, 16]} className="report-container-row">
                <Col span={24}>
                    <Card title="Biểu đồ doanh thu theo thời gian" className="report-card">
                        {renderRevenueChart()}
                    </Card>
                </Col>
            </Row>
        </Spin>
    </>
)}

            {type === 'revenue-by-category' && (
                <Spin spinning={loading}>
                    <Row gutter={[16, 16]} className="report-container-row">
                        <Col span={24}>
                            <Card title="Doanh thu theo danh mục" className="report-card">
                                {renderRevenueByCategory()}
                            </Card>
                        </Col>
                    </Row>
                </Spin>
            )}

            {type === 'invoices-over-time' && (
    <>
        <SummaryStats
            stats={[
                { title: 'Tổng số hóa đơn', value: totalInvoices },
                { title: 'Tổng doanh thu', value: invoicesOverTime?.reduce((sum, item) => sum + item.total, 0) || 0, formatter: (v) => formatCurrency(v) },
            ]}
        />
        <ReportTable
            dataSource={invoicesOverTime}
            columns={invoiceColumns}
            loading={loading}
            pagination={{ pageSize: 10 }}
            rowKey="date"
        />
    </>
)}
        </div>
    );
};

export default RevenueReport; 