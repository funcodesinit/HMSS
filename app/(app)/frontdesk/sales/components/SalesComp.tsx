'use client'
import { Avatar } from '@/components/avatar'
import { Heading, Subheading } from '@/components/heading'
import { Select } from '@/components/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
// import { getRecentOrders } from '@/data'
import { Stat } from './stat'
import { Button } from '@/components/button'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronLeftIcon } from '@heroicons/react/16/solid'
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/dialog'
import { Formik } from 'formik'
import { Field, Label } from '@/components/fieldset'
import * as Yup from 'yup'

import FormikInput from '@/components/app/FormikField'
import { Divider } from '@/components/divider'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { fetchGuests } from '@/store/actions/userActions'
import LoadingComp from '../../Loading'
import { useSession } from 'next-auth/react'
import { fetchPos, SetPosStats } from '@/store/actions/paymentAction'

export default function SalesComp() {
    const dispatch = useDispatch();
    const { data: session, status } = useSession()

    const user = session?.user;

    //   let orders = await getRecentOrders() 
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [postxn, setPostxn] = useState(null);

    useEffect(() => {
        dispatch(fetchPos()).then(() => {
            dispatch(SetPosStats());
        }).then(() => setLoading(false));
    }, [dispatch, setPostxn]);



    useEffect(() => {
        dispatch(fetchGuests())
    }, [dispatch])


    const pos = useSelector((state: RootState) => state.payment.pos);
    const guest = useSelector((state: RootState) => state.user.guests);
    const stats = useSelector((state: RootState) => state.payment.stats);



    if (loading) return <LoadingComp />

    return (
        <>
            <div className="mt-8 flex items-end justify-between">
                <Subheading>POS</Subheading>
                <Button type="button" onClick={() => setIsOpen(true)}>
                    Add POS transaction
                </Button>
                <Dialog open={isOpen} onClose={setIsOpen}>
                    <Formik
                        initialValues={{
                            id: pos.id || '',
                            guestId: pos.guestId || '',
                            userId: user?.id || '',
                            itemName: pos.itemName || '',
                            itemDescription: pos.itemDescription || '',
                            photo: pos.photo || '',
                            amount: pos.amount || '',
                        }}
                        validationSchema={
                            Yup.object({
                                guestId: Yup.string().required("guest is required."),
                                userId: Yup.string().required("user is required."),
                                itemName: Yup.string(),
                                itemDescription: Yup.string(),
                                photo: Yup.string(),
                                amount: Yup.string().required("amount is required."),
                            })
                        }

                        enableReinitialize={true}
                        onSubmit={async (values, { setStatus }) => {
                            setLoading(true);
                            setStatus(null);
                            const url = pos?.id ? `/frontdesk/sales/${pos.id}/api` : '/frontdesk//sales/api';
                            const method = pos?.id ? 'PUT' : 'POST';
                            try {
                                const response = await fetch(url, {
                                    method: method,
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        guestId: values.guestId,
                                        userId: parseInt(values.userId, 10),
                                        itemName: values.itemName,
                                        itemDescription: values.itemDescription,
                                        photo: values.photo || '',
                                        amount: parseFloat(values.amount),
                                    }),
                                });

                                const data = await response.json();

                                if (!response.ok) {
                                    const errorMessage = data?.message || 'Failed to create POS item.';
                                    setStatus(errorMessage);
                                } else {
                                    setIsOpen(false);
                                    // Optionally reset form state or refresh list
                                    dispatch(fetchPos()).then(() => {
                                        dispatch(SetPosStats());
                                    });
                                }
                            } catch (error) {
                                console.error('Error creating POS item:', error);
                                setStatus('Something went wrong while creating the POS item. Please try again.');
                            } finally {
                                setLoading(false);
                                setPostxn(null);
                            }
                        }}

                    >
                        {({
                            handleSubmit, isSubmitting, errors, handleChange, status, setStatus, values
                        }) => (
                            <form method="post" onSubmit={handleSubmit}>
                                <DialogTitle> {pos?.id ? `Update Room No. ${pos.id}` : 'Add Pos Transaction'}</DialogTitle>
                                <DialogDescription>
                                    Fill in the form to  {pos?.id ? `update Room No. ${pos.id}` : 'create new room'}
                                </DialogDescription>
                                <DialogBody>

                                    {status && (
                                        <div className="mb-4 rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-700">
                                            {status}
                                        </div>
                                    )}

                                    {Object.keys(errors).length > 0 && (
                                        <div className="mb-4 rounded-md border border-red-300 bg-red-50 p-4">
                                            <ul className="list-disc list-inside text-sm text-red-700">
                                                {Object.entries(errors).map(([field, message]) => (
                                                    <li key={field}>{typeof message === 'string' ? message : 'Invalid value'}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <FormikInput label="Item Name" name="itemName" placeholder="e.g. Coffee" />
                                    <Divider className="my-4" />

                                    <FormikInput label="Item Description" name="itemDescription" placeholder="Optional description" />
                                    <Divider className="my-4" />

                                    <FormikInput label="Amount" name="amount" placeholder="e.g. 5.00" />

                                    <Divider className="my-4" />

                                    <Field >
                                        <Label>Guest</Label>
                                        <Select name="guestId" onChange={handleChange} value={values.guestId}>
                                            {/* Replace these options with actual guests dynamically */}
                                            <option value="">Select a guest</option>
                                            {guest?.data?.map((g) => (
                                                <option key={g.id} value={g.id}>
                                                    {g.firstName} {g.lastName}
                                                </option>
                                            ))}
                                        </Select>
                                    </Field>

                                    <Divider className="mt-4" />
                                    <Field>
                                        <Label>Handled By (User)</Label>
                                        <Select name="userId" onChange={handleChange} value={values.userId}>
                                            {/* Replace with actual user options */}
                                            <option value={user?.id} >{user?.email}</option>
                                        </Select>
                                    </Field>
                                </DialogBody>
                                <DialogActions>
                                    <Button plain onClick={() => {
                                        setIsOpen(false);
                                        setPostxn(null);
                                    }}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? 'Creating...' : 'Save'}
                                    </Button>
                                </DialogActions>
                            </form>
                        )}
                    </Formik>
                </Dialog>
            </div>
            {/* <div className='flex flex-row justify-between mt-4'>

                <div className="max-lg:hidden mb-4">
                    <span className="inline-flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                        Pos transactions Overview
                    </span>
                </div>

                <div>
                    <Select name="period">
                        <option value="last_week">Last week</option>
                        <option value="last_two">Last two weeks</option>
                        <option value="last_month">Last month</option>
                        <option value="last_quarter">Last quarter</option>
                    </Select>
                </div>

            </div> */}

            <div className="mt-4 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
                <Stat title="Total Txn Amount" value={`BWP${stats.totalAmount}`} change="+4.5%" />
                <Stat title="Average Guest Transaction" value={`${stats.averageTransactionsPerGuest}`} change="+0.5%" />
                <Stat title="Guest Served" value={stats.uniqueGuestCount} change="+4.5%" />
                <Stat title="Av Guest Spent" value={`BWP${stats.averageAmountPerGuest}`} change="+21.2%" />
            </div>

            <Subheading className="mt-14">Recent sales</Subheading>
            <Table className="mt-4 [--gutter:--spacing(6)] lg:[--gutter:--spacing(10)]">
                <TableHead>
                    <TableRow>
                        <TableHeader>Transaction Id</TableHeader>
                        <TableHeader>Purchase date</TableHeader>
                        <TableHeader>Guest</TableHeader>
                        <TableHeader>Item</TableHeader>
                        <TableHeader className="text-right">Amount</TableHeader>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {pos?.error && (
                        <TableRow>
                            <TableCell colSpan={5} className="text-pink-500 flex items-center gap-2">
                                <div className=' text-sm text-red-700'>

                                    {pos?.error}
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                    {pos && !pos?.length && (
                        <TableRow  >
                            <TableCell colSpan={5} className="text-pink-500 flex items-center gap-2">
                                <div className='text-sm text-red-700'>
                                    No POS transactions found.
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                    {pos?.map((order) => (
                        <TableRow key={order.id} href={order.url} title={`Order #${order.id}`}>
                            <TableCell>{order.id}</TableCell>
                            <TableCell className="text-zinc-500">{order.createdAt}</TableCell>
                            <TableCell>{order.guest.firstName} {order.guest.lastName}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    {/* <Avatar src={order.event.thumbUrl} className="size-6" /> */}
                                    <span>{order.itemName}</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-right">BPW {order.amount}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );

}
