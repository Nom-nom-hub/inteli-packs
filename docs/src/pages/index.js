import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} - Smart Node.js Project Assistant`}
      description="AI-powered developer assistant for Node.js project optimization using multiple AI providers with automatic fallback">
      <main>
        {/* Hero Section */}
        <div className={styles.hero}>
          <div className={styles.heroBackground}>
            <div className={styles.heroBackgroundShape}></div>
            <div className={styles.heroBackgroundShape2}></div>
          </div>
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              <span className={styles.heroBadgeText}>🚀 AI-Powered</span>
            </div>
            <h1 className={styles.heroTitle}>
              {siteConfig.title}
            </h1>
            <p className={styles.heroSubtitle}>
              Smart developer assistant for Node.js project optimization using AI
            </p>
            <p className={styles.heroDescription}>
              Analyze dependencies, optimize security, automate testing, and streamline DevOps with 
              multi-provider AI support including Gemini, GPT-4, Claude, Ollama, and LLaMA.
            </p>
            <div className={styles.heroButtons}>
              <Link
                className={`${styles.button} ${styles.buttonPrimary}`}
                to="/docs/intro">
                <span>Get Started</span>
                <svg className={styles.buttonIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                className={`${styles.button} ${styles.buttonSecondary}`}
                to="/docs/installation">
                <span>Installation</span>
                <svg className={styles.buttonIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
            </div>
            <div className={styles.heroStats}>
              <div className={styles.heroStat}>
                <span className={styles.heroStatNumber}>5+</span>
                <span className={styles.heroStatLabel}>AI Providers</span>
              </div>
              <div className={styles.heroStat}>
                <span className={styles.heroStatNumber}>100%</span>
                <span className={styles.heroStatLabel}>Open Source</span>
              </div>
              <div className={styles.heroStat}>
                <span className={styles.heroStatNumber}>24/7</span>
                <span className={styles.heroStatLabel}>Auto Fallback</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className={styles.features}>
          <div className={styles.featuresHeader}>
            <h2 className={styles.featuresTitle}>Why Choose Inteli-Packs?</h2>
            <p className={styles.featuresSubtitle}>
              Comprehensive AI-powered tools for modern Node.js development
            </p>
          </div>
          <div className={styles.featuresGrid}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3>🤖 AI-Powered Analysis</h3>
              <p>Multi-provider support with Gemini, GPT-4, Claude, Ollama, and LLaMA with automatic fallback and intelligent dependency analysis.</p>
              <div className={styles.featureTags}>
                <span className={styles.featureTag}>Gemini</span>
                <span className={styles.featureTag}>GPT-4</span>
                <span className={styles.featureTag}>Claude</span>
                <span className={styles.featureTag}>Ollama</span>
              </div>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3>🔒 Security & Testing</h3>
              <p>Vulnerability scanning, suspicious package detection, and comprehensive testing analysis with automated security recommendations.</p>
              <div className={styles.featureTags}>
                <span className={styles.featureTag}>Security</span>
                <span className={styles.featureTag}>Testing</span>
                <span className={styles.featureTag}>Vulnerabilities</span>
                <span className={styles.featureTag}>Audit</span>
              </div>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3>🚀 DevOps & Automation</h3>
              <p>GitHub Actions generation, Dockerfile creation, and automated workflow setup with intelligent CI/CD pipeline optimization.</p>
              <div className={styles.featureTags}>
                <span className={styles.featureTag}>GitHub Actions</span>
                <span className={styles.featureTag}>Docker</span>
                <span className={styles.featureTag}>CI/CD</span>
                <span className={styles.featureTag}>Automation</span>
              </div>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <h3>🔧 Plugin System</h3>
              <p>Extensible plugin architecture with custom analyzers, formatters, and integrations for specialized development workflows.</p>
              <div className={styles.featureTags}>
                <span className={styles.featureTag}>Plugins</span>
                <span className={styles.featureTag}>Extensible</span>
                <span className={styles.featureTag}>Custom</span>
                <span className={styles.featureTag}>Integration</span>
              </div>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3>📚 Documentation</h3>
              <p>Comprehensive documentation generation with interactive examples, API references, and best practices guides.</p>
              <div className={styles.featureTags}>
                <span className={styles.featureTag}>Docs</span>
                <span className={styles.featureTag}>API</span>
                <span className={styles.featureTag}>Examples</span>
                <span className={styles.featureTag}>Guides</span>
              </div>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              <h3>⚙️ Smart Configuration</h3>
              <p>Intelligent project configuration with auto-detection, profile management, and environment-specific optimizations.</p>
              <div className={styles.featureTags}>
                <span className={styles.featureTag}>Config</span>
                <span className={styles.featureTag}>Profiles</span>
                <span className={styles.featureTag}>Auto-detect</span>
                <span className={styles.featureTag}>Smart</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className={styles.cta}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Ready to Supercharge Your Development?</h2>
            <p className={styles.ctaSubtitle}>
              Join thousands of developers who trust Inteli-Packs for their Node.js projects
            </p>
            <div className={styles.ctaButtons}>
              <Link
                className={`${styles.button} ${styles.buttonPrimary} ${styles.buttonLarge}`}
                to="/docs/quick-start">
                Start Building Today
              </Link>
              <Link
                className={`${styles.button} ${styles.buttonSecondary} ${styles.buttonLarge}`}
                href="https://github.com/Nom-nom-hub/inteli-packs">
                View on GitHub
              </Link>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
} 