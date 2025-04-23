import { Button, Dropdown } from "antd";
import { FilterOutlined } from "@ant-design/icons";

const OrderFilter = ({ filterItems, filterValue, onFilter, sortItems, sortValue, onSort, rightExtra }) => (
  <div className="filter-buttons-order">
    <Dropdown
      menu={{
        items: filterItems,
        onClick: onFilter,
        selectedKeys: [filterValue],
      }}
    >
      <Button icon={<FilterOutlined />}>
        {filterItems.find(item => item.key === filterValue)?.label || 'Lọc'}
      </Button>
    </Dropdown>
    <Dropdown
      menu={{
        items: sortItems,
        onClick: onSort,
        selectedKeys: [sortValue],
      }}
    >
      <Button>
        {sortItems.find(item => item.key === sortValue)?.label || 'Sắp xếp'}
      </Button>
    </Dropdown>
    {rightExtra}
  </div>
);

export default OrderFilter;
