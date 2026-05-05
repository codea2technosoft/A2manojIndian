import PropTypes from 'prop-types';
import { Button } from 'antd';
// images
import googleIcon from 'assets/images/logo_google.svg';
// requests
import { loginViaGoogle } from 'requests/auth';

const GoogleButton = (props) => {
    const { title, className } = props;

    const onSignin = async () => {
        const response = await loginViaGoogle();

        window.location.href = response.redirect_url;
    }

    return (
        <Button className={`social-authentication-button social-authentication-button--google ${className}`} onClick={onSignin}>
            <span className="social-authentication-button--icon">
                <img src={googleIcon} />
            </span>
            {title}
        </Button>
    )
}

GoogleButton.propTypes = {
    title: PropTypes.string.isRequired,
    className: PropTypes.string
}

GoogleButton.defaultProps = {
    title: "Signin via Google",
    className: ""
}

export default GoogleButton;