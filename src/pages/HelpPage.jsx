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
      id: "1",
      question: "How can I add my family to this application?",
      answer: (
        <div
          style={{
            backgroundColor: "#E8E8E8",
            padding: "12px",
            borderRadius: 6,
          }}
        >
          <p>
            To add your family, email{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> with the
            details below.
          </p>
          <ul>
            <li>
              <strong>Family Name</strong>
            </li>
            <li>
              <strong>Family Address</strong>
            </li>
          </ul>
          <p>
            Alternatively, you may provide the page number from the{" "}
            <em>
              <strong>यथार्थ (Yatharth)</strong>
            </em>{" "}
            book where your family is listed.
          </p>
          <p className="small text-muted">
            The administrator will review and process your request.
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
      id: "5",
      question:
        "How I can register/sign up or get online access for this application",
      answer: (
        <div
          style={{
            backgroundColor: "#E8E8E8",
            padding: "12px",
            borderRadius: 6,
          }}
        >
          <p>
            Access to this application is restricted to members of the Rajput
            Chhipa Samaj.
          </p>
          <p>
            To register, you must be listed as a member of one of the families.
            Once your family membership is recorded with a valid email address,
            you can{" "}
            <a
              href="/signup"
              style={{ color: "#A42502", textDecoration: "none" }}
            >
              sign up
            </a>{" "}
            sign up using that registered email.
          </p>
          <p>
            If the member does not have an email address, they cannot be
            registered directly. In that case, request an administrator or any
            registered family member to add or update the member's email address
            so the member can sign up.
          </p>
          <p className="small text-muted">
            For assistance, contact{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
          </p>
        </div>
      ),
    },
    {
      id: "6",
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
    {
      id: "7",
      question: "How do I contact support?",
      answer: (
        <div
          style={{
            backgroundColor: "#E8E8E8",
            padding: "12px",
            borderRadius: 6,
          }}
        >
          <p>
            You can contact support by emailing <strong>{SUPPORT_EMAIL}</strong>
            .
          </p>
          <p className="mb-0">
            Typical response time: <strong>1-2 business days</strong>.
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
