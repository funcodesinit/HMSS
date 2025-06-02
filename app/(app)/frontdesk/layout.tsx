
import React from 'react'

// import { withProtectedRoute } from '@/lib/utility/adminProtector'
import ApplicationLayout from './ApplicationLayout';
import StoreProvider from '@/context/StoreProvider';
import AuthProvider from '@/context/AuthProvider';


const layout = async ({ children }: { children: React.ReactNode }) => {

    return <StoreProvider>
        <AuthProvider>
            <ApplicationLayout >
                {children}
            </ApplicationLayout>;
        </AuthProvider>
    </StoreProvider>

}

export default layout