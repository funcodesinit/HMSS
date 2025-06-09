
import React from 'react'

// import { withProtectedRoute } from '@/lib/utility/adminProtector'
import ApplicationLayout from './ApplicationLayout';
import StoreProvider from '@/context/StoreProvider';
import AuthProvider from '@/context/AuthProvider';
import { auth } from '@/auth';


const layout = async ({ children }: { children: React.ReactNode }) => {
    const session = await auth();

    return <StoreProvider>
        <AuthProvider session={session} >
            <ApplicationLayout session={session}>
                {children}
            </ApplicationLayout>;
        </AuthProvider>
    </StoreProvider>

}

export default layout