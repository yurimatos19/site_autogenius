// Bloqueia video-autogenius/ (material-fonte do vídeo, não usado pelo site). Funções do
// Pages rodam antes dos arquivos estáticos, o que o _redirects sozinho não conseguia
// (arquivo existente tem prioridade sobre a regra).
export function onRequest() {
  return new Response('Not found', { status: 404 });
}
