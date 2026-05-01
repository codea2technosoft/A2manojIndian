import { Row, Col, Switch, Input } from 'antd';
import { BaseSelect } from 'components/Elements';

const BackendSettingForm = (props) => {
    const { platform, data, onChange } = props;

    const categories = [
        { label: 'Consumer Goods', value: 'Consumer Goods' },
        { label: 'Toys and Baby Products', value: 'Toys and Baby Products' },
        { label: 'Handbags and Luggage', value: 'Handbags and Luggage' },
        { label: 'Computers and Accessories', value: 'Computers and Accessories' },
        { label: 'Food Articles', value: 'Food Articles' },
        { label: 'Home Kitchen and Pets', value: 'Home Kitchen and Pets' },
        { label: 'Shoes', value: 'Shoes' },
        { label: 'Clothing and Accessories', value: 'Clothing and Accessories' },
        { label: 'Gift Item', value: 'Gift Item' },
        { label: 'Books', value: 'Books' },
        { label: 'Movies Music and Video Games', value: 'Movies Music and Video Games' },
        { label: 'Mobiles and Tablets', value: 'Mobiles and Tablets' },
        { label: 'Cameras Audio and Video', value: 'Cameras Audio and Video' },
        { label: 'Sports Fitness and Outdoors', value: 'Sports Fitness and Outdoors' },
        { label: 'Beauty Health and Gourmet', value: 'Beauty Health and Gourmet' },
        { label: 'Jewellery Watches and Eyewear', value: 'Jewellery Watches and Eyewear' },
        { label: 'Car Motorbike and Industrial', value: 'Car Motorbike and Industrial' },
        { label: 'Other', value: 'Other' },
    ];

    const autoBookingModes = [
        { label: 'As per selection by the customer', value: 'customer_selection' },
        { label: 'Lowest cost amongst all carriers for same mode', value: 'lowest_same_mode' },
        { label: 'Lowest cost amongst all carriers and all modes', value: 'lowest_of_all'}
    ];

    return (
        <div>
            <Row gutter={[48, 16]} className="mb-16">
                <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                    <Row justify='space-between' align="middle">
                        <div>Auto book when order is marked as Shipped</div>
                        <Switch
                            checked={data?.auto_booking}
                            onChange={(checked) => onChange(`${platform}.backend.auto_booking`, checked)}
                        />
                    </Row>
                </Col>
                {/* <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                    <Row justify='space-between' align="middle">
                        <div>Book orders via other shipping methods</div>
                        <Switch
                            checked={data?.book_via_other_methods}
                            onChange={(checked) => onChange(`${platform}.backend.book_via_other_methods`, checked)}
                        />
                    </Row>
                </Col> */}
                <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                    <Row justify='space-between' align="middle">
                        <div>Combine name and company name</div>
                        <Switch
                            checked={data?.combine_name_and_company_name}
                            onChange={(checked) => onChange(`${platform}.backend.combine_name_and_company_name`, checked)}
                        />
                    </Row>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                    <Row justify='space-between' align="middle">
                        <div>Phone number mandatory check</div>
                        <Row align="middle">
                            <Input
                                placeholder='Specify digits'
                                size='small'
                                className='mr-16'
                                value={data?.phone_digit_numbers}
                                onChange={(e) => onChange(`${platform}.backend.phone_digit_numbers`, e.target.value)}
                                style={{ width: 120 }}
                            />
                            <Switch
                                checked={data?.enable_check_phone}
                                onChange={(checked) => onChange(`${platform}.backend.enable_check_phone`, checked)}
                            />
                        </Row>
                    </Row>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                    <Row justify='space-between' align="middle">
                        <div>Allow alternative phone number</div>
                        <Row align="middle">
                            <Input
                                placeholder='Specify digits'
                                size='small'
                                className='mr-16'
                                value={data?.alt_phone_digit_numbers}
                                onChange={(e) => onChange(`${platform}.backend.alt_phone_digit_numbers`, e.target.value)}
                                style={{ width: 120 }}
                            />
                            <Switch
                                checked={data?.enable_alt_phone}
                                onChange={(checked) => onChange(`${platform}.backend.enable_alt_phone`, checked)}
                            />
                        </Row>
                    </Row>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                    <Row justify='space-between' align="middle">
                        <div>Allow prepaid shipping with offline payment method</div>
                        <Switch
                            checked={data?.allow_prepaid_shipping_with_offline_payment}
                            onChange={(checked) => onChange(`${platform}.backend.allow_prepaid_shipping_with_offline_payment`, checked)}
                        />
                    </Row>
                </Col>
            </Row>
            <Row className='mb-16' gutter={[48, 16]}>
                <Col xs={24} sm={24} md={24} lg={24}>
                    <div className='mb-8'>Category of products</div>
                    <BaseSelect
                        className="w-100"
                        options={categories}
                        value={data?.default_category}
                        onChange={(value) => onChange(`${platform}.backend.default_category`, value)}
                    />
                </Col>
            </Row>
            <Row className='mb-16' gutter={[48, 16]}>
                <Col xs={24} sm={24} md={12} lg={12}>
                    <div className='mb-8'>Default item weight</div>
                    <Input
                        addonAfter='kg'
                        value={data?.default_item_weight}
                        onChange={(e) => onChange(`${platform}.backend.default_item_weight`, e.target.value)}
                    />
                    <p>
                        <small>
                            The default item weight is used to calculate shipping rates for products with no
                            weight specified. To precisely calculate shipping costs for all of your products,
                            please specify their weight in product details.
                        </small>
                    </p>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12}>
                    <div className='mb-8'>Default package dimensions</div>
                    <Row gutter={[8, 8]}>
                        <Col xs={24} sm={24} md={8} lg={8}>
                            <Input
                                addonAfter='cm'
                                placeholder='Length'
                                value={data?.default_item_length}
                                onChange={(e) => onChange(`${platform}.backend.default_item_length`, e.target.value)}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={8}>
                            <Input
                                addonAfter='cm'
                                placeholder='Breadth'
                                value={data?.default_item_breadth}
                                onChange={(e) => onChange(`${platform}.backend.default_item_breadth`, e.target.value)}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={8}>
                            <Input
                                addonAfter='cm'
                                placeholder='Height'
                                value={data?.default_item_height}
                                onChange={(e) => onChange(`${platform}.backend.default_item_height`, e.target.value)}
                            />
                        </Col>
                    </Row>
                    <p>
                        <small>
                            The default package dimensions is used to calculate shipping rates for products with
                            no dimensions specified. To precisely calculate shipping costs for all of your
                            products, please specify their dimensions in product details.
                        </small>
                    </p>
                </Col>
            </Row>
            <Row className='mb-16' gutter={[48, 16]}>
                <Col xs={24} sm={24} md={12} lg={12}>
                    <div className='mb-8'>Reduce COD order value while booking</div>
                    <Input
                        addonBefore={'₹'}
                        placeholder="Amount"
                        value={data?.reduce_order_amount}
                        onChange={(e) => onChange(`${platform}.backend.reduce_order_amount`, e.target.value)}
                    />
                </Col>
                <Col xs={24} sm={24} md={12} lg={12}>
                    <div className='mb-8'>Auto booking mode</div>
                    <BaseSelect
                        className="w-100"
                        options={autoBookingModes}
                        value={data?.auto_booking_mode}
                        onChange={(value) => onChange(`${platform}.backend.auto_booking_mode`, value)}
                    />
                </Col>
            </Row>
        </div>
    )
}

export default BackendSettingForm;