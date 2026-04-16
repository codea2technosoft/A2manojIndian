import React, { useState, useEffect } from "react";

export default function Resulthistory() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fallback = setTimeout(() => {
      setIsLoading(false);
    }, 10000);

    return () => clearTimeout(fallback);
  }, []);
  return (
    <>
      {isLoading && (
        <div className="spinner-wrapper">
          <div className="loadernew2"></div>
        </div>
      )}
      {!isLoading && (
        <section id="Help" className='margin-bottom-88'>
          <div className='margin-bottom-88 mb-0'>
            <div className="pb-4">
              <iframe
                src="https://matkawaale.com/api/app_result.php"
                style={{
                  width: "100%",
                  height: "1500px",
                  visibility: isLoading ? "hidden" : "visible",
                }}
                onLoad={() => {
                  console.log("iframe loaded");
                  setIsLoading(false);
                }}

              />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
