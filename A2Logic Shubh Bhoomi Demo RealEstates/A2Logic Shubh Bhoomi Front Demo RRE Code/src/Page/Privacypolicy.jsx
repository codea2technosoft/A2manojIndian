import React from 'react';

const Privacypolicy = () => {
  const sitename = process.env.REACT_APP_NAME;

  return (
    <div className="privacy-container">
      <h1 className="privacy-heading">
        Privacy Policy for {sitename} - Protecting Your Personal Information
      </h1>
      <p className="privacy-paragraph">
        Welcome to {sitename}. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you visit our platform. By using {sitename}, you consent to the practices described in this policy. If you do not agree with our privacy practices, please do not use our services.
      </p>
      <section className="privacy-section">
        <h2>1. Information We Collect</h2>
        <p>
          We collect information that you provide directly to us, such as when you create an account, place bets, or contact customer support. This may include personal details such as your name, email address, phone number, and payment information. We also collect information automatically through your use of our platform, including IP addresses, device information, and browsing activity.
        </p>
      </section>
      <section className="privacy-section">
        <h2>2. How We Use Your Information</h2>
        <p>
          We use your information to provide and improve our services, process transactions, communicate with you, and ensure compliance with our terms. This includes using your data to personalize your experience, respond to inquiries, and send you relevant updates and promotional offers.
        </p>
      </section>
      <section className="privacy-section">
        <h2>3. Sharing Your Information</h2>
        <p>
          We may share your information with third parties in the following circumstances: to comply with legal obligations, to process payments, to provide services through third-party providers, or in connection with a business transfer. We do not sell your personal information to third parties.
        </p>
      </section>
      <section className="privacy-section">
        <h2>4. Data Security</h2>
        <p>
          We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure, alteration, and destruction. While we strive to protect your data, no online platform is completely secure, and we cannot guarantee absolute security.
        </p>
      </section>
      <section className="privacy-section">
        <h2>5. Your Rights</h2>
        <p>
          You have the right to access, correct, or delete your personal information that we hold. You may also have the right to object to or restrict certain processing of your data. To exercise these rights, please contact us using the details provided below.
        </p>
      </section>
      <section className="privacy-section">
        <h2>6. Cookies and Tracking Technologies</h2>
        <p>
          We use cookies and other tracking technologies to enhance your experience on our platform, analyze usage, and provide personalized content. You can manage your cookie preferences through your browser settings, but please note that disabling cookies may affect the functionality of our services.
        </p>
      </section>
      <section className="privacy-section">
        <h2>7. Data Retention</h2>
        <p>
          We retain your personal information for as long as necessary to fulfill the purposes for which it was collected, including legal and regulatory requirements. Data retention periods are outlined in our data retention policy.
        </p>
      </section>
      <section className="privacy-section">
        <h2>8. Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Any changes will be posted on our website with an updated effective date. Your continued use of our services after any changes indicates your acceptance of the updated policy.
        </p>
      </section>
      <section className="privacy-section">
        <h2>9. Third-Party Links</h2>
        <p>
          Our website may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies before providing any personal information.
        </p>
      </section>
      <section className="privacy-section">
        <h2>10. Contact Us</h2>
        <p>
          If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at support@{sitename}.com. We will make reasonable efforts to address your inquiries and provide assistance.
        </p>
      </section>
    </div>
  );
};

export default Privacypolicy;
