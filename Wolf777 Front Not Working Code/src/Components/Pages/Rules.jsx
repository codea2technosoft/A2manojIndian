import React, { useState } from "react";
import { Link } from 'react-router-dom';

const Rules = () => {
  // Page language
  const [language, setLanguage] = useState("english");

  // Modal language
  const [modalLanguage, setModalLanguage] = useState("english");

  // Modal visibility
  const [showModal, setShowModal] = useState(true);

  // Company name
  const COMPANY_NAME = {
    english: "wolff777",
    hindi: "wolff777",
  };

  // Comprehensive rules content in both languages
  const content = {
    english: {
      title: "Rules And Regulations",
      intro: `Dear Customer, before withdrawing balance from your ${COMPANY_NAME.english} account and before placing bets, please read the Terms and Conditions carefully. If you agree, you may start playing on ${COMPANY_NAME.english}.`,

      sections: [
        {
          title: "General Rules",
          rules: [
            "All dealers are requested to explain the site's rules to clients before proceeding with any deals.",
            "If you do not accept this agreement, please do not proceed with any deal.",
            "In case of any server or website malfunction or shutdown, only the deals made will be considered valid. No disputes will be entertained in such a situation.",
            "The company reserves the right to suspend/cancel any ads/terms if proven to be misleading. For example, in cases of VPN/robot-use/multiple entries from the same IP, etc. Note: Only winning terms will be canceled.",
            "The company reserves the right to cancel any match deals (only winning deals) at any point during the match if the company believes that any fraud/improper act is occurring by the players (whether batsman/bowler)."
          ]
        },
        {
          title: "Bookmaker Rules",
          rules: [
            "We are not responsible for any advantage or disadvantage to any team due to any reason.",
            "The company has the right to delete/void any ID/bets if found invalid. For example, in cases of VPN/robot-use/multiple bets from the same IP at the same time (punching) and others. Note: Only winning bets will be canceled.",
            "Any questions regarding results or sessions must be contacted within 4 days of the result; it will not be considered valid after 4 days of the event.",
            "If two teams have equal points, the result will be given based on the point table.",
            "In any situation, if the video is interrupted/stopped due to any technical issue and cannot be continued, the bookmaker market will be canceled."
          ]
        },
        {
          title: "Casino Rules",
          rules: [
            "If the result does not come in any casino game due to a technical issue, the client will get their coins back.",
            "In such a situation, no dispute will be valid.",
            "If a client enters the Ludo Quick table and exits without playing the game, their amount will be considered a loss."
          ]
        },
        {
          title: "Fancy Rules",
          rules: [
            "If the match is tied, all fancy bets will be valid.",
            "All advance fancies will be suspended before the toss or in case of bad weather conditions.",
            "In technical error or any circumstance where any fancy is canceled and the event is not resumed, all previous bets will be valid (based on win/loss).",
            "If in any case an incorrect rate is given in a fancy, that fancy bet will be canceled.",
            "In any circumstance, management's decision across all exchanges shall be final. In case of any mismatch in the online portal, our scoreboard shall be considered valid.",
            "If the client places a bet incorrectly, we will not be liable to delete it; no changes will be made and the bet will be considered confirmed.",
            "Due to technical error, if the market remains open and result comes, after result all incorrect bets will be removed. No dispute will be accepted.",
            "Manual bets (via phone call) are not accepted in our exchange.",
            "Our exchange will provide a 5-second delay on our TV.",
            "The company reserves the right to suspend/nullify any ID/bet found invalid. For example: VPN/robot-use/multiple entries from same IP/multiple betting at same time (punching) and others. Note: Only winning bets will be canceled. For example: If we find entries from any ID (as above) and their bets are (200000 Lay in 6-over session at rate 40 and 200000 Back at rate 48) and actual score is 38, the Lay bet at 40 will be canceled and Back bet at 48 will be considered valid.",
            "The company holds the right at any point in the match to cancel any fancy bet (only winning bets) if it believes a player (batsman/bowler) is cheating/acting improperly in that fancy.",
            "Once our exchange gives username and password, changing password is your responsibility.",
            "Penalty runs will be counted in all fancy. (This rule applicable from 20th March 2024)",
            "If any unfair activity is detected, the user ID will be blocked; no queries will be accepted in this regard.",
            "Our exchange is not responsible for misuse of client IDs.",
            "In case of no-ball, incorrect bets will be removed; final decision rests with management.",
            "If the match is abandoned or due to bad weather, any sessions, partnerships, or players in running bets or retired will not have their running bets canceled. Sessions that are complete will have coins awarded or deducted accordingly. On result being declared, the players' current positions will be considered final."
          ]
        },
        {
          title: "Toss Rules",
          rules: [
            "Bets will be accepted until 1 hour before match start.",
            "Example - If match starts at 9:30 PM, bets will be accepted until 8:30 PM",
            "Example - If a match is at 6:30 PM and it starts at 5:30 PM, then as per rules, bets will be accepted until 1 hour before match start."
          ]
        },
        {
          title: "Test Match Rules",
          rules: [
            "Advance sessions are valid in Test.",
            "Incomplete sessions due to declared innings or all-out will be canceled and overs will be added to next innings.",
            "If declared innings or all-out in 132nd over, only up to 132 overs fancy will be valid.",
            "Advance fancy is valid in both innings of Test match.",
            "If match is halted due to weather, all long innings/fancies will be canceled.",
            "In Test, long innings/inning run both advance session fancies are valid.",
            "In case of batsman injury, if not out, runs will be considered where he played (example: 34 runs).",
            "If batsman injured near 50/100 runs, result will be based on that score.",
            "In 'next batsman out' fancy, if player gets injured, advance fancy will be canceled.",
            "In advance fancy, only originally designated opening batsman is valid; if changed, fancy will be canceled.",
            "In Test match, advance fancy for both opening batsmen is valid."
          ]
        },
        {
          title: "One Day Rules",
          rules: [
            "First over run advance fancy will only count runs from first innings.",
            "In case of rain or match cancellation, only complete fancies will remain valid, incomplete fancies will be removed.",
            "Partnership, fall of wicket and running batsman's final score will be final result.",
            "Example: Team A 35 over run fancy, if Team A all-out in 33 overs making 150 runs, that will be final result.",
            "Advance fancies are valid only in first innings.",
            "If full 50 overs are not completed (due to weather or any reason), all bets will be void.",
            "Advance 50 over run fancy is valid only in first innings."
          ]
        },
        {
          title: "T20 Rules",
          rules: [
            "Match first over run advance fancy will only count runs from first innings.",
            "In case of rain or match cancellation, complete fancy is valid, incomplete fancy will be removed. Partnership, fall of wicket, and player running will have final result based on their runs.",
            "Example: - 35 over run Team A in any case playing, Team A all-out in 33 overs, Team A made 150 runs, fancy final result validated on that run.",
            "Advance fancy is valid only in first innings.",
            "Advance 20 over run is valid only in first innings. 20 over run will not be considered valid if 20 overs not completed in any situation."
          ]
        },
        {
          title: "Extra Rules",
          rules: [
            "If any error found in session result (such as wrong odds, technical issue, or incorrect result reported), company reserves right to cancel/modify/remove bets related to that session even after match over."
          ]
        }
      ],

      closing: `Note: If the Agent has already informed these conditions to its Client, no argument or dispute of any kind will be entertained later. Thank you. Team ${COMPANY_NAME.english}.`,
    },

    hindi: {
      title: "नियम और शर्तें",
      intro: `प्रिय ग्राहक, ${COMPANY_NAME.hindi} में खेलने से पहले नियम और शर्तें ध्यान से पढ़ें।`,

      sections: [
        {
          title: "सामान्य नियम",
          rules: [
            "सभी डीलर्स से निवेदन है कि क्लाइंट्स को साइट के रूल्स समझाने के बाद ही सौदे करवायें।",
            "अगर आप इस एग्रीमेंट को ऐक्सेप्ट नहीं करते हे तो कोई सौदा नहीं कीजिये।",
            "सर्वर या वेबसाइट में किसी तरह की खराबी आने या बंद हो जाने पर केवल किए गए सौदे ही मान्य होंगे | ऐसी स्तिथि में किसी तरह का वाद-विवाद मान्य नहीं होगा",
            "कंपनी के पास अधिकार है कि वे किसी भी ऐड/शर्तों को निलंबित/रद्द करें अगर यह गलतफहमी साबित होता है। उदाहरण स्वरूप, वीपीएन/रोबोट-प्रयोग/एक ही आईपी से एकाधिक प्रवेश की स्थिति में और अन्य। ध्यान दें: केवल जीतने वाली शर्तें ही रद्द की जाएँगी।",
            "कंपनी के पास अधिकार है कि वे किसी भी मैच की कोई भी सौदे (केवल जीतने वाली सौदे) किसी भी समय मैच के किसी भी बिंदु पर रद्द करें अगर कंपनी का विश्वास होता है कि उस विशेष मैच में कोई धोखाधड़ी/गलत कृत्य हो रहा है खिलाड़ियों द्वारा (चाहे वो बैट्समैन/गेंदबाज हों)।"
          ]
        },
        {
          title: "बुकमेकर नियम",
          rules: [
            "किसी भी कारण से किसी भी टीम को फायदा होगा या नुकसान, इसमें हमारी कोई जवाबदारी नहीं है",
            "कंपनी के पास किसी भी आईडी/बेटस को हटाने /शून्य करने का अधिकार है, यदि वह अमान्य पाया जाता है। उदाहरण के लिए vpn/robot-use/एक ही IP से एक से अधिक बेटस एक ही समय में एक से अधिक दांव (पंचिंग) और अन्य के मामले में। नोट: केवल जीतने वाली बेट ही रद्द कर दी जाएगी ।",
            "रिजल्ट या सेशन के बारे में किसी भी प्रश्न के लिए रिजल्ट के 4 दिनों के भीतर संपर्क किया जाना चाहिए, इसे इवेंट के 4 दिनों के बाद मान्य नहीं माना जाएगा।",
            "यदि दो टीमों के अंक समान होते हैं, तो रिजल्ट पॉइंट टेबल के आधार पर दिया जाएगा",
            "किसी भी स्थिति में अगर वीडियो बाधित/बंद हो जाता है तो किसी तकनीकी समस्या के कारण इसे जारी नहीं रखा जा सकता है बुकमेकर बाजार को रद्द कर दिया जाएगा"
          ]
        },
        {
          title: "कैसीनो नियम",
          rules: [
            "यदि किसी कैसिनो गेम में किसी टेक्निकल इशू की वजह से रिजल्ट नहीं डलता है तो क्लाइंट को कॉइन वापिस मिलेंगे",
            "ऐसी स्थिति मे कोई वाद विवाद मान्य नहीं होगा",
            "अगर कोई क्लाइंट लूडो क्विक टेबल में एंट्री करता है और वह बिना गेम खेले खत्म करे एग्जिट करे तो उसकी राशि नुकसान में मान्य होगी ।"
          ]
        },
        {
          title: "फैंसी नियम",
          rules: [
            "मैच टाई होने पर सभी फैंसी बेटस मान्य होंगे।",
            "टॉस या खराब मौसम की स्थिति से पहले सभी एडवांस फैंसीयां ससपेंड कर दी जाएंगी।",
            "टेक्निकल एरर या किसी भी परिस्थिति में किसी भी फैंसी को कैंसिल कर दिया जाता है और इवेंट फिर से शुरू नहीं होता है, तो सभी पिछले दांव मान्य होंगे (हार/जीत के आधार पर)।",
            "यदि किसी मामले में गलत रेट फैंसी में दी गई है तो उस फैंसी बेटस को रद्द कर दिया जाएगा।",
            "किसी भी परिस्थिति में सभी एक्सचेंज में मैनेजमेंट का निर्णय अंतिम होगा। ऑनलाइन पोर्टल में कोई बेमेल होने पर हमारा स्कोरकार्ड मान्य माना जाएगा।",
            "यदि ग्राहक गलत तरीके से बेट लगाता है तो हम डिलीट करने के लिए उत्तरदायी नहीं होंगे, कोई बदलाव नहीं किया जाएगा और बेट को कन्फर्म बेट माना जाएगा।",
            "किसी टेक्निकल एरर के कारण मार्किट खुला है और रिजल्ट आ गया है, रिजल्ट के बाद भी सभी गलत दांव हटा दिए जाएंगे। इसमें कोई वाद विवाद मान्य नहीं होगा।",
            "हमारे एक्सचेंज में मैनुअल बेट्स (फ़ोन कॉल के द्वारा) स्वीकार नहीं किए जाते हैं।",
            "हमारा एक्सचेंज हमारे टीवी में 5 सेकंड की देरी प्रदान करेगा।",
            "कंपनी के पास किसी भी आईडी/बेट को अमान्य पाए जाने पर ससपेंड/शून्य करने का अधिकार सुरक्षित है। उदाहरण के लिए vpn/robot-use/एक ही IP से कई एंट्री/एक ही समय में कई बेट (पंचिंग) और अन्य के मामले में। नोट: केवल जीतने वाली बेट को रद्द कर दिया जाएगा, उदाहरण के लिए: यदि हमें किसी भी आईडी से ऐसी प्रविष्टियां (ऊपर उल्लिखित) मिलती हैं और उनकी बेट हैं (200000 6 ओवर सेशन में 40 की दर से और 200000 48 की दर से वापस) और वास्तविक स्कोर 38 है, 40 ले की बेट रद्द कर दी जाएगी और 48 बैक की बेट मान्य मानी जाएगी।",
            "कंपनी मैच के किसी भी बिंदु पर किसी भी फैंसी के किसी भी बेटस (केवल जीतने वाले दांव) को रद्द करने का अधिकार रखती है यदि कंपनी का मानना है कि खिलाड़ियों (या तो बल्लेबाज/गेंदबाज) द्वारा उस फैंसी में कोई धोखा/गलत किया जा रहा है।",
            "एक बार जब हमारा एक्सचेंज यूजरनेम और पासवर्ड दे देता है तो पासवर्ड बदलने की जिम्मेदारी आपकी होती है।",
            "सभी फैंसी में पेनल्टी रन गिने जाएंगे। (यह नियम 20 मार्च 2024 से लागू होगा)",
            "किसी भी गलत गतिविधियों का पता चलने पर यूजर आईडी ब्लॉक कर दिया जाएगा, इस संबंध में कोई प्रश्न स्वीकार नहीं किया जाएगा।",
            "क्लाइंट आईडी के दुरुपयोग के लिए हमारा एक्सचेंज जिम्मेदार नहीं है।",
            "नो बॉल के मामले में, गलत बेटस हटा दिए जाएंगे, तो अंतिम निर्णय मैनेजमेंट का होगा।",
            "मैच अबॉण्डेड या खराब मौसम होने पर जो सेशन, पार्टनरशिप और खिलाड़ी रनिंग में है या खिलाड़ी रिटायर हुआ है वो रनिंग सौदे कैंसल नहीं होंगे। और जो सेशन कम्पलीट है उनके हिसाब से कोइन्स कम या ज्यादा होंगे। और रिजल्ट आने पे जो खिलाड़ी जहां है वो वहीं माने जाएंगे।"
          ]
        },
        {
          title: "टॉस के नियम",
          rules: [
            "मैच शुरू होने से 1 घंटे पहले तक दांव स्वीकार किए जाएंगे",
            "उदाहरण -  यदि मैच रात 9:30 बजे शुरू होता है तो दांव रात 8:30 बजे तक स्वीकार किए जाएंगे",
            "उदाहरण -  यदि कोई मैच शाम 6:30 बजे है और वह 5:30 बजे शुरू होता है तो नियमों के अनुसार मैच शुरू होने से 1 घंटे पहले तक दांव स्वीकार किए जाएंगे।"
          ]
        },
        {
          title: "टेस्ट मैच नियम",
          rules: [
            "एडवांस सेशन टेस्ट में मान्य है।",
            "घोषित पारी या ऑल आउट के कारण अधूरे सेशन रद्द किए जाएंगे और ओवर अगले इनिंग में जोड़े जाएंगे।",
            "132वें ओवर में घोषित पारी या ऑल आउट होने पर केवल 132 ओवर तक की फैंसी मान्य होगी।",
            "टेस्ट मैच की दोनों इनिंग में एडवांस फैंसी मान्य हैं।",
            "यदि मौसम के कारण मैच रोका गया हो तो सभी लंबी इनिंग/फैंसी रद्द कर दी जाएंगी।",
            "टेस्ट में लंबी पारी/इनिंग रन की दोनों एडवांस सेशन फैंसी मान्य हैं।",
            "बल्लेबाज के चोटिल होने की स्थिति में उसके आउट न होने पर रन वहीं माने जाएंगे जहाँ तक वह खेला (उदाहरण: 34 रन)।",
            "बल्लेबाज 50/100 रन के पास घायल होने पर रिजल्ट उसी स्कोर पर माना जाएगा।",
            "अगला बल्लेबाज आउट फैंसी में यदि खिलाड़ी घायल हो जाए तो एडवांस फैंसी रद्द कर दी जाएगी।",
            "एडवांस फैंसी में वही ओपनिंग बैट्समैन मान्य होगा जो पहले नामित था; यदि बदला गया तो फैंसी रद्द होगी।",
            "टेस्ट मैच में दोनों ओपनिंग बल्लेबाज की एडवांस फैंसी मान्य है।"
          ]
        },
        {
          title: "वनडे नियम",
          rules: [
            "पहले ओवर रन एडवांस फैंसी केवल पहली पारी के रन गिने जाएंगे।",
            "बारिश या मैच रद्द होने की स्थिति में केवल कम्प्लीट फैंसी मान्य रहेंगी, इन्कम्प्लीट फैंसी हटा दी जाएंगी।",
            "पार्टनरशिप, फॉल ऑफ विकेट और रनिंग में खिलाड़ी का अंतिम स्कोर ही फाइनल रिजल्ट माना जाएगा।",
            "उदाहरण: टीम A 35 ओवर रन फैंसी में 33 ओवर में ऑलआउट होकर 150 रन बनाती है, तो वही फाइनल रिजल्ट माना जाएगा।",
            "एडवांस फैंसी केवल पहली पारी में मान्य है।",
            "50 ओवर पूरे न होने की स्थिति में (मौसम या अन्य कारणों से), सभी बेट रद्द किए जाएंगे।",
            "एडवांस 50 ओवर रन फैंसी केवल पहली पारी में मान्य है।"
          ]
        },
        {
          title: "T20 नियम",
          rules: [
            "मैच का पहला ओवर रन एडवांस फैंसी केवल पहली पारी के रन गिने जाएंगे।",
            "बारिश या मैच रद्द होने की स्थिति में कम्प्लीट फैंसी मान्य है,इन्कम्प्लीट फैंसी हटा दि जाएंगे।।और जो पार्टनरशिप,फॉलऑफ़ विकेट,और खिलाडी रनिंग में है उनका फाइनल रिजल्ट उनके रनो पर ही दिया जायगा",
            "उदाहरण के लिए: - 35 ओवर रन टीम ए किसी भी मामले में खेल रही है, टीम ए 33 ओवर में ऑल-आउट हो गई है, टीम ए ने 150 रन बना लिए हैं, फैंसी फाइनल रिजल्ट उस रन पर मान्य किया जाता है।",
            "एडवांस फैंसी  केवल पहली पारी में मान्य है।",
            "एडवांस 20 ओवर रन केवल पहली पारी में मान्य है। 20 ओवर का रन मान्य नहीं माना जाएगा यदि 20 ओवर किसी भी स्थिति में पूरा नहीं होता है"
          ]
        },
        {
          title: "अन्य नियम",
          rules: [
            "यदि किसी सेशन के परिणाम में कोई त्रुटि (जैसे कि गलत ऑड्स, तकनीकी समस्या, या गलत रिपोर्ट किया गया परिणाम) पाई जाती है, तो कंपनी उस सेशन से जुड़ी शर्तों (बेट्स) को मैच समाप्त होने के बाद भी रद्द, संशोधित या हटाने का अधिकार रखती है।"
          ]
        }
      ],

      closing: `नोट: यदि एजेंट ने इन शर्तों को पहले ही अपने ग्राहक को बता दिया है, तो बाद में किसी भी प्रकार का तर्क या विवाद स्वीकार नहीं किया जाएगा। धन्यवाद। टीम ${COMPANY_NAME.hindi}।`,
    },
  };
  const modelcontent = {
    english: {
      title: "Rules And Regulations",
      intro: `Dear Customer, before withdrawing balance from your ${COMPANY_NAME.english} account and before placing bets, please read the Terms and Conditions carefully. If you agree, you may start playing on ${COMPANY_NAME.english}.`,

      sections: [
        {
          title: "General Rules",
          rules: [
            "If any event or game is entered in error, the user shall always have the right to correct it. The correct result for the game or event may be entered within 48 to 72 hours after the result has been entered or at any time.",
            "If the Client uses the coins added by a wrong result declared, then the Client will have to pay for the coins used when the result is corrected, or the coins will be minused or deducted from the Client's ID. The Client can bet on this site only if he agrees to these terms.",
            "In this case, no dispute of any kind will be entertained later either with the Agent or by the Agent with the Company. If the Agent has already informed these conditions to its Client, no argument or dispute of any kind will be entertained later.",
            
          ]
        },
        
      ],
    },

    hindi: {
      title: "नियम और शर्तें",
      intro: `प्रिय ग्राहक, ${COMPANY_NAME.hindi} में खेलने से पहले नियम और शर्तें ध्यान से पढ़ें।`,

      sections: [
        {
          title: "सामान्य नियम",
          rules: [
            "किसी भी इवेंट या खेल का परिणाम गलती से दर्ज होने पर, उसे सही करने का अधिकार हमेशा रहेगा। परिणाम दर्ज होने के बाद से 48 से 72 घंटों के अंदर या कभी भी उस खेल या इवेंट का सही परिणाम दर्ज किया जा सकता है।",
            "यदि ग्राहक घोषित ग़लत रिजल्ट के द्वारा बड़े हुये कॉइन का यूज़ करता है तो रिजल्ट सही किए जाने पर इस्तेमाल किए गए कॉइन का भुगतान ग्राहक को ख़ुद करना पड़ेगा, या ग्राहक की आईडी से कॉइन माइनस या काट लिए जाएँगे यदि ग्राहक इन शर्तों से सहमत होता है, तो ही वह इस साइट पर बैटिंग कर सकता है।",
            "इस स्थिति में बाद में किसी भी प्रकार का विवाद न तो एजेंट के साथ और न ही एजेंट के द्वारा कंपनी के साथ स्वीकार किया जाएगा। यदि एजेंट ने इन शर्तों को पहले ही अपने ग्राहक को बता दे , बाद में किसी भी प्रकार का तर्क या विवाद स्वीकार नहीं किया जाएगा।",
           
          ]
        },
       
      ],

    
    },
  };

  const pageContent = content[language];
  const modalContent = modelcontent[modalLanguage];

  return (
    <>
      <div className="Manu">
        <Link to='/indexpage'>Main Menu</Link>
      </div>

      {/* ================= MODAL ================= */}
     
      <div className="d-flex justify-content-center align-items-center">
        <div className="language-selector">
          <button
            className={`lang-btn ${language === "english" ? "active" : ""
              }`}
            onClick={() => setLanguage("english")}
          >
            English
          </button>

          <button
            className={`lang-btn ${language === "hindi" ? "active" : ""
              }`}
            onClick={() => setLanguage("hindi")}
          >
            हिंदी
          </button>
        </div>
      </div>
      {/* ================= PAGE CONTENT ================= */}
      <div className="rules-regulations-container">
        <div className="card pt-3">
          <div className="card-body">
            <header className="card-header text-white">
              {pageContent.title}


            </header>

            <div className="content-section">
              <p className="intro-text">{pageContent.intro}</p>

              {pageContent.sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="section-container">
                  <div class="d-flex align-items-center my-3 ruledesign">
                    <span class="sectiontitle">{section.title}</span>
                    <hr class="flex-grow-1"/>
                  </div>
                  {/* <h4 className="section-title">{section.title}</h4> */}
                  <div className="rules-list">
                    {section.rules.map((rule, index) => (
                      <div key={index} className="rule-item">
                        <span className="rule-text">{rule}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="closing-section">
                <p>{pageContent.closing}</p>
              </div>
            </div>
          </div>
        </div>
      </div>


    </>
  );
};

export default Rules;