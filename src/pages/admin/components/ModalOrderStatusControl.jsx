import { Select } from "antd";
import { OrderStatus, OrderStatusLabels } from "../../../enums/OrderStatus";

const { Option } = Select;

const ModalOrderStatusControl = ({ status, onChange, disabled }) => (
  <Select
    value={status}
    onChange={onChange}
    style={{ width: 200 }}
    disabled={disabled}
  >
    {Object.entries(OrderStatus).map(([value]) => (
      <Option key={value} value={value}>
        {OrderStatusLabels[value]}
      </Option>
    ))}
  </Select>
);

export default ModalOrderStatusControl;
