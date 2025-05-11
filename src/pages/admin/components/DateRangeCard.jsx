import { Card, DatePicker } from 'antd';
const { RangePicker } = DatePicker;
const DateRangeCard = ({ value, onChange, loading }) => (
  <Card>
    <RangePicker value={value} onChange={onChange} className="report-date-picker" disabled={loading} />
  </Card>
);
export default DateRangeCard;
