
import React from 'react'

import { withProtectedRoute } from '@/lib/utility/adminProtector'
import ApplicationLayout from './ApplicationLayout';
import StoreProvider from '@/context/StoreProvider';


const layout = async ({ children }: { children: React.ReactNode }) => {


    return <StoreProvider> 
        <ApplicationLayout >
            {children}
        </ApplicationLayout>;
    </StoreProvider>

}

export default layout