import React, { useEffect } from 'react';

const Breadcrumb = ({ title, items }) => {
    // Update document title
    useEffect(() => {
        if (title) {
            document.title = `${title} `;
        }
    }, [title]);

    // Prepend "Home" to breadcrumb items
    const fullItems = [
        { label: 'Home', href: '/dashboard' },
        ...items,
    ];

    return (
        <div id="Breadcrumb">
            <div className="py-3 py-lg-4 container-fluid">
                <div className="row">
                    <div className="col-lg-5">
                        <h4 className="page-title mb-0">{title}</h4>
                    </div>
                    <div className="col-lg-7">
                        <div className="d-none d-lg-block">
                            <ol className="breadcrumb m-0 float-end">
                                {fullItems.map((item, index) => (
                                    <li
                                        key={index}
                                        className={`breadcrumb-item ${index === fullItems.length - 1 ? 'active' : ''}`}
                                    >
                                        {index === fullItems.length - 1 ? (
                                            item.label
                                        ) : (
                                            <a href={item.href}>{item.label}</a>
                                        )}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Breadcrumb;
