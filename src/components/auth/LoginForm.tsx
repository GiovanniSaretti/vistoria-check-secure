import { useState } from 'react'
import { signIn, signUp } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from '@/components/ui/sonner'
import { ClipboardCheck } from 'lucide-react'

export function LoginForm() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [organizationName, setOrganizationName] = useState('')

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await signIn(email, password)
      toast.success('Login realizado com sucesso!')
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await signUp(email, password, organizationName)
      toast.success('Conta criada com sucesso! Verifique seu email.')
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary">
              <ClipboardCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Vistoria Check</h1>
              <p className="text-sm text-muted-foreground">Vistorias Profissionais</p>
            </div>
          </div>
          <p className="text-muted-foreground">
            Checklist personalizável, fotos, assinaturas e PDF com verificação pública
          </p>
        </div>

        <Card className="shadow-medium">
          <CardHeader className="text-center">
            <CardTitle>Acesse sua conta</CardTitle>
            <CardDescription>
              Entre ou crie uma nova conta para começar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Entrar</TabsTrigger>
                <TabsTrigger value="signup">Criar Conta</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Entrando...' : 'Entrar'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="org-name">Nome da Empresa</Label>
                    <Input
                      id="org-name"
                      type="text"
                      value={organizationName}
                      onChange={(e) => setOrganizationName(e.target.value)}
                      placeholder="Minha Empresa Ltda"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Senha</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Criando conta...' : 'Criar Conta'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>Plano Pay-per-Use: 3 PDFs gratuitos</p>
          <p>Depois R$ 19 por vistoria adicional</p>
        </div>
      </div>
    </div>
  )
}