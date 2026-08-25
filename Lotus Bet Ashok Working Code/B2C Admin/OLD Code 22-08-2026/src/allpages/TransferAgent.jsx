import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
  getAllAgentsLists,
  getUsersByAgent,
  getAgentTransfertouser
} from "../Server/api";

function TransferAgent() {
  // State for agents and users
  const [agentList, setAgentList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [userListData, setUserListData] = useState([]); // Store full user objects
  
  // State for selected values
  const [fromAgent, setFromAgent] = useState('');
  const [fromAgentId, setFromAgentId] = useState(''); // Store admin_id
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(''); // Store user _id
  const [toAgent, setToAgent] = useState('');
  const [toAgentId, setToAgentId] = useState(''); // Store admin_id
  
  // State for dropdown visibility
  const [fromAgentDropdown, setFromAgentDropdown] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [toAgentDropdown, setToAgentDropdown] = useState(false);
  
  // State for search terms
  const [fromAgentSearch, setFromAgentSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [toAgentSearch, setToAgentSearch] = useState('');
  
  // State for filtered lists
  const [filteredFromAgents, setFilteredFromAgents] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredToAgents, setFilteredToAgents] = useState([]);
  
  // State for loading and messages
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Store full agent objects for reference
  const [allAgentsData, setAllAgentsData] = useState([]);

  // Fetch all agents on component mount
  useEffect(() => {
    fetchAllAgents();
  }, []);

  // Fetch all agents from API
  const fetchAllAgents = async () => {
    setLoading(true);
    try {
      const response = await getAllAgentsLists();
      console.log("All Agents Response:", response);
      
      // Handle both response structures
      let agents = response?.data?.data || response?.data || response || [];
      
      // Check if agents is array and contains objects
      if (Array.isArray(agents) && agents.length > 0) {
        // Store full agent data
        setAllAgentsData(agents);
        console.log("All Agents Data:", agents);
        
        // Extract agent names (username) for display
        const agentNames = agents.map(agent => agent.username || agent._id || agent.name || agent);
        setAgentList(agentNames);
        setFilteredFromAgents(agentNames);
        setFilteredToAgents(agentNames);
      } else {
        console.error("Invalid agents data format:", agents);
        setAgentList([]);
        setFilteredFromAgents([]);
        setFilteredToAgents([]);
        setAllAgentsData([]);
      }
    } catch (error) {
      console.error("Error fetching agents:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load agents list",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter from agents based on search
  useEffect(() => {
    if (fromAgentSearch) {
      setFilteredFromAgents(
        agentList.filter(agent => 
          String(agent).toLowerCase().includes(fromAgentSearch.toLowerCase())
        )
      );
    } else {
      setFilteredFromAgents(agentList);
    }
  }, [fromAgentSearch, agentList]);

  // Filter users based on search
  useEffect(() => {
    if (userSearch && userList.length > 0) {
      setFilteredUsers(
        userList.filter(user => 
          String(user).toLowerCase().includes(userSearch.toLowerCase())
        )
      );
    } else {
      setFilteredUsers(userList);
    }
  }, [userSearch, userList]);

  // Filter to agents based on search and exclude from agent
  useEffect(() => {
    let availableAgents = agentList.filter(agent => agent !== fromAgent);
    
    if (toAgentSearch) {
      availableAgents = availableAgents.filter(agent =>
        String(agent).toLowerCase().includes(toAgentSearch.toLowerCase())
      );
    }
    
    setFilteredToAgents(availableAgents);
  }, [toAgentSearch, fromAgent, agentList]);

  // Handle from agent selection
  const handleFromAgentSelect = (agentName) => {
    // Find the full agent object
    const selectedAgent = allAgentsData.find(agent => agent.username === agentName);
    
    console.log("Selected Agent:", selectedAgent);
    
    setFromAgent(agentName);
    setFromAgentSearch(agentName);
    setFromAgentDropdown(false);
    
    // Send admin_id to backend
    if (selectedAgent) {
      setFromAgentId(selectedAgent.admin_id);
      console.log("From Agent admin_id:", selectedAgent.admin_id);
    } else {
      setFromAgentId(agentName);
    }
    
    // Reset user and to agent when from agent changes
    setSelectedUser('');
    setSelectedUserId('');
    setUserSearch('');
    setToAgent('');
    setToAgentId('');
    setToAgentSearch('');
    setUserList([]);
    setUserListData([]);
    setFilteredUsers([]);
    
    // Fetch users for selected agent using admin_id
    if (selectedAgent) {
      const agentIdToSend = selectedAgent.admin_id || selectedAgent._id || agentName;
      console.log("Fetching users for agent ID:", agentIdToSend);
      fetchUsersForAgent(agentIdToSend);
    } else {
      fetchUsersForAgent(agentName);
    }
  };

  // Fetch users for agent from API
  const fetchUsersForAgent = async (agentId) => {
    setLoading(true);
    try {
      // Proper payload as per API requirement - send admin_id as agent_id
      const payload = {
        agent_id: agentId, // This should be admin_id like "AG6327"
        search: "",
        page: 1,
        limit: 50
      };
      
      console.log("Fetching users with payload:", payload);
      
      const response = await getUsersByAgent(payload);
      console.log("Full Users Response:", response);
      
      // Try different response structures
      let users = [];
      
      // Check if response has data property
      if (response?.data) {
        // If data is array
        if (Array.isArray(response.data)) {
          users = response.data;
        } 
        // If data has data property inside
        else if (response.data.data && Array.isArray(response.data.data)) {
          users = response.data.data;
        }
        // If data has users property
        else if (response.data.users && Array.isArray(response.data.users)) {
          users = response.data.users;
        }
        // If data is an object with values
        else if (typeof response.data === 'object') {
          // Try to find any array in the response
          const keys = Object.keys(response.data);
          for (let key of keys) {
            if (Array.isArray(response.data[key])) {
              users = response.data[key];
              break;
            }
          }
        }
      } 
      // If response itself is array
      else if (Array.isArray(response)) {
        users = response;
      }
      // If response has users property directly
      else if (response?.users && Array.isArray(response.users)) {
        users = response.users;
      }
      
      console.log("Extracted Users:", users);
      
      if (Array.isArray(users) && users.length > 0) {
        // Store full user objects with _id
        setUserListData(users);
        console.log("Users with _id:", users);
        
        // If users are objects, extract username or _id for display
        if (typeof users[0] === 'object') {
          const userNames = users.map(user => {
            // Try to get username, if not then _id, if not then any string field
            return user.username || user._id || user.name || user.email || user.user_id || JSON.stringify(user);
          });
          console.log("Extracted User Names:", userNames);
          setUserList(userNames);
          setFilteredUsers(userNames);
        } else {
          // If already strings
          setUserList(users);
          setFilteredUsers(users);
        }
      } else {
        console.log("No users found for this agent");
        setUserList([]);
        setUserListData([]);
        setFilteredUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      console.error("Error details:", error.response || error.message);
      
      // Check if error response has data
      if (error.response && error.response.data) {
        console.error("Error response data:", error.response.data);
      }
      
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load users for this agent. Please check console for details.",
        confirmButtonText: "OK",
      });
      setUserList([]);
      setUserListData([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle user selection
  const handleUserSelect = (userName) => {
    // Find the full user object from userListData
    const selectedUserData = userListData.find(user => {
      const displayName = user.username || user._id || user.name || user.email || user.user_id || JSON.stringify(user);
      return displayName === userName;
    });
    
    console.log("Selected User Data:", selectedUserData);
    
    setSelectedUser(userName);
    setUserSearch(userName);
    setUserDropdown(false);
    
    // Store user _id if available
    if (selectedUserData) {
      const userId = selectedUserData._id || selectedUserData.user_id;
      console.log("Selected User _id:", userId);
      setSelectedUserId(userId);
    } else {
      setSelectedUserId(userName);
    }
    
    // Reset to agent when user changes
    setToAgent('');
    setToAgentId('');
    setToAgentSearch('');
  };

  // Handle to agent selection
  const handleToAgentSelect = (agentName) => {
    // Find the full agent object
    const selectedAgent = allAgentsData.find(agent => agent.username === agentName);
    
    console.log("Selected To Agent:", selectedAgent);
    
    setToAgent(agentName);
    setToAgentSearch(agentName);
    setToAgentDropdown(false);
    
    // Send admin_id to backend
    if (selectedAgent) {
      setToAgentId(selectedAgent.admin_id);
      console.log("To Agent admin_id:", selectedAgent.admin_id);
    } else {
      setToAgentId(agentName);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validate form
    if (!fromAgent) {
      setMessage({ type: 'error', text: 'Please select From Agent' });
      return;
    }
    if (!selectedUser) {
      setMessage({ type: 'error', text: 'Please select a User' });
      return;
    }
    if (!toAgent) {
      setMessage({ type: 'error', text: 'Please select To Agent' });
      return;
    }
    if (fromAgent === toAgent) {
      setMessage({ type: 'error', text: 'From Agent and To Agent cannot be same' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const payload = {
        user_id: selectedUserId, // Send user _id
        from_agent_id: fromAgentId, // Send admin_id
        to_agent_id: toAgentId // Send admin_id
      };

      console.log("========== FINAL PAYLOAD ==========");
      console.log("user_id:", payload.user_id);
      console.log("from_agent_id:", payload.from_agent_id);
      console.log("to_agent_id:", payload.to_agent_id);
      console.log("Full Payload:", JSON.stringify(payload, null, 2));
      console.log("====================================");

      const response = await getAgentTransfertouser(payload);
      console.log("Transfer Response:", response);

      // Handle both response structures
      const isSuccess = response?.success || response?.data?.success || false;
      const messageText = response?.message || response?.data?.message || "User transferred successfully";

      if (isSuccess) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: messageText,
          confirmButtonText: "OK",
        });
        
        // Reset form
        setFromAgent('');
        setFromAgentId('');
        setSelectedUser('');
        setSelectedUserId('');
        setToAgent('');
        setToAgentId('');
        setFromAgentSearch('');
        setUserSearch('');
        setToAgentSearch('');
        setUserList([]);
        setUserListData([]);
        setFilteredUsers([]);
        setMessage({ type: '', text: '' });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: messageText || "Transfer failed",
          confirmButtonText: "OK",
        });
        setMessage({ type: 'error', text: messageText || 'Transfer failed' });
      }
    } catch (error) {
      console.error("Error during transfer:", error);
      
      let errorMessage = "An error occurred during transfer";
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonText: "OK",
      });
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.multiselect-container')) {
        setFromAgentDropdown(false);
        setUserDropdown(false);
        setToAgentDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className='allcommon'>
      <section className="set-limit-sec py-4">
        <div className="container-fluid">
          <h4 className="page-title">Transfer User</h4>
          
          {/* Message display */}
          {message.text && (
            <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`} role="alert">
              {message.text}
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setMessage({ type: '', text: '' })}
              ></button>
            </div>
          )}

          <div className="row" style={{ padding: 10, marginBottom: 0, marginLeft: 0, marginRight: 0 }}>
            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
              
              {/* From Agent Dropdown - Always enabled */}
              <div className="d-flex align-items-start" style={{ flexDirection: "column" }}>
                <label className="form-label">From Agent</label>
                <div className="multiselect-container multiSelectContainer">
                  <div className="search-wrapper searchWrapper singleSelect">
                    <input
                      type="text"
                      className="searchBox"
                      placeholder="Select an option"
                      autoComplete="off"
                      value={fromAgentSearch}
                      onChange={(e) => {
                        setFromAgentSearch(e.target.value);
                        setFromAgentDropdown(true);
                      }}
                      onClick={() => setFromAgentDropdown(!fromAgentDropdown)}
                      disabled={loading}
                    />
                    <img
                      src="data:image/svg+xml,%3Csvg%20height%3D%2232%22%20viewBox%3D%220%200%2032%2032%22%20width%3D%2232%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20id%3D%22background%22%3E%3Crect%20fill%3D%22none%22%20height%3D%2232%22%20width%3D%2232%22%2F%3E%3C%2Fg%3E%3Cg%20id%3D%22arrow_x5F_down%22%3E%3Cpolygon%20points%3D%222.002%2C10%2016.001%2C24%2030.002%2C10%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E"
                      className="icon_cancel icon_down_dir"
                      onClick={() => setFromAgentDropdown(!fromAgentDropdown)}
                      alt="dropdown"
                    />
                  </div>
                  {fromAgentDropdown && (
                    <div className="optionListContainer" style={{ display: 'block' }}>
                      <ul className="optionContainer">
                        {loading ? (
                          <span className="notFound">Loading...</span>
                        ) : filteredFromAgents.length > 0 ? (
                          filteredFromAgents.map((agent, index) => (
                            <li
                              key={index}
                              className={`option ${fromAgent === agent ? 'highlightOption highlight' : ''}`}
                              onClick={() => handleFromAgentSelect(agent)}
                            >
                              {String(agent)}
                            </li>
                          ))
                        ) : (
                          <span className="notFound">No Options Available</span>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* User Dropdown - Disabled until From Agent is selected */}
              <div className="d-flex align-items-start" style={{ flexDirection: "column" }}>
                <label className="form-label">User</label>
                <div className="multiselect-container multiSelectContainer">
                  <div className="search-wrapper searchWrapper singleSelect">
                    <input
                      type="text"
                      className="searchBox"
                      placeholder="Select"
                      autoComplete="off"
                      value={userSearch}
                      onChange={(e) => {
                        if (fromAgent) {
                          setUserSearch(e.target.value);
                          setUserDropdown(true);
                        }
                      }}
                      onClick={() => {
                        if (fromAgent) {
                          setUserDropdown(!userDropdown);
                        }
                      }}
                      disabled={!fromAgent || loading}
                      style={{ cursor: fromAgent ? 'pointer' : 'not-allowed' }}
                    />
                    <img
                      src="data:image/svg+xml,%3Csvg%20height%3D%2232%22%20viewBox%3D%220%200%2032%2032%22%20width%3D%2232%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20id%3D%22background%22%3E%3Crect%20fill%3D%22none%22%20height%3D%2232%22%20width%3D%2232%22%2F%3E%3C%2Fg%3E%3Cg%20id%3D%22arrow_x5F_down%22%3E%3Cpolygon%20points%3D%222.002%2C10%2016.001%2C24%2030.002%2C10%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E"
                      className="icon_cancel icon_down_dir"
                      onClick={() => {
                        if (fromAgent) {
                          setUserDropdown(!userDropdown);
                        }
                      }}
                      alt="dropdown"
                      style={{ cursor: fromAgent ? 'pointer' : 'not-allowed' }}
                    />
                  </div>
                  {userDropdown && (
                    <div className="optionListContainer" style={{ display: 'block' }}>
                      <ul className="optionContainer">
                        {loading ? (
                          <span className="notFound">Loading...</span>
                        ) : filteredUsers.length > 0 ? (
                          filteredUsers.map((user, index) => (
                            <li
                              key={index}
                              className={`option ${selectedUser === user ? 'highlightOption highlight' : ''}`}
                              onClick={() => handleUserSelect(user)}
                            >
                              {String(user)}
                            </li>
                          ))
                        ) : (
                          <span className="notFound">No Users Available</span>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* To Agent Dropdown - Disabled until User is selected */}
              <div className="d-flex align-items-start" style={{ flexDirection: "column" }}>
                <label className="form-label">To Agent</label>
                <div className="multiselect-container multiSelectContainer">
                  <div className="search-wrapper searchWrapper singleSelect">
                    <input
                      type="text"
                      className="searchBox"
                      placeholder="Select"
                      autoComplete="off"
                      value={toAgentSearch}
                      onChange={(e) => {
                        if (selectedUser) {
                          setToAgentSearch(e.target.value);
                          setToAgentDropdown(true);
                        }
                      }}
                      onClick={() => {
                        if (selectedUser) {
                          setToAgentDropdown(!toAgentDropdown);
                        }
                      }}
                      disabled={!selectedUser || loading}
                      style={{ cursor: selectedUser ? 'pointer' : 'not-allowed' }}
                    />
                    <img
                      src="data:image/svg+xml,%3Csvg%20height%3D%2232%22%20viewBox%3D%220%200%2032%2032%22%20width%3D%2232%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20id%3D%22background%22%3E%3Crect%20fill%3D%22none%22%20height%3D%2232%22%20width%3D%2232%22%2F%3E%3C%2Fg%3E%3Cg%20id%3D%22arrow_x5F_down%22%3E%3Cpolygon%20points%3D%222.002%2C10%2016.001%2C24%2030.002%2C10%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E"
                      className="icon_cancel icon_down_dir"
                      onClick={() => {
                        if (selectedUser) {
                          setToAgentDropdown(!toAgentDropdown);
                        }
                      }}
                      alt="dropdown"
                      style={{ cursor: selectedUser ? 'pointer' : 'not-allowed' }}
                    />
                  </div>
                  {toAgentDropdown && (
                    <div className="optionListContainer" style={{ display: 'block' }}>
                      <ul className="optionContainer">
                        {loading ? (
                          <span className="notFound">Loading...</span>
                        ) : filteredToAgents.length > 0 ? (
                          filteredToAgents.map((agent, index) => (
                            <li
                              key={index}
                              className={`option ${toAgent === agent ? 'highlightOption highlight' : ''}`}
                              onClick={() => handleToAgentSelect(agent)}
                            >
                              {String(agent)}
                            </li>
                          ))
                        ) : (
                          <span className="notFound">No Options Available</span>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                className="theme_light_btn btn btn-primary"
                style={{ alignSelf: "end", padding: "6px 10px" }}
                onClick={handleSubmit}
                disabled={loading || !toAgent}
              >
                {loading ? 'Transferring...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default TransferAgent;