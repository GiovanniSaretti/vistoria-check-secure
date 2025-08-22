import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from '@/pages/Landing'
import Pricing from '@/pages/Pricing'
import Dashboard from '@/pages/Dashboard'
import PublicVerify from '@/pages/PublicVerify'
import NotFound from '@/pages/NotFound'

export default function AppRoutes(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing/>}/>
        <Route path="/pricing" element={<Pricing/>}/>
        <Route path="/app" element={<Dashboard/>}/>
        <Route path="/p/:token" element={<PublicVerify/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </BrowserRouter>
  )
}
