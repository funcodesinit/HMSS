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

    const orders = useSelector((state: RootState) => state.payment.orders||[]) as any;

    useEffect(() => {
        dispatch(fetchOrders() as any).then(() => setLoading(false));
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
                                {order?.items?.map((item:any, index:number) => (
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
