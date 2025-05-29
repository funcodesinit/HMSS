
import React from 'react'

<<<<<<< HEAD
// import { withProtectedRoute } from '@/lib/utility/adminProtector'
import ApplicationLayout from './ApplicationLayout';
import StoreProvider from '@/context/StoreProvider';
import AuthProvider from '@/context/AuthProvider';
=======
import { withProtectedRoute } from '@/lib/utility/adminProtector'
import ApplicationLayout from './ApplicationLayout';
import StoreProvider from '@/context/StoreProvider';
>>>>>>> 9caa6e2523b37c39dbada7f3aa7fdcd1ee386a6f


const layout = async ({ children }: { children: React.ReactNode }) => {


<<<<<<< HEAD
    return <StoreProvider>
        <AuthProvider>
            <ApplicationLayout >
                {children}
            </ApplicationLayout>;
        </AuthProvider>
=======
    return <StoreProvider> 
        <ApplicationLayout >
            {children}
        </ApplicationLayout>;
>>>>>>> 9caa6e2523b37c39dbada7f3aa7fdcd1ee386a6f
    </StoreProvider>

}

export default layout