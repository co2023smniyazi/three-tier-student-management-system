import React from 'react';
import { IconGithub, IconExternalLink } from './Icons';

export const Footer = () => {
  return (
    <footer className="app-footer" role="contentinfo">
      <div className="footer-content">
        <div className="footer-brand-summary">
          <h4 className="footer-title">CampusConnect</h4>
          <p className="footer-desc">
            Production-grade Three-Tier Architecture Student Information System
            built with React, Express, MongoDB Atlas, and Model Context Protocol (MCP).
          </p>
        </div>

        <div className="footer-badges-grid">
          <div className="footer-badge">
            <span className="badge-tag tier-tag">Tier 1 • Client</span>
            <span className="badge-tech">React 18 + Vite</span>
            <span className="badge-host">Vercel</span>
          </div>

          <div className="footer-badge">
            <span className="badge-tag tier-tag">Tier 2 • Server</span>
            <span className="badge-tech">Node.js + Express</span>
            <span className="badge-host">Render</span>
          </div>

          <div className="footer-badge">
            <span className="badge-tag tier-tag">Tier 3 • Database</span>
            <span className="badge-tech">Mongoose ODM</span>
            <span className="badge-host">MongoDB Atlas</span>
          </div>

          <div className="footer-badge">
            <span className="badge-tag ai-tag">AI Layer</span>
            <span className="badge-tech">MCP Protocol</span>
            <span className="badge-host">Claude Desktop</span>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            Budget: <strong>₹0 / $0</strong> (100% Free-Tier &amp; Open-Source) • MIT License
          </p>

          <div className="footer-links">
            <a
              href="https://github.com/co2023smniyazi/three-tier-student-management-system"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              <IconGithub size={16} />
              <span>Source Repository</span>
              <IconExternalLink size={12} />
            </a>

            <a
              href="https://three-tier-student-management-system.onrender.com/api/health"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              <span>Backend Health Check</span>
              <IconExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
