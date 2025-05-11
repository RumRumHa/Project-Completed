import React from 'react';
import { List, Button, Avatar, Empty } from 'antd';
import { Link } from 'react-router-dom';

const Wishlist = ({ wishlist, loading, handleRemoveFromWishlist }) => (
  <List
    itemLayout="horizontal"
    dataSource={wishlist}
    loading={loading}
    locale={{
      emptyText: (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Danh sách yêu thích trống"
        />
      )
    }}
    renderItem={item => (
      <List.Item
        actions={[
          <Button danger onClick={() => handleRemoveFromWishlist(item.wishListId)}>
            Xóa
          </Button>
        ]}
      >
        <List.Item.Meta
          avatar={
            <Avatar
              src={item.productImage?.[0]}
              shape="square"
              size={64}
            />
          }
          title={
            <Link className='text-decoration-none' to={`/products/${item.productId}`}>
              {item.productName}
            </Link>
          }
          description={
            <div>
              <div className="text-danger">
                {item.productPrice?.toLocaleString('vi-VN')}đ
              </div>
              <div className="text-muted">
                {item.productDescription.slice(0, 50)}...
              </div>
            </div>
          }
        />
      </List.Item>
    )}
  />
);

export default Wishlist;
