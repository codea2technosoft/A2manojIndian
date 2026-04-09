import React, { useState, useEffect } from 'react';

import PageTitle from '../Include/Pagetitle';
import { useParams } from "react-router-dom";
import TestimonialSection from '../Commonpage/TestimonialSection';
import notavailable from "../assets/images/Image_not_available.png";
import pageTitleImage from '../assets/images/bglocaiton.jpg';
import { Link } from 'react-router-dom'
const BlogDetails = () => {
    const { slug } = useParams();
    const [blog, setblog] = useState([]);
    const [blogView, setblogView] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedimagePath, setSelectedimagePath] = useState(null);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/blog-details/${slug}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch blog posts');
                }
                const data = await response.json();
                console.log("hhhh", data)
                setblog(data.data);
                setSelectedimagePath(data.imagePath);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, []);



    useEffect(() => {
        const viewBlog = async () => {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_API_URL}/blog-list?page=1&limit=10`
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch blog posts");
                }
                const data = await response.json();
                console.warn("view blog", data.data)
                setblogView(data.data || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        viewBlog();
    }, []);


    return (
        <>
            {/* <PageTitle /> */}
            <section
                className="flat-title-page breadcrumbbg"
                style={{ backgroundImage: `url(${pageTitleImage})` }}
            >
                <div className="svg-bg">
                    <svg
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        x="0px"
                        y="0px"
                        width="100%"
                        height="100%"
                        viewBox="0 0 1600 900"
                        preserveAspectRatio="xMidYMax slice"
                    >
                        <defs>
                            <linearGradient id="bg">
                                <stop offset="0%" style={{ stopColor: "rgba(255, 255, 255, 0.6)" }} />
                                <stop offset="50%" style={{ stopColor: "rgba(255, 255, 255, 0.1)" }} />
                                <stop offset="100%" style={{ stopColor: "rgba(255, 255, 255, 0.6)" }} />
                            </linearGradient>
                            <path
                                id="wave"
                                stroke="url(#bg)"
                                fill="none"
                                d="M-363.852,502.589c0,0,236.988-41.997,505.475,0
                s371.981,38.998,575.971,0s293.985-39.278,505.474,5.859s493.475,48.368,716.963-4.995v560.106H-363.852V502.589z"
                            />
                        </defs>
                        <g>
                            <use xlinkHref="#wave">
                                <animateTransform
                                    attributeName="transform"
                                    attributeType="XML"
                                    type="translate"
                                    dur="10s"
                                    calcMode="spline"
                                    values="270 230; -334 180; 270 230"
                                    keyTimes="0; .5; 1"
                                    keySplines="0.42, 0, 0.58, 1.0;0.42, 0, 0.58, 1.0"
                                    repeatCount="indefinite"
                                />
                            </use>
                            <use xlinkHref="#wave">
                                <animateTransform
                                    attributeName="transform"
                                    attributeType="XML"
                                    type="translate"
                                    dur="8s"
                                    calcMode="spline"
                                    values="-270 230;243 220;-270 230"
                                    keyTimes="0; .6; 1"
                                    keySplines="0.42, 0, 0.58, 1.0;0.42, 0, 0.58, 1.0"
                                    repeatCount="indefinite"
                                />
                            </use>
                            <use xlinkHref="#wave">
                                <animateTransform
                                    attributeName="transform"
                                    attributeType="XML"
                                    type="translate"
                                    dur="6s"
                                    calcMode="spline"
                                    values="0 230;-140 200;0 230"
                                    keyTimes="0; .4; 1"
                                    keySplines="0.42, 0, 0.58, 1.0;0.42, 0, 0.58, 1.0"
                                    repeatCount="indefinite"
                                />
                            </use>
                            <use xlinkHref="#wave">
                                <animateTransform
                                    attributeName="transform"
                                    attributeType="XML"
                                    type="translate"
                                    dur="12s"
                                    calcMode="spline"
                                    values="0 240;140 200;0 230"
                                    keyTimes="0; .4; 1"
                                    keySplines="0.42, 0, 0.58, 1.0;0.42, 0, 0.58, 1.0"
                                    repeatCount="indefinite"
                                />
                            </use>
                        </g>
                    </svg>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="breadcrumb-wrapper text-center">
                        <div className="inline-flex flex-wrap justify-center items-center">
                            <Link
                                to="/"
                                className="text-white hover:text-gray-200 transition-colors duration-200"
                            >
                                Home
                            </Link>
                            <span className="mx-2">/</span>
                            <span className="text-white text-sm md:text-base">
                                <span className="font-medium">{blog?.title}</span>
                            </span>
                        </div>
                    </div>

                    <h1 className="text-center text-white mb-0">
                        {blog?.title}
                    </h1>
                </div>
            </section>
            <div className="margin_all_section pb-70">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-8 col-lg-8">
                            <div className="blog_details_content">
                                {/* Categories Section */}
                                <div className="categories_type-1">
                                    <div className="categories_type-1_img">
                                        <a href="#">
                                            {/* <img
                                                src={`${process.env.REACT_APP_IMAGE_API_URL}/uploads/blog/${blog.image}`}
                                                alt={blog.title}
                                            /> */}
                                            <img
                                                src={
                                                    blog.image
                                                        ? `${process.env.REACT_APP_IMAGE_API_URL}/uploads/blog/${blog.image}`
                                                        : notavailable
                                                }
                                                alt={blog.title || "Blog post"}
                                            />

                                        </a>
                                    </div>
                                    <div className="categories_type-1_content">
                                        <div className="d-flex justify-content-between">
                                            <div>
                                                <h4>By Author</h4>
                                                <h6>Admin</h6>
                                            </div>
                                            <div>
                                                <h4>Posted Date</h4>
                                                <h6>{blog.date}</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div className="row mt-5">
                                    <div className="col-xl-12 col-lg-12">
                                        <div className="blgo_sider_content">
                                            <h3>{blog?.title}</h3>
                                            <p className="mt-3">
                                                <div dangerouslySetInnerHTML={{ __html: blog?.description }} />
                                            </p>

                                        </div>
                                    </div>
                                </div>



                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="recent_post">
                                <h3 className="blog_side-heading">Recent Posts :</h3>

                                {blogView.length > 0 ? (
                                    blogView.map((post, index) => (
                                        <div className="padding_all">
                                            <div className="recent_post_box mt-4">
                                                <div className="recent_post_img">
                                                    <a href={post.title}>
                                                        <img
                                                            src={
                                                                post.image
                                                                    ? `${process.env.REACT_APP_IMAGE_API_URL}/uploads/blog/${post.image}`
                                                                    : notavailable
                                                            }
                                                            alt={post.title || "Blog post"}
                                                            onError={(e) => {
                                                                e.target.onerror = null; // infinite loop avoid karega
                                                                e.target.src = notavailable; // fallback image
                                                            }}
                                                        />

                                                    </a>
                                                </div>
                                                <div className="recent_post_content">
                                                    <p>{post.date}</p>
                                                    <a href={post.title}>{post.title}</a>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-12 text-center py-5">
                                        <p>No blog posts available yet.</p>
                                    </div>
                                )}
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