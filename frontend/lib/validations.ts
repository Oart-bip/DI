export interface FormErrors {
  nome?: string;
  email?: string;
  cidade?: string;
  estado?: string;
  pais?: string;
}

interface FormValues {
  nome: string;
  email: string;
  cidade: string;
  estado: string;
  pais: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validarFormCliente(values: FormValues): FormErrors {
  const erros: FormErrors = {};

  if (!values.nome.trim()) {
    erros.nome = 'Nome é obrigatório';
  } else if (values.nome.trim().length < 2) {
    erros.nome = 'Nome deve ter no mínimo 2 caracteres';
  } else if (values.nome.trim().length > 100) {
    erros.nome = 'Nome deve ter no máximo 100 caracteres';
  }

  if (!values.email.trim()) {
    erros.email = 'E-mail é obrigatório';
  } else if (!EMAIL_REGEX.test(values.email.trim())) {
    erros.email = 'Formato de e-mail inválido';
  } else if (values.email.trim().length > 150) {
    erros.email = 'E-mail deve ter no máximo 150 caracteres';
  }

  if (!values.cidade.trim()) {
    erros.cidade = 'Cidade é obrigatória';
  } else if (values.cidade.trim().length > 100) {
    erros.cidade = 'Cidade deve ter no máximo 100 caracteres';
  }

  if (!values.estado.trim()) {
    erros.estado = 'Estado é obrigatório';
  } else if (values.estado.trim().length > 100) {
    erros.estado = 'Estado deve ter no máximo 100 caracteres';
  }

  if (!values.pais.trim()) {
    erros.pais = 'País é obrigatório';
  } else if (values.pais.trim().length > 100) {
    erros.pais = 'País deve ter no máximo 100 caracteres';
  }

  return erros;
}

export function temErros(erros: FormErrors): boolean {
  return Object.keys(erros).length > 0;
}

// ── Produtos ──────────────────────────────────────────────

export interface ProdutoFormErrors {
  nome?: string;
  preco?: string;
  estoque?: string;
  categoria?: string;
}

interface ProdutoFormValues {
  nome: string;
  preco: string;   // string pois vem de input de texto
  estoque: string;
  categoria: string;
}

export function validarFormProduto(values: ProdutoFormValues): ProdutoFormErrors {
  const erros: ProdutoFormErrors = {};

  if (!values.nome.trim()) {
    erros.nome = 'Nome é obrigatório';
  } else if (values.nome.trim().length < 2) {
    erros.nome = 'Nome deve ter no mínimo 2 caracteres';
  } else if (values.nome.trim().length > 150) {
    erros.nome = 'Nome deve ter no máximo 150 caracteres';
  }

  if (values.preco === '' || values.preco === undefined) {
    erros.preco = 'Preço é obrigatório';
  } else {
    const precoNum = parseFloat(values.preco.replace(',', '.'));
    if (isNaN(precoNum)) {
      erros.preco = 'Preço deve ser um número válido';
    } else if (precoNum <= 0) {
      erros.preco = 'Preço deve ser maior que zero';
    }
  }

  if (values.estoque === '' || values.estoque === undefined) {
    erros.estoque = 'Estoque é obrigatório';
  } else {
    const estoqueNum = parseInt(values.estoque, 10);
    if (isNaN(estoqueNum) || !Number.isInteger(Number(values.estoque))) {
      erros.estoque = 'Estoque deve ser um número inteiro';
    } else if (estoqueNum < 0) {
      erros.estoque = 'Estoque não pode ser negativo';
    }
  }

  // categoria é opcional — só valida se preenchida
  if (values.categoria.trim().length > 100) {
    erros.categoria = 'Categoria deve ter no máximo 100 caracteres';
  }

  return erros;
}
