import React from 'react';
// import { Tabs } from 'antd';
export default function Playcommon() {
    
    // const onChange = (key) => {
    //     console.log(key);
    //   };
    //   const items = [
    //     {
    //       key: '1',
    //       label: 'Tab 1',
    //       children: 'Content of Tab Pane 1',
    //     },
    //     {
    //       key: '2',
    //       label: 'Tab 2',
    //       children: 'Content of Tab Pane 2',
    //     },
    //     {
    //       key: '3',
    //       label: 'Tab 3',
    //       children: 'Content of Tab Pane 3',
    //     },
    //     {
    //       key: '4',
    //       label: 'Tab 4',
    //       children: 'Content of Tab Pane 4',
    //     },
    //     {
    //       key: '5',
    //       label: 'Tab 5',
    //       children: 'Content of Tab Pane 4',
    //     },
    //   ];
  return (
    <>
      <section className="margin-bottom-88" id="Playcommon">
            <div className="d-flex justify-content-between align-items-center gameandtime">
                <div className="gamename fw-bold">
                     London Bazar
                </div>
                <div className="timer">
                        <p>Timer Left</p>
                        <span> 01:00:45</span>|
                        <small>Active</small>
                </div>
            </div>
            <div className="tabsplay">
            {/* <Tabs defaultActiveKey="1" items={items} onChange={onChange} /> */}
            
            </div>
      </section>
    </>
  )
}
