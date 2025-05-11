import React, { useEffect, useState } from "react";
import BaseModal from "./components/BaseModal";
import ModalOrderInfo from "./components/ModalOrderInfo";
import ModalOrderItems from "./components/ModalOrderItems";
import ModalOrderStatusControl from "./components/ModalOrderStatusControl";
import { useDispatch } from "react-redux";
import { updateOrderStatus } from "../../redux/reducers/admin/orderSlice";
import { toast } from "react-toastify";
import { OrderStatusNotes } from "../../enums/OrderStatus";

const ModalOrder = ({ 
  open, 
  onCancel, 
  data: initialData,
  onSuccess,
  isView
}) => {
  const dispatch = useDispatch();
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const handleStatusChange = async (status) => {
    try {
      setLoading(true);
      const note = OrderStatusNotes[status];
      await dispatch(updateOrderStatus({ 
        orderId: data.orderId, 
        status,
        note
      })).unwrap();
      setData(prev => ({ ...prev, status, note }));
      toast.success("Cập nhật trạng thái đơn hàng thành công!");
      onSuccess?.();
    } catch (error) {
      toast.error(error?.message || "Lỗi khi cập nhật trạng thái đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  if (!data) {
    return (
      <BaseModal
        title="👁️ Chi tiết đơn hàng"
        open={open}
        onCancel={onCancel}
        loading={true}
        width={800}
        bodyStyle={{ padding: 24 }}
      >
        <div>Đang tải dữ liệu...</div>
      </BaseModal>
    );
  }

  return (
    <BaseModal
      title="👁️ Chi tiết đơn hàng"
      open={open}
      onCancel={onCancel}
      loading={loading}
      width={800}
      bodyStyle={{ padding: 24 }}
    >
      <ModalOrderInfo data={data} />
      <div style={{ margin: '24px 0 8px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontWeight: 500 }}>Trạng thái:</span>
        <ModalOrderStatusControl
          status={data.status}
          onChange={handleStatusChange}
          disabled={isView || loading}
        />
      </div>
      <h3 style={{ marginTop: 24 }}>Chi tiết đơn hàng</h3>
      <ModalOrderItems items={data.orderDetails} />
    </BaseModal>
  );
};

export default ModalOrder;