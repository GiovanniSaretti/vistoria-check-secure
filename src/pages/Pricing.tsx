import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { CheckCircle, X, Shield, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Free",
      price: { monthly: 0, annual: 0 },
      period: "Teste gratuito",
      description: "Perfeito para testar a plataforma",
      features: [
        { name: "Até 3 PDFs por mês", included: true },
        { name: "1 usuário", included: true },
        { name: "1 link público ativo", included: true },
        { name: "Templates básicos", included: true },
        { name: "Suporte por email", included: true },
        { name: "Revistoria comparativa", included: false },
        { name: "Branding customizado", included: false },
        { name: "Exportações avançadas", included: false },
        { name: "Auditoria completa", included: false },
        { name: "Marketplace premium", included: false }
      ],
      cta: "Começar Grátis",
      popular: false,
      highlight: false
    },
    {
      name: "Pay-Per-Use",
      price: { monthly: 19, annual: 19 },
      period: "por vistoria",
      description: "Pague apenas quando usar",
      features: [
        { name: "R$ 19 por vistoria completa", included: true },
        { name: "Pagamento via Pix ou cartão", included: true },
        { name: "Sem mensalidade", included: true },
        { name: "1 usuário por vistoria", included: true },
        { name: "Link de verificação", included: true },
        { name: "Templates personalizados", included: true },
        { name: "Suporte prioritário", included: false },
        { name: "Revistoria comparativa", included: false },
        { name: "Múltiplos usuários", included: false },
        { name: "Auditoria completa", included: false }
      ],
      cta: "Pagar por Uso",
      popular: false,
      highlight: false
    },
    {
      name: "Starter",
      price: { monthly: 59, annual: 49 },
      period: "/mês", 
      description: "Ideal para pequenas equipes",
      features: [
        { name: "PDFs ilimitados", included: true },
        { name: "Até 2 usuários", included: true },
        { name: "Links públicos (30-90 dias)", included: true },
        { name: "Templates personalizados", included: true },
        { name: "Branding básico", included: true },
        { name: "Suporte prioritário", included: true },
        { name: "Exportações CSV/Excel", included: true },
        { name: "Revistoria comparativa", included: false },
        { name: "Auditoria completa", included: false },
        { name: "Marketplace premium", included: false }
      ],
      cta: "Assinar Starter",
      popular: true,
      highlight: true
    },
    {
      name: "Pro",
      price: { monthly: 149, annual: 125 },
      period: "/mês",
      description: "Para equipes profissionais",
      features: [
        { name: "Tudo do Starter, mais:", included: true },
        { name: "Até 5 usuários", included: true },
        { name: "Revistoria comparativa", included: true },
        { name: "Exportações avançadas", included: true },
        { name: "Auditoria completa", included: true },
        { name: "Marketplace premium", included: true },
        { name: "Retenção estendida (2 anos)", included: true },
        { name: "API de integração", included: true },
        { name: "Suporte telefônico", included: true },
        { name: "Treinamento incluso", included: true }
      ],
      cta: "Assinar Pro",
      popular: false,
      highlight: false
    },
    {
      name: "Business",
      price: { monthly: 349, annual: 299 },
      period: "/mês",
      description: "Para grandes organizações",
      features: [
        { name: "Tudo do Pro, mais:", included: true },
        { name: "Até 20 usuários", included: true },
        { name: "Retenção ilimitada", included: true },
        { name: "SSO (Single Sign-On)", included: true },
        { name: "White-label disponível", included: true },
        { name: "SLA garantido", included: true },
        { name: "Gerente de conta dedicado", included: true },
        { name: "Implementação assistida", included: true },
        { name: "Treinamento presencial", included: true },
        { name: "Customizações sob demanda", included: true }
      ],
      cta: "Falar com Vendas",
      popular: false,
      highlight: false
    }
  ];

  const faqs = [
    {
      question: "Posso mudar de plano a qualquer momento?",
      answer: "Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As alterações entram em vigor no próximo ciclo de cobrança."
    },
    {
      question: "Os dados ficam seguros na plataforma?",
      answer: "Absolutamente. Utilizamos criptografia end-to-end, armazenamento em nuvem segura e conformidade total com a LGPD. Seus dados são protegidos com os mais altos padrões de segurança."
    },
    {
      question: "Como funciona a verificação pública dos PDFs?",
      answer: "Cada PDF gerado possui um hash SHA-256 único e um QR Code que direciona para uma página de verificação pública, onde qualquer pessoa pode confirmar a integridade do documento."
    },
    {
      question: "Existe limite de armazenamento?",
      answer: "Não há limite de armazenamento para documentos e fotos nos planos pagos. No plano gratuito, há limite de 3 PDFs para teste da plataforma."
    },
    {
      question: "Posso usar templates prontos?",
      answer: "Sim! Oferecemos templates padrão para diferentes tipos de vistoria (imóveis, veículos, equipamentos) e você pode criar templates personalizados conforme sua necessidade."
    },
    {
      question: "Como funciona o suporte técnico?",
      answer: "Oferecemos suporte via email para todos os planos, chat para planos Starter+ e suporte telefônico para planos Pro+. Nosso tempo de resposta é de até 24h."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <ArrowLeft className="h-5 w-5" />
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Vistor IA
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-muted-foreground hover:text-foreground">
                Início
              </Link>
              <Link to="/inspection-demo" className="text-muted-foreground hover:text-foreground">
                Demo
              </Link>
              <Link to="/auth">
                <Button>Entrar</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Planos e Preços Transparentes
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Escolha o plano que melhor se adapta às suas necessidades
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <span className={`text-sm ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
              Mensal
            </span>
            <Switch 
              checked={isAnnual} 
              onCheckedChange={setIsAnnual}
            />
            <span className={`text-sm ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
              Anual
            </span>
            {isAnnual && (
              <Badge variant="secondary" className="ml-2">
                Economize até 20%
              </Badge>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-8">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative ${
                  plan.highlight 
                    ? 'border-primary shadow-lg scale-105' 
                    : ''
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    Mais Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="pt-4">
                    {plan.name === "Free" ? (
                      <div className="text-3xl font-bold">Grátis</div>
                    ) : (
                      <div className="text-3xl font-bold">
                        R$ {isAnnual ? plan.price.annual : plan.price.monthly}
                        <span className="text-base font-normal text-muted-foreground">
                          {plan.period}
                        </span>
                      </div>
                    )}
                    {isAnnual && plan.price.annual !== plan.price.monthly && (
                      <div className="text-sm text-muted-foreground">
                        <span className="line-through">R$ {plan.price.monthly}</span>
                        <span className="ml-1 text-green-600 font-medium">
                          ({Math.round((1 - plan.price.annual / plan.price.monthly) * 100)}% off)
                        </span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start space-x-2 text-sm">
                        {feature.included ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        )}
                        <span className={feature.included ? '' : 'text-muted-foreground'}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link to="/auth">
                    <Button 
                      className="w-full" 
                      variant={plan.highlight ? "default" : "outline"}
                      size="sm"
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Compare os Recursos</h2>
            <p className="text-lg text-muted-foreground">
              Veja detalhadamente o que cada plano oferece
            </p>
          </div>
          
          {/* Feature comparison table would go here */}
          <div className="bg-card rounded-lg p-8 text-center">
            <h3 className="text-xl font-semibold mb-4">
              Precisa de mais detalhes?
            </h3>
            <p className="text-muted-foreground mb-6">
              Entre em contato conosco para uma demonstração personalizada
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button>Falar com Vendas</Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline">Ver Demonstração</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Perguntas Frequentes</h2>
            <p className="text-lg text-muted-foreground">
              Tire suas dúvidas sobre nossos planos e recursos
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para Começar?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Experimente gratuitamente por 30 dias. Sem compromisso.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" variant="secondary">
                Começar Teste Grátis
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Falar com Especialista
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Vistor IA
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; 2024 Vistor IA. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Pricing;