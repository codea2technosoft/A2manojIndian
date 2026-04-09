import React, { useState } from 'react';
import { Tab, Tabs, Container } from 'react-bootstrap';

const GameRulesModal = () => {
    const [activeTab, setActiveTab] = useState('hindi');

    return (
        <>
            <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-3 border-bottom"
                fill
            >
                <Tab
                    eventKey="hindi"
                    title={
                        <span style={{ fontSize: '16px', fontWeight: '500' }}>
                            हिंदी
                        </span>
                    }
                >
                    <Container className="py-4">
                        <h4 className="mb-4">प्रिय ग्राहक</h4>
                        <div className="rules-content">
                            <p>
                                किसी भी इवेंट या खेल का परिणाम गलती से दर्ज होने पर, उसे सही करने का अधिकार हमेशा रहेगा।
                                परिणाम दर्ज होने के बाद से 24 से 48 घंटों के अंदर या कभी भी उस खेल या इवेंट का सही
                                परिणाम दर्ज किया जा सकता है।
                            </p>
                            <p>
                                यदि ग्राहक घोषित ग़लत रिजल्ट के द्वारा बड़े हुये कॉइन का यूज़ करता है तो रिजल्ट सही
                                किए जाने पर इस्तेमाल किए गए कॉइन का भुगतान ग्राहक को ख़ुद करना पड़ेगा, या ग्राहक की
                                आईडी से कॉइन माइनस या काट लिए जाएँगे।
                            </p>
                            <p>
                                यदि ग्राहक इन शर्तों से सहमत होता है, तो ही वह इस साइट पर बैटिंग कर सकता है।
                                इस स्थिति में बाद में किसी भी प्रकार का विवाद न तो एजेंट के साथ और न ही एजेंट के
                                द्वारा कंपनी के साथ स्वीकार किया जाएगा। यदि एजेंट ने इन शर्तों को पहले ही अपने
                                ग्राहक को बता दिया हो, तो बाद में किसी भी प्रकार का तर्क या विवाद स्वीकार नहीं
                                किया जाएगा।
                            </p>
                        </div>
                    </Container>
                </Tab>

                <Tab
                    eventKey="english"
                    title={
                        <span style={{ fontSize: '16px', fontWeight: '500' }}>
                            English
                        </span>
                    }
                >
                    <Container className="py-4">
                        <h4 className="mb-4">Dear Client</h4>
                        <div className="rules-content">
                            <p>
                                If any event or game is entered in error, the user shall always have the right to correct it.
                                The correct result for the game or event may be entered within 24 to 48 hours after the
                                result has been entered or at any time.
                            </p>
                            <p>
                                If the Client uses the coins added by a wrong result declared, then the Client will have to
                                pay for the coins used when the result is corrected, or the coins will be deducted from
                                the Client's ID.
                            </p>
                            <p>
                                The Client can bet on this site only if they agree to these terms. In this case,
                                no dispute of any kind will be entertained later either with the Agent or by the Agent
                                with the Company. If the Agent has already informed these conditions to its Client,
                                no argument or dispute of any kind will be entertained later.
                            </p>
                        </div>
                    </Container>
                </Tab>
            </Tabs>
            <style jsx>{`
        .rules-content p {
          line-height: 1.8;
          margin-bottom: 1.5rem;
          text-align: justify;
        }
        
        .rules-content p:last-child {
          margin-bottom: 0;
        }
        
        .modal-title {
          font-weight: 600;
          color: #333;
        }
        
        .nav-tabs .nav-link {
          color: #6c757d;
          padding: 12px 24px;
          transition: all 0.3s ease;
        }
        
        .nav-tabs .nav-link.active {
          color: #0d6efd;
          background-color: transparent;
          border-color: transparent;
          position: relative;
        }
        
        .nav-tabs .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: #0d6efd;
        }
        
        .nav-tabs {
          border-bottom: 2px solid #dee2e6;
        }
      `}</style>
        </>
    );
};

export default GameRulesModal;