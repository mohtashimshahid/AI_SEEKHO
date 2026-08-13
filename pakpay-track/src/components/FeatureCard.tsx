import React from 'react';

export interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  accentColor: 'primary' | 'secondary' | 'tertiary';
  colSpan?: 'col-span-1 md:col-span-8' | 'col-span-1 md:col-span-4';
  delay?: string;
  children?: React.ReactNode;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  accentColor,
  colSpan = 'col-span-1 md:col-span-4',
  delay,
  children,
}) => {
  const accentClasses = {
    primary: {
      borderHover: 'hover:border-primary/50',
      gradient: 'from-primary/10',
      iconBg: 'bg-primary/20',
      iconBorder: 'border-primary/30',
      iconText: 'text-primary',
    },
    secondary: {
      borderHover: 'hover:border-secondary/50',
      gradient: 'from-secondary/10',
      iconBg: 'bg-secondary/20',
      iconBorder: 'border-secondary/30',
      iconText: 'text-secondary',
    },
    tertiary: {
      borderHover: 'hover:border-tertiary/50',
      gradient: 'from-tertiary/10',
      iconBg: 'bg-tertiary/20',
      iconBorder: 'border-tertiary/30',
      iconText: 'text-tertiary',
    },
  }[accentColor];

  return (
    <div
      className={`${colSpan} glass-panel rounded-3xl p-8 relative overflow-hidden group ${accentClasses.borderHover} transition-colors duration-500 animate-up`}
      style={delay ? { transitionDelay: delay } : undefined}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${accentClasses.gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
      />
      <div className="relative z-10 h-full flex flex-col justify-between">
        <div>
          <div
            className={`w-12 h-12 rounded-full ${accentClasses.iconBg} flex items-center justify-center mb-6 border ${accentClasses.iconBorder}`}
          >
            <span className={`material-symbols-outlined ${accentClasses.iconText}`}>
              {icon}
            </span>
          </div>
          <h3 className="text-title-md font-title-md text-white mb-3">{title}</h3>
          <p className="text-body-md font-body-md text-on-surface-variant">
            {description}
          </p>
        </div>

        {children && <div className="mt-8">{children}</div>}
      </div>
    </div>
  );
};
