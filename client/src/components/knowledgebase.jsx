
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./KnowledgeBase.css";

const KnowledgeBase = () => {
  const navigate = useNavigate();

  return (
    <div className="kb-page">
      {/* Header */}
      <header className="kb-header">
        <button className="kb-back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>
        <h1 className="kb-title">Knowledge Base Module – Documentation</h1>
        <p className="kb-subtitle">
          A self-service help center for FAQs, guides, and tutorials.
        </p>
      </header>

      {/* Main Scrollable Content */}
      <main className="kb-content">
        <h2>Module Name:</h2>
        <p><strong>Knowledge Base Page</strong></p>

        <h2>Purpose:</h2>
        <p>
          The Knowledge Base module provides users with a self-service help
          center where they can find answers to common questions, read guides,
          and access tutorials. It reduces dependency on direct support by
          giving users an easy and organized way to explore frequently asked
          questions (FAQs) and learn how to use the system effectively.
        </p>

        <h2>Technology Used:</h2>
        <ul>
          <li>Frontend: React.js</li>
          <li>Routing: React Router DOM</li>
          <li>Icons: React Icons & Lucide React</li>
          <li>Styling: CSS3</li>
          <li>State Management: React Hooks (useState, useNavigate)</li>
        </ul>

        <h2>Features:</h2>
        <ul>
          <li>FAQ Section: Displays a list of frequently asked questions with expandable answers.</li>
          <li>Search Bar: Allows users to search for specific questions dynamically.</li>
          <li>Interactive UI: Users can click on each question to expand or collapse the answer.</li>
          <li>Navigation Integration: A 'Back' button allows users to return to the previous Help page easily.</li>
          <li>Responsive Design: Works smoothly across desktop and mobile screens.</li>
          <li>Reusable Data: FAQ questions and answers are stored in an array, making it easy to update or expand the content.</li>
        </ul>

        <h2>Working Logic:</h2>
        <ul>
          <li>Data Setup: A list of FAQs is defined in a state array using <code>useState()</code>. Each object contains a question and its answer.</li>
          <li>Search Functionality: The search input filters FAQs dynamically using the <code>filter()</code> method based on user input.</li>
          <li>Accordion Toggle: The <code>openIndex</code> state tracks which question is currently expanded.</li>
          <li>Routing: The page can be opened by clicking the 'Visit Hub' button in the Help page, which navigates to <code>/knowledge-base</code>.</li>
          <li>Back Navigation: The <code>useNavigate()</code> hook is used to move back to the Help page.</li>
        </ul>

        <h2>React Hooks Used:</h2>
        <ul>
          <li><strong>useState()</strong> – To manage FAQ list, search input, and currently open question.</li>
          <li><strong>useNavigate()</strong> – For navigation between Help and Knowledge Base pages.</li>
        </ul>

        <h2>File Structure Example:</h2>
        <pre className="kb-code">
{`src/
 ├── pages/
 │   ├── Help.jsx
 │   ├── KnowledgeBase.jsx
 │   └── KnowledgeBase.css
 └── App.jsx`}
        </pre>

        <h2>Routing Configuration (in App.jsx):</h2>
        <pre className="kb-code">
{`import KnowledgeBase from "./pages/KnowledgeBase";

<Route path="/knowledge-base" element={<KnowledgeBase />} />`}
        </pre>

        <h2>Sample Viva / Interview Questions:</h2>
        <ul>
          <li><strong>Q:</strong> What is the purpose of the Knowledge Base page?<br />
              <strong>A:</strong> To provide users with self-help resources like FAQs and guides.</li>
          <li><strong>Q:</strong> How does the search feature work?<br />
              <strong>A:</strong> It filters the FAQ list using the <code>filter()</code> function based on the user’s input text.</li>
          <li><strong>Q:</strong> What React Hooks are used in this module?<br />
              <strong>A:</strong> <code>useState</code> for managing data and <code>useNavigate</code> for routing.</li>
          <li><strong>Q:</strong> How do you handle navigation between Help and Knowledge Base pages?<br />
              <strong>A:</strong> Using React Router’s <code>useNavigate()</code> hook and routes defined in <code>App.jsx</code>.</li>
          <li><strong>Q:</strong> What makes this component interactive?<br />
              <strong>A:</strong> The accordion system that opens or closes each question when clicked.</li>
          <li><strong>Q:</strong> Is the Knowledge Base content dynamic or static?<br />
              <strong>A:</strong> Currently static, but can easily be made dynamic by fetching data from a backend API.</li>
        </ul>

        <h2>Outcome:</h2>
        <p>
          This Knowledge Base module improves user experience and reduces support load
          by providing a centralized area for user education and problem-solving.
          It serves as an essential part of the Help & Support System in your
          Fraud Detection Transaction application.
        </p>
      </main>

      {/* Footer */}
      <footer className="kb-footer">
        © 2025 FraudShield — Knowledge Base Module Documentation
      </footer>
    </div>
  );
};

export default KnowledgeBase;
