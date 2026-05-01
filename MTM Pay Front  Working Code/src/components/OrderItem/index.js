import { Avatar, Row } from "antd";
import { Bag } from 'react-iconly';

const OrderItem = (props) => {
    const { orderItem, currency } = props;

    return (
        <Row align="top" className="mb-8">
            <div>
            {
                orderItem.image ? (
                    <Avatar shape="square" size={36} src={orderItem.image} className="mt-8 mr-8" />
                ) : (
                    <Avatar shape="square" size={36} icon={<Bag set='light'/>} className="mt-8 mr-8" />
                )
            }
            </div>
            <div>
                <div>
                    <strong><small>{orderItem.name}</small></strong>
                    <span className="text-gray ml-8"><small>{orderItem.sku}</small></span>
                </div>
                {
                    orderItem.options && orderItem.options.map((option, index) => (
                        <div key={index}>
                            <small>{option.name}: {option.value}</small>
                        </div>
                    ))
                }
                <div>
                    <small>{orderItem.quantity} x {currency} {orderItem.price}</small>
                </div>
            </div>
        </Row>
    );
}

export default OrderItem;