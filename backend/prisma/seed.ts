import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Populando banco de dados...');

  await prisma.itemPedido.deleteMany();
  await prisma.pedido.deleteMany();
  await prisma.produto.deleteMany();
  await prisma.cliente.deleteMany();

  const clientes = await Promise.all([
    prisma.cliente.create({ data: { nome: 'Ana Paula Ferreira', email: 'ana.ferreira@email.com', cidade: 'Curitiba', estado: 'Paraná', pais: 'Brasil' } }),
    prisma.cliente.create({ data: { nome: 'Carlos Eduardo Silva', email: 'carlos.silva@empresa.com.br', cidade: 'São Paulo', estado: 'São Paulo', pais: 'Brasil' } }),
    prisma.cliente.create({ data: { nome: 'Mariana Souza Lima', email: 'mariana.lima@gmail.com', cidade: 'Porto Alegre', estado: 'Rio Grande do Sul', pais: 'Brasil' } }),
    prisma.cliente.create({ data: { nome: 'Roberto Alves Costa', email: 'roberto.costa@outlook.com', cidade: 'Belo Horizonte', estado: 'Minas Gerais', pais: 'Brasil' } }),
    prisma.cliente.create({ data: { nome: 'Fernanda Oliveira', email: 'fernanda.oliveira@email.com', cidade: 'Rio de Janeiro', estado: 'Rio de Janeiro', pais: 'Brasil' } }),
    prisma.cliente.create({ data: { nome: 'Lucas Mendes Barbosa', email: 'lucas.barbosa@corp.com', cidade: 'Florianópolis', estado: 'Santa Catarina', pais: 'Brasil' } }),
    prisma.cliente.create({ data: { nome: 'Juliana Castro', email: 'juliana.castro@gmail.com', cidade: 'Goiânia', estado: 'Goiás', pais: 'Brasil' } }),
    prisma.cliente.create({ data: { nome: 'Diego Rodrigues', email: 'diego.rodrigues@hotmail.com', cidade: 'Recife', estado: 'Pernambuco', pais: 'Brasil' } }),
    prisma.cliente.create({ data: { nome: 'Patricia Nunes', email: 'patricia.nunes@empresa.com', cidade: 'Salvador', estado: 'Bahia', pais: 'Brasil' } }),
    prisma.cliente.create({ data: { nome: 'Thiago Martins', email: 'thiago.martins@email.com', cidade: 'Manaus', estado: 'Amazonas', pais: 'Brasil' } }),
    prisma.cliente.create({ data: { nome: 'Camila Pereira', email: 'camila.pereira@gmail.com', cidade: 'Guarulhos', estado: 'São Paulo', pais: 'Brasil' } }),
    prisma.cliente.create({ data: { nome: 'Rafael Gonçalves', email: 'rafael.goncalves@email.com', cidade: 'Campinas', estado: 'São Paulo', pais: 'Brasil' } }),
    prisma.cliente.create({ data: { nome: 'Isabela Torres', email: 'isabela.torres@corp.com.ar', cidade: 'Buenos Aires', estado: 'Buenos Aires', pais: 'Argentina' } }),
    prisma.cliente.create({ data: { nome: 'Miguel Hernández', email: 'miguel.hernandez@email.com', cidade: 'Santiago', estado: 'Santiago', pais: 'Chile' } }),
    prisma.cliente.create({ data: { nome: 'Beatriz Campos', email: 'beatriz.campos@email.com', cidade: 'Fortaleza', estado: 'Ceará', pais: 'Brasil' } }),
  ]);

  const produtos = await Promise.all([
    prisma.produto.create({ data: { nome: 'Notebook Dell Inspiron 15', preco: 3299.90, estoque: 12, categoria: 'Eletrônicos' } }),
    prisma.produto.create({ data: { nome: 'Mouse Logitech MX Master 3', preco: 499.90, estoque: 35, categoria: 'Periféricos' } }),
    prisma.produto.create({ data: { nome: 'Teclado Mecânico HyperX', preco: 389.90, estoque: 28, categoria: 'Periféricos' } }),
    prisma.produto.create({ data: { nome: 'Monitor LG 27" 4K', preco: 2199.90, estoque: 8, categoria: 'Eletrônicos' } }),
    prisma.produto.create({ data: { nome: 'Cadeira Gamer ThunderX3', preco: 1299.90, estoque: 5, categoria: 'Mobiliário' } }),
    prisma.produto.create({ data: { nome: 'Headset Sony WH-1000XM5', preco: 1899.90, estoque: 15, categoria: 'Áudio' } }),
    prisma.produto.create({ data: { nome: 'SSD Samsung 1TB NVMe', preco: 449.90, estoque: 40, categoria: 'Armazenamento' } }),
    prisma.produto.create({ data: { nome: 'Webcam Logitech 4K Pro', preco: 799.90, estoque: 20, categoria: 'Periféricos' } }),
    prisma.produto.create({ data: { nome: 'Hub USB-C 7 portas', preco: 189.90, estoque: 50, categoria: 'Periféricos' } }),
    prisma.produto.create({ data: { nome: 'Mesa Digitalizadora Wacom', preco: 649.90, estoque: 3, categoria: 'Periféricos' } }),
    prisma.produto.create({ data: { nome: 'Suporte Ergonômico para Notebook', preco: 149.90, estoque: 0, categoria: 'Mobiliário' } }),
    prisma.produto.create({ data: { nome: 'Fonte 650W 80 Plus Gold', preco: 579.90, estoque: 18, categoria: 'Hardware' } }),
    prisma.produto.create({ data: { nome: 'Placa de Vídeo RTX 4060', preco: 2799.90, estoque: 4, categoria: 'Hardware' } }),
    prisma.produto.create({ data: { nome: 'Memória RAM 32GB DDR5', preco: 699.90, estoque: 22, categoria: 'Hardware' } }),
    prisma.produto.create({ data: { nome: 'Roteador Wi-Fi 6 TP-Link', preco: 599.90, estoque: 0, categoria: 'Redes' } }),
  ]);

  const [ana, carlos, mariana, roberto, fernanda, lucas, juliana, diego, patricia, thiago, camila, rafael, isabela, miguel, beatriz] = clientes;
  const [notebook, mouse, teclado, monitor, cadeira, headset, ssd, webcam, hub, wacom, , fonte, rtx, ram] = produtos;

  type P = (typeof produtos)[0];
  type C = (typeof clientes)[0];

  async function pedido(c: C, itens: { p: P; q: number }[], status: string, cat?: string, dias = 0) {
    const total = itens.reduce((a, i) => a + i.p.preco * i.q, 0);
    const data = new Date();
    data.setDate(data.getDate() - dias);
    return prisma.pedido.create({
      data: {
        clienteId: c.id, nomeCliente: c.nome, categoria: cat ?? null,
        total, status, criadoEm: data, atualizadoEm: data,
        itens: {
          create: itens.map((i) => ({
            produtoId: i.p.id, nomeProduto: i.p.nome,
            precoProduto: i.p.preco, quantidade: i.q, subtotal: i.p.preco * i.q,
          })),
        },
      },
    });
  }

  await pedido(ana, [{ p: notebook, q: 1 }, { p: mouse, q: 1 }], 'confirmado', 'Corporativo', 45);
  await pedido(ana, [{ p: ssd, q: 2 }], 'confirmado', 'Corporativo', 20);
  await pedido(ana, [{ p: teclado, q: 1 }, { p: hub, q: 1 }], 'confirmado', undefined, 5);
  await pedido(carlos, [{ p: monitor, q: 2 }, { p: rtx, q: 1 }], 'confirmado', 'Corporativo', 30);
  await pedido(carlos, [{ p: ram, q: 2 }, { p: fonte, q: 1 }], 'confirmado', undefined, 10);
  await pedido(mariana, [{ p: headset, q: 1 }], 'confirmado', 'Varejo', 60);
  await pedido(mariana, [{ p: webcam, q: 1 }], 'cancelado', undefined, 40);
  await pedido(mariana, [{ p: mouse, q: 1 }], 'confirmado', undefined, 15);
  await pedido(mariana, [{ p: teclado, q: 1 }], 'cancelado', undefined, 3);
  await pedido(roberto, [{ p: cadeira, q: 1 }], 'cancelado', 'Varejo', 90);
  await pedido(roberto, [{ p: notebook, q: 1 }], 'cancelado', undefined, 60);
  await pedido(roberto, [{ p: monitor, q: 1 }], 'cancelado', undefined, 30);
  await pedido(roberto, [{ p: ssd, q: 1 }], 'pendente', undefined, 2);
  await pedido(fernanda, [{ p: wacom, q: 1 }, { p: hub, q: 2 }], 'confirmado', 'Criativo', 10);
  await pedido(fernanda, [{ p: headset, q: 1 }], 'confirmado', undefined, 3);
  await pedido(lucas, [{ p: ssd, q: 1 }, { p: ram, q: 1 }], 'confirmado', 'Corporativo', 50);
  await pedido(lucas, [{ p: fonte, q: 1 }], 'confirmado', undefined, 25);
  await pedido(lucas, [{ p: mouse, q: 2 }, { p: teclado, q: 1 }], 'confirmado', undefined, 8);
  await pedido(juliana, [{ p: notebook, q: 1 }], 'confirmado', 'Varejo', 120);
  await pedido(juliana, [{ p: mouse, q: 1 }], 'cancelado', undefined, 100);
  await pedido(diego, [{ p: headset, q: 1 }], 'confirmado', undefined, 150);
  await pedido(patricia, [{ p: webcam, q: 1 }, { p: hub, q: 1 }], 'confirmado', 'Home Office', 15);
  await pedido(patricia, [{ p: monitor, q: 1 }], 'confirmado', 'Home Office', 7);
  await pedido(patricia, [{ p: cadeira, q: 1 }], 'pendente', undefined, 1);
  await pedido(thiago, [{ p: rtx, q: 1 }, { p: ram, q: 2 }], 'confirmado', 'Gamer', 35);
  await pedido(camila, [{ p: teclado, q: 1 }, { p: mouse, q: 1 }], 'confirmado', undefined, 5);
  await pedido(rafael, [{ p: notebook, q: 1 }], 'cancelado', undefined, 20);
  await pedido(rafael, [{ p: ssd, q: 1 }], 'confirmado', undefined, 12);
  await pedido(isabela, [{ p: headset, q: 2 }], 'confirmado', 'Internacional', 25);
  await pedido(isabela, [{ p: webcam, q: 1 }], 'confirmado', undefined, 10);
  await pedido(miguel, [{ p: mouse, q: 3 }, { p: teclado, q: 2 }], 'confirmado', 'Internacional', 40);
  await pedido(beatriz, [{ p: hub, q: 1 }], 'confirmado', undefined, 18);
  await pedido(beatriz, [{ p: ssd, q: 1 }], 'cancelado', undefined, 8);

  console.log(`\nBanco populado!`);
  console.log(`  ${await prisma.cliente.count()} clientes`);
  console.log(`  ${await prisma.produto.count()} produtos`);
  console.log(`  ${await prisma.pedido.count()} pedidos`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
