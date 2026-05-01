import PropTypes from 'prop-types';
import { Button } from 'antd';
// images
import facebookIcon from 'assets/images/logo_facebook.svg';
// requests
import { loginViaFacebook } from 'requests/auth';

const FacebookButton = (props) => {
    const { title, className } = props;

    const onSignin = async () => {
        const response = await loginViaFacebook();

        window.location.href = response.redirect_url;
    }

    return (
        <Button className={`social-authentication-button social-authentication-button--facebook ${className}`} onClick={onSignin}>
            <span className="social-authentication-button--icon">
                <img src={facebookIcon} />
            </span>
            {title}
        </Button>
    )
}

FacebookButton.propTypes = {
    title: PropTypes.string.isRequired,
    className: PropTypes.string
}

FacebookButton.defaultProps = {
    title: "Signin via Facebook",
    className: ""
}

export default FacebookButton;