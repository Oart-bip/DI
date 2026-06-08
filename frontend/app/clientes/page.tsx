'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Cliente } from '@/types/cliente';
import { clientesService } from '@/services/clientesService';
import TabelaClientes from '@/components/clientes/TabelaClientes';
import FormCliente from '@/components/clientes/FormCliente';
import Modal from '@/components/ui/Modal';
import ConfirmacaoExclusao from '@/components/ui/ConfirmacaoExclusao';
import Toast from '@/components/ui/Toast';

type EstadoModal = 'fechado' | 'criando' | 'editando';

interface ToastState {
  mensagem: string;
  tipo: 'sucesso' | 'erro';
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erroLista, setErroLista] = useState<string | null>(null);

  const [estadoModal, setEstadoModal] = useState<EstadoModal>('fechado');
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
  const [clienteParaExcluir, setClienteParaExcluir] = useState<Cliente | null>(null);

  const [salvando, setSalvando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  const [toast, setToast] = useState<ToastState | null>(null);

  const carregarClientes = useCallback(async () => {
    try {
      setCarregando(true);
      setErroLista(null);
      const dados = await clientesService.listarTodos();
      setClientes(dados);
    } catch (err) {
      setErroLista(err instanceof Error ? err.message : 'Erro ao carregar clientes');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarClientes();
  }, [carregarClientes]);

  function mostrarToast(mensagem: string, tipo: 'sucesso' | 'erro') {
    setToast({ mensagem, tipo });
  }

  async function handleCriar(dados: object) {
    try {
      setSalvando(true);
      const criado = await clientesService.criar(dados as Parameters<typeof clientesService.criar>[0]);
      setClientes((prev) => [criado, ...prev]);
      setEstadoModal('fechado');
      mostrarToast(`Cliente "${criado.nome}" cadastrado com sucesso!`, 'sucesso');
    } catch (err) {
      mostrarToast(err instanceof Error ? err.message : 'Erro ao cadastrar cliente', 'erro');
    } finally {
      setSalvando(false);
    }
  }

  function abrirEdicao(cliente: Cliente) {
    setClienteSelecionado(cliente);
    setEstadoModal('editando');
  }

  async function handleAtualizar(dados: object) {
    if (!clienteSelecionado) return;
    try {
      setSalvando(true);
      const atualizado = await clientesService.atualizar(
        clienteSelecionado.id,
        dados as Parameters<typeof clientesService.atualizar>[1]
      );
      setClientes((prev) =>
        prev.map((c) => (c.id === atualizado.id ? atualizado : c))
      );
      setEstadoModal('fechado');
      setClienteSelecionado(null);
      mostrarToast(`Cliente "${atualizado.nome}" atualizado com sucesso!`, 'sucesso');
    } catch (err) {
      mostrarToast(err instanceof Error ? err.message : 'Erro ao atualizar cliente', 'erro');
    } finally {
      setSalvando(false);
    }
  }

  function confirmarExclusao(cliente: Cliente) {
    setClienteParaExcluir(cliente);
  }

  async function handleExcluir() {
    if (!clienteParaExcluir) return;
    try {
      setExcluindo(true);
      await clientesService.remover(clienteParaExcluir.id);
      setClientes((prev) => prev.filter((c) => c.id !== clienteParaExcluir.id));
      mostrarToast(`Cliente "${clienteParaExcluir.nome}" excluído.`, 'sucesso');
      setClienteParaExcluir(null);
    } catch (err) {
      mostrarToast(err instanceof Error ? err.message : 'Erro ao excluir cliente', 'erro');
    } finally {
      setExcluindo(false);
    }
  }

  function fecharModal() {
    if (salvando) return;
    setEstadoModal('fechado');
    setClienteSelecionado(null);
  }

  return (
    <div>
      {/* Cabeçalho */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}>
          <div>
            <div style={{
              fontFamily: 'var(--fonte-mono)',
              fontSize: '10px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#C8401A',
              marginBottom: '12px',
            }}>
              Módulo 02 — Gestão
            </div>
            <div style={{ height: '3px', backgroundColor: '#1A1A18', marginBottom: '20px', width: '60px' }} />
            <h1 style={{
              fontFamily: 'var(--fonte-serif)',
              fontSize: '42px',
              color: '#1A1A18',
              margin: 0,
              lineHeight: 1.05,
            }}>
              Clientes
            </h1>
          </div>

          <button
            onClick={() => setEstadoModal('criando')}
            style={{
              padding: '11px 22px',
              backgroundColor: '#1A1A18',
              color: '#F5F2ED',
              border: 'none',
              fontFamily: 'var(--fonte-mono)',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'background 0.15s ease',
              marginTop: '8px',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#C8401A';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1A1A18';
            }}
          >
            + Novo cliente
          </button>
        </div>

        {/* Linha separadora + contador */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginTop: '24px',
          paddingTop: '16px',
          borderTop: '1px solid #D4D0C8',
        }}>
          <span style={{
            fontFamily: 'var(--fonte-mono)',
            fontSize: '10px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#6B6B65',
          }}>
            {carregando
              ? 'Carregando...'
              : `${clientes.length} ${clientes.length === 1 ? 'registro' : 'registros'}`
            }
          </span>
        </div>
      </div>

      {/* Conteúdo */}
      {carregando ? (
        <div style={{
          padding: '80px 40px',
          textAlign: 'center',
        }}>
          <span style={{
            fontFamily: 'var(--fonte-mono)',
            fontSize: '11px',
            color: '#BBBAB4',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            Carregando dados...
          </span>
        </div>
      ) : erroLista ? (
        <div style={{
          padding: '40px',
          border: '1.5px solid #C8401A',
          backgroundColor: '#FDF0ED',
        }}>
          <p style={{
            fontFamily: 'var(--fonte-mono)',
            fontSize: '12px',
            color: '#C8401A',
            margin: '0 0 16px',
          }}>
            Erro ao carregar clientes: {erroLista}
          </p>
          <button
            onClick={carregarClientes}
            style={{
              padding: '8px 16px',
              background: '#1A1A18',
              border: 'none',
              fontFamily: 'var(--fonte-mono)',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              color: '#F5F2ED',
            }}
          >
            Tentar novamente
          </button>
        </div>
      ) : (
        <TabelaClientes
          clientes={clientes}
          onEditar={abrirEdicao}
          onExcluir={confirmarExclusao}
        />
      )}

      {/* Modal de criação */}
      {estadoModal === 'criando' && (
        <Modal
          titulo="Novo cliente"
          subtítulo="Cadastro"
          onFechar={fecharModal}
        >
          <FormCliente
            onSubmit={handleCriar}
            onCancelar={fecharModal}
            carregando={salvando}
          />
        </Modal>
      )}

      {/* Modal de edição */}
      {estadoModal === 'editando' && clienteSelecionado && (
        <Modal
          titulo="Editar cliente"
          subtítulo="Atualização"
          onFechar={fecharModal}
        >
          <FormCliente
            clienteInicial={clienteSelecionado}
            onSubmit={handleAtualizar}
            onCancelar={fecharModal}
            carregando={salvando}
            modoEdicao
          />
        </Modal>
      )}

      {/* Dialog de confirmação de exclusão */}
      {clienteParaExcluir && (
        <ConfirmacaoExclusao
          nomeCliente={clienteParaExcluir.nome}
          carregando={excluindo}
          onConfirmar={handleExcluir}
          onCancelar={() => setClienteParaExcluir(null)}
        />
      )}

      {/* Toast de notificação */}
      {toast && (
        <Toast
          mensagem={toast.mensagem}
          tipo={toast.tipo}
          onFechar={() => setToast(null)}
        />
      )}
    </div>
  );
}
