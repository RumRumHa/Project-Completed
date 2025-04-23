export const OrderStatus = {
    WAITING: 'WAITING',
    CONFIRM: 'CONFIRM',
    DELIVERY: 'DELIVERY',
    SUCCESS: 'SUCCESS',
    CANCEL: 'CANCEL',
    DENIED: 'DENIED'
};

export const OrderStatusLabels = {
    [OrderStatus.WAITING]: 'Chờ xử lý',
    [OrderStatus.CONFIRM]: 'Đã xác nhận',
    [OrderStatus.DELIVERY]: 'Đang giao hàng',
    [OrderStatus.SUCCESS]: 'Đã giao hàng',
    [OrderStatus.CANCEL]: 'Đã hủy',
    [OrderStatus.DENIED]: 'Đã từ chối'
};

export const OrderStatusColors = {
    [OrderStatus.WAITING]: 'orange',
    [OrderStatus.CONFIRM]: 'blue',
    [OrderStatus.DELIVERY]: 'purple',
    [OrderStatus.SUCCESS]: 'green',
    [OrderStatus.CANCEL]: 'red',
    [OrderStatus.DENIED]: 'red'
}; 

export const OrderStatusNotes = {
    [OrderStatus.WAITING]: 'Đơn hàng đang chờ xử lý',
    [OrderStatus.CONFIRM]: 'Đơn hàng đã được xác nhận',
    [OrderStatus.DELIVERY]: 'Đơn hàng đang được giao',
    [OrderStatus.SUCCESS]: 'Đơn hàng đã được giao thành công',
    [OrderStatus.CANCEL]: 'Đơn hàng đã bị hủy',
    [OrderStatus.DENIED]: 'Đơn hàng đã bị từ chối'
};