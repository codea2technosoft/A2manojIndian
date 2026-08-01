import React from "react";

function VideoLists() {
  return (
    <div className="container mt-5">
      <h1>Simple HTML Page in React</h1>
      <p>Welcome to the minimal React page with plain HTML content.</p>

      <hr />

      <h2>Users Table</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Sr.</th>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>John Doe</td>
            <td>john@example.com</td>
            <td>Active</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Jane Smith</td>
            <td>jane@example.com</td>
            <td>Inactive</td>
          </tr>
        </tbody>
      </table>

      <button className="btn btn-primary">Click Me</button>
    </div>
  );
}

export default VideoLists;
