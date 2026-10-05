import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalDocument, LegalSection } from "#/components/legal/legal-document";

export const Route = createFileRoute("/terms")({
	component: TermsPage,
});

function TermsPage() {
	return (
		<LegalDocument
			title="Termos de uso"
			description="Regras para acessar a Hyperwood, participar de mercados de previsão e utilizar recursos de conta e carteira."
		>
			<LegalSection id="operadora" title="1. Operadora e aceite">
				<p>
					A plataforma Hyperwood (“Hyperwood” ou “Plataforma”) é operada por
					[RAZÃO SOCIAL DA OPERADORA], inscrita no CNPJ sob nº [CNPJ], com sede
					em [ENDEREÇO COMPLETO] (“Operadora”). Estes Termos regulam o acesso ao
					site, à conta, aos mercados e aos demais recursos disponibilizados
					pela Operadora.
				</p>
				<p>
					Ao criar uma conta ou utilizar a Plataforma, você declara que leu e
					aceita estes Termos e a{" "}
					<Link className="font-medium text-brand underline" to="/privacy">
						Política de Privacidade
					</Link>
					. Se não concordar, não crie uma conta nem envie ordens. Condições
					específicas exibidas em um mercado complementam estes Termos e
					prevalecem quanto às regras daquele mercado.
				</p>
			</LegalSection>

			<LegalSection id="servico" title="2. O serviço e seus riscos">
				<p>
					A Hyperwood disponibiliza mercados vinculados a eventos e resultados
					futuros. Conforme o mercado e os recursos disponíveis, usuários podem
					visualizar preços, publicar conteúdo, enviar ordens e manter posições
					ou saldos denominados na moeda indicada na interface. A Plataforma
					pode usar um livro de ofertas e mecanismos de correspondência; uma
					ordem pode não ser executada, ser executada parcialmente ou ser
					cancelada.
				</p>
				<p>
					Preços, probabilidades implícitas, liquidez e valores de posição podem
					mudar rapidamente. Você pode perder parte ou todo o valor
					comprometido, inclusive por falta de liquidez, execução a preço
					diferente do esperado, resultado do evento, cancelamento ou anulação
					do mercado e indisponibilidade operacional. Resultados passados e
					preços exibidos não garantem resultados futuros. Não utilize dinheiro
					necessário para despesas essenciais.
				</p>
				<p>
					A Plataforma não oferece recomendação de investimento, consultoria
					financeira, jurídica ou tributária. Você decide de forma independente
					se participa e em que valor, e deve buscar orientação profissional
					quando necessário. Esta declaração não altera a natureza jurídica que
					a lei aplicável atribua às operações.
				</p>
			</LegalSection>

			<LegalSection id="elegibilidade" title="3. Elegibilidade e localização">
				<p>
					Você deve ter pelo menos 18 anos, capacidade civil para contratar e
					utilizar a Plataforma apenas onde o serviço e o tipo de operação forem
					permitidos. Não use a Plataforma se estiver sujeito a sanções,
					proibições legais ou restrições aplicáveis. A Operadora pode limitar
					acesso, mercados, depósitos ou saques por localização, exigência
					regulatória, prevenção a fraude ou decisão de parceiros.
				</p>
				<p>
					A publicação destes Termos não representa declaração de licença,
					registro ou autorização da Operadora por órgão regulador. Antes de
					aceitar operações em dinheiro ou ativos de valor real, a Operadora
					deve verificar e descrever aqui as autorizações, limites territoriais
					e regras efetivamente aplicáveis: [DESCREVER APÓS REVISÃO JURÍDICA].
				</p>
			</LegalSection>

			<LegalSection id="conta" title="4. Conta, identidade e segurança">
				<p>
					Forneça informações corretas, atualizadas e suas. Mantenha suas
					credenciais em sigilo, proteja os dispositivos usados para acessar a
					conta e avise a Operadora imediatamente sobre acesso não autorizado.
					Você é responsável pelas atividades realizadas na conta até que a
					Operadora receba aviso e tenha oportunidade razoável de protegê-la,
					sem prejuízo dos direitos previstos em lei.
				</p>
				<p>
					Podemos solicitar confirmação de e-mail, identidade, origem de
					recursos ou outras verificações necessárias para segurança, prevenção
					a fraude e cumprimento de obrigações legais. Informações incompletas
					ou inconsistentes podem impedir determinadas operações, gerar revisão
					da conta ou levar a restrições permitidas por lei.
				</p>
			</LegalSection>

			<LegalSection id="mercados" title="5. Regras dos mercados e ordens">
				<p>
					Antes de enviar uma ordem, leia a pergunta, os critérios de resolução,
					as fontes, os prazos, a moeda, os custos e quaisquer condições
					mostradas na página do mercado. Esses elementos definem o que está
					sendo negociado e como o resultado será determinado. Em caso de dúvida
					ou inconsistência, não envie a ordem e contate o suporte.
				</p>
				<p>
					Ordens são instruções para negociar nas condições apresentadas, não
					garantias de execução. O preço final pode diferir da cotação vista
					antes da confirmação. Ordens pendentes podem reservar saldo; seu
					cancelamento só produz efeito quando confirmado pela Plataforma, e
					quantidades já executadas não são desfeitas pelo cancelamento do
					restante.
				</p>
				<p>
					Taxas, limites, requisitos de saldo e eventuais custos de rede ou de
					meios de pagamento devem ser apresentados antes da operação a que se
					aplicam. Consulte também a tarifa exibida na Plataforma. Não
					aplicaremos uma cobrança que não tenha sido informada ou que seja
					proibida pela lei aplicável.
				</p>
			</LegalSection>

			<LegalSection id="resolucao" title="6. Resolução e liquidação">
				<p>
					A resolução seguirá os critérios e as fontes publicados na página do
					mercado. A Operadora poderá analisar as fontes, publicar evidências e
					registrar o resultado e a liquidação correspondente. Os prazos podem
					variar conforme a disponibilidade de informações confiáveis.
				</p>
				<p>
					Se o evento for ambíguo, as fontes forem insuficientes ou houver erro
					material, a Operadora poderá suspender a negociação, solicitar
					revisão, corrigir informação ou declarar o mercado anulado, de acordo
					com as regras específicas publicadas para ele. O tratamento de
					posições, reservas e valores em um mercado anulado ou contestado deve
					seguir essas regras e a legislação aplicável; consulte-as antes de
					participar.
				</p>
			</LegalSection>

			<LegalSection id="carteira" title="7. Saldos, depósitos e saques">
				<p>
					Quando habilitados, depósitos, saques e saldos da carteira são
					processados de acordo com o meio de pagamento, a moeda, os prazos e os
					limites exibidos. Um pedido pode ficar pendente, ser recusado,
					revertido ou submetido a verificações de segurança e conformidade.
					Prazos de terceiros, instituições financeiras e redes de pagamento
					estão fora do controle direto da Operadora.
				</p>
				<p>
					Verifique o valor, a moeda, os dados do destino e eventuais tarifas
					antes de confirmar. Não envie recursos de terceiros sem autorização.
					Registros da carteira e do histórico ficam disponíveis para
					conferência; comunique divergências prontamente. A forma jurídica dos
					saldos, custódia, segregação e eventual proteção contra insolvência
					deve ser descrita pela Operadora após validação jurídica e
					operacional: [DESCREVER NATUREZA E CUSTÓDIA DOS SALDOS].
				</p>
			</LegalSection>

			<LegalSection id="conduta" title="8. Conduta proibida">
				<p>Você não pode:</p>
				<ul className="list-disc space-y-2 pl-6">
					<li>
						violar leis, estes Termos ou as regras publicadas para um mercado;
					</li>
					<li>
						usar informação obtida ilegalmente, manipular preços ou resultados,
						coordenar operações fraudulentas, explorar falhas ou interferir em
						eventos para influenciar uma resolução;
					</li>
					<li>
						fraudar identidade, contornar limites ou controles, operar contas de
						terceiros sem autorização ou movimentar recursos de origem ilícita;
					</li>
					<li>
						interromper, sondar ou acessar sistemas sem autorização, ou usar
						automação para abusar do serviço, contornar limites técnicos ou
						prejudicar outros usuários;
					</li>
					<li>
						publicar conteúdo ilegal, enganoso, ameaçador, discriminatório, que
						viole direitos de terceiros ou que exponha dados pessoais sem base
						legal.
					</li>
				</ul>
			</LegalSection>

			<LegalSection id="conteudo" title="9. Conteúdo e propriedade intelectual">
				<p>
					Você mantém os direitos que tiver sobre o conteúdo que publicar.
					Concede à Operadora uma licença não exclusiva, gratuita, mundial e
					limitada ao necessário para hospedar, exibir, moderar e distribuir
					esse conteúdo dentro da Plataforma e promover seu funcionamento. Você
					declara ter os direitos necessários para publicá-lo.
				</p>
				<p>
					Marcas, software, design e demais elementos da Plataforma pertencem à
					Operadora ou a seus licenciantes e não podem ser copiados, usados
					comercialmente ou modificados sem autorização, exceto quando a lei
					permitir. A Operadora pode ocultar conteúdo que viole estes Termos ou
					a lei e tratar denúncias de acordo com regras de moderação aplicáveis.
				</p>
			</LegalSection>

			<LegalSection id="suspensao" title="10. Suspensão e encerramento">
				<p>
					Você pode parar de usar a Plataforma e solicitar o encerramento da
					conta pelo canal de suporte, sujeito à conclusão de ordens, saques,
					verificações e obrigações legais pendentes. A Operadora pode limitar
					ou suspender temporariamente o acesso para proteger contas, investigar
					atividade suspeita, manter a integridade do mercado ou cumprir a lei.
					Quando legalmente permitido e operacionalmente seguro, informaremos o
					motivo e os meios de contestação.
				</p>
				<p>
					O encerramento não elimina direitos ou obrigações já constituídos.
					Saldos e posições pendentes serão tratados conforme as regras do
					mercado, os procedimentos de saque e a legislação aplicável. Registros
					podem ser preservados pelo período necessário às finalidades descritas
					na Política de Privacidade e a obrigações legais.
				</p>
			</LegalSection>

			<LegalSection
				id="disponibilidade"
				title="11. Disponibilidade e alterações"
			>
				<p>
					A Operadora busca manter o serviço disponível, mas não garante
					funcionamento ininterrupto, ausência de erros ou disponibilidade de um
					mercado específico. Manutenções, falhas de rede, provedores, ataques,
					eventos externos ou obrigações legais podem interromper recursos. A
					Operadora poderá atualizar funcionalidades e estes Termos; alterações
					relevantes serão comunicadas pelos canais disponíveis e indicarão a
					data de vigência.
				</p>
			</LegalSection>

			<LegalSection id="responsabilidade" title="12. Responsabilidade">
				<p>
					Na extensão permitida por lei, cada parte responde pelos danos que
					causar por descumprimento de suas obrigações. Nada nestes Termos
					exclui ou limita direitos inderrogáveis do consumidor, deveres legais
					da Operadora ou responsabilidade que não possa ser afastada. A
					Operadora não responde por decisões de negociação tomadas pelo usuário
					nem por falhas exclusivamente atribuíveis a terceiros, sem prejuízo da
					responsabilidade que a lei eventualmente lhe atribua.
				</p>
			</LegalSection>

			<LegalSection id="lei" title="13. Lei aplicável e atendimento">
				<p>
					Estes Termos serão interpretados de acordo com as leis brasileiras,
					respeitadas as normas de proteção ao consumidor e as regras
					obrigatórias de competência. Nenhuma disposição impede você de
					recorrer às autoridades ou ao Judiciário competente.
				</p>
				<p>
					Dúvidas, reclamações ou solicitações: [E-MAIL DE SUPORTE/JURÍDICO].
					Identifique sua conta sem enviar senha, token de autenticação ou dados
					completos de cartão.
				</p>
			</LegalSection>
		</LegalDocument>
	);
}
