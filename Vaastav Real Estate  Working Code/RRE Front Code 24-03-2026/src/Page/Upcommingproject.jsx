import React from 'react'
import PageTitle from '../Include/Pagetitle'
import projectimage from '../assets/images/projectone.jpg'
import rentimage from '../assets/images/sell_rent_icon.svg'
import { FaArrowUp } from "react-icons/fa";
import {Link} from 'react-router-dom'

function Upcommingproject() {
    const projects = [
        {
            id: 1,
            image: projectimage,
            siteName: 'Green Valley Residency',
            description: 'Unique City Extension is one of our latest offerings. A JDA approved project,',
        
        },
        {
            id: 2,
            image: projectimage,
            siteName: 'Royal Orchid',
            description: 'Unique City Extension is one of our latest offerings. A JDA approved project,',
        
        },
        {
            id: 3,
            image: projectimage,
            siteName: 'Ocean View',
            description: 'Unique City Extension is one of our latest offerings. A JDA approved project,',
           
        },
        {
            id: 4,
            image: projectimage,
            siteName: 'Hilltop Villas',
            description: 'Unique City Extension is one of our latest offerings. A JDA approved project,',
           
        }
    ];
    return (
        <div className='projectdesign pb-70'>
            <PageTitle />
       <div className="bg_design">

            <div className="margin_all_section">
                <div className="container">
                    <div className="row">
                        {projects.map((items, index) => (
                            <div className="col-md-3 mb-2" key={index.id || index}>
                                <div className="project-card">
                                    <div class="popular-badge">
                                        
                                        <img src={rentimage} alt="icon"/>
                                            <p>For Sale</p>
                                    </div>
                                    <div className="imageproject">
                                        <img src={items.image} alt="" />
                                    </div>
                                    <div className="project-details">
                                        <h4>{items.siteName}</h4>
                                        <p>{items.description}</p>
                                        <div className="button_learn">
                                            <Link to="/projectdetils">Read More<FaArrowUp/></Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </div>
        </div>
    )
}

export default Upcommingproject
