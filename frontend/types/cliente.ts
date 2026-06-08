export interface Cliente {
  id: string;
  nome: string;
  email: string;
  cidade: string;
  estado: string;
  pais: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface CreateClientePayload {
  nome: string;
  email: string;
  cidade: string;
  estado: string;
  pais: string;
}

export interface UpdateClientePayload extends Partial<CreateClientePayload> {}

export interface ApiValidationError {
  statusCode: number;
  message: string | string[];
  error: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}
