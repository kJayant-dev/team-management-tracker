import React from 'react';

export default function StatCard({ title, value, subtext, icon: Icon, color, trend }) {
  const getColorStyle = () => {
    switch (color) {
      case 'indigo':
        return { bg: 'rgba(99, 102, 241, 0.12)', border: 'rgba(99, 102, 241, 0.3)', text: '#818cf8' };
      case 'emerald':
        return { bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.3)', text: '#34d399' };
      case 'amber':
        return { bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.3)', text: '#fbbf24' };
      case 'cyan':
        return { bg: 'rgba(6, 182, 212, 0.12)', border: 'rgba(6, 182, 212, 0.3)', text: '#38bdf8' };
      case 'purple':
        return { bg: 'rgba(168, 85, 247, 0.12)', border: 'rgba(168, 85, 247, 0.3)', text: '#c084fc' };
      case 'rose':
        return { bg: 'rgba(244, 63, 94, 0.12)', border: 'rgba(244, 63, 94, 0.3)', text: '#fb7185' };
      default:
        return { bg: 'rgba(51, 65, 85, 0.4)', border: 'var(--border-color)', text: 'var(--text-primary)' };
    }
  };

  const style = getColorStyle();

  return (
    <div className="glass-card" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {title}
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', margin: '0.3rem 0 0.1rem 0', color: 'var(--text-primary)' }}>
            {value !== undefined && value !== null ? value : 0}
          </div>
          {subtext && (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {subtext}
            </div>
          )}
        </div>

        {Icon && (
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: 'var(--radius-md)',
            background: style.bg,
            border: `1px solid ${style.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: style.text
          }}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
}
