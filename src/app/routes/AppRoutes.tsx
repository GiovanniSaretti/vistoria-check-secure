import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from '@/pages/Landing'
import Pricing from '@/pages/Pricing'
import Dashboard from '@/pages/Dashboard'
import Auth from '@/pages/Auth'
import ResetPassword from '@/pages/ResetPassword'
import PublicVerify from '@/pages/PublicVerify'
import NotFound from '@/pages/NotFound'
import Inspections from '@/pages/app/Inspections'
import Templates from '@/pages/app/Templates'
import Billing from '@/pages/app/Billing'
import Settings from '@/pages/app/Settings'

export default function AppRoutes(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing/>}/>
        <Route path="/pricing" element={<Pricing/>}/>
        <Route path="/auth" element={<Auth/>}/>
        <Route path="/reset" element={<ResetPassword/>}/>
        <Route path="/app" element={<Dashboard/>}/>
        <Route path="/app/inspections" element={<Inspections/>}/>
        <Route path="/app/templates" element={<Templates/>}/>
        <Route path="/app/billing" element={<Billing/>}/>
        <Route path="/app/settings" element={<Settings/>}/>
        <Route path="/p/:token" element={<PublicVerify/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </BrowserRouter>
  )
}


