import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Row, Card, Col, DatePicker } from 'antd';
import TableBar from 'components/TableBar';
import { FaSearch } from 'react-icons/fa';

const { RangePicker } = DatePicker;

function FileSearch() {
    const location = useLocation();
    const navigate = useNavigate();
    const [mode, setMode] = useState('today');
    const [dates, setDates] = useState([dayjs(), dayjs()]);
    const searchRef = useRef(null);
    const config = useSelector((state) => state.config);
    const [isOpen, setIsOpen] = useState(false);
    const handleClick = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            {isOpen && (
                <div className="search_input">
                    <TableBar
                        type="text"
                        placeholder="Search"
                        // onSearch={onSearch}
                        // onFilter={onToggleFilter}
                        // isActiveFilter={isShowFilter}
                        inputRef={searchRef}
                        showFilter={false}
                    />
                </div>
            )}
            <div className="search_box">
                <div className="search" onClick={handleClick}>
                    <FaSearch />
                </div>
            </div>
        </>
    );
}

export default FileSearch;
