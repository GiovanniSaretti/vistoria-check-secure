import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Shield, Home, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Vistoria Check</span>
          </div>
        </div>

        <Card>
          <CardContent className="text-center p-8">
            <div className="text-6xl font-bold text-muted-foreground mb-4">
              404
            </div>
            <h1 className="text-2xl font-semibold mb-2">
              Página não encontrada
            </h1>
            <p className="text-muted-foreground mb-8">
              A página que você está procurando não existe ou foi movida.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button variant="default" className="w-full sm:w-auto">
                  <Home className="mr-2 h-4 w-4" />
                  Página Inicial
                </Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={() => window.history.back()}
                className="w-full sm:w-auto"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>Se você acredita que isso é um erro, entre em contato conosco.</p>
        </div>
      </div>
    </div>
  )
}