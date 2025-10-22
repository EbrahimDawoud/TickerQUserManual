import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="TickerQ Demo Documentation">
      <div className="tickerq-hero">
        <div className="container">
          <h1 className="hero__title">TickerQ Demo Documentation</h1>
          <p className="hero__subtitle">
            Learn how to implement background job processing with TickerQ in .NET
          </p>
          <div>
            <Link
              className="button button--secondary button--lg"
              to="/docs/intro">
              Get Started - 5min ⏱️
            </Link>
          </div>
        </div>
      </div>
      <main>
        <div className="container">
          <div className="row">
            <div className="col col--4">
              <div className="tickerq-feature">
                <h3>🚀 Easy Setup</h3>
                <p>Get TickerQ running in minutes with our step-by-step guide.</p>
              </div>
            </div>
            <div className="col col--4">
              <div className="tickerq-feature">
                <h3>⏰ Flexible Scheduling</h3>
                <p>Schedule jobs with cron expressions or one-time execution.</p>
              </div>
            </div>
            <div className="col col--4">
              <div className="tickerq-feature">
                <h3>📊 Dashboard</h3>
                <p>Monitor and manage your jobs with the built-in dashboard.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
