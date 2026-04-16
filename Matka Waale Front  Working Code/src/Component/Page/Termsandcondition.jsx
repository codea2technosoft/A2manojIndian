import React,{useState,useEffect} from 'react'

export default function Termsandcondition() {
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {

       setIsLoading(false);
 
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
        {/* Your iframe code here */}
        <div className='margin-bottom-88 mb-0'>
          <div className="pb-4">
            <iframe src={`https://matkawaale.com/api/pages/other.php`} style={{ width: '100%', height: '100vh' }} />
          </div>
        </div>
        {/* Rest of your content */}
      </section>
    )}
    </>

  )
}
