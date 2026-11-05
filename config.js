// Configuração do site de agendamento. Único arquivo a ajustar para ligar ao NewCRM.
window.CONFIG = {
  // 'mock' = dados de exemplo no navegador (nada é enviado).
  // 'live' = fala com o NewCRM pelos endpoints abaixo.
  MODO: 'mock',

  // Nome exibido no topo (provisório, ver PRD §6.1).
  NOME_CLINICA: 'Clínica Corpo Terra',

  // Identifica a clínica (tenant) dentro do NewCRM. Segmento do tenant = 'clinica'.
  TENANT: 'clinica-corpo-terra',

  // Base das funções públicas do NewCRM (sem login), ex.: URL das Edge Functions do Supabase.
  // Mesmo padrão do `coletar-evento` do Tráfego.
  API_BASE: 'https://SEU-PROJETO.supabase.co/functions/v1',

  // Chave pública (anon) se a função exigir; não colocar chaves secretas aqui.
  API_KEY: '',

  // Quantos meses à frente o paciente pode agendar.
  MESES_A_FRENTE: 3,

  // Endereço do sistema com login (criar senha / entrar). Vazio = o convite "Criar minha senha"
  // não aparece na confirmação. Preencher quando o sistema estiver no ar.
  SISTEMA_URL: '',
};
