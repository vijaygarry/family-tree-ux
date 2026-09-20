import React, { useState } from "react";
import {
  Accordion,
  Button,
  Form,
  InputGroup,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { SUPPORT_EMAIL } from "../constants/contact";

const HelpPage = () => {
  const [expandedItems, setExpandedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Answers can be strings or React nodes (JSX). Use JSX to add multiple lines, formatting or images.
  const faqs = [
    {
      id: "11",
      question: "How do I contact support? / सहायता के लिए मैं कैसे संपर्क करूं?",
      answer: (
        <div
          style={{
            backgroundColor: "#E8E8E8",
            padding: "12px",
            borderRadius: 6,
            lineHeight: "1.6",
          }}
        >
          <p>
            Reach out to one of the local volunteers in your area:
          </p>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.9rem",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#c8c8c8" }}>
                <th style={{ border: "1px solid #aaa", padding: "6px 10px" }}>#</th>
                <th style={{ border: "1px solid #aaa", padding: "6px 10px" }}>Name</th>
                <th style={{ border: "1px solid #aaa", padding: "6px 10px" }}>City</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Rohit Alekar", city: "Todi Fatehpur" },
                { name: "Vijay Garothaya", city: "Amravati" },
                { name: "Rohit Rajput", city: "Amravati" },
                { name: "CA Nikhil Malaiya", city: "Amravati" },
                { name: "Dushyant Chhipa", city: "Mumbai" },
                { name: "Hemchandra Vaidya (Babu)", city: "Mumbai" },
                { name: "Kalpana Tomar", city: "Nagpur" },
                { name: "Hemant Dularya", city: "Mahoba" },
                { name: "Aryan Alekar", city: "Banda" },
                { name: "Sunil Dularya", city: "Maidwara" },
                { name: "Parshuram Lachurya", city: "Garautha" },
                { name: "Tarendra Chhatpuriya", city: "Belatal" },
                { name: "Abhishek Vaidya", city: "Sujunwa" },
                { name: "Neelesh Kutraya", city: "Mauaranipur" },
                { name: "Veeru Bajnawale", city: "Mauaranipur" },
              ].map((v, i) => (
                <tr
                  key={i}
                  style={{ backgroundColor: i % 2 === 0 ? "#f0f0f0" : "#e0e0e0" }}
                >
                  <td style={{ border: "1px solid #aaa", padding: "5px 10px" }}>{i + 1}</td>
                  <td style={{ border: "1px solid #aaa", padding: "5px 10px" }}>{v.name}</td>
                  <td style={{ border: "1px solid #aaa", padding: "5px 10px" }}>{v.city}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>
            OR you can contact support by emailing <strong>{SUPPORT_EMAIL}</strong>.
          </p>

          <hr />

          <p>
            आप अपने क्षेत्र के किसी स्थानीय स्वयंसेवक से संपर्क कर सकते हैं:
          </p>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.9rem",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#c8c8c8" }}>
                <th style={{ border: "1px solid #aaa", padding: "6px 10px" }}>क्र.</th>
                <th style={{ border: "1px solid #aaa", padding: "6px 10px" }}>नाम</th>
                <th style={{ border: "1px solid #aaa", padding: "6px 10px" }}>शहर</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "श्री रोहित आलेकर", city: "टोड़ी फतेहपुर" },
                { name: "श्री विजय गरौठया", city: "अमरावती" },
                { name: "श्री रोहित राजपुत", city: "अमरावती" },
                { name: "श्री सीए निखिल मलैया", city: "अमरावती" },
                { name: "श्री दुष्यंत जी छीपा", city: "मुम्बई" },
                { name: "श्री हेमचंद्र जी वैद्य (बाबू)", city: "मुम्बई" },
                { name: "श्रीमती कल्पना तोमर", city: "नागपुर" },
                { name: "श्री हेमन्त दुलारया", city: "महोवा" },
                { name: "श्री आर्यन आलेकर", city: "बाँदा" },
                { name: "श्री सुनील दुलारया", city: "मैदवारा" },
                { name: "श्री परशुराम लचुरया", city: "गरौठा" },
                { name: "श्री तारेन्द्र छतपुरिया", city: "बेलाताल" },
                { name: "श्री अभिषेक वैद्य", city: "सुजुंवा" },
                { name: "श्री नीलेश कुटरया", city: "मऊरानीपुर" },
                { name: "श्री वीरू बजनावाले", city: "मऊरानीपुर" },
              ].map((v, i) => (
                <tr
                  key={i}
                  style={{ backgroundColor: i % 2 === 0 ? "#f0f0f0" : "#e0e0e0" }}
                >
                  <td style={{ border: "1px solid #aaa", padding: "5px 10px" }}>{i + 1}</td>
                  <td style={{ border: "1px solid #aaa", padding: "5px 10px" }}>{v.name}</td>
                  <td style={{ border: "1px solid #aaa", padding: "5px 10px" }}>{v.city}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>
            या आप सहायता के लिए <strong>{SUPPORT_EMAIL}</strong> पर ईमेल कर सकते हैं।
          </p>
        </div>
      ),
    },
    {
      id: "1",
      question: "How to use this application?",
      answer: (
        <div
          style={{
            backgroundColor: "#E8E8E8",
            padding: "12px",
            borderRadius: 6,
          }}
        >
          <p>
            Watch the introduction video below to learn how to use the
            application:
          </p>

          <div
            style={{
              position: "relative",
              paddingBottom: "56.25%", // 16:9 aspect ratio
              height: 0,
              overflow: "hidden",
              borderRadius: 6,
            }}
          >
            <iframe
              src="https://www.youtube.com/embed/KjhBoB-0mzc"
              title="How to use Rajput Chhipa Samaj Application"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                borderRadius: 6,
              }}
            />
          </div>
        </div>
      ),
    },
    {
      id: "5",
      question:
        "How can I get online access? / मुझे ऑनलाइन एक्सेस कैसे मिलेगा?",
      answer: (
        <div
          style={{
            backgroundColor: "#E8E8E8",
            padding: "16px",
            borderRadius: 6,
            lineHeight: "1.6",
          }}
          className="faq-content"
        >
          <p>
            <strong>Before you begin</strong>
          </p>
          <p>Check the following before registering:</p>
          <ul>
            <li>
              <strong>Your family must be registered in the system.</strong> If
              your family and members are not yet added, you will not be able to
              use the App. Contact a volunteer or email{" "}
              <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> to get
              your family added.
            </li>
            <li>
              <strong>
                Your member profile must have the correct WhatsApp mobile
                number.
              </strong>
            </li>
          </ul>

          <p>
            <strong>Register for Online Access (only once)</strong>
          </p>
          <ol>
            <li>
              Open the Rajput Chhipa App:{" "}
              <a
                href="https://www.rajputchhipa.com"
                style={{ color: "#A42502", textDecoration: "none" }}
              >
                www.rajputchhipa.com
              </a>
            </li>
            <li>
              Click the{" "}
              <a
                href="/signup"
                style={{ color: "#A42502", textDecoration: "none" }}
              >
                Sign Up
              </a>{" "}
              link on the login page.
            </li>
            <li>
              Enter your mobile number and click{" "}
              <strong>Request Sign Up OTP</strong>.
            </li>
            <li>
              Contact any of the following volunteers on WhatsApp to receive
              your OTP:
              <table
                style={{
                  margin: "8px 0",
                  borderCollapse: "collapse",
                  fontSize: "0.9rem",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#c8c8c8" }}>
                    <th style={{ border: "1px solid #aaa", padding: "5px 10px" }}>Volunteer</th>
                    <th style={{ border: "1px solid #aaa", padding: "5px 10px" }}>WhatsApp / Phone</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ backgroundColor: "#f0f0f0" }}>
                    <td style={{ border: "1px solid #aaa", padding: "5px 10px" }}>Rohit</td>
                    <td style={{ border: "1px solid #aaa", padding: "5px 10px" }}>+91 73963 58265</td>
                  </tr>
                  <tr style={{ backgroundColor: "#e0e0e0" }}>
                    <td style={{ border: "1px solid #aaa", padding: "5px 10px" }}>Veeru</td>
                    <td style={{ border: "1px solid #aaa", padding: "5px 10px" }}>+91 83170 59394</td>
                  </tr>
                  <tr style={{ backgroundColor: "#f0f0f0" }}>
                    <td style={{ border: "1px solid #aaa", padding: "5px 10px" }}>Vijay</td>
                    <td style={{ border: "1px solid #aaa", padding: "5px 10px" }}>+1 571 484 3763</td>
                  </tr>
                </tbody>
              </table>
              ⚠️ OTP must be used within <strong>24 hours</strong>.
            </li>
            <li>
              Enter the OTP, choose your password, and click{" "}
              <strong>Sign Up</strong> to complete registration.
            </li>
          </ol>
          <p>
            💡 <strong>Tip:</strong> Registration is done only once. After
            that, log in anytime using your mobile number and chosen password.
          </p>

          <p>
            <strong>Login to Rajput Chhipa App</strong>
          </p>
          <ol>
            <li>
              Open:{" "}
              <a
                href="https://www.rajputchhipa.com"
                style={{ color: "#A42502", textDecoration: "none" }}
              >
                www.rajputchhipa.com
              </a>
            </li>
            <li>
              Enter your mobile number and the password you set during
              registration, then click <strong>Login</strong>.
            </li>
          </ol>

          <hr />

          <p>
            <strong>शुरू करने से पहले</strong>
          </p>
          <p>Register करने से पहले ये चीज़ें check कर लें:</p>
          <ul>
            <li>
              <strong>आपकी family system में registered होनी चाहिए।</strong>{" "}
              अगर आपकी family और family members registered नहीं हैं, तो आप App
              use नहीं कर पाएंगे। किसी volunteer से या{" "}
              <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> पर ईमेल
              करके अपना परिवार जुड़वाएं।
            </li>
            <li>
              <strong>
                आपकी member profile में सही WhatsApp mobile number होना
                चाहिए।
              </strong>
            </li>
          </ul>

          <p>
            <strong>Online Access के लिए Register करें (सिर्फ एक बार)</strong>
          </p>
          <ol>
            <li>
              इस link से Rajput Chhipa App खोलें:{" "}
              <a
                href="https://www.rajputchhipa.com"
                style={{ color: "#A42502", textDecoration: "none" }}
              >
                www.rajputchhipa.com
              </a>
            </li>
            <li>Login page पर Sign-up link पर click करें।</li>
            <li>
              अपना mobile number डालें और{" "}
              <strong>Request Sign Up OTP</strong> पर click करें।
            </li>
            <li>
              OTP लेने के लिए नीचे दिए गए किसी भी volunteer से WhatsApp पर
              contact करें:
              <table
                style={{
                  margin: "8px 0",
                  borderCollapse: "collapse",
                  fontSize: "0.9rem",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#c8c8c8" }}>
                    <th style={{ border: "1px solid #aaa", padding: "5px 10px" }}>Volunteer</th>
                    <th style={{ border: "1px solid #aaa", padding: "5px 10px" }}>WhatsApp / Phone</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ backgroundColor: "#f0f0f0" }}>
                    <td style={{ border: "1px solid #aaa", padding: "5px 10px" }}>Rohit</td>
                    <td style={{ border: "1px solid #aaa", padding: "5px 10px" }}>+91 73963 58265</td>
                  </tr>
                  <tr style={{ backgroundColor: "#e0e0e0" }}>
                    <td style={{ border: "1px solid #aaa", padding: "5px 10px" }}>Veeru</td>
                    <td style={{ border: "1px solid #aaa", padding: "5px 10px" }}>+91 83170 59394</td>
                  </tr>
                  <tr style={{ backgroundColor: "#f0f0f0" }}>
                    <td style={{ border: "1px solid #aaa", padding: "5px 10px" }}>Vijay</td>
                    <td style={{ border: "1px solid #aaa", padding: "5px 10px" }}>+1 571 484 3763</td>
                  </tr>
                </tbody>
              </table>
              ⚠️ OTP को <strong>24 घंटे</strong> के अंदर use करना ज़रूरी है।
            </li>
            <li>
              OTP डालें, अपना password चुनें, और registration पूरा करने के
              लिए <strong>Sign Up</strong> पर click करें।
            </li>
          </ol>
          <p>
            💡 <strong>Tip:</strong> Registration सिर्फ एक बार करना होता है।
            इसके बाद आप अपने mobile number और चुने हुए password से login
            करेंगे।
          </p>

          <p>
            <strong>Rajput Chhipa App में Login करें</strong>
          </p>
          <ol>
            <li>
              Rajput Chhipa App खोलें:{" "}
              <a
                href="https://www.rajputchhipa.com"
                style={{ color: "#A42502", textDecoration: "none" }}
              >
                www.rajputchhipa.com
              </a>
            </li>
            <li>
              अपना mobile number और registration के time चुना हुआ password
              डालें, फिर <strong>Login</strong> पर click करें।
            </li>
          </ol>
        </div>
      ),
    },
    {
      id: "6",
      question:
        "Why isn't the admin adding all families from the यथार्थ (Yatharth) book automatically? / Admin यथार्थ पुस्तक के सभी परिवारों को सीधे क्यों नहीं जोड़ रहे हैं?",
      answer: (
        <div
          style={{
            backgroundColor: "#E8E8E8",
            padding: "16px",
            borderRadius: 6,
            lineHeight: "1.6",
          }}
          className="faq-content"
        >
          <p>
            Some families may not want their information published online
            without their consent.
          </p>
          <p>
            Requesting families to send an email ensures that we have their
            permission before adding their details to the application.
          </p>

          <hr />

          <p>
            कुछ परिवार अपनी जानकारी बिना अनुमति के इंटरनेट पर प्रकाशित नहीं करना
            चाहते।
          </p>
          <p>
            Email द्वारा अनुरोध मंगवाने का उद्देश्य यह सुनिश्चित करना है कि
            परिवार की सहमति (Permission) प्राप्त हो चुकी है।
          </p>
          <p>
            सहमति मिलने के बाद ही परिवार का विवरण application में जोड़ा जाता है।
          </p>
        </div>
      ),
    },
    {
      id: "7",
      question:
        "Why can’t I access the application without adding my family first? / परिवार जोड़े बिना मैं application का उपयोग क्यों नहीं कर सकता?",
      answer: (
        <div
          style={{
            backgroundColor: "#E8E8E8",
            padding: "16px",
            borderRadius: 6,
            lineHeight: "1.6",
          }}
          className="faq-content"
        >
          <p>
            This application is exclusively for the Rajput Chhipa Samaj
            community.
          </p>
          <p>
            If open registration were allowed, anyone could create an account
            and view community profiles.
          </p>
          <p>
            To ensure privacy and restrict access only to verified families:
          </p>
          <ul>
            <li>Your family must first be added to the system.</li>
            <li>
              You must register using a valid mobile number linked to your
              family.
            </li>
          </ul>
          <p>
            This process keeps the platform secure and limited to community
            members only.
          </p>

          <hr />

          <p>
            यह एप्लिकेशन केवल राजपूत छीपा समाज के सदस्यों के लिए बनाई गई है।
          </p>
          <p>
            यदि खुली रजिस्ट्रेशन की अनुमति दी जाए, तो कोई भी व्यक्ति रजिस्टर
            करके समाज की जानकारी देख सकता है।
          </p>
          <p>सुरक्षा और गोपनीयता बनाए रखने के लिए:</p>
          <ul>
            <li>पहले आपके परिवार का विवरण सिस्टम में जोड़ा जाता है।</li>
            <li>फिर आप अपने registered मोबाइल नंबर से Sign Up कर सकते हैं।</li>
          </ul>
          <p>
            इस प्रक्रिया से application का उपयोग केवल प्रमाणित समाज के सदस्य ही
            कर सकते हैं।
          </p>
        </div>
      ),
    },
    {
      id: "2",
      question: "How can I add a member to my family?",
      answer: (
        <div
          style={{
            backgroundColor: "#E8E8E8",
            padding: "12px",
            borderRadius: 6,
          }}
        >
          <p>
            Reach out to an administrator at{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> with the
            following details:
          </p>
          <ul>
            <li>
              <strong>Family Name</strong>
            </li>
            <li>
              <strong>First Name</strong>
            </li>
            <li>
              <strong>Birthdate</strong>
            </li>
            <li>
              <strong>Marital Status</strong>
            </li>
          </ul>
          <p className="small text-muted">
            The administrator will review and process your request.
          </p>
        </div>
      ),
    },
    {
      id: "3",
      question: "How do I update my profile?",
      answer: (
        <div
          style={{
            backgroundColor: "#E8E8E8",
            padding: "12px",
            borderRadius: 6,
          }}
        >
          <p>There are two ways to update your profile:</p>
          <ol>
            <li>
              <strong>If you are a registered member:</strong> Log in to the
              application, go to{" "}
              <a
                href="/myProfile"
                style={{ color: "#A42502", textDecoration: "none" }}
              >
                <em>My Profile</em> &rarr; <em>Edit Profile</em>
              </a>
              . Make the necessary changes and save.
            </li>
            <li>
              <strong>
                If you are not registered or cannot access your account:
              </strong>{" "}
              Ask any registered family member to log in, go to{" "}
              <em>My Family</em>, click your profile, and use the{" "}
              <em>Edit Profile</em> option to update your information on your
              behalf.
            </li>
          </ol>
        </div>
      ),
    },
    {
      id: "4",
      question: "How do I update my profile picture?",
      answer: (
        <div
          style={{
            backgroundColor: "#E8E8E8",
            padding: "12px",
            borderRadius: 6,
          }}
        >
          <p>There are two ways to update your profile picture:</p>
          <ol>
            <li>
              <strong>If you are a registered member:</strong> Log in to the
              application, go to{" "}
              <a
                href="/myProfile"
                style={{ color: "#A42502", textDecoration: "none" }}
              >
                <em>My Profile</em>
              </a>
              . On your profile page, use the <em>Edit Image</em> option
              displayed just below your profile image to upload a new picture.
            </li>
            <li>
              <strong>
                If you are not registered or cannot access your account:
              </strong>{" "}
              Ask any registered family member to log in, go to{" "}
              <em>My Family</em>, click your profile, and use the{" "}
              <em>Edit Image</em> option (below the profile image) to upload or
              update your picture on your behalf.
            </li>
          </ol>
        </div>
      ),
    },
    {
      id: "8",
      question:
        "Why does each member need a unique mobile number? / प्रत्येक सदस्य के लिए अलग मोबाइल नंबर क्यों आवश्यक है?",
      answer: (
        <div
          style={{
            backgroundColor: "#E8E8E8",
            padding: "16px",
            borderRadius: 6,
            lineHeight: "1.6",
          }}
          className="faq-content"
        >
          <p>Each member has their own separate login and password.</p>
          <p>
            To uniquely identify every user and maintain account security, each
            member must have a unique mobile number.
          </p>
          <p>
            Sharing the same mobile number between multiple members is not
            allowed.
          </p>
          <hr />
          <p>प्रत्येक सदस्य का अलग लॉगिन और पासवर्ड होता है।</p>
          <p>
            सुरक्षा और पहचान के लिए हर सदस्य का एक यूनिक (अलग) मोबाइल नंबर होना
            आवश्यक है।
          </p>
          <p>
            एक ही मोबाइल नंबर से कई सदस्यों को रजिस्टर करने की अनुमति नहीं है।
          </p>
        </div>
      ),
    },
    {
      id: "9",
      question:
        "Why can’t I add my family myself? / मैं अपना परिवार स्वयं क्यों नहीं जोड़ सकता?",
      answer: (
        <div
          style={{
            backgroundColor: "#E8E8E8",
            padding: "16px",
            borderRadius: 6,
            lineHeight: "1.6",
          }}
          className="faq-content"
        >
          <p>
            Since this is a new application, allowing self-registration for
            families may lead to:
          </p>
          <ul>
            <li>Duplicate entries</li>
            <li>Incorrect information</li>
            <li>Data inconsistencies</li>
          </ul>
          <p>
            To maintain accuracy and avoid confusion, only the admin can add new
            families.
          </p>
          <p>
            Once your family is added, members can update and manage their own
            profiles.
          </p>

          <hr />

          <p>
            यह एक नया एप्लिकेशन है। यदि सभी को स्वयं परिवार जोड़ने की अनुमति दी
            जाए तो:
          </p>
          <ul>
            <li>Duplicate एंट्री हो सकती है</li>
            <li>गलत जानकारी दर्ज हो सकती है</li>
            <li>डेटा में भ्रम उत्पन्न हो सकता है</li>
          </ul>
          <p>इसी कारण से केवल admin को नया परिवार जोड़ने की अनुमति है।</p>
          <p>
            एक बार परिवार जुड़ जाने के बाद, सदस्य अपनी प्रोफ़ाइल और परिवार की
            जानकारी अपडेट कर सकते हैं।
          </p>
        </div>
      ),
    },
    {
      id: "10",
      question: "How do I reset my password?",
      answer: (
        <div
          style={{
            backgroundColor: "#E8E8E8",
            padding: "12px",
            borderRadius: 6,
          }}
        >
          <p>
            To reset your password, enter your registered email address on the{" "}
            <a
              href="/forgotpassword"
              style={{ color: "#A42502", textDecoration: "none" }}
            >
              Forgot Password
            </a>{" "}
            page. You will receive a one-time password (OTP) at that email
            address.
          </p>
          <p>
            Enter the OTP you received to verify your identity, then choose a
            new password to complete the reset.
          </p>
          <p className="small text-muted">
            If you don't receive the OTP email, check your spam folder or
            contact support.
          </p>
        </div>
      ),
    },
  ];

  // Filter based on search
  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Toggle a single FAQ
  const toggleItem = (id) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // Expand/collapse all
  const toggleAll = (expand) => {
    if (expand) {
      setExpandedItems(filteredFaqs.map((faq) => faq.id));
    } else {
      setExpandedItems([]);
    }
  };

  return (
    <Container className="py-4">
      <div className="container p-4 bg-white rounded mt-4">
        {/* Help image */}
        <Row className="mb-4">
          <Col className="text-center">
            <img
              src="/faq-banner.jpg"
              alt="Help"
              className="img-fluid rounded shadow"
              style={{ maxHeight: "200px" }}
            />
          </Col>
        </Row>

        {/* Search and buttons */}
        <Row className="mb-3 d-flex">
          <Col md={8}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="me-2"
              />
            </InputGroup>
          </Col>
          <Col md={4} className="text-md-end mt-2 mt-md-0">
            <Button
              variant="primary"
              className="me-2"
              onClick={() => toggleAll(true)}
            >
              Expand All
            </Button>
            <Button variant="secondary" onClick={() => toggleAll(false)}>
              Collapse All
            </Button>
          </Col>
        </Row>

        {/* FAQ Accordion */}
        <Accordion activeKey={expandedItems}>
          {filteredFaqs.map((faq) => (
            <Accordion.Item eventKey={faq.id} key={faq.id}>
              <Accordion.Header onClick={() => toggleItem(faq.id)}>
                {faq.question}
              </Accordion.Header>
              <Accordion.Body>
                {/* Render answer which may be string or JSX node */}
                {typeof faq.answer === "string" ? (
                  <p>{faq.answer}</p>
                ) : (
                  faq.answer
                )}
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>

        {/* No results */}
        {filteredFaqs.length === 0 && (
          <p className="mt-3 text-muted text-center">
            No matching questions found.
          </p>
        )}
      </div>
    </Container>
  );
};

export default HelpPage;
