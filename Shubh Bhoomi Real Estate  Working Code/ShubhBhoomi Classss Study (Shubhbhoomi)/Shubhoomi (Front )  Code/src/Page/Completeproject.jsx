import React, { useEffect, useState } from 'react';
import PageTitle from '../Include/Pagetitle';
import rentimage from '../assets/images/sell_rent_icon.svg';
import { Link } from 'react-router-dom';
import { FaArrowUp } from "react-icons/fa";
import axios from 'axios';
const imagePathname = `${process.env.REACT_APP_IMAGE_API_URL}/uploads/project/`;

function Completeproject() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    // const imagePath = "https://realestateapi.a2logicgroup.com/uploads/project/";
        const imagePath = `${process.env.REACT_IMAGE_API_URL}/project/`;

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await axios.post(
                 `${process.env.REACT_APP_API_URL}/project-list?page=1&limit=100&name=`,
                {},
                {
                    params: {
                        project_status: "complete",
                    },
                }
            );

            if (response.data && response.data.data) {
                setProjects(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch projects:", error);
        } finally {
            setLoading(false);
        }
    };


    const stripHTML = (html) => {
        return html.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim();
    };

      const toSentenceCase = (str) => {
  if (!str) return "";
  const cleaned = str.trim().toLowerCase();
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
};


    return (
        <div className='margin_all_bottom pb-70 projectdesign'>
            <PageTitle />
       
           <div className="margin_all_section">
                <div className="container">
                    <div className="row">
                        {loading ? (
                            <p>Loading projects...</p>
                        ) : (
                            projects.map((item, index) => (
                                <div className="col-md-3 mb-2" key={item.id || index}>
                                    <div className="project-card">
                                        <div className="popular-badge bgcolornewallss">
                                            <img src={rentimage} alt="icon" />
                                            <p>Completed</p>
                                        </div>
                                        <div className="imageproject">
                                            <img src={item.thumbnail && item.thumbnail.length ? imagePathname + item.thumbnail : rentimage} alt={item.siteName} />
                                        </div>
                                        <div className="project-details">
                                            <h3>{toSentenceCase(item.name)}</h3>
                                            <p>{(stripHTML(toSentenceCase(item.description)))}</p>
                                            <div className="button_learn">
                                                <Link to={`/projectdetils/${item.id}`}>Read More <FaArrowUp /></Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Completeproject
