import React, { useState, useEffect } from 'react';
import { Card, Row, Col, DatePicker, Spin, Table, Statistic } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { getBestSellerProducts, getMostLikedProducts } from '../../../redux/reducers/admin/reportSlice';
import dayjs from 'dayjs';
import { formatPrice } from '../../../utils/formatPrice';
import '../../../styles/admin/report.css';

const { RangePicker } = DatePicker;

const ProductReport = ({ type }) => {
    const dispatch = useDispatch();
    const { bestSellerProducts, mostLikedProducts, loading } = useSelector((state) => state.reportAdmin);
    const [dateRange, setDateRange] = useState([dayjs().subtract(30, 'days'), dayjs()]);

    useEffect(() => {
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

    const bestSellerColumns = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            width: 60,
            render: (_, __, index) => index + 1,
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
            render: (_, __, index) => index + 1,
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

    const getTotalRevenue = () => {
        return bestSellerProducts?.reduce((sum, item) => sum + item.totalRevenue, 0) || 0;
    };

    const getTotalQuantity = () => {
        return bestSellerProducts?.reduce((sum, item) => sum + item.totalQuantity, 0) || 0;
    };

    const getTotalLikes = () => {
        return mostLikedProducts?.reduce((sum, item) => sum + item.totalLikes, 0) || 0;
    };

    return (
        <div className="report-container">
            <Row gutter={[16, 16]} className="report-container-row">
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

            {type === 'best-seller-products' ? (
                <Row gutter={[16, 16]} className="report-container-row">
                    <Col span={12}>
                        <Card>
                            <Statistic
                                title="Tổng doanh thu"
                                value={getTotalRevenue()}
                                formatter={(value) => formatPrice(value)}
                            />
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card>
                            <Statistic
                                title="Tổng số lượng bán"
                                value={getTotalQuantity()}
                            />
                        </Card>
                    </Col>
                </Row>
            ) : (
                <Row gutter={[16, 16]} className="report-container-row">
                    <Col span={12}>
                        <Card>
                            <Statistic
                                title="Tổng số lượt thích"
                                value={getTotalLikes()}
                            />
                        </Card>
                    </Col>
                </Row>
            )}

            <Spin spinning={loading}>
                <Row gutter={[16, 16]} className="report-container-row">
                    <Col span={24}>
                        <Card 
                            title={type === 'best-seller-products' ? 'Top sản phẩm bán chạy' : 'Top sản phẩm yêu thích'}
                        >
                            <Table
                                dataSource={type === 'best-seller-products' ? bestSellerProducts : mostLikedProducts}
                                columns={type === 'best-seller-products' ? bestSellerColumns : mostLikedColumns}
                                pagination={{ pageSize: 10 }}
                                scroll={{ x: 'max-content' }}
                                rowKey="productId"
                            />
                        </Card>
                    </Col>
                </Row>
            </Spin>
        </div>
    );
};

export default ProductReport; 