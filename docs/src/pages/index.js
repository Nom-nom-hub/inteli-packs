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
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              {siteConfig.title}
            </h1>
            <p className={styles.heroSubtitle}>
              Smart developer assistant for Node.js project optimization using AI
            </p>
            <div className={styles.heroButtons}>
              <Link
                className="button button--primary button--lg"
                to="/docs/intro">
                Get Started
              </Link>
              <Link
                className="button button--secondary button--lg"
                to="/docs/installation">
                Installation
              </Link>
            </div>
          </div>
        </div>
        <div className={styles.features}>
          <div className={styles.feature}>
            <h3>🤖 AI-Powered Analysis</h3>
            <p>Multi-provider support with Gemini, GPT-4, Claude, Ollama, and LLaMA with automatic fallback.</p>
          </div>
          <div className={styles.feature}>
            <h3>🔒 Security & Testing</h3>
            <p>Vulnerability scanning, suspicious package detection, and comprehensive testing analysis.</p>
          </div>
          <div className={styles.feature}>
            <h3>🚀 DevOps & Automation</h3>
            <p>GitHub Actions generation, Dockerfile creation, and automated workflow setup.</p>
          </div>
        </div>
      </main>
    </Layout>
  );
} 