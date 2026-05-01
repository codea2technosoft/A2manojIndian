import { Divider, Button } from 'antd';
import 'assets/styles/customer.scss';
import { ChevronDown } from 'react-iconly';
import { RefreshIcon } from '@heroicons/react/solid';
import PropTypes from 'prop-types';

const CurrenViewing = (props) => {
    const filter = props.filter  ?? 'All Customers'
    return (
        <div>
            <span className='text-medium text-16'>Currently viewing : </span>
            <span className='text-16 text-primary pointer'>{filter} <ChevronDown set="bold" size={14}/></span>
            <Divider type='vertical' style={{backgroundColor: 'black', borderWidth: 1}}/>
            <Button className='btn1' icon={<RefreshIcon className='icon-btn' />} onClick={props.onRefresh}>Refresh</Button>
        </div>
    )
}
CurrenViewing.propTypes = {
	onRefresh: PropTypes.func
};
CurrenViewing.defaultProps = {
    onRefresh: () => {},
};

export default CurrenViewing;