import { useAuth } from '@/context/AuthContext'
import { Outlet, Navigate } from 'react-router-dom'

const PrivateRoutes = () => {
    const {isAuth} = useAuth();
    return(
        isAuth ? <Outlet/> : <Navigate to="/login"/>
    )
}

export default PrivateRoutes