import Link from 'next/link';
import { Icon } from './Icon';

const steps = [
  { number: '01', label: 'Speak', href: '/report/voice' },
  { number: '02', label: 'Add details', href: '/report/details' },
  { number: '03', label: 'Review', href: '/report/review' },
];

export function WizardShell({ step, children }: { step: number; children: React.ReactNode }) {
  return <main id="top" className="wizard-page">
    <div className="wizard-topline"><Link href="/" className="back-home"><span aria-hidden="true">←</span> Home</Link><span className="wizard-demo-tag"><span aria-hidden="true"/> Demo · Saved on this device</span></div>
    <div className="wizard-heading"><p className="eyebrow">YOUR NEIGHBOURHOOD, YOUR VOICE</p><h1>Let’s report an issue.</h1></div>
    <nav className="wizard-steps" aria-label={`Step ${step} of 3`}>
      {steps.map((item, index) => {
        const complete = index + 1 < step;
        const current = index + 1 === step;
        return <div key={item.number} className={`wizard-step${current ? ' current' : ''}${complete ? ' complete' : ''}`} aria-current={current ? 'step' : undefined}>
          <span className="wizard-step-number">{complete ? <Icon name="check"/> : item.number}</span><span>{item.label}</span>
        </div>;
      })}
    </nav>
    <section className="wizard-card">{children}</section>
    <p className="demo-disclosure"><span><Icon name="privacy"/></span> Demo only · Reports are saved in this browser and aren’t sent to a civic authority.</p>
  </main>;
}
