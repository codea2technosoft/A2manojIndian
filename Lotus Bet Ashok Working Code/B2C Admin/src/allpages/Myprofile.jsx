import React from 'react'

function Myprofile({setIsOpen}) {
  return (
    <div className='allcommon'>
        <section className="py-4 main-inner-outer">
  <div className="container-fluid">
    <div className="row">
      <div className="col-lg-12 col-md-12">
        <div className="inner-wrapper">
          <h2>profile</h2>
          <div className="account-table w-100">
            <div className="profile-tab table-color">
              <div className="row">
                <div className="col-md-7">
                  <div className="responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col" colSpan={4} className="text-start">
                            About You
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="text-start" width="25%">
                            First Name
                          </td>
                          <td className="text-start" colSpan={3} />
                        </tr>
                        <tr>
                          <td className="text-start" width="25%">
                            Last Name
                          </td>
                          <td className="text-start" colSpan={3} />
                        </tr>
                        <tr>
                          <td className="text-start" width="25%">
                            Birthday
                          </td>
                          <td className="text-start" colSpan={3}>
                            -----
                          </td>
                        </tr>
                        <tr>
                          <td className="text-start" width="25%">
                            Email
                          </td>
                          <td className="text-start" colSpan={3} />
                        </tr>
                        <tr>
                          <td className="text-start" width="25%">
                            Password
                          </td>
                          <td className="text-start">************</td>
                          <td className="p-2">
                            <a
                              className="text-decoration-none theme_dark_btn"
                              href="/my-profile"
                              onClick={() => setIsOpen(true)}
                            >
                              Edit <i className="fas fa-pen text-white ps-1" />
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <td className="text-start" width="25%">
                            Exposure
                          </td>
                          <td className="text-start" colSpan={3}>
                            0
                          </td>
                        </tr>
                        <tr>
                          <td className="text-start" width="25%">
                            Time Zone
                          </td>
                          <td className="text-start" colSpan={3}>
                            Asia/Kolkata
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="col-md-5">
                  {" "}
                  <div className="responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col" colSpan={4} className="text-start">
                            Contact Details
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="text-start">Primary Number</td>
                          <td className="text-start"> 0</td>
                        </tr>
                      </tbody>
                    </table>
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col" colSpan={2} className="text-start">
                            Set Deposit / Withdraw Limit Setting
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <button
                              type="button"
                              className="theme_light_btn btn btn-primary btn btn-primary"
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

    </div>
  )
}

export default Myprofile
