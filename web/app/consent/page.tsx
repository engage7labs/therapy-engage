export default function ConsentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8">
            Termo de Consentimento Informado
          </h1>

          <div className="prose max-w-none">
            <h2>1. FINALIDADE DO TRATAMENTO</h2>
            <p>
              O presente termo tem por objetivo obter o consentimento livre,
              informado e específico para o tratamento de dados pessoais do
              paciente menor de idade, em conformidade com a Lei Geral de
              Proteção de Dados (LGPD) e regulamentações internacionais.
            </p>

            <h2>2. DADOS COLETADOS</h2>
            <ul>
              <li>Informações pessoais (nome, idade, contato)</li>
              <li>Histórico clínico e psicológico</li>
              <li>Gravações de sessões (mediante consentimento específico)</li>
              <li>Análises comportamentais e de progresso terapêutico</li>
              <li>Comunicações entre paciente e terapeuta</li>
            </ul>

            <h2>3. BASE LEGAL</h2>
            <p>
              O tratamento dos dados é baseado no consentimento livre e
              específico do responsável legal, na execução de procedimentos
              terapêuticos e no legítimo interesse para prestação de serviços de
              saúde mental.
            </p>

            <h2>4. DIREITOS DO TITULAR</h2>
            <ul>
              <li>Confirmação da existência de tratamento de dados</li>
              <li>Acesso aos dados pessoais</li>
              <li>Correção de dados incompletos, inexatos ou desatualizados</li>
              <li>Anonimização, bloqueio ou eliminação de dados</li>
              <li>Portabilidade dos dados</li>
              <li>Revogação do consentimento</li>
            </ul>

            <h2>5. SEGURANÇA E RETENÇÃO</h2>
            <p>
              Os dados são armazenados com criptografia avançada, acesso
              restrito e por período determinado conforme necessidade
              terapêutica e obrigações legais.
            </p>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Para aceitar este termo de consentimento, entre em contato
              conosco.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
