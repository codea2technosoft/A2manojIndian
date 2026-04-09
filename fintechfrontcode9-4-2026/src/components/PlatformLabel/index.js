import { useEffect, useState } from "react";
import { Row } from "antd";
// images
import ecwidImg from 'assets/images/ecwid.png';
// import shopifyImg from 'assets/images/shopify.svg';
// import woocommerceImg from 'assets/images/woo.svg';

const PlatformLabel = ({type}) => {
    const [image, setImage] = useState(null);
    const [name, setName] = useState('');

    useEffect(() => {
        let img, name;

        if (type === 1) {
            img = ecwidImg;
            name = 'Ecwid';
        } else if (type === 2) {
            // img = shopifyImg;
            name = 'Shopify';
        } else if (type === 3) {
            // img = woocommerceImg;
            name = 'Woocommerce';
        } else {
            img = '';
            name = 'Other';
        }

        setImage(img);
        setName(name);
    }, [type]);

    return (
        <Row align="middle">
            { image ? <img src={image} className="img-contain" height={20} /> : null }
            <span className="ml-8">{name}</span>
        </Row>
    )
}

export default PlatformLabel;