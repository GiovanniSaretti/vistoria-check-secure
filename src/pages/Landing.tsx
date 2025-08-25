import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Shield, FileCheck, QrCode, Users, Building2, Camera, FileText, Zap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Landing() {
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Vistor IA
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/pricing" className="text-muted-foreground hover:text-foreground">
                Planos
              </Link>
              <Link to="/auth">
                <Button>Entrar</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4 shadow-soft">
            🤖 Vistorias Inteligentes com IA
          </Badge>
          <h1 className="text-5xl font-bold mb-6 gradient-hero bg-clip-text text-transparent">
            Vistor IA
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Plataforma de vistorias inteligentes com IA, templates personalizáveis, coleta de evidências,
            assinaturas digitais e PDFs com verificação criptográfica de integridade.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/auth">
              <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary-hover shadow-primary hover:shadow-strong transition-all">
                <Zap className="mr-2 h-5 w-5" />
                Começar Grátis
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                <ArrowRight className="mr-2 h-5 w-5" />
                Ver Planos
              </Button>
            </Link>
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
              <Card key={index} className="text-center shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105 border-0 bg-gradient-to-br from-card to-card/50">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center text-primary mb-4 shadow-soft">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
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
}