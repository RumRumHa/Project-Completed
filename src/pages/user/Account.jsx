import React, { useEffect, useState } from 'react';
import { Tabs, Card, Avatar, Form, Input, Button, Upload, Radio, List, Popconfirm, Row, Col, Empty, Modal, Tag, Divider, Space, Select, Tooltip, Table, Checkbox } from 'antd';
import ProfileInfo from './account/ProfileInfo';
import useProfileInfo from './hooks/useProfileInfo';
import ChangePassword from './account/ChangePassword';
import { UserOutlined, LockOutlined, HomeOutlined, HeartOutlined, HistoryOutlined, UploadOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  fetchAddresses,
  deleteAddress,
  fetchWishlist,
  removeFromWishlist,
  fetchOrderHistory,
  cancelOrder,
  addAddress,
  updateAddress,
  fetchOrdersByStatus,
  fetchOrderDetail,
  fetchAddressById
} from '../../redux/reducers/user/accountSlice';
import { changePassword } from '../../redux/reducers/public/authSlice';
import { Link } from 'react-router-dom';
import { OrderStatus, OrderStatusLabels, OrderStatusColors } from '../../enums/OrderStatus';
import { setDefaultAddress } from '../../redux/reducers/user/accountSlice';
import Address from './account/Address';
import Wishlist from './account/Wishlist';
import useWishList from './hooks/useWishList';
import OrderHistory from './account/OrderHistory';
import OrderDetailModal from './account/OrderDetailModal';
import useOrderHistory from './hooks/useOrderHistory';
import useChangePassword from './hooks/useChangePassword';
import useAddress from './hooks/useAddress';
const { TabPane } = Tabs;

const Account = ({ defaultTab = 'profile' }) => {
  const dispatch = useDispatch();
  // Sử dụng custom hook cho order/history
  const {
    orders,
    loading: orderLoading,
    fetchAllOrders,
    handleStatusFilter,
    handleShowOrderDetail,
    handleCancelOrder,
    orderDetail,
    isOrderDetailVisible,
    handleCloseOrderDetail
  } = useOrderHistory();
  // Sử dụng custom hook cho wishlist
  const { wishlist, loading: wishlistLoading, fetchAllWishlist, handleRemoveFromWishlist } = useWishList();

  // Sử dụng custom hook cho profile info
  const {
    form,
    avatarUrl,
    loading: profileLoading,
    handleAvatarChange,
    handleUpdateProfile
  } = useProfileInfo();
  // Sử dụng custom hook cho đổi mật khẩu
  const {
    form: passwordForm,
    loading: passwordLoading,
    handleChangePassword
  } = useChangePassword();
  // Sử dụng custom hook cho địa chỉ
  const {
    addressForm,
    addresses,
    fetchAllAddresses,
    selectedAddress,
    loading: addressLoading,
    isAddressModalVisible,
    setIsAddressModalVisible,
    editingAddress,
    setEditingAddress,
    isAddressDetailVisible,
    setIsAddressDetailVisible,
    handleAddressSubmit,
    handleDeleteAddress,
    showAddressModal,
    showEditAddressModal,
    showAddressDetail,
    handleAddressModalCancel
  } = useAddress();

  useEffect(() => {
    fetchAllAddresses();  
    fetchAllWishlist();
    fetchAllOrders();
  }, [fetchAllAddresses, fetchAllWishlist, fetchAllOrders]);

  return (
    <Card>
      <Tabs defaultActiveKey={defaultTab}>
        <TabPane
          tab={
            <span>
              <UserOutlined />
              Hồ Sơ
            </span>
          }
          key="profile"
        >
          <ProfileInfo
            form={form}
            avatarUrl={avatarUrl}
            loading={profileLoading}
            handleAvatarChange={handleAvatarChange}
            handleUpdateProfile={handleUpdateProfile}
          />
        </TabPane>

        <TabPane
          tab={
            <span>
              <LockOutlined />
              Đổi Mật Khẩu
            </span>
          }
          key="password"
        >
          <ChangePassword
            form={passwordForm}
            loading={passwordLoading}
            handleChangePassword={handleChangePassword}
          />
        </TabPane>

        <TabPane
          tab={
            <span>
              <HomeOutlined />
              Địa Chỉ
            </span>
          }
          key="addresses"
        >
          <Address
            addresses={addresses}
            loading={addressLoading}
            selectedAddress={selectedAddress}
            isAddressModalVisible={isAddressModalVisible}
            isAddressDetailVisible={isAddressDetailVisible}
            editingAddress={editingAddress}
            addressForm={addressForm}
            showAddressModal={showAddressModal}
            showEditAddressModal={showEditAddressModal}
            handleAddressModalCancel={handleAddressModalCancel}
            handleAddressSubmit={handleAddressSubmit}
            handleDeleteAddress={handleDeleteAddress}
            showAddressDetail={showAddressDetail}
          />
        </TabPane>

        <TabPane
          tab={
            <span>
              <HeartOutlined />
              Danh Sách Yêu Thích
            </span>
          }
          key="wishlist"
        >
          <Wishlist
            wishlist={wishlist}
            loading={wishlistLoading}
            handleRemoveFromWishlist={handleRemoveFromWishlist}
          />
        </TabPane>

        <TabPane
          tab={
            <span>
              <HistoryOutlined />
              Lịch Sử Đơn Hàng
            </span>
          }
          key="orders"
        >
          <OrderHistory
            orders={orders}
            loading={orderLoading}
            OrderStatus={OrderStatus}
            handleStatusFilter={handleStatusFilter}
            handleShowOrderDetail={handleShowOrderDetail}
            handleCancelOrder={handleCancelOrder}
          />

          <OrderDetailModal
            open={isOrderDetailVisible}
            onCancel={handleCloseOrderDetail}
            orderDetail={orderDetail}
          />
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default Account;