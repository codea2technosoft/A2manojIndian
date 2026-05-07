import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FilterIcon, SearchIcon } from "@heroicons/react/outline";
import { Row, Input } from "antd";
import _ from 'lodash';


const TableBar = (props) => {
    const { showFilter, onFilter, showSearch, onSearch } = props;
    const [activeFilter, setActiveFilter] = useState(false);

    const onClickFilter = () => {
        if (!activeFilter) {
            setActiveFilter(true);
            onFilter();
        } else {
            setActiveFilter(false);
        }
    }

    const onChangeInput = _.debounce(onSearch, 1000);

    return (
        <Row>
            {
                showFilter ? (
                    <div className={`app-circle-icon filter-button ${activeFilter ? 'app-circle-icon--active' : ''}`} onClick={onClickFilter}>
                        <FilterIcon width={24} height={24} />
                    </div>
                ) : null
            }
            {
                showSearch ? (
                    <Input
                        placeholder="Search..."
                        prefix={<SearchIcon width={24} height={24} />}
                        className="search-input"
                        allowClear
                        onChange={(e) => onChangeInput(e.target.value)}
                    />
                ) : null
            }
        </Row>
    )
}

TableBar.propTypes = {
    showFilter: PropTypes.bool,
    onFilter: PropTypes.func,
    showSearch: PropTypes.bool,
    onSearch: PropTypes.func,
}

TableBar.defaultProps = {
    showFilter: true,
    onFilter: () => { },
    showSearch: true,
    onSearch: () => { },
}

export default TableBar;