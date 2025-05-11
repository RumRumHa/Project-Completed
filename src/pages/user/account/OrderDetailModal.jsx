import React from 'react';
import { Modal, Row, Col, Divider, Tag, Table, Avatar, Space } from 'antd';
import { OrderStatusLabels, OrderStatusColors } from '../../../enums/OrderStatus';
import { formatPrice } from '../../../utils/formatPrice';

const OrderDetailModal = ({ open, onCancel, orderDetail }) => {
  return (
    <Modal
      title={`Chi tiết đơn hàng #${orderDetail?.serialNumber}`}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      {orderDetail && (
        <div>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <h4>Thông tin đơn hàng</h4>
              <p>Ngày đặt: {new Date(orderDetail.orderDate).toLocaleString('vi-VN')}</p>
              <p>Trạng thái: <Tag color={OrderStatusColors[orderDetail.orderStatus]}>{OrderStatusLabels[orderDetail.orderStatus]}</Tag></p>
              <p>Ghi chú: {orderDetail.note || 'Không có'}</p>
            </Col>
            <Col span={12}>
              <h4>Thông tin giao hàng</h4>
              <p>Người nhận: {orderDetail.receiveName}</p>
              <p>Số điện thoại: {orderDetail.receivePhone}</p>
              <p>Địa chỉ: {orderDetail.receiveAddress}</p>
            </Col>
          </Row>

          <Divider />

          <h4>Chi tiết sản phẩm</h4>
          <Table
            dataSource={orderDetail.orderDetails}
            pagination={false}
            rowKey="orderDetailId"
            columns={[
              {
                title: 'Sản phẩm',
                dataIndex: 'productName',
                render: (text, record) => (
                  <Space>
                    <Avatar shape="square" size={64} src={record.mainImageUrl} />
                    <span>{text}</span>
                  </Space>
                ),
              },
              {
                title: 'Đơn giá',
                dataIndex: 'unitPrice',
                align: 'right',
                render: (price) => formatPrice(price),
              },
              {
                title: 'Số lượng',
                dataIndex: 'orderQuantity',
                align: 'center',
              },
              {
                title: 'Thành tiền',
                align: 'right',
                render: (_, record) => formatPrice(record.unitPrice * record.orderQuantity),
              },
            ]}
            summary={() => (
              <Table.Summary.Row>
                <Table.Summary.Cell colSpan={3} align="right">
                  <strong>Tổng tiền hàng:</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell align="right">
                  <strong>{formatPrice(orderDetail.totalPrice)}</strong>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            )}
          />

          <Row justify="end" style={{ marginTop: 16 }}>
            <Col>
              <Space direction="vertical" align="end">
                <div>Tổng tiền hàng: {formatPrice(orderDetail.totalPrice)}</div>
                <div>Phí vận chuyển: {formatPrice(orderDetail.shippingFee || 0)}</div>
                <div><strong>Tổng thanh toán: {formatPrice(orderDetail.totalPrice + (orderDetail.shippingFee || 0))}</strong></div>
              </Space>
            </Col>
          </Row>
        </div>
      )}
    </Modal>
  );
};

export default OrderDetailModal;
