import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getOrders, getOrdersByStatus, getOrderById, deleteOrder } from "../../../redux/reducers/admin/orderSlice";
import { toast } from "react-toastify";
import { Button, Popconfirm, Space, Table, Pagination, Form, Input, Spin, Card, Typography, Dropdown, Tag, Tooltip } from "antd";
import { DeleteOutlined, EyeOutlined, FilterOutlined } from "@ant-design/icons";
import { OrderStatusLabels, OrderStatusColors } from "../../../enums/OrderStatus";

const useOrderLogic = () => {
    const dispatch = useDispatch();
    const { data: orders, loading, total, currentOrder } = useSelector((state) => state.orderAdmin);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterValue, setFilterValue] = useState('all');
    const [sortValue, setSortValue] = useState('createdAt_desc');
    const [isViewMode, setIsViewMode] = useState(true);
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                if (filterValue === 'all') {
                    await dispatch(getOrders({
                        page,
                        limit,
                        ...getSortParams()
                    })).unwrap();
                } else {
                    await dispatch(getOrdersByStatus({
                        status: filterValue,
                        page,
                        limit,
                        ...getSortParams()
                    })).unwrap();
                }
            } catch (error) {
                toast.error(error?.message || 'Không thể tải danh sách đơn hàng');
            }
        };
        fetchOrders();
    }, [dispatch, page, limit, filterValue, sortValue]);

    const getSortParams = () => {
        const [sortBy, orderBy] = sortValue.split('_');
        return { sortBy, orderBy };
    };

    const handleViewDetail = async (orderId) => {
        try {
            await dispatch(getOrderById(orderId)).unwrap();
            setIsModalOpen(true);
            setIsViewMode(false);
        } catch (error) {
            toast.error(error?.message || 'Không thể tải thông tin đơn hàng');
        }
    };
    const handleDelete = async (id) => {
        const result = await dispatch(deleteOrder(id));
        if (result.meta.requestStatus === "fulfilled") {
            toast.success("Xóa đơn hàng thành công!");
            if (orders.length === 1 && page > 1) {
                setPage(page - 1);
            } else {
                refreshData();
            }
        } else {
            toast.error("Lỗi khi xóa đơn hàng.");
        }
    };
    const refreshData = async () => {
        try {
            if (filterValue === 'all') {
                await dispatch(getOrders({
                    page,
                    limit,
                    ...getSortParams()
                })).unwrap();
            } else {
                await dispatch(getOrdersByStatus({
                    status: filterValue,
                    page,
                    limit,
                    ...getSortParams()
                })).unwrap();
            }
        } catch (error) {
            toast.error(error?.message || 'Không thể tải lại danh sách đơn hàng');
        }
    };
    const handleCancel = () => {
        setIsModalOpen(false);
        setIsViewMode(true);
    };
    const handleFilter = ({ key }) => {
        setFilterValue(key);
        setPage(1);
    };
    const handleSort = ({ key }) => {
        setSortValue(key);
        setPage(1);
    };
    // const getStatusColor = (status) => {
    //     return OrderStatusColors[status] || 'default';
    // };
    // const getStatusText = (status) => {
    //     return OrderStatusLabels[status] || status;
    // };
    const onChangePage = (page, pageSize) => {
        setPage(page);
        setLimit(pageSize);
    };

    const filterItems = [
        {
            key: 'all',
            label: 'Tất cả',
        },
        ...Object.entries(OrderStatusLabels).map(([value, label]) => ({
            key: value,
            label
        }))
    ];

    const sortItems = [
        {
            key: 'createdAt_desc',
            label: 'Mới nhất',
        },
        {
            key: 'createdAt_asc',
            label: 'Cũ nhất',
        },
        {
            key: 'totalPrice_desc',
            label: 'Giá trị cao đến thấp',
        },
        {
            key: 'totalPrice_asc',
            label: 'Giá trị thấp đến cao',
        },
    ];

    return {
        filterProps: {
            filterItems,
            filterValue,
            onFilter: handleFilter,
            sortItems,
            sortValue,
            onSort: handleSort,
            rightExtra: undefined
        },
        tableProps: {
            data: orders,
            loading,
            page,
            limit,
            onView: handleViewDetail,
            onDelete: handleDelete
        },
        paginationProps: {
            current: page,
            pageSize: limit,
            total,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} đơn hàng`,
            onChange: onChangePage
        },
        modalProps: {
            open: isModalOpen,
            onCancel: handleCancel,
            data: currentOrder,
            isView: isViewMode,
            onSuccess: refreshData
        },
        loading
    };
};

export default useOrderLogic;