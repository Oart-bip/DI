'use client';

import { useState } from 'react';
import CampoForm from '@/components/ui/CampoForm';
import { validarFormCliente, temErros, type FormErrors } from '@/lib/validations';
import type { Cliente, CreateClientePayload, UpdateClientePayload } from '@/types/cliente';

interface FormClienteProps {
  clienteInicial?: Cliente;
  onSubmit: (dados: CreateClientePayload | UpdateClientePayload) => Promise<void>;
  onCancelar: () => void;
  carregando?: boolean;
  modoEdicao?: boolean;
}

export default function FormCliente({
  clienteInicial,
  onSubmit,
  onCancelar,
  carregando = false,
  modoEdicao = false,
}: FormClienteProps) {
  const [valores, setValores] = useState({
    nome: clienteInicial?.nome ?? '',
    email: clienteInicial?.email ?? '',
    cidade: clienteInicial?.cidade ?? '',
    estado: clienteInicial?.estado ?? '',
    pais: clienteInicial?.pais ?? '',
  });

  const [erros, setErros] = useState<FormErrors>({});
  const [tocado, setTocado] = useState<Record<string, boolean>>({});

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    const novosValores = { ...valores, [name]: value };
    setValores(novosValores);

    if (tocado[name]) {
      const novosErros = validarFormCliente(novosValores);
      setErros((prev) => ({
        ...prev,
        [name]: novosErros[name as keyof FormErrors],
      }));
    }
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    const { name } = e.target;
    setTocado((prev) => ({ ...prev, [name]: true }));
    const novosErros = validarFormCliente(valores);
    setErros((prev) => ({
      ...prev,
      [name]: novosErros[name as keyof FormErrors],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const novosErros = validarFormCliente(valores);
    if (temErros(novosErros)) {
      setErros(novosErros);
      setTocado({ nome: true, email: true, cidade: true, estado: true, pais: true });
      return;
    }

    await onSubmit(valores);
  }

  const formularioAlterado = modoEdicao && clienteInicial
    ? JSON.stringify(valores) !== JSON.stringify({
        nome: clienteInicial.nome,
        email: clienteInicial.email,
        cidade: clienteInicial.cidade,
        estado: clienteInicial.estado,
        pais: clienteInicial.pais,
      })
    : true;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <CampoForm
        label="Nome completo"
        name="nome"
        value={valores.nome}
        onChange={handleChange}
        onBlur={handleBlur}
        erro={erros.nome}
        placeholder="Ex: Maria Aparecida Silva"
        required
        autoComplete="name"
      />

      <CampoForm
        label="E-mail"
        name="email"
        type="email"
        value={valores.email}
        onChange={handleChange}
        onBlur={handleBlur}
        erro={erros.email}
        placeholder="Ex: maria@empresa.com.br"
        required
        autoComplete="email"
      />

      {/* Linha separadora */}
      <div style={{
        height: '1px',
        backgroundColor: '#D4D0C8',
        margin: '8px 0 20px',
      }} />

      <div style={{
        fontFamily: 'var(--fonte-mono)',
        fontSize: '9px',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: '#6B6B65',
        marginBottom: '16px',
      }}>
        Localização
      </div>

      <CampoForm
        label="Cidade"
        name="cidade"
        value={valores.cidade}
        onChange={handleChange}
        onBlur={handleBlur}
        erro={erros.cidade}
        placeholder="Ex: Curitiba"
        required
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <CampoForm
          label="Estado"
          name="estado"
          value={valores.estado}
          onChange={handleChange}
          onBlur={handleBlur}
          erro={erros.estado}
          placeholder="Ex: Paraná"
          required
        />

        <CampoForm
          label="País"
          name="pais"
          value={valores.pais}
          onChange={handleChange}
          onBlur={handleBlur}
          erro={erros.pais}
          placeholder="Ex: Brasil"
          required
        />
      </div>

      {/* Botões */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginTop: '32px',
        paddingTop: '24px',
        borderTop: '1px solid #D4D0C8',
      }}>
        <button
          type="button"
          onClick={onCancelar}
          disabled={carregando}
          style={{
            flex: 1,
            padding: '11px',
            background: 'transparent',
            border: '1.5px solid #D4D0C8',
            fontFamily: 'var(--fonte-mono)',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            color: '#1A1A18',
            transition: 'all 0.15s ease',
          }}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={carregando || (modoEdicao && !formularioAlterado)}
          style={{
            flex: 2,
            padding: '11px',
            background: carregando ? '#6B6B65' : '#1A1A18',
            border: 'none',
            fontFamily: 'var(--fonte-mono)',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: (carregando || (modoEdicao && !formularioAlterado)) ? 'not-allowed' : 'pointer',
            color: '#F5F2ED',
            opacity: (modoEdicao && !formularioAlterado) ? 0.5 : 1,
            transition: 'all 0.15s ease',
          }}
        >
          {carregando
            ? 'Salvando...'
            : modoEdicao
              ? 'Salvar alterações'
              : 'Cadastrar cliente'
          }
        </button>
      </div>
    </form>
  );
}
