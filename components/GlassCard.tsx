import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  glow?: boolean;
  onClick?: () => void;
  className?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  title,
  subtitle,
  glow = true,
  onClick,
  className = '',
}) => {
  return (
    <div className={`relative group ${className}`} onClick={onClick}>
      {/* Background Glow Effect */}
      {glow && (
        <div className="absolute -inset-0.5 bg-gradient-to-r from-violetAccent via-cyanAccent to-violetAccent rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500 group-hover:animate-glass-glow"></div>
      )}

      {/* Glass Surface */}
      <div className="relative bg-charcoal-100/60 backdrop-blur-xl border border-white/10 hover:border-white/20 p-8 rounded-2xl shadow-glass hover:shadow-glass-lg transition-all duration-300">
        {/* Header */}
        {(title || subtitle) && (
          <div className="mb-6">
            {title && (
              <h3 className="text-xs uppercase tracking-[0.2em] text-cyanAccent font-semibold mb-2">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-400 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Content */}
        <div className="text-white">
          {children}
        </div>
      </div>
    </div>
  );
};

export default GlassCard;
