import React from 'react';
import { FeatureCard } from './FeatureCard';

export const FeaturesBentoGrid: React.FC = () => {
  return (
    <section id="features" className="py-24">
      <div className="text-center mb-16 animate-up">
        <h2 className="text-headline-lg font-headline-lg text-white mb-4">
          Pro-Level Financial Tooling
        </h2>
        <p className="text-body-md font-body-md text-on-surface-variant max-w-2xl mx-auto">
          Engineered specifically for the nuances of cross-border payments, tax
          compliance, and automated invoicing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(320px,auto)]">
        {/* Feature 1: Wide Card */}
        <FeatureCard
          colSpan="col-span-1 md:col-span-8"
          accentColor="primary"
          icon="currency_exchange"
          title="Instant Cross-Border Settlement"
          description="Receive payments from international clients in seconds, converted at real mid-market rates without hidden spread fees."
        >
          <div className="w-full h-32 rounded-xl bg-surface-container/50 border border-white/5 relative overflow-hidden flex items-end">
            {/* Abstract chart representation */}
            <div className="w-full h-full flex items-end gap-2 p-4 opacity-70">
              <div className="w-1/6 bg-primary/40 rounded-t-sm h-1/3" />
              <div className="w-1/6 bg-primary/60 rounded-t-sm h-1/2" />
              <div className="w-1/6 bg-primary/80 rounded-t-sm h-3/4" />
              <div className="w-1/6 bg-primary rounded-t-sm h-full" />
              <div className="w-1/6 bg-secondary/80 rounded-t-sm h-4/5" />
              <div className="w-1/6 bg-secondary/50 rounded-t-sm h-2/3" />
            </div>
          </div>
        </FeatureCard>

        {/* Feature 2: Tall Card */}
        <FeatureCard
          colSpan="col-span-1 md:col-span-4"
          accentColor="secondary"
          icon="receipt_long"
          title="Automated Invoicing"
          description="Smart contracts that automatically generate, send, and reconcile invoices upon project milestones."
          delay="0.1s"
        >
          <div className="space-y-3">
            <div className="bg-surface-container-highest p-4 rounded-xl border border-white/5 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-label-sm font-label-sm text-on-surface">
                Inv #4092 Paid
              </span>
              <span className="text-label-sm font-label-sm text-primary ml-auto">
                +$1,250
              </span>
            </div>
            <div className="bg-surface-container-highest p-4 rounded-xl border border-white/5 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-secondary" />
              <span className="text-label-sm font-label-sm text-on-surface">
                Inv #4093 Sent
              </span>
              <span className="text-label-sm font-label-sm text-secondary ml-auto">
                Pending
              </span>
            </div>
          </div>
        </FeatureCard>

        {/* Feature 3: Small Card */}
        <FeatureCard
          colSpan="col-span-1 md:col-span-4"
          accentColor="tertiary"
          icon="shield_person"
          title="Tax Compliance Engine"
          description="Real-time tax calculation and automated holding accounts customized for Pakistani freelancers."
        />

        {/* Feature 4: Wide Card */}
        <FeatureCard
          colSpan="col-span-1 md:col-span-8"
          accentColor="primary"
          icon="donut_large"
          title="Deep Portfolio Analytics"
          description="Visualize your income streams, client concentration risk, and cash flow projections in stunning 4K detail."
          delay="0.1s"
        >
          <div className="flex flex-col md:flex-row gap-8 items-center h-full">
            <div className="flex-1 w-full max-w-[200px] aspect-square rounded-full border-4 border-surface-container-highest relative flex items-center justify-center mx-auto md:mx-0">
              <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent rotate-45" />
              <div className="absolute inset-2 border-4 border-secondary rounded-full border-b-transparent -rotate-12" />
              <span className="text-headline-lg font-headline-lg text-white">
                94%
              </span>
            </div>
          </div>
        </FeatureCard>
      </div>
    </section>
  );
};
