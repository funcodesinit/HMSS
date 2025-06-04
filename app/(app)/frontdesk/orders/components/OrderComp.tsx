// 'use client'
// import { Subheading } from '@/components/heading'
// import { Select } from '@/components/select'
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
// import { Button } from '@/components/button'
// import { useEffect, useState } from 'react'
// import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/dialog'
// import { Formik } from 'formik'
// import { Field, Label } from '@/components/fieldset'
// import * as Yup from 'yup'

// import FormikInput from '@/components/app/FormikField'
// import { Divider } from '@/components/divider'
// import { useDispatch, useSelector } from 'react-redux'
// import { RootState } from '@/store'
// import LoadingComp from '../../Loading'
// import { fetchBills, fetchOrders } from '@/store/actions/paymentAction'
// import { fetchReservations } from '@/store/actions/roomActions'

// export default function OrdersComp() {
//     const dispatch = useDispatch();
//     const [isOpen, setIsOpen] = useState(false);
//     const [loading, setLoading] = useState(true);
//     const [bill, setBill] = useState(null);

//     useEffect(() => {
//         dispatch(fetchOrders()).then(() => setLoading(false));
//     }, [dispatch]);

 

//     const orders = useSelector((state: RootState) => state.payment.orders);

//     if (loading) return <LoadingComp />

//     return (
//         <>
//             <div className="mt-8 flex items-end justify-between">
//                 <Subheading>Orders</Subheading>
//             </div>
//             <Table className="mt-4 [--gutter:--spacing(6)] lg:[--gutter:--spacing(10)]">
//                 <TableHead>
//                     <TableRow>
//                         <TableHeader>Order Id</TableHeader>
//                         <TableHeader>Guest</TableHeader>
//                         <TableHeader>Product</TableHeader>
//                         <TableHeader>status</TableHeader>
//                         {/* <TableHeader className="text-right">Amount</TableHeader> */}
//                     </TableRow>
//                 </TableHead>
//                 <TableBody>
//                     {orders?.error && (
//                         <TableRow>
//                             <TableCell colSpan={5} className="text-pink-500 flex items-center gap-2">
//                                 <div className=' text-sm text-red-700'>
//                                     {bills?.error}
//                                 </div>
//                             </TableCell>
//                         </TableRow>
//                     )}
//                     {Array.isArray(orders) && orders.length === 0 && (

//                         <TableRow  >
//                             <TableCell colSpan={5} className="text-pink-500 flex items-center gap-2">
//                                 <div className='text-sm text-red-700'>
//                                     No orders found.
//                                 </div>
//                             </TableCell>
//                         </TableRow>
//                     )}
//                     {orders?.map((order) => (
//                         <TableRow key={order?.id} title={`Order #${order.id}`}>
//                             <TableCell>{order?.id}</TableCell>
//                             <TableCell className="text-zinc-500">{order?.gues?.firstName} {order?.gues?.lastName}</TableCell>
//                             {order?.items?.map(
//                                 (item, index) => <TableCell key={index} className="text-zinc-500">{item?.product?.name}</TableCell>
//                             )}
//                             <TableCell>{order.status.toLowerCase()}</TableCell>
//                             {/* <TableCell className="text-right">BPW </TableCell> */}
//                         </TableRow>
//                     ))}
//                 </TableBody>
//             </Table>
//         </>
//     );

// }
'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { fetchOrders } from '@/store/actions/paymentAction'

import { Subheading } from '@/components/heading'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import LoadingComp from '../../Loading'

export default function OrdersComp() {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    const orders = useSelector((state: RootState) => state.payment.orders);

    useEffect(() => {
        dispatch(fetchOrders()).then(() => setLoading(false));
    }, [dispatch]);

    if (loading) return <LoadingComp />;

    return (
        <>
            <div className="mt-8 flex items-end justify-between">
                <Subheading>Orders</Subheading>
            </div>

            <Table className="mt-4 [--gutter:--spacing(6)] lg:[--gutter:--spacing(10)]">
                <TableHead>
                    <TableRow  >
                        <TableHeader>Order ID</TableHeader>
                        <TableHeader>Guest</TableHeader>
                        <TableHeader>Products</TableHeader>
                        <TableHeader>Status</TableHeader>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {/* Error */}
                    {orders?.error && (
                        <TableRow>
                            <TableCell colSpan={4} className="text-red-600 text-sm p-4">
                                {orders.error}
                            </TableCell>
                        </TableRow>
                    )}

                    {/* Empty */}
                    {Array.isArray(orders) && orders.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4} className="text-zinc-500 text-sm p-4">
                                No orders found.
                            </TableCell>
                        </TableRow>
                    )}

                    {/* Data */}
                    {Array.isArray(orders) && orders.map((order) => (
                        <TableRow key={order.id}>
                            <TableCell>{order.id}</TableCell>
                            <TableCell className="text-zinc-600">
                                {order?.guest?.firstName} {order?.guest?.lastName}
                            </TableCell>
                            <TableCell className="text-zinc-600">
                                {order?.items?.map((item, index) => (
                                    <div key={index}>
                                        • {item?.product?.name}
                                    </div>
                                ))}
                            </TableCell>
                            <TableCell>
                                <span
                                    className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                                        order.status === 'PENDING'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : order.status === 'COMPLETED'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}
                                >
                                    {order.status.toLowerCase()}
                                </span>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
}
