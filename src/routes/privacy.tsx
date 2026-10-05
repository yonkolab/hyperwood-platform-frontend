import { createFileRoute } from "@tanstack/react-router";
import { LegalDocument, LegalSection } from "#/components/legal/legal-document";

export const Route = createFileRoute("/privacy")({
	component: PrivacyPage,
});

function PrivacyPage() {
	return (
		<LegalDocument
			title="Política de privacidade"
			description="Como a Hyperwood trata dados pessoais para operar contas, mercados de previsão, carteira, segurança e atendimento."
		>
			<LegalSection id="controladora" title="1. Quem controla seus dados">
				<p>
					A controladora dos dados pessoais tratados pela Plataforma é [RAZÃO
					SOCIAL DA CONTROLADORA], CNPJ [CNPJ], com endereço em [ENDEREÇO
					COMPLETO] (“Hyperwood” ou “Controladora”). Para assuntos de
					privacidade e exercício dos direitos previstos na Lei Geral de
					Proteção de Dados Pessoais (LGPD), escreva para [E-MAIL DE
					PRIVACIDADE] ou contate o encarregado pelo canal [CONTATO DO
					ENCARREGADO/DPO].
				</p>
				<p>
					Esta Política descreve o tratamento ligado ao site e aos serviços da
					Hyperwood. Um mercado, campanha ou serviço de terceiro pode ter aviso
					de privacidade próprio, que deve ser lido junto com este documento.
				</p>
			</LegalSection>

			<LegalSection id="dados" title="2. Dados que podemos tratar">
				<ul className="list-disc space-y-2 pl-6">
					<li>
						<strong className="text-foreground">Cadastro e identidade:</strong>{" "}
						e-mail, nome de usuário, região informada, estado da conta e dados
						de autenticação. Se você escolher login social, recebemos os dados
						necessários do provedor, como identificador e e-mail verificado.
					</li>
					<li>
						<strong className="text-foreground">Segurança:</strong> registros de
						acesso, endereço IP, navegador/dispositivo, tentativas e resultados
						de login, sessões, fatores de autenticação e sinais necessários à
						prevenção de fraude e proteção da conta.
					</li>
					<li>
						<strong className="text-foreground">Operações e carteira:</strong>{" "}
						ordens, posições, negociações, saldos, depósitos, saques, meio de
						pagamento, moeda, valores, status e referências do provedor de
						pagamento. Não solicitamos que você informe a senha do banco ou
						dados completos do cartão no conteúdo de suporte.
					</li>
					<li>
						<strong className="text-foreground">
							Verificação e conformidade:
						</strong>{" "}
						região, status de verificação e informações que possam ser
						solicitadas para cumprir obrigações legais, prevenir fraude,
						analisar riscos ou proteger a integridade do serviço. A Operadora
						deve especificar aqui quais verificações e dados de identificação
						são efetivamente usados: [DETALHAR PROCESSOS KYC/AML APLICÁVEIS].
					</li>
					<li>
						<strong className="text-foreground">Conteúdo e suporte:</strong>{" "}
						comentários, curtidas, denúncias, mensagens e informações que você
						envia ao atendimento.
					</li>
					<li>
						<strong className="text-foreground">Preferências:</strong> idioma,
						tema visual e favoritos salvos no navegador.
					</li>
				</ul>
				<p>
					Podemos receber dados diretamente de você, do uso da Plataforma, de
					provedores de autenticação ou pagamento e de fontes públicas ou
					parceiros legítimos para prevenção a fraude e cumprimento da lei. Não
					use a Plataforma para inserir dados pessoais de outras pessoas sem
					autorização ou outra base legal.
				</p>
			</LegalSection>

			<LegalSection id="finalidades" title="3. Finalidades e bases legais">
				<p>Tratamos dados pessoais, conforme o contexto, para:</p>
				<ul className="list-disc space-y-2 pl-6">
					<li>
						criar e administrar sua conta, autenticar acesso e executar
						funcionalidades solicitadas — execução de contrato ou procedimentos
						preliminares;
					</li>
					<li>
						processar ordens, manter registros de carteira e operações, realizar
						liquidações e atender solicitações — execução de contrato e, quando
						aplicável, cumprimento de obrigação legal ou regulatória;
					</li>
					<li>
						prevenir fraude, proteger sistemas e usuários, investigar abusos e
						manter a integridade dos mercados — legítimo interesse, observados
						seus direitos, ou cumprimento de obrigação legal;
					</li>
					<li>
						enviar comunicações operacionais, de segurança e atendimento —
						execução de contrato ou legítimo interesse; comunicações
						promocionais dependerão da base legal e das opções aplicáveis;
					</li>
					<li>
						cumprir ordens de autoridades, responder a processos e exercer
						direitos — obrigação legal ou exercício regular de direitos;
					</li>
					<li>
						medir e melhorar o serviço com dados minimizados — legítimo
						interesse ou consentimento, quando exigido.
					</li>
				</ul>
				<p>
					Quando o tratamento depender de consentimento, você poderá revogá-lo.
					Isso não afeta tratamentos anteriores válidos nem aqueles que tenham
					outra base legal.
				</p>
			</LegalSection>

			<LegalSection
				id="compartilhamento"
				title="4. Compartilhamento e transferências"
			>
				<p>
					Compartilhamos apenas o necessário com prestadores de hospedagem,
					banco de dados, segurança, envio de e-mails, autenticação e
					processamento de pagamentos; parceiros de verificação e prevenção a
					fraude quando habilitados; assessores profissionais; e autoridades,
					órgãos reguladores ou terceiros quando a lei exigir ou permitir. Esses
					destinatários devem receber apenas os dados necessários às respectivas
					finalidades e estar sujeitos a obrigações adequadas de proteção.
				</p>
				<p>
					Alguns prestadores podem tratar dados fora do Brasil. Antes da
					publicação, a Controladora deve identificar os prestadores e países
					envolvidos, as categorias transferidas e as salvaguardas utilizadas:
					[LISTAR OPERADORES, PAÍSES E MECANISMOS DE TRANSFERÊNCIA
					INTERNACIONAL].
				</p>
				<p>
					Não vendemos dados pessoais. Se isso mudar ou se dados forem
					compartilhados para publicidade comportamental, esta Política deverá
					ser atualizada e as opções de controle aplicáveis serão apresentadas.
				</p>
			</LegalSection>

			<LegalSection id="retencao" title="5. Retenção e eliminação">
				<p>
					Guardamos dados pelo tempo necessário para prestar o serviço, manter
					registros de operações e segurança, resolver disputas, cumprir
					obrigações legais e regulatórias ou exercer direitos. O período varia
					conforme o tipo de dado e a finalidade. Quando a finalidade terminar e
					não houver base para retenção, os dados serão eliminados ou
					anonimizados de forma segura, ressalvadas cópias de backup que sejam
					removidas conforme seu ciclo técnico.
				</p>
				<p>
					A Controladora deve definir prazos ou critérios específicos para
					registros financeiros, verificação, segurança e marketing: [INSERIR
					PRAZOS DE RETENÇÃO E FUNDAMENTOS].
				</p>
			</LegalSection>

			<LegalSection id="cookies" title="6. Cookies e armazenamento local">
				<p>
					A sessão autenticada pode usar cookie necessário, protegido e não
					disponível diretamente a scripts da página, para manter sua conta
					conectada e segura. O navegador também pode armazenar localmente
					preferências como tema visual e favoritos. Esses dados de preferência
					podem ser removidos nas configurações do navegador; removê-los pode
					redefinir suas preferências ou encerrar sua sessão.
				</p>
				<p>
					Esta versão descreve os recursos observados no aplicativo. Se forem
					adicionados cookies analíticos, publicidade, pixels ou SDKs de
					terceiros, a Controladora deverá atualizar este aviso, explicar suas
					finalidades e obter consentimento quando necessário antes de
					ativá-los.
				</p>
			</LegalSection>

			<LegalSection id="direitos" title="7. Seus direitos">
				<p>
					Você pode solicitar, nos termos da LGPD, confirmação da existência de
					tratamento, acesso, correção, anonimização, bloqueio ou eliminação de
					dados desnecessários ou tratados em desconformidade, portabilidade
					quando regulamentada, informação sobre compartilhamentos, informação
					sobre a possibilidade de negar consentimento e suas consequências,
					revogação do consentimento e revisão de decisões tomadas unicamente
					com base em tratamento automatizado que afetem seus interesses.
				</p>
				<p>
					Envie seu pedido para [E-MAIL DE PRIVACIDADE]. Podemos solicitar
					informações razoáveis para confirmar sua identidade e proteger sua
					conta. Alguns dados não poderão ser apagados enquanto forem
					necessários para cumprir uma obrigação legal, prevenir fraude ou
					exercer direitos; explicaremos a base e o escopo da retenção quando
					isso se aplicar. Você também pode apresentar reclamação à Autoridade
					Nacional de Proteção de Dados (ANPD).
				</p>
			</LegalSection>

			<LegalSection id="decisoes" title="8. Segurança e decisões automatizadas">
				<p>
					Adotamos controles técnicos e organizacionais destinados a proteger
					dados contra acesso não autorizado, perda, alteração ou divulgação
					indevida. Nenhum sistema conectado à internet pode ter segurança
					absoluta. Se ocorrer incidente que possa causar risco ou dano
					relevante, a Controladora avaliará as medidas e comunicações exigidas
					pela LGPD e pela regulamentação aplicável.
				</p>
				<p>
					Controles automatizados podem ajudar a identificar tentativas de
					acesso suspeitas, fraude ou necessidade de revisão de conformidade.
					Quando uma decisão for tomada unicamente por processamento
					automatizado e afetar seus interesses, você pode solicitar revisão e
					informações sobre os critérios, respeitados segredos comerciais e
					limites legais.
				</p>
			</LegalSection>

			<LegalSection id="menores" title="9. Crianças e adolescentes">
				<p>
					A Plataforma não se destina a menores de 18 anos. Não permitimos a
					criação de conta ou participação em mercados por menores. Se
					acreditarmos que dados de um menor foram coletados, adotaremos medidas
					apropriadas para restringir o acesso e tratar os dados de acordo com a
					lei.
				</p>
			</LegalSection>

			<LegalSection id="alteracoes" title="10. Alterações e contato">
				<p>
					Esta Política pode ser atualizada para refletir mudanças no serviço,
					nas práticas de tratamento ou na legislação. Publicaremos a versão
					atualizada nesta página e indicaremos a data de vigência. Mudanças
					relevantes poderão ser comunicadas por e-mail ou dentro da Plataforma.
				</p>
				<p>
					Controladora: [RAZÃO SOCIAL DA CONTROLADORA], [CNPJ], [ENDEREÇO].
					Privacidade/encarregado: [E-MAIL DE PRIVACIDADE] · [CONTATO DO
					ENCARREGADO/DPO].
				</p>
			</LegalSection>
		</LegalDocument>
	);
}
