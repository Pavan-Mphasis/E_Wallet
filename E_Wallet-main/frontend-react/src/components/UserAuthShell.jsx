import React from "react";
import { motion } from "framer-motion";
import "../styles/user-auth.css";

function UserAuthShell({
  brandBadge,
  brandTitle,
  brandCopy,
  metrics = [],
  features = [],
  formBadge,
  formTitle,
  formCopy,
  children
}) {
  const visibleMetrics = metrics.slice(0, 2);
  const visibleFeatures = features.slice(0, 2);

  return (
    <div className="user-auth-page">
      <div className="container user-auth-shell">
        <motion.div
          className="user-auth-frame"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <section className="user-auth-brand">
            <div className="user-auth-brand-top">
              <div className="user-auth-logo">EW</div>
              <div className="user-auth-brand-badge">
                <i className="bi bi-stars" />
                {brandBadge}
              </div>
            </div>

            <div className="user-auth-brand-main">
              <h1>{brandTitle}</h1>
              <p>{brandCopy}</p>
            </div>

            {!!visibleMetrics.length && (
              <div className="user-auth-spotlight">
                <div className="user-auth-spotlight-label">Designed for everyday wallet access</div>
                <div className="user-auth-spotlight-grid">
                  {visibleMetrics.map((metric) => (
                    <div className="user-auth-spotlight-item" key={metric.label}>
                      <div className="user-auth-spotlight-value">{metric.value}</div>
                      <div className="user-auth-spotlight-copy">{metric.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!!visibleFeatures.length && (
              <div className="user-auth-point-list">
                {visibleFeatures.map((feature) => (
                  <div className="user-auth-point" key={feature.title}>
                    <div className="user-auth-point-icon">
                      <i className={`bi ${feature.icon}`} />
                    </div>
                    <div>
                      <div className="user-auth-point-title">{feature.title}</div>
                      <div className="user-auth-point-copy">{feature.copy}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="user-auth-panel">
            <div className="user-auth-form-header">
              <div className="user-auth-form-badge">
                <i className="bi bi-person-badge" />
                {formBadge}
              </div>
              <h2>{formTitle}</h2>
              <p>{formCopy}</p>
            </div>

            {children}
          </section>
        </motion.div>
      </div>
    </div>
  );
}

export default UserAuthShell;
