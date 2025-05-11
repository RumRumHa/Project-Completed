import { Input, Button, Dropdown } from "antd";
import { FilterOutlined } from "@ant-design/icons";

const CommonFilter = ({ filterItems, filterValue, onFilter, searchInput, onSearch, onReset, isSearching, rightExtra }) => (
  <div className="content-filter">
    <Input.Search
      placeholder="Tìm kiếm..."
      allowClear
      value={searchInput}
      onChange={e => onSearch(e.target.value)}
      onSearch={onSearch}
      className="search-input"
      enterButton
    />
    <div className="filter-buttons">
      <Dropdown
        menu={{ items: filterItems, onClick: onFilter, selectedKeys: [filterValue] }}
        placement="bottomRight"
      >
        <Button icon={<FilterOutlined />}>Lọc</Button>
      </Dropdown>
      {isSearching && (
        <Button onClick={onReset}>Hiển thị tất cả</Button>
      )}
      {rightExtra}
    </div>
  </div>
);

export default CommonFilter;
