import React from 'react'
import Heading from '../../Layout/Heading'
import password from '../../asset/image/changepass.png'
import transferuser from '../../asset/image/transferuser.png'
function Adminsetting() {
  return (
    <div>
      <Heading title="Admin Setting"/>
      <div className="setting_dashboard">
  <div className="setting_dashboard_block">
    <h2 className="common-heading">General Settings</h2>
    <ul>
      <li>
        <a href="/general-setting">
         
          <figure>
           
            <img
              src={password}
              alt="Change Password"
            />
          </figure>
        </a>
      </li>
      <li>
        <a href="/transfer-agent">
         
          <figure>
           
            <img
              src={transferuser}
              alt="Promotional"
              style={{ height: 129, width: "100%" }}
            />
          </figure>
        </a>
      </li>
    </ul>
  </div>
</div>

    </div>
  )
}

export default Adminsetting
