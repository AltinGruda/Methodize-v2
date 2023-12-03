import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.tsx'
import { Toaster } from './components/ui/toaster.tsx'
ReactDOM.createRoot(document.getElementById('root')!).render(
    <AuthProvider>
      <App />
      <Toaster />
    </AuthProvider>
)
