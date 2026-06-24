import React, { useState, useEffect } from 'react';

import PageTitle from '../Include/Pagetitle';
import { useParams } from "react-router-dom";

import TestimonialSection from '../Commonpage/TestimonialSection';
const BlogDetails = () => {
    const { id } = useParams();
    // const post = blog.find((p) => p.id.toString() === id);

    // if (!post) return <p>Blog not found</p>;
    const [blog, setblog] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedimagePath, setSelectedimagePath] = useState(null);
    useEffect(() => {
        const fetchBlog = async () => {
            try {

                const response = await fetch(`${process.env.REACT_APP_API_URL}/blog-list?page=1&limit=10`);

                if (!response.ok) {
                    throw new Error('Failed to fetch blog posts');
                }
                const data = await response.json();
                const post = data.data.find((p) => p.id.toString() === id);
                console.log("hhhh",post)
                setblog(post);

                setSelectedimagePath(data.imagePath);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, []);
    return (
        <>
            <PageTitle />
            <div className="margin_all_section pb-70">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-8 col-lg-8">
                            <div className="blog_details_content">
                                {/* Categories Section */}
                                <div className="categories_type-1">
                                    <div className="categories_type-1_img">
                                        <a href="#">
                                            <img src={blog?.image} alt="Blog thumbnail" />
                                        </a>
                                    </div>
                                    <div className="categories_type-1_content">
                                        <div className="d-flex justify-content-between">
                                            <div>
                                                <h4>Category :</h4>
                                                <h6> Left Sidebar</h6>
                                            </div>
                                            <div>
                                                <h4>Date Posted :</h4>
                                                <h6>9 Apr, 2024 / 1 Comment</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* First Content Row */}
                                <div className="row mt-5">
                                    <div className="col-xl-8 col-lg-8">
                                        <div className="blgo_sider_content">
                                            <h3>{blog?.title}</h3>
                                            <p className="mt-3">
                                                <div dangerouslySetInnerHTML={{ __html: blog?.description }} />
                                            </p>

                                        </div>
                                    </div>
                                    <div className="col-xl-4 col-lg-4">
                                        <div className="blog_details_img">
                                            <img src="https://solsticeskyspa.com/the-house/assets/images/blog/blgo-detail-1.jpg" alt="Blog detail" className="w-100" />
                                        </div>
                                    </div>
                                </div>

                                {/* Second Content Row */}
                                <div className="row mt-5">
                                    <div className="col-xl-4 col-lg-4">
                                        <div className="blog_details_img">
                                            <img src="https://solsticeskyspa.com/the-house/assets/images/blog/blgo-detail-2.jpg" alt="Blog detail" className="w-100" />
                                        </div>
                                    </div>
                                    <div className="col-xl-8 col-lg-8">
                                        <div className="blgo_sider_content mt-lg-0 mt-4">
                                            <h3>Diam quam nulla :</h3>
                                            <ul className="listing-2">
                                                <li>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</li>
                                                <li>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum</li>
                                                <li>It has survived not only five centuries, but also the leap into electronic typesetting,</li>
                                                <li>desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</li>
                                                <li>it is a long established fact that a reader will be distracted by the readable content</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Content */}
                                <div className="blgo_sider_content mt-5">
                                    <h3>Hendrerit dolor magna eget est</h3>
                                    <p className="mt-3">
                                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                                        when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                        It has survived not only five centuries, but also the leap into electronic typesetting,
                                        remaining essentially unchanged. It was popularised in the 1960s with the release of
                                        Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing
                                        software like Aldus PageMaker including versions of Lorem Ipsum.
                                    </p>
                                </div>


                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="recent_post">
                                <h3 className="blog_side-heading">Recent Posts :</h3>

                                <div className="padding_all"> {/* Recent Post 1 */}
                                    <div className="recent_post_box mt-4">
                                        <div className="recent_post_img">
                                            <a href="#">
                                                <img src="https://solsticeskyspa.com/the-house/assets/images/blog/recent-1.jpg" alt="Recent post thumbnail" />
                                            </a>
                                        </div>
                                        <div className="recent_post_content">
                                            <p>9 Apr, 2024</p>
                                            <a href="#">How To Select Individual Villa Property In Village?</a>
                                        </div>
                                    </div>

                                    {/* Recent Post 2 */}
                                    <div className="recent_post_box mt-4">
                                        <div className="recent_post_img">
                                            <a href="#">
                                                <img src="https://solsticeskyspa.com/the-house/assets/images/blog/recent-1.jpg" alt="Recent post thumbnail" />
                                            </a>
                                        </div>
                                        <div className="recent_post_content">
                                            <p>10 Apr, 2024</p>
                                            <a href="#">Tips To Setup Affordable Luxurious Living Room</a>
                                        </div>
                                    </div>

                                    {/* Recent Post 3 */}
                                    <div className="recent_post_box mt-4">
                                        <div className="recent_post_img">
                                            <a href="#">
                                                <img src="https://solsticeskyspa.com/the-house/assets/images/blog/recent-1.jpg" alt="Recent post thumbnail" />
                                            </a>
                                        </div>
                                        <div className="recent_post_content">
                                            <p>11 Apr, 2024</p>
                                            <a href="#">What Are The Steps Involved In Project Planning?</a>
                                        </div>
                                    </div>

                                    {/* Recent Post 4 */}
                                    <div className="recent_post_box mt-4">
                                        <div className="recent_post_img">
                                            <a href="#">
                                                <img src="https://solsticeskyspa.com/the-house/assets/images/blog/recent-1.jpg" alt="Recent post thumbnail" />
                                            </a>
                                        </div>
                                        <div className="recent_post_content">
                                            <p>12 Apr, 2024</p>
                                            <a href="#">Ideas For Modern Bedroom Designs And Essentials</a>
                                        </div>
                                    </div>

                                    {/* Recent Post 5 */}
                                    <div className="recent_post_box mt-4">
                                        <div className="recent_post_img">
                                            <a href="#">
                                                <img src="https://solsticeskyspa.com/the-house/assets/images/blog/recent-1.jpg" alt="Recent post thumbnail" />
                                            </a>
                                        </div>
                                        <div className="recent_post_content">
                                            <p>13 Apr, 2024</p>
                                            <a href="#">Why Should I Select Gated Community House?</a>
                                        </div>
                                    </div></div>
                            </div>
                        </div>
                    </div>
                    <TestimonialSection />
                </div>
            </div>
        </>
    );
};

export default BlogDetails;