import React, { useState } from "react";
import { Layout, Menu, theme, Avatar, Dropdown, Space } from "antd";
import { AppstoreOutlined, ShoppingCartOutlined, UserOutlined, DashboardOutlined, LogoutOutlined, SettingOutlined, ShoppingOutlined, FormOutlined, BarChartOutlined } from "@ant-design/icons";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import ModalUser from "../pages/admin/ModalUser";
import '../styles/admin/index.css'

const { Header, Content, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem('Trang chủ', '', <DashboardOutlined />),
  getItem('Quản lý danh mục', 'categories', <AppstoreOutlined />),
  getItem('Quản lý sản phẩm', 'products', <ShoppingCartOutlined />),
  getItem('Quản lý người dùng', 'users', <UserOutlined />),
  getItem('Quản lý đơn hàng', 'orders', <ShoppingOutlined />),
  getItem('Báo cáo', 'reports', <FormOutlined />, [
    getItem('Số lượng hóa đơn', 'reports/invoices-over-time', <BarChartOutlined />),
    getItem('Doanh thu theo thời gian', 'reports/sales-revenue-over-time', <BarChartOutlined />),
    getItem('Doanh thu theo danh mục', 'reports/revenue-by-category', <BarChartOutlined />),
    getItem('Sản phẩm bán chạy', 'reports/best-seller-products', <ShoppingOutlined />),
    getItem('Sản phẩm yêu thích', 'reports/most-liked-products', <ShoppingOutlined />),
    getItem('Khách hàng chi tiêu nhiều', 'reports/top-spending-customers', <UserOutlined />),
    getItem('Tài khoản mới', 'reports/new-accounts-this-month', <UserOutlined />),
  ]),
];

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.authPublic.user) || JSON.parse(Cookies.get("user") || "{}");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isViewMode, setIsViewMode] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      Cookies.remove("token");
      Cookies.remove("role");
      Cookies.remove("user");
      window.location.href = "/login";
    } else if (key === "account") {
      setEditData(user);
      setIsViewMode(true);
      setIsModalOpen(true);
    } else {
      navigate(`/admin/${key}`);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditData(null);
    setIsViewMode(false);
  };

  const getSelectedKey = () => {
    const currentPath = location.pathname.replace("/admin/", "");
    return currentPath === "" ? "" : currentPath;
  };

  const userMenu = (
    <Menu
      items={[
        {
          key: 'account',
          label: 'Hồ sơ cá nhân',
          icon: <UserOutlined />,
        },
        {
          key: 'settings',
          label: 'Cài đặt',
          icon: <SettingOutlined />,
        },
        {
          type: 'divider',
        },
        {
          key: 'logout',
          label: 'Đăng xuất',
          icon: <LogoutOutlined />,
          danger: true,
        },
      ]}
      onClick={handleMenuClick}
    />
  );

  return (
    <Layout className="admin-layout">
      <Sider 
        width={250}
        collapsedWidth={80}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        className="admin-sider"
        breakpoint="lg"
      >
        <div className="admin-sider-header">
          <Space direction="vertical" size={8}>
            <Avatar 
              size={64} 
              src={user.avatar} 
              className="admin-sider-avatar"
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            />
            {!collapsed && (
              <>
                <div className="admin-sider-title">
                  ADMIN PANEL
                </div>
                <div className="admin-sider-subtitle">
                  Xin chào, Admin!
                </div>
              </>
            )}
          </Space>
        </div>
        
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          onClick={handleMenuClick}
          items={items}
          className="admin-sider-menu"
          inlineIndent={16}
        />
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 220, transition: "all 0.2s" }}>
        <Header className="admin-layout-content-header" style={{ background: colorBgContainer }}>
          <div className="admin-layout-content-header-title">
            {items.find(item => item.key === getSelectedKey())?.label || 'Trang chủ'}
          </div>
          
          <Space size="large">
            <Dropdown menu={userMenu} placement="bottomRight">
              <Space className="admin-user-info">
                <Avatar 
                  size="small" 
                  src={user.avatar}
                />
                <span className="admin-user-info-name">{user.fullname}</span>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        <Content className="admin-layout-content" style={{ background: colorBgContainer, borderRadius: borderRadiusLG }}>
          <Outlet />
        </Content>
      </Layout>

      <ModalUser 
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        editData={editData}
        handleCancel={handleCancel}
        refreshData={() => {}}
        isViewMode={isViewMode}
        setIsViewMode={setIsViewMode}
      />
    </Layout>
  );
};

export default AdminLayout;