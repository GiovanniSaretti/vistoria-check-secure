import { Header } from "@/components/layout/header"
import { InspectionFormPreview } from "@/components/inspection/inspection-form-preview"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"

const InspectionDemo = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Dashboard
            </Button>
          </Link>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Demo - Execução de Vistoria</h1>
            <p className="text-muted-foreground">
              Interface para preenchimento de vistoria com status, fotos e observações
            </p>
          </div>
        </div>

        <InspectionFormPreview />
      </main>
    </div>
  )
}

export default InspectionDemo