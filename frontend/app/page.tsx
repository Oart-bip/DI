export default function Dashboard() {
  return (
    <div>
      {/* Cabeçalho editorial */}
      <div style={{ marginBottom: '48px' }}>
        <div style={{
          fontFamily: 'var(--fonte-mono)',
          fontSize: '10px',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: '#C8401A',
          marginBottom: '12px',
        }}>
          Visão geral — módulo 01
        </div>
        <div style={{ height: '3px', backgroundColor: '#1A1A18', marginBottom: '20px', width: '60px' }} />
        <h1 style={{
          fontFamily: 'var(--fonte-serif)',
          fontSize: '42px',
          color: '#1A1A18',
          margin: 0,
          lineHeight: 1.05,
          maxWidth: '500px',
        }}>
          Dashboard
        </h1>
        <p style={{
          fontFamily: 'var(--fonte-sans)',
          fontSize: '15px',
          color: '#6B6B65',
          marginTop: '14px',
          lineHeight: 1.6,
          maxWidth: '480px',
          fontWeight: 300,
        }}>
          Bem-vindo ao sistema de análise de dados empresariais.
          Use o menu lateral para navegar pelos módulos.
        </p>
      </div>

      {/* Cards de módulos */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', backgroundColor: '#D4D0C8', maxWidth: '640px' }}>
        {[
          { codigo: '02', titulo: 'Clientes', desc: 'Cadastro e gestão de clientes', href: '/clientes', status: 'ativo' },
          { codigo: '03', titulo: 'Produtos', desc: 'Cadastro e controle de estoque', href: '/produtos', status: 'ativo' },
          { codigo: '04', titulo: 'Vendas', desc: 'Em desenvolvimento', href: '#', status: 'em breve' },
          { codigo: '05', titulo: 'Relatórios', desc: 'Em desenvolvimento', href: '#', status: 'em breve' },
        ].map((mod) => (
          <div
            key={mod.codigo}
            style={{
              backgroundColor: '#FAFAF7',
              padding: '28px 32px',
              opacity: mod.status === 'em breve' ? 0.6 : 1,
            }}
          >
            <div style={{
              fontFamily: 'var(--fonte-mono)',
              fontSize: '10px',
              letterSpacing: '0.1em',
              color: mod.status === 'ativo' ? '#C8401A' : '#BBBAB4',
              marginBottom: '12px',
            }}>
              {mod.codigo} / {mod.status}
            </div>
            <div style={{
              fontFamily: 'var(--fonte-serif)',
              fontSize: '20px',
              color: '#1A1A18',
              marginBottom: '6px',
            }}>
              {mod.titulo}
            </div>
            <p style={{
              fontFamily: 'var(--fonte-sans)',
              fontSize: '13px',
              color: '#6B6B65',
              margin: 0,
              lineHeight: 1.4,
            }}>
              {mod.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
