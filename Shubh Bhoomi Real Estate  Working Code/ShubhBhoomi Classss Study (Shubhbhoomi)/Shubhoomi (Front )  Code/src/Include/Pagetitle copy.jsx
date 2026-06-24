import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import pageTitleImage from '../assets/images/bglocaiton.jpg';

const PageTitle = ({ title }) => {
  const location = useLocation();

  // Route to name mapping
  const routeMap = {
    '/': 'Home',
    '/adminlogin': 'Admin Login',
    '/custumerlogin': 'Customer Login',
    '/contact-us': 'Contact Us',
    '/gallery': 'Gallery',
    '/ourservice': 'Our Services',
    '/projectdetils': 'Project Details',
    '/ongoinproject': 'Ongoing Projects',
    '/completeproject': 'Completed Projects',
    '/aboutus': 'About Us',
    '/download-shubh-bhoomi-plans': 'Download Shubh Bhoomi Plan'
  };

  // Generate breadcrumbs from current path
  const getBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter(x => x);
    const breadcrumbs = [{ name: 'Home', path: '/' }];

    pathnames.forEach((segment, index) => {
      const path = `/${pathnames.slice(0, index + 1).join('/')}`;
      const name = routeMap[path] || segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      breadcrumbs.push({ name, path });
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();
  const currentPage = breadcrumbs[breadcrumbs.length - 1]?.name || 'Page';

  return (
    <section
      className="flat-title-page breadcrumbbg"
      style={{ backgroundImage: `url(${pageTitleImage})`}}
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
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <span key={index} className="text-white text-sm md:text-base">
                  {!isLast ? (
                    <>
                      <Link 
                        to={item.path} 
                        className="text-white hover:text-gray-200 transition-colors duration-200"
                      >
                        {item.name}
                      </Link>
                      <span className="mx-2">/</span>
                    </>
                  ) : (
                    <span className="font-medium">{item.name}</span>
                  )}
                </span>
              );
            })}
          </div>
        </div>

        <h1 className="text-center text-white mb-0">
          {title || currentPage}
        </h1>
      </div>
    </section>
  );
};

export default PageTitle;