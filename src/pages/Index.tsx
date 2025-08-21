import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Shield, FileCheck, QrCode, Users, Building2, Camera, FileText, Zap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const [activeTab, setActiveTab] = useState("template");

  const features = [
    {
      icon: <FileCheck className="h-6 w-6" />,
      title: "Templates Personalizáveis",
      description: "Crie templates específicos para cada tipo de vistoria"
    },
    {
      icon: <Camera className="h-6 w-6" />,
      title: "Coleta de fotos e evidências",
      description: "Capture e organize fotos com localização automática"
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Assinaturas digitais",
      description: "Coleta presencial ou remota com validade jurídica"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "PDF com SHA-256 + QR",
      description: "Documentos seguros com verificação pública de integridade"
    },
    {
      icon: <QrCode className="h-6 w-6" />,
      title: "Verificação Pública",
      description: "Links públicos para validação da autenticidade"
    },
    {
      icon: <Building2 className="h-6 w-6" />,
      title: "Multiempresa",
      description: "Gestão isolada para múltiplas organizações"
    }
  ];

  const howItWorks = [
    {
      id: "template",
      title: "1. Crie o Template",
      description: "Configure os campos e seções da sua vistoria",
      image: "📋"
    },
    {
      id: "collect", 
      title: "2. Colete Dados",
      description: "Execute a vistoria, adicione fotos e observações",
      image: "📷"
    },
    {
      id: "verify",
      title: "3. Gere PDF + Verificação", 
      description: "Documento seguro com hash e QR para verificação pública",
      image: "🔒"
    }
  ];

  const plans = [
    {
      name: "Free",
      price: "R$ 0",
      period: "Teste",
      features: ["Até 3 PDFs", "1 usuário", "1 link ativo", "Templates básicos"],
      popular: false,
      cta: "Começar Grátis"
    },
    {
      name: "Starter", 
      price: "R$ 59",
      period: "/mês",
      features: ["PDFs ilimitados", "2 usuários", "Links com validade", "Branding básico"],
      popular: true,
      cta: "Assinar Starter"
    },
    {
      name: "Pro",
      price: "R$ 149", 
      period: "/mês",
      features: ["Até 5 usuários", "Revistoria comparativa", "Exportações", "Auditoria completa"],
      popular: false,
      cta: "Assinar Pro"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">Vistoria Check</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/pricing" className="text-muted-foreground hover:text-foreground">
                Planos
              </Link>
              <Link to="/docs" className="text-muted-foreground hover:text-foreground">
                Documentação
              </Link>
              <Link to="/app">
                <Button>Entrar</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4">
            🔒 Vistorias Seguras e Verificáveis
          </Badge>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Vistoria Check Secure
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Plataforma completa para vistorias com templates personalizáveis, coleta de evidências,
            assinaturas digitais e PDFs com verificação criptográfica de integridade.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/inspection-demo">
              <Button size="lg" className="w-full sm:w-auto">
                <Zap className="mr-2 h-5 w-5" />
                Ver Demo Interativa
              </Button>
            </Link>
            <Link to="/app">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Começar Grátis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Hero Image Mockup */}
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-card border-2 rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  VERIFICADO
                </Badge>
              </div>
              
              <div className="text-left space-y-4">
                <h3 className="font-semibold text-lg">Vistoria #2024-001 - Imóvel Comercial</h3>
                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div>Cliente: Empresa XYZ Ltda</div>
                  <div>Data: 21/08/2024</div>
                  <div>Local: Av. Paulista, 1000</div>
                  <div>Inspetor: João Silva</div>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>HASH: a1b2c3d4e5f6... • Verificação: vistoria.app/p/abc123</span>
                    <QrCode className="h-6 w-6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Recursos Principais</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tudo que você precisa para realizar vistorias profissionais e seguras
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Como Funciona</h2>
            <p className="text-lg text-muted-foreground">
              Em 3 passos simples, do template ao PDF verificável
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <div className="flex space-x-1 bg-muted p-1 rounded-lg">
              {howItWorks.map((step) => (
                <button
                  key={step.id}
                  onClick={() => setActiveTab(step.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === step.id
                      ? "bg-background text-foreground shadow"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {step.title}
                </button>
              ))}
            </div>
          </div>

          <div className="max-w-3xl mx-auto">
            {howItWorks.map((step) => (
              <div
                key={step.id}
                className={`${activeTab === step.id ? "block" : "hidden"}`}
              >
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="text-6xl mb-6">{step.image}</div>
                    <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                    <p className="text-lg text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Planos e Preços</h2>
            <p className="text-lg text-muted-foreground">
              Escolha o plano ideal para sua necessidade
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    Mais Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold">
                    {plan.price}
                    <span className="text-base font-normal text-muted-foreground">
                      {plan.period}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/app">
                    <Button 
                      className="w-full" 
                      variant={plan.popular ? "default" : "outline"}
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

      {/* Social Proof */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Confiado por Profissionais</h2>
            <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">1000+</div>
                <div className="text-sm text-muted-foreground">Vistorias Realizadas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">98%</div>
                <div className="text-sm text-muted-foreground">Taxa de Satisfação</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">24h</div>
                <div className="text-sm text-muted-foreground">Suporte Técnico</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">Conformidade LGPD</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para Digitalizar suas Vistorias?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Comece gratuitamente e transforme seu processo de vistoria hoje mesmo
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/app">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Começar Agora - Grátis
              </Button>
            </Link>
            <Link to="/inspection-demo">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Ver Demonstração
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">Vistoria Check</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Plataforma segura para vistorias profissionais com verificação criptográfica.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/features" className="hover:text-foreground">Recursos</Link></li>
                <li><Link to="/pricing" className="hover:text-foreground">Preços</Link></li>
                <li><Link to="/inspection-demo" className="hover:text-foreground">Demo</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/about" className="hover:text-foreground">Sobre</Link></li>
                <li><Link to="/contact" className="hover:text-foreground">Contato</Link></li>
                <li><Link to="/blog" className="hover:text-foreground">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/privacy" className="hover:text-foreground">Privacidade</Link></li>
                <li><Link to="/terms" className="hover:text-foreground">Termos</Link></li>
                <li><Link to="/security" className="hover:text-foreground">Segurança</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Vistoria Check Secure. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Index