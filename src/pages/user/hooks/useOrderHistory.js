import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useState } from 'react';
import { fetchOrderHistory, fetchOrdersByStatus, fetchOrderDetail, cancelOrder } from '../../../redux/reducers/user/accountSlice';
import { toast } from 'react-toastify';

export default function useOrderHistory() {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector(state => state.account);
  const [orderDetail, setOrderDetail] = useState(null);
  const [isOrderDetailVisible, setIsOrderDetailVisible] = useState(false);

  // Lấy danh sách đơn hàng
  const fetchAllOrders = useCallback(() => {
    dispatch(fetchOrderHistory());
  }, [dispatch]);

  // Lọc đơn hàng theo trạng thái
  const handleStatusFilter = useCallback((value) => {
    if (value === 'ALL') {
      dispatch(fetchOrderHistory());
    } else {
      dispatch(fetchOrdersByStatus(value));
    }
  }, [dispatch]);

  // Xem chi tiết đơn hàng
  const handleShowOrderDetail = useCallback((orderId) => {
    dispatch(fetchOrderDetail(orderId))
      .unwrap()
      .then((data) => {
        setOrderDetail(data);
        setIsOrderDetailVisible(true);
      })
      .catch(() => toast.error('Không thể tải chi tiết đơn hàng'));
  }, [dispatch]);

  // Hủy đơn hàng
  const handleCancelOrder = useCallback((orderId) => {
    dispatch(cancelOrder(orderId))
      .unwrap()
      .then(() => {
        toast.success('Hủy đơn hàng thành công');
        dispatch(fetchOrderHistory());
      })
      .catch((error) => {
        toast.error(error || 'Không thể hủy đơn hàng');
      });
  }, [dispatch]);

  // Đóng modal chi tiết đơn hàng
  const handleCloseOrderDetail = useCallback(() => {
    setIsOrderDetailVisible(false);
    setOrderDetail(null);
  }, []);

  return {
    orders,
    loading,
    fetchAllOrders,
    handleStatusFilter,
    handleShowOrderDetail,
    handleCancelOrder,
    orderDetail,
    isOrderDetailVisible,
    handleCloseOrderDetail
  };
}
