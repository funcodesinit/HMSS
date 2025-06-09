
import React from 'react'

// import { withProtectedRoute } from '@/lib/utility/adminProtector'
import ApplicationLayout from './ApplicationLayout';
import StoreProvider from '@/context/StoreProvider';
import AuthProvider from '@/context/AuthProvider';
import { useSession } from 'next-auth/react';


const layout = async ({ children }: { children: React.ReactNode }) => {
    const {data:session} = useSession()

    return <StoreProvider>
        <AuthProvider session={session} >
            <ApplicationLayout session={session}>
                {children}
            </ApplicationLayout>;
        </AuthProvider>
    </StoreProvider>

}

export default layout