'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Pedido, StatusPedido } from '@/types/pedido';
import type { Cliente } from '@/types/cliente';
import type { Produto } from '@/types/produto';
import { pedidosService } from '@/services/pedidosService';
import { clientesService } from '@/services/clientesService';
import { produtosService } from '@/services/produtosService';
import TabelaPedidos from '@/components/pedidos/TabelaPedidos';
import FormPedido from '@/components/pedidos/FormPedido';
import Modal from '@/components/ui/Modal';
import ConfirmacaoExclusao from '@/components/ui/ConfirmacaoExclusao';
import Toast from '@/components/ui/Toast';

interface ToastState { mensagem: string; tipo: 'sucesso' | 'erro'; }

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erroLista, setErroLista] = useState<string | null>(null);

  const [modalAberto, setModalAberto] = useState(false);
  const [pedidoParaExcluir, setPedidoParaExcluir] = useState<Pedido | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const carregar = useCallback(async () => {
    try {
      setCarregando(true);
      setErroLista(null);
      const [ped, cli, prod] = await Promise.all([
        pedidosService.listarTodos(),
        clientesService.listarTodos(),
        produtosService.listarTodos(),
      ]);
      setPedidos(ped);
      setClientes(cli);
      setProdutos(prod);
    } catch (err) {
      setErroLista(err instanceof Error ? err.message : 'erro ao carregar dados');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  function mostrarToast(mensagem: string, tipo: 'sucesso' | 'erro') {
    setToast({ mensagem, tipo });
  }

  async function handleCriar(dados: Parameters<typeof pedidosService.criar>[0]) {
    try {
      setSalvando(true);
      const criado = await pedidosService.criar(dados);
      setPedidos((prev) => [criado, ...prev]);
      setModalAberto(false);
      mostrarToast('pedido criado com sucesso!', 'sucesso');
    } catch (err) {
      mostrarToast(err instanceof Error ? err.message : 'erro ao criar pedido', 'erro');
    } finally {
      setSalvando(false);
    }
  }

  async function handleAlterarStatus(pedido: Pedido, novoStatus: StatusPedido) {
    try {
      const atualizado = await pedidosService.atualizarStatus(pedido.id, { status: novoStatus });
      setPedidos((prev) => prev.map((p) => (p.id === atualizado.id ? atualizado : p)));
      mostrarToast(`status atualizado para "${novoStatus}"`, 'sucesso');
    } catch (err) {
      mostrarToast(err instanceof Error ? err.message : 'erro ao atualizar status', 'erro');
    }
  }

  async function handleExcluir() {
    if (!pedidoParaExcluir) return;
    try {
      setExcluindo(true);
      await pedidosService.remover(pedidoParaExcluir.id);
      setPedidos((prev) => prev.filter((p) => p.id !== pedidoParaExcluir.id));
      mostrarToast('pedido excluido.', 'sucesso');
      setPedidoParaExcluir(null);
    } catch (err) {
      mostrarToast(err instanceof Error ? err.message : 'erro ao excluir pedido', 'erro');
    } finally {
      setExcluindo(false);
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontFamily: 'var(--fonte-mono)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C8401A', marginBottom: '12px' }}>
              modulo 04 — vendas
            </div>
            <div style={{ height: '3px', backgroundColor: '#1A1A18', marginBottom: '20px', width: '60px' }} />
            <h1 style={{ fontFamily: 'var(--fonte-serif)', fontSize: '42px', color: '#1A1A18', margin: 0, lineHeight: 1.05 }}>
              Pedidos
            </h1>
          </div>
          <button
            onClick={() => setModalAberto(true)}
            style={{
              padding: '11px 22px', backgroundColor: '#1A1A18', color: '#F5F2ED', border: 'none',
              fontFamily: 'var(--fonte-mono)', fontSize: '11px', fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer',
              transition: 'background 0.15s ease', marginTop: '8px',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#C8401A'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1A1A18'; }}
          >
            + novo pedido
          </button>
        </div>
        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #D4D0C8' }}>
          <span style={{ fontFamily: 'var(--fonte-mono)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6B6B65' }}>
            {carregando ? 'carregando...' : `${pedidos.length} ${pedidos.length === 1 ? 'registro' : 'registros'}`}
          </span>
        </div>
      </div>

      {carregando ? (
        <div style={{ padding: '80px 40px', textAlign: 'center' }}>
          <span style={{ fontFamily: 'var(--fonte-mono)', fontSize: '11px', color: '#BBBAB4', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            carregando dados...
          </span>
        </div>
      ) : erroLista ? (
        <div style={{ padding: '40px', border: '1.5px solid #C8401A', backgroundColor: '#FDF0ED' }}>
          <p style={{ fontFamily: 'var(--fonte-mono)', fontSize: '12px', color: '#C8401A', margin: '0 0 16px' }}>
            erro ao carregar pedidos: {erroLista}
          </p>
          <button onClick={carregar} style={{ padding: '8px 16px', background: '#1A1A18', border: 'none', fontFamily: 'var(--fonte-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', color: '#F5F2ED' }}>
            tentar novamente
          </button>
        </div>
      ) : (
        <TabelaPedidos
          pedidos={pedidos}
          onAlterarStatus={handleAlterarStatus}
          onExcluir={setPedidoParaExcluir}
        />
      )}

      {modalAberto && (
        <Modal titulo="Novo pedido" subtitulo="Criacao" onFechar={() => { if (!salvando) setModalAberto(false); }}>
          <FormPedido
            clientes={clientes}
            produtos={produtos}
            onSubmit={handleCriar}
            onCancelar={() => setModalAberto(false)}
            carregando={salvando}
          />
        </Modal>
      )}

      {pedidoParaExcluir && (
        <ConfirmacaoExclusao
          nomeCliente={`pedido de ${pedidoParaExcluir.nomeCliente}`}
          carregando={excluindo}
          onConfirmar={handleExcluir}
          onCancelar={() => setPedidoParaExcluir(null)}
        />
      )}

      {toast && <Toast mensagem={toast.mensagem} tipo={toast.tipo} onFechar={() => setToast(null)} />}
    </div>
  );
}
