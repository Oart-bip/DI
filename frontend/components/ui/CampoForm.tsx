'use client';

interface CampoFormProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  erro?: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
}

export default function CampoForm({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  erro,
  placeholder,
  required,
  autoComplete,
}: CampoFormProps) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label
        htmlFor={name}
        style={{
          display: 'block',
          fontFamily: 'var(--fonte-mono)',
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: erro ? '#C8401A' : '#6B6B65',
          marginBottom: '7px',
        }}
      >
        {label}
        {required && (
          <span style={{ color: '#C8401A', marginLeft: '3px' }}>*</span>
        )}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        autoComplete={autoComplete}
        style={{
          width: '100%',
          padding: '10px 14px',
          backgroundColor: erro ? '#FDF0ED' : '#FAFAF7',
          border: `1.5px solid ${erro ? '#C8401A' : '#D4D0C8'}`,
          borderRadius: 0,
          fontFamily: 'var(--fonte-sans)',
          fontSize: '14px',
          color: '#1A1A18',
          outline: 'none',
          transition: 'border-color 0.15s ease',
          WebkitAppearance: 'none',
        }}
        onFocus={(e) => {
          if (!erro) e.target.style.borderColor = '#1A1A18';
        }}
      />

      {erro && (
        <p style={{
          fontFamily: 'var(--fonte-mono)',
          fontSize: '10px',
          color: '#C8401A',
          marginTop: '5px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}>
          <span>✕</span> {erro}
        </p>
      )}
    </div>
  );
}
