import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Spinner, Card } from "react-bootstrap";
import Swal from "sweetalert2";
import { Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

const SubadminPermission = () => {
    const { sub_admin_id } = useParams();
    const navigate = useNavigate();
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [toggle, setToggle] = useState({});

    const togglePermission = (index) => {
        setToggle(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };


    const initialPermissionStructure = [
        {
            id: "dashboard",
            name: "Dashboard",
            children: [],
            checked: true

        },


         {
            id: "AccountsReport",
            name: "Accounts Report",
            children: [
                { id: "account-report", name: "Accounts Report" },
            ],
        },

         {
            id: "WalletLedger",
            name: "Wallet Ledger",
            children: [
                { id: "admin-wallet-report", name: "Wallet Ledger" },
            ],
        },



        {
            id: "subadminManagement",
            name: "Subadmin Management",
            children: [
                { id: "create-subadmin", name: "Create Subadmin" },
                { id: "all-subadmin", name: "All Subadmin" },
            ],
        },
        {
            id: "projectManagement",
            name: "Project Management",
            children: [
                { id: "all-project", name: "All Project" },
                // { id: "create-project", name: "Create Project" },
                { id: "active-project", name: "Show Project" },
                { id: "inactive-project", name: "Hide Project" },
                 { id: "aminities-list", name: "Aminities" },

                { id: "all-block-list", name: "All Block" },
                // { id: "create-block", name: "Create Block" },
                { id: "active-block-list", name: "Active Block" },
                { id: "inactive-block-list", name: "Inactive Block" },
                { id: "all-Plot", name: "All Unit" },
                // { id: "create-plot", name: "Create Plot" },
                { id: "active-plot-list", name: "Available Unit" },
                { id: "inactive-plot-list", name: "Sold Unit" },
                
            ],
        },
        {
            id: "projectAssociate",
            name: "Associate Management",
            children: [
                { id: "all-associate-list", name: "All Associate List" },
                { id: "all-associate-active-list", name: "Active Associate" },
                { id: "all-associate-inactive-list", name: "Inactive Associate" },
                { id: "my-team-tree-admin", name: "My Tree" },
                { id: "myteam-parent-chain-upline", name: "Parent Chain" },
                { id: "download-my-11level-team-data-in-excel", name: "Download My 11level Team" },
            ],
        },
        {
            id: "projectChannel",
            name: "Channel Partner Management",
            children: [
                { id: "all-channel-list", name: "All Channel List" },
                { id: "all-channel-active-list", name: "Active Channel" },
                { id: "all-channel-inactive-list", name: "Inactive Channel" },
            ],
        },
       

        {
            id: "LeadManagement",
            name: "Lead Management",
            children: [
                { id: "lead-list", name: "Property Lead" },
                { id: "assign-property-lead-to-subadmin", name: "Assign Calling Leads" },
                { id: "loan-list", name: "Loan Lead" },
                { id: "upload-property-lead-csv", name: "Calling Leads" },
                { id: "calling-lead-report", name: "Calling Leads Report" },
                { id: "property-income-list", name: "Property Income Approved Leads" },
                { id: "property-income-unit-is-not-sold-list", name: "Unit Is Not Sold" },
                // { id: "assign-property-loan-lead-to-subadmin", name: "Assign Property Loan Lead To Subadmin" },
            ],
        },


         {
            id: "ExpenceManagement",
            name: "Expence Management",
            children: [
                { id: "category-list", name: "Category List" },
                { id: "bank-account-list", name: "Bank Account List" },
                { id: "expence-add", name: "Add Expence" },
                { id: "expenses-list", name: "CR DR Ledger Report" },
                { id: "expenses-date-wise", name: "Date Wise CR DR Ledger Report" },
                { id: "tds-report", name: "Tds Report" },
                // { id: "assign-property-loan-lead-to-subadmin", name: "Assign Property Loan Lead To Subadmin" },
            ],
        },


         {
            id: "VisitReport",
            name: "Visit Report",
            children: [
                { id: "visit-list", name: "Visit List" },
                { id: "visit-date-wise", name: "Visit Date Wise" },
            ],
        },


        {
            id: "BankAccount",
            name: "Bank Account",
            children: [
                { id: "account-list", name: "Pending Account" },
                { id: "account-list-status", name: "Success / Reject" },
            ],
        },

         {
            id: "withdrawal",
            name: "Withdrawal",
            children: [
                { id: "withdrawal-list", name: "Commission Pending" },
                { id: "withdrawal-success-list-status", name: "Commission Success" },
                { id: "withdrawal-rejected-list-status", name: "Commission Reject" },
            ],
        },


        //  {
        //     id: "incomeplan",
        //     name: "Income Plan",
        //     children: [
        //         { id: "income-list", name: "Loan 1" },
        //         { id: "personal-income-list", name: "Loan 2" },
        //         { id: "product-income-list", name: "Property" },
        //     ],
        // },


        {
            id: "BookingManagement",
            name: "Booking Management",
            children: [
                { id: "pending-booking", name: "Pending Booking" },
                { id: "booked-pending-booking", name: "Booked Pending" },
                { id: "ongoing-booking", name: "Ongoing Booking" },
                { id: "complete-booking", name: "Completed Booking" },
                { id: "cancel-booking", name: "Canceled Booking" },
            ],
        },



         {
            id: "self/teamgiftsqyd",
            name: "Self / Team Gift SQYD",
            children: [
                { id: "self-gifts", name: "Assign Self Gifts" },
                { id: "gift-self-associate-list", name: "Self Gift Associate List" },
                { id: "assign-team-self-gifts", name: "Assign Team Gifts" },
                { id: "team-self-gifts-lists", name: "Team  Gifts Associates list" },
            
            ],
        },



         {
            id: "OfferManagement",
            name: "Offers Management",
            children: [
                { id: "all-offer-gifts", name: "Upload New Offers" },
                { id: "monthly-or-special-self-offers-lists", name: "Self Offers Winners" },
                { id: "monthly-or-special-customers-offers-lists", name: "Customers offers Winners" },
                { id: "monthly-or-special-team-offers-lists", name: "Teams Offers Winners" },
               
            ],
        },



         {
            id: "RewardsManagement",
            name: "Royalty Management",
            children: [
                { id: "mentor-royalty-rewards-lists", name: "Mentor Royalty Royalty" },
                { id: "voice-president-rewards-lists", name: "Vice President Royalty" },
                { id: "senior-voice-president-rewards-lists", name: "Sr.Voice President Royalty" },
                { id: "president-fund-rewards-lists", name: "President Fund Royalty" },

                { id: "president-level-fund-rewards-lists", name: "President Level Fund Royalty" },

               
            ],
        },


         {
            id: "lifeTimeRewards",
            name: "Life Time Rewards",
            children: [
                { id: "upload-lifetime-rewards", name: "Upload Life Time Rewards" },
                { id: "all-lifetime-rewards-lists", name: "Lifetime Rewards Lists" },
                { id: "life-time-rewards-winner-lists", name: "Lifetime Rewards Winner Lists" },
                
               
            ],
        },




         {
            id: "settingManagement",
            name: "General Settings",
            children: [

                 { id: "web-settings", name: "General Settings" },

                { id: "banner-list", name: "Banner List" },

                { id: "gallery-list", name: "Gallery List" },
               
                { id: "blogs", name: "Blog" },

                { id: "blog-list", name: "Blog List" },
                { id: "testimonial", name: "Testimonial" },
                { id: "testimonial-list", name: "Testimonial List" },
                { id: "document-upload", name: "Document Upload" },

            ],
        },






    ];

    const getAuthToken = () => localStorage.getItem("token");

    const fetchSubadminPermissions = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = getAuthToken();
            if (!token) {
                throw new Error("Authentication token not found. Please log in.");
            }

            const response = await fetch(`${API_URL}/sub-admin-permission-list`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ sub_admin_id }),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.clear();
                    sessionStorage.clear();
                    navigate("/login");
                    throw new Error("Unauthorized: Please log in again.");
                }
                const errorData = await response.json();
                throw new Error(errorData.message || `API error: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            let fetchedPermissions = [];
            console.log("fuck you", result)
            if (result.data && result.data.data) {
                try {
                    fetchedPermissions = JSON.parse(result.data.data);

                } catch (parseError) {
                    console.error("Error parsing fetched permissions data:", parseError);
                    setError("Failed to parse permissions data from server.");
                    setLoading(false);
                    return;
                }
            }


            const organizedPermissions = initialPermissionStructure.map((parent) => {
                const fetchedParent = fetchedPermissions.find((fp) => fp.id === parent.id);

                const childrenWithStatus = parent.children.map((child) => {
                    const fetchedChild = fetchedParent && fetchedParent.children
                        ? fetchedParent.children.find((fc) => fc.id === child.id)
                        : null;

                    return {
                        ...child,
                        checked: fetchedChild ? fetchedChild.checked : false,
                    };
                });

                // console.log("fp.id",fp.id)

                let parentChecked;
                console.log("initialPermissionStructure", parent.id, parent)

                if (parent.id == 'dashboard') {
                    parentChecked = fetchedParent ? fetchedParent.checked : true;
                } else if (fetchedParent && fetchedParent.checked !== undefined) {
                    parentChecked = fetchedParent.checked;
                } else if (childrenWithStatus.length > 0) {
                    parentChecked = childrenWithStatus.every(child => child.checked);
                } else {
                    parentChecked = false;
                }
                // if (fetchedParent && fetchedParent.checked !== undefined) {

                //     parentChecked = fetchedParent.checked;
                // } else if (childrenWithStatus.length > 0) {

                //     parentChecked = childrenWithStatus.every(child => child.checked);
                // } else {

                //     parentChecked = false;
                // }

                return {
                    ...parent,
                    checked: parentChecked,
                    children: childrenWithStatus,
                };
            });


            if (fetchedPermissions.length === 0) {
                setPermissions(initialPermissionStructure.map(p => ({
                    ...p,
                    checked: p.id === "dashboard",
                    children: p.children.map(c => ({
                        ...c,
                        checked: false
                    }))
                })));
            } else {
                setPermissions(organizedPermissions);
            }

        } catch (err) {
            console.error("Error fetching permissions:", err);
            setError(err.message);
            Swal.fire("Error", err.message, "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (sub_admin_id) {
            fetchSubadminPermissions();
        } else {
            setError("Sub-admin ID not provided in URL.");
            setLoading(false);
        }
    }, [sub_admin_id]);

    const handleParentCheckboxChange = (parentId) => {
        setPermissions((prevPermissions) =>
            prevPermissions.map((parent) => {
                if (parent.id === parentId) {
                    const newChecked = !parent.checked;
                    return {
                        ...parent,
                        checked: newChecked,
                        children: parent.children.map((child) => ({
                            ...child,
                            checked: newChecked,
                        })),
                    };
                }
                return parent;
            })
        );
    };




    const handleChildCheckboxChange = (parentId, childId) => {
        setPermissions((prevPermissions) =>
            prevPermissions.map((parent) => {
                if (parent.id === parentId) {
                    const updatedChildren = parent.children.map((child) =>
                        child.id === childId ? { ...child, checked: !child.checked } : child
                    );

                    const anyChildChecked = updatedChildren.some((child) => child.checked);

                    const newParentChecked = anyChildChecked; // Parent is checked if ANY child is checked

                    return {
                        ...parent,
                        checked: newParentChecked,
                        children: updatedChildren,
                    };
                }
                return parent;
            })
        );
    };



    // const handleChildCheckboxChange = (parentId, childId) => {
    //     setPermissions((prevPermissions) =>
    //         prevPermissions.map((parent) => {
    //             if (parent.id === parentId) {
    //                 const updatedChildren = parent.children.map((child) =>
    //                     child.id === childId ? { ...child, checked: !child.checked } : child
    //                 );

    //                 const anyChildChecked = updatedChildren.some((child) => child.checked);
    //                 const allChildrenChecked = updatedChildren.every((child) => child.checked);


    //                 const newParentChecked = allChildrenChecked; 

    //                 return {
    //                     ...parent,
    //                     checked: newParentChecked,
    //                     children: updatedChildren,
    //                 };
    //             }
    //             return parent;
    //         })
    //     );
    // };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setIsSaving(true);
    //     setError(null);

    //     const formattedPermissions = permissions.map((parent) => {

    //         const parentCheckedStatus = parent.checked;


    //         const childrenPayload = parent.children.map((child) => ({
    //             id: child.id,
    //             name: child.name,
    //             checked: child.checked,
    //         }));

    //         return {
    //             id: parent.id,
    //             name: parent.name,
    //             checked: parentCheckedStatus,
    //             children: childrenPayload,
    //         };
    //     });


    //     const dashboardPermission = permissions.find(p => p.id === 'dashboard');
    //     if (dashboardPermission) {
    //         const formattedDashboard = formattedPermissions.find(fp => fp.id === 'dashboard');
    //         if (formattedDashboard) {
    //             formattedDashboard.checked = dashboardPermission.checked;
    //             formattedDashboard.children = [];
    //         }
    //     }

    //     console.log("Permissions being sent to API:", formattedPermissions);
    //     try {
    //         const token = getAuthToken();
    //         if (!token) {
    //             throw new Error("Authentication token not found. Please log in.");
    //         }

    //         const response = await fetch(`${API_URL}/sub-admin-permission-update`, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 Authorization: `Bearer ${token}`,
    //             },
    //             body: JSON.stringify({
    //                 sub_admin_id: sub_admin_id,
    //                 data: formattedPermissions
    //             }),
    //         });

    //         if (!response.ok) {
    //             if (response.status === 401) {
    //                 localStorage.clear();
    //                 sessionStorage.clear();
    //                 navigate("/login");
    //                 throw new Error("Unauthorized: Please log in again.");
    //             }
    //             const errorData = await response.json();
    //             throw new Error(errorData.message || `Failed to update permissions. Status: ${response.status} ${response.statusText}`);
    //         }

    //         Swal.fire("Success", "Permissions updated successfully!", "success");
    //         navigate("/allsubadmin");

    //     } catch (err) {
    //         console.error("Error updating permissions:", err);
    //         setError(err.message);
    //         Swal.fire("Error", err.message, "error");
    //     } finally {
    //         setIsSaving(false);
    //     }
    // };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);

        try {
            // Validate permissions data
            if (!permissions || !Array.isArray(permissions)) {
                throw new Error("Invalid permissions data");
            }

            // Format permissions for API
            const formattedPermissions = permissions.map((parent) => {
                // Ensure we have required fields
                if (!parent.id || !parent.name) {
                    throw new Error(`Missing required permission fields for ${JSON.stringify(parent)}`);
                }

                return {
                    id: parent.id,
                    name: parent.name,
                    checked: Boolean(parent.checked), // Ensure boolean value
                    children: parent.children?.map(child => ({
                        id: child.id,
                        name: child.name,
                        checked: Boolean(child.checked) // Ensure boolean value
                    })) || [] // Default to empty array if no children
                };
            });

            // Get authentication token
            const token = getAuthToken();
            if (!token) {
                throw new Error("Authentication token not found. Please log in.");
            }

            // API request
            const response = await fetch(`${API_URL}/sub-admin-permission-update`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    sub_admin_id: sub_admin_id,
                    data: formattedPermissions
                }),
            });

            // Handle response
            if (!response.ok) {
                if (response.status === 401) {
                    // Clear auth data and redirect if unauthorized
                    localStorage.clear();
                    sessionStorage.clear();
                    navigate("/login");
                    throw new Error("Your session has expired. Please log in again.");
                }

                const errorData = await response.json();
                throw new Error(errorData.message ||
                    `Failed to update permissions (${response.status} ${response.statusText})`);
            }

            // Success handling
            await Swal.fire({
                title: "Success",
                text: "Permissions updated successfully!",
                icon: "success",
                confirmButtonText: "OK"
            });

            // Redirect after successful update
            navigate("/allsubadmin");

        } catch (err) {
            console.error("Permission update error:", err);
            setError(err.message);

            // More detailed error message for user
            await Swal.fire({
                title: "Error",
                text: err.message || "Failed to update permissions. Please try again.",
                icon: "error",
                confirmButtonText: "OK"
            });
        } finally {
            setIsSaving(false);
        }
    };
    console.log("permissions", permissions)
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
                <Spinner animation="border" role="status" className="text-primary">
                    <span className="visually-hidden">Loading permissions...</span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger text-center m-5" role="alert">
                {error}
                <Button className="ms-3" onClick={fetchSubadminPermissions}>
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <Container className="mt-4">
            <div className="card">
                <div className="card-header">
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="titlepage">
                            <h3>Manage Sub Admin Permissions </h3>
                        </div>
                        <div className="d-flex gap-2">
                            <div className="backbutton">
                                <Link to="/allsubadmin">Back</Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            {permissions.map((parent, index) => (
                                <Col md={6} lg={4} key={parent.id} className="mb-4">
                                    <Card className="card_all_design">
                                        <Card.Header className="card_bg text-white d-flex justify-content-between align-items-center"
                                            onClick={parent.children && parent.children.length > 0 ? () => togglePermission(index) : null}>
                                            <Form.Check
                                                type="checkbox"
                                                id={`parent-${parent.id}`}
                                                label={<strong className="">{parent.name} </strong>}
                                                checked={parent.checked}
                                                onChange={() => handleParentCheckboxChange(parent.id)}
                                                className="d-flex align-items-center gap-2"
                                            />
                                            {/* {parent.children && parent.children.length > 0 && (
                                                <div className="permissioncount" style={{ cursor: 'pointer' }}>
                                                    {toggle[index] ? 'Hide Permissions' : 'More Permissions'}
                                                </div>
                                            )} */}
                                        </Card.Header>
                                        {/* {parent.children && parent.children.length > 0 && toggle[index] && ( */}
                                        <Card.Body>
                                            <ul className="list-unstyled mb-0">
                                                {parent.children.map((child) => (
                                                    <li key={child.id} className="mb-2">
                                                        <Form.Check
                                                            type="checkbox"
                                                            id={`child-${child.id}`}
                                                            label={child.name}
                                                            checked={child.checked}
                                                            onChange={() => handleChildCheckboxChange(parent.id, child.id)}
                                                        />
                                                    </li>
                                                ))}
                                            </ul>
                                        </Card.Body>
                                        {/* )} */}
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                        <div className="d-flex justify-content-end">
                            <Button type="submit" variant="primary" className="px-5" disabled={isSaving}>
                                {isSaving ? (
                                    <>
                                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                        <span className="ms-2">Saving...</span>
                                    </>
                                ) : (
                                    "Save Permissions"
                                )}
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>

        </Container>
    );
};

export default SubadminPermission;