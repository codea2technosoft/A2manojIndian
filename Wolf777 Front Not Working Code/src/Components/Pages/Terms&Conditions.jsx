import React from "react";
import "./Terms.css";

const termsData = [
  {
    title: "1. Acceptance of Terms",
    content: "By accessing or using the Booki website and services, you agree to adhere to these Terms and Conditions. If you do not agree with any part of these terms, you must refrain from using our services. We reserve the right to modify these terms at any time without prior notice, and it is your responsibility to review them regularly."
  },
  {
    title: "2. Use of Betting Services",
    content: "Booki provides a platform for users to place bets on various sports and events. You agree to use our services only for lawful purposes and in accordance with applicable betting regulations. Any misuse of the platform, including fraudulent activities, will result in immediate suspension or termination of your account. You must not use the platform for any illegal or unauthorized activities."
  },
  {
    title: "3. Registration and Account Management",
    content: "To access certain features of Booki, you must register and create an account. When registering, you agree to provide accurate, current, and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify us immediately if you suspect any unauthorized use of your account or if your account information is compromised. Booki reserves the right to terminate accounts at our discretion."
  },
  {
    title: "4. Betting Rules and Regulations",
    content: "All bets placed through Booki are subject to our betting rules and regulations. These include specific conditions related to various sports and events, minimum and maximum bet limits, and eligibility criteria. It is your responsibility to familiarize yourself with these rules before placing any bets. Booki may adjust these rules and limits at our discretion."
  },
  {
    title: "5. Payment and Withdrawals",
    content: "All financial transactions, including deposits and withdrawals, must be processed through the methods provided on the Booki platform. You agree to provide accurate payment information and to comply with all requirements for financial transactions. Booki reserves the right to review and verify all transactions and to delay or refuse withdrawals if there are any discrepancies or concerns."
  },
  {
    title: "6. Responsible Gambling",
    content: "Booki is committed to promoting responsible gambling. We provide resources and tools to help users manage their gambling activities. You should only gamble with money you can afford to lose and seek help if you believe you may have a gambling problem. If necessary, we may suspend or close accounts for users who exhibit problematic gambling behavior."
  },
  {
    title: "7. Security and Privacy",
    content: "We implement industry-standard security measures to protect your personal and financial information. However, no online platform is completely secure. By using our services, you acknowledge and accept the risks associated with online transactions and data breaches. Our Privacy Policy outlines how we collect, use, and protect your personal data."
  },
  {
    title: "8. Intellectual Property",
    content: "All content, trademarks, and other intellectual property on the Booki website are owned by Booki or our licensors. You may not use, reproduce, or distribute any content from our website without our prior written consent. Unauthorized use of intellectual property may result in legal action."
  },
  {
    title: "9. Limitation of Liability",
    content: "Booki is not liable for any indirect, incidental, special, or consequential damages arising from or related to your use of our services. We do not guarantee the accuracy or completeness of any information provided on our platform. Our liability is limited to the maximum extent permitted by law. We are not responsible for any losses or damages resulting from your reliance on information or content provided by Booki."
  },
  {
    title: "10. Termination",
    content: "Booki reserves the right to terminate or suspend your account at any time for any reason, including but not limited to violation of these terms, fraudulent activities, or legal compliance issues. Upon termination, you will lose access to your account and any remaining funds, unless otherwise specified."
  },
  {
    title: "11. Dispute Resolution",
    content: "Any disputes arising from or related to these Terms and Conditions or your use of Booki services will be resolved through binding arbitration in accordance with the rules of the jurisdiction in which Booki operates. The arbitration process will be conducted in the English language, and the decision of the arbitrator will be final and binding."
  },
  {
    title: "12. Governing Law",
    content: "These terms are governed by and construed in accordance with the laws of the jurisdiction in which Booki operates. Any disputes arising under these terms will be subject to the exclusive jurisdiction of the courts in that jurisdiction. If any provision of these terms is found to be invalid or unenforceable, the remaining provisions will remain in full force and effect."
  },
  {
    title: "13. Changes to Terms",
    content: "Booki reserves the right to modify these Terms and Conditions at any time. We will notify users of any significant changes by posting the updated terms on our website. It is your responsibility to review these terms periodically. Continued use of our services after any changes constitutes acceptance of the new terms."
  },
  {
    title: "14. Contact Information",
    content: "If you have any questions, concerns, or feedback regarding these Terms and Conditions or our services, please contact us at support@Booki.com. We will make reasonable efforts to address your inquiries and provide assistance."
  },
  // Add remaining sections up to 50 in similar objects
];

const TermsConditions = () => {
  return (
    <div className="terms-container">
      <h1 className="terms-heading">
        Terms and Conditions of Use for Booki - Comprehensive Betting Guidelines
      </h1>
      <p className="terms-paragraph">
        Welcome to Booki. These Terms and Conditions govern your use of our betting platform. By accessing or using Booki, you agree to comply with and be bound by these terms. If you do not agree with any part of these terms, you must not use our services. We may modify these terms periodically, and your continued use of the site constitutes acceptance of any changes. It is your responsibility to review these terms regularly.
      </p>

      {termsData.map((section, index) => (
        <section className="terms-section" key={index}>
          <h2>{section.title}</h2>
          <p>{section.content}</p>
        </section>
      ))}
    </div>
  );
};

export default TermsConditions;
