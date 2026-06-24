import React, { useState } from 'react';
import { Tab, Tabs, Container } from 'react-bootstrap';

const Rules = () => {
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
                    <div >
                        <div className="rules-content">
                            <div className="container my-4">
                                <h3 className='bg-dark p-2 text-light'>खेल के नियम और शर्तें</h3>

                                <p><strong>नोट:</strong> कृपया खेलने से पहले सभी नियम ध्यान से पढ़ें।</p>

                                <div className="card bg-transparent">
                                    <div className="card-body bg-transparent">
                                        <h4>🔹 सामान्य नियम</h4>
                                        <ul>
                                            <li>डीलर क्लाइंट को सभी नियम समझाकर ही सौदा करवाए।</li>
                                            <li>नियम स्वीकार नहीं हैं तो कोई सौदा न करें।</li>
                                            <li>सर्वर/वेबसाइट खराब होने पर केवल हुए सौदे ही मान्य होंगे।</li>
                                            <li>कंपनी किसी भी नियम या सौदे को कभी भी बदल/रद्द कर सकती है।</li>
                                            <li>गलत रिजल्ट या तकनीकी गलती पर बेट बाद में भी रद्द हो सकता है।</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="card bg-transparent">
                                    <div className="card-body bg-transparent">
                                        <h4>🔹 बुकमेकर नियम</h4>
                                        <ul>
                                            <li>टीम के फायदे या नुकसान की जिम्मेदारी कंपनी की नहीं होगी।</li>
                                            <li>कंपनी जीतने वाले सौदे भी कभी भी रद्द कर सकती है।</li>
                                            <li>रिजल्ट से जुड़ी शिकायत 4 दिन के अंदर करनी होगी।</li>
                                            <li>बराबरी होने पर पॉइंट टेबल से रिजल्ट माना जाएगा।</li>
                                            <li>वीडियो बंद होने पर बुकमेकर मार्केट रद्द होगी।</li>
                                        </ul>
                                    </div>

                                </div>

                                <div className="card bg-transparent">
                                    <div className="card-body bg-transparent">
                                        <h4>🔹 कैसीनो नियम</h4>
                                        <ul>
                                            <li>टेक्निकल इश्यू में रिजल्ट न आने पर कॉइन वापस मिलेंगे।</li>
                                            <li>इस स्थिति में कोई विवाद मान्य नहीं होगा।</li>
                                        </ul>
                                    </div>

                                </div>
                                <div className="card bg-transparent">
                                    <div className="card-body bg-transparent">
                                        <h4>🔹 फैंसी नियम</h4>
                                        <ul>
                                            <li>मैच टाई होने पर सभी फैंसी मान्य रहेंगी।</li>
                                            <li>टॉस/मौसम से पहले एडवांस फैंसी बंद हो जाएंगी।</li>
                                            <li>टेक्निकल एरर में पुराने दांव मान्य रहेंगे।</li>
                                            <li>गलत रेट वाली फैंसी रद्द कर दी जाएगी।</li>
                                            <li>मैनेजमेंट का फैसला अंतिम होगा।</li>
                                        </ul>
                                    </div>

                                </div>

                                <div className="card bg-transparent">
                                    <div className="card-body bg-transparent">
                                        <h4>🔹 टेस्ट मैच नियम</h4>
                                        <ul>
                                            <li>एडवांस सेशन मान्य हैं।</li>
                                            <li>डिक्लेयर या ऑल आउट पर अधूरे सेशन रद्द होंगे।</li>
                                            <li>दोनों इनिंग में एडवांस फैंसी मान्य है।</li>
                                            <li>चोटिल बल्लेबाज के रन ही रिजल्ट माने जाएंगे।</li>
                                        </ul>
                                    </div>

                                </div>

                                <div className="card bg-transparent">
                                    <div className="card-body bg-transparent">
                                        <h4>🔹 वनडे नियम</h4>
                                        <ul>
                                            <li>एडवांस फैंसी केवल पहली पारी में होगी।</li>
                                            <li>50 ओवर पूरे नहीं हुए तो बेट रद्द होगी।</li>
                                            <li>मैच रद्द होने पर कम्प्लीट फैंसी मान्य रहेगी।</li>
                                        </ul>
                                    </div>

                                </div>

                                <div className="card bg-transparent">
                                    <div className="card-body bg-transparent">
                                        <h4>🔹 T20 नियम</h4>
                                        <ul>
                                            <li>एडवांस सेशन सिर्फ पहली पारी में होगा।</li>
                                            <li>मैच रद्द होने पर फैंसी मान्य रहेगी।</li>
                                            <li>चोटिल बल्लेबाज के रन ही गिने जाएंगे।</li>
                                        </ul>

                                    </div>

                                </div>
                                <div className="card bg-transparent">
                                    <div className="card-body bg-transparent">
                                        <h4>🔹 बॉलर रन फैंसी</h4>
                                        <ul>
                                            <li>केवल बॉलर द्वारा दिए गए रन मान्य होंगे।</li>
                                            <li>बाई/लेग बाई रन नहीं गिने जाएंगे।</li>
                                            <li>ओवर रन में एक्स्ट्रा रन जुड़ेंगे।</li>
                                        </ul>
                                    </div>

                                </div>

                                <div className="card bg-transparent">
                                    <div className="card-body bg-transparent">
                                        <h4>🔹 पावर प्ले नियम</h4>
                                        <ul>
                                            <li>पहले 4 ओवर + 2 ओवर पावर सर्ज।</li>
                                            <li>11वें ओवर के बाद कभी भी पावर सर्ज लिया जा सकता है।</li>
                                            <li>पावर सर्ज में बाहर सिर्फ 2 फील्डर होंगे।</li>
                                        </ul>
                                    </div>

                                </div>

                                <div className="card bg-transparent">
                                    <div className="card-body bg-transparent">
                                        <h4>🔹 डॉट बॉल नियम</h4>
                                        <ul>
                                            <li>बिना रन वाली गेंद डॉट बॉल होगी।</li>
                                            <li>विकेट वाली गेंद डॉट बॉल मानी जाएगी।</li>
                                            <li>फ्री हिट पर सिर्फ बैट से लगी बाउंड्री मान्य होगी।</li>
                                        </ul>

                                        <p style={{ marginTop: "15px", fontWeight: "bold" }}>
                                            ⚠️ अगर एजेंट ने पहले ही नियम बता दिए हैं, तो बाद में कोई विवाद मान्य नहीं होगा।
                                        </p>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
                </Tab>

                <Tab
                    eventKey="english"
                    title={
                        <span style={{ fontSize: '16px', fontWeight: '500' }}>
                            English
                        </span>
                    }
                >
                    <div>
                        <div className="rules-content">
                            <div className="container my-4">
                                <h3 className='bg-dark p-2 text-light'>Game Rules & Terms</h3>
                                <div className="card bg-transparent mb-3">
                                    <div className="card-body bg-transparent">
                                        <strong>Note:</strong> Please take a few minutes to read and understand all rules carefully.
                                    </div>
                                </div>

                                {/* General Rules */}
                                <div className="card bg-transparent mb-3">
                                    <div className="card-body bg-transparent">
                                        <h4>🔹 General Rules</h4>
                                        <ul>
                                            <li>Dealers must explain site rules to clients before placing bets.</li>
                                            <li>If you do not accept these rules, do not place any bets.</li>
                                            <li>In case of server or website issues, only completed deals will be valid.</li>
                                            <li>The company reserves the right to suspend or cancel any odds or terms.</li>
                                            <li>In case of any result or technical error, bets may be cancelled even after match completion.</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Bookmaker Rules */}
                                <div className="card bg-transparent mb-3">
                                    <div className="card-body bg-transparent">
                                        <h4>🔹 Bookmaker Rules</h4>
                                        <ul>
                                            <li>The company is not responsible for any team’s advantage or disadvantage.</li>
                                            <li>The company can cancel winning bets at any time.</li>
                                            <li>Result-related complaints must be raised within 4 days.</li>
                                            <li>If both teams have equal points, the result will be decided by the points table.</li>
                                            <li>If live video is interrupted, the bookmaker market will be cancelled.</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Casino Rules */}
                                <div className="card bg-transparent mb-3">
                                    <div className="card-body bg-transparent">
                                        <h4>🔹 Casino Rules</h4>
                                        <ul>
                                            <li>If a technical issue occurs and no result is declared, coins will be refunded.</li>
                                            <li>No disputes will be entertained in such cases.</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Fancy Rules */}
                                <div className="card bg-transparent mb-3">
                                    <div className="card-body bg-transparent">
                                        <h4>🔹 Fancy Rules</h4>
                                        <ul>
                                            <li>All fancy bets remain valid if the match is tied.</li>
                                            <li>Advance fancies will be suspended before toss or bad weather.</li>
                                            <li>In case of technical error, previous bets will be settled as win/loss.</li>
                                            <li>If wrong rates are displayed, fancy bets will be cancelled.</li>
                                            <li>Management’s decision will be final.</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Test Match Rules */}
                                <div className="card bg-transparent mb-3">
                                    <div className="card-body bg-transparent">
                                        <h4>🔹 Test Match Rules</h4>
                                        <ul>
                                            <li>Advance sessions are valid in Test matches.</li>
                                            <li>Incomplete sessions will be cancelled if innings is declared or all out.</li>
                                            <li>Advance fancies are valid in both innings.</li>
                                            <li>If a batsman is injured, runs scored will be final.</li>
                                            <li>Advance fancy is valid only for declared opening batsmen.</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* ODI Rules */}
                                <div className="card bg-transparent mb-3">
                                    <div className="card-body bg-transparent">
                                        <h4>🔹 ODI Rules</h4>
                                        <ul>
                                            <li>First over run fancy counts only first innings runs.</li>
                                            <li>If the match is cancelled due to rain, completed fancies will stand.</li>
                                            <li>Advance fancies are valid only in the first innings.</li>
                                            <li>If 50 overs are not completed, all bets will be cancelled.</li>
                                            <li>If a batsman is injured, runs scored will be final.</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* T20 Rules */}
                                <div className="card bg-transparent mb-3">
                                    <div className="card-body bg-transparent">
                                        <h4>🔹 T20 Rules</h4>
                                        <ul>
                                            <li>First over run fancy counts only first innings runs.</li>
                                            <li>If match is cancelled, completed fancies will stand.</li>
                                            <li>Advance 20-over run fancy is valid only in first innings.</li>
                                            <li>If a batsman is injured, runs scored will be final.</li>
                                            <li>Advance sessions are valid only in first innings.</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Bowler Run Fancy */}
                                <div className="card bg-transparent mb-3">
                                    <div className="card-body bg-transparent">
                                        <h4>🔹 Bowler Run Fancy</h4>
                                        <ul>
                                            <li>Only runs conceded by the bowler will be counted.</li>
                                            <li>Byes and leg-byes are not included.</li>
                                            <li>Over run fancy includes all runs including extras.</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Power Play Rules */}
                                <div className="card bg-transparent mb-3">
                                    <div className="card-body bg-transparent">
                                        <h4>🔹 Power Play Rules</h4>
                                        <ul>
                                            <li>Power play includes first 4 overs + 2 overs power surge.</li>
                                            <li>Batting team can take power surge anytime after the 11th over.</li>
                                            <li>Maximum 2 fielders allowed outside the 30-yard circle.</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Dot Ball Rules */}
                                <div className="card bg-transparent mb-3">
                                    <div className="card-body bg-transparent">
                                        <h4>🔹 Dot Ball Rules</h4>
                                        <ul>
                                            <li>Balls with no runs are counted as dot balls.</li>
                                            <li>Wicket balls are counted as dot balls.</li>
                                            <li>Free-hit boundaries are valid.</li>
                                            <li>Only bat boundaries are counted.</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Final Note */}
                                <div className="card bg-transparent mt-4">
                                    <div className="card-body bg-transparent">
                                        <strong>⚠️ Final Note:</strong>
                                        If the agent has already informed the client about these rules, no dispute will be accepted later.
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>
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

export default Rules;