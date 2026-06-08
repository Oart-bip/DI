export default function Dashboard() {
  return (
    <div>
      <div style={{ marginBottom: '48px' }}>
        <div style={{ fontFamily: 'var(--fonte-mono)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C8401A', marginBottom: '12px' }}>
          visao geral — modulo 01
        </div>
        <div style={{ height: '3px', backgroundColor: '#1A1A18', marginBottom: '20px', width: '60px' }} />
        <h1 style={{ fontFamily: 'var(--fonte-serif)', fontSize: '42px', color: '#1A1A18', margin: 0, lineHeight: 1.05, maxWidth: '500px' }}>
          Dashboard
        </h1>
        <p style={{ fontFamily: 'var(--fonte-sans)', fontSize: '15px', color: '#6B6B65', marginTop: '14px', lineHeight: 1.6, maxWidth: '480px', fontWeight: 300 }}>
          bem-vindo ao sistema de analise de dados empresariais.
          use o menu lateral para navegar pelos modulos.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', backgroundColor: '#D4D0C8', maxWidth: '640px' }}>
        {[
          { codigo: '02', titulo: 'Clientes', desc: 'cadastro e gestao de clientes', href: '/clientes', status: 'ativo' },
          { codigo: '03', titulo: 'Produtos', desc: 'cadastro e controle de estoque', href: '/produtos', status: 'ativo' },
          { codigo: '04', titulo: 'Pedidos', desc: 'criacao e gestao de pedidos', href: '/pedidos', status: 'ativo' },
          { codigo: '05', titulo: 'Relatorios', desc: 'em desenvolvimento', href: '#', status: 'em breve' },
        ].map((mod) => (
          <div key={mod.codigo} style={{ backgroundColor: '#FAFAF7', padding: '28px 32px', opacity: mod.status === 'em breve' ? 0.6 : 1 }}>
            <div style={{ fontFamily: 'var(--fonte-mono)', fontSize: '10px', letterSpacing: '0.1em', color: mod.status === 'ativo' ? '#C8401A' : '#BBBAB4', marginBottom: '12px' }}>
              {mod.codigo} / {mod.status}
            </div>
            <div style={{ fontFamily: 'var(--fonte-serif)', fontSize: '20px', color: '#1A1A18', marginBottom: '6px' }}>
              {mod.titulo}
            </div>
            <p style={{ fontFamily: 'var(--fonte-sans)', fontSize: '13px', color: '#6B6B65', margin: 0, lineHeight: 1.4 }}>
              {mod.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
