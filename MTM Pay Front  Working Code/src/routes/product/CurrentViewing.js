import { Divider, Button } from 'antd';
import 'assets/styles/customer.scss';
import { RefreshIcon } from '@heroicons/react/solid';
import PropTypes from 'prop-types';

const CurrentViewing = (props) => {
	const filter = props.filter ?? 'All Products';
	return (
		<div>
			<span className="text-medium text-16">Currently viewing : </span>
			<span className="text-16 text-primary pointer">{filter}</span>
			<Divider type="vertical" style={{ backgroundColor: 'black', borderWidth: 1 }} />
			<Button className="btn1" icon={<RefreshIcon className="icon-btn" />} onClick={props.onRefresh}>
				Refresh
			</Button>
		</div>
	);
};
CurrentViewing.propTypes = {
	onRefresh: PropTypes.func,
};
CurrentViewing.defaultProps = {
	onRefresh: () => {},
};

export default CurrentViewing;
