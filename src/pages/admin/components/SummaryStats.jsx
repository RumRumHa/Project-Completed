import { Row, Col, Card, Statistic } from 'antd';
const SummaryStats = ({ stats }) => (
  <Row gutter={[16, 16]} className="report-container-row">
    {stats.map(({ title, value, formatter }, idx) => (
      <Col span={24 / stats.length} key={title}>
        <Card>
          <Statistic title={title} value={value} formatter={formatter} />
        </Card>
      </Col>
    ))}
  </Row>
);
export default SummaryStats;
