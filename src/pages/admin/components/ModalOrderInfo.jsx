import { Descriptions, Tag } from "antd";
import { OrderStatusLabels } from "../../../enums/OrderStatus";
import { formatPrice } from "../../../utils/formatPrice";

const ModalOrderInfo = ({ data }) => {
  if (!data) return null;
  return (
    <Descriptions bordered column={2} size="small">
      <Descriptions.Item label="Mã đơn hàng">{data.serialNumber}</Descriptions.Item>
      <Descriptions.Item label="Ngày đặt hàng">{new Date(data.createdAt).toLocaleString('vi-VN')}</Descriptions.Item>
      <Descriptions.Item label="Ngày nhận hàng">{data.receivedAt ? new Date(data.receivedAt).toLocaleString('vi-VN') : 'Chưa nhận hàng'}</Descriptions.Item>
      <Descriptions.Item label="Khách hàng">{data.userName}</Descriptions.Item>
      <Descriptions.Item label="Người nhận">{data.receiveName}</Descriptions.Item>
      <Descriptions.Item label="Số điện thoại">{data.receivePhone}</Descriptions.Item>
      <Descriptions.Item label="Địa chỉ nhận hàng" span={2}>{data.receiveAddress}</Descriptions.Item>
      <Descriptions.Item label="Ghi chú" span={2}>{data.note || 'Không có ghi chú'}</Descriptions.Item>
      <Descriptions.Item label="Trạng thái">
        <Tag color="blue">{OrderStatusLabels[data.status]}</Tag>
      </Descriptions.Item>
      <Descriptions.Item label="Tổng tiền">
        <Tag color="blue">{formatPrice(data.totalPrice)}</Tag>
      </Descriptions.Item>
    </Descriptions>
  );
};

export default ModalOrderInfo;
