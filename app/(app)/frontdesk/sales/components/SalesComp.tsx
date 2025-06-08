'use client'
import { Heading, Subheading } from '@/components/heading'
// import { getRecentOrders } from '@/data'
import { useEffect, useState } from 'react'
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
import { fetchOrders, SetPosStats } from '@/store/actions/paymentAction'
import { fetchPublicProductList } from '@/store/actions/productsActions'
import { CheckIcon, ChevronDownIcon, ClockIcon, QuestionMarkCircleIcon, TrashIcon } from '@heroicons/react/20/solid'
import { Combobox, ComboboxDescription, ComboboxLabel, ComboboxOption } from '@/components/combobox'
import { useRouter } from 'next/navigation'
import GuestSelectCombobox from '@/components/app/GuestCombo'


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}


export default function SalesComp() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { data: session, status } = useSession()

    const user = session?.user;

    //   let orders = await getRecentOrders() 
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [postxn, setPostxn] = useState(null);
    const [activeTab, setActiveTab] = useState('All');

    const tabs = [
        { name: 'ALL' },
        { name: 'BAR' },
        { name: 'RESTAURANT' },
        { name: 'KITCHEN' },
    ];

    useEffect(() => {
        dispatch(fetchGuests() as any);
        dispatch(fetchPublicProductList() as any).then(() => setLoading(false));
    }, [dispatch]);

    const guests = useSelector((state: RootState) => state?.user?.guests?.data);

    useEffect(() => {
        if (guests?.length > 0 && !currentUser) {
            setCurrentUser(guests[0]);
        }
    }, [guests]);
    const products = useSelector((state: RootState) => state.payment.products || []);
    const [currentUser, setCurrentUser] = useState(guests?.length > 0 ? guests[0] : null);
    const order = useSelector((state: RootState) => state.payment.selected_order);

    const filteredProducts = activeTab === 'All' ? products : products?.filter(p => p.section === activeTab);



    if (loading) return <LoadingComp />

    return (
        <>
            <div className="mt-8 flex items-end justify-between">
                <Subheading>Point Of Sale</Subheading>
            </div>
            <div>
                <div className="grid grid-cols-1 sm:hidden">
                    {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
                    <select
                        value={activeTab}
                        onChange={(e) => setActiveTab(e.target.value)}
                        aria-label="Select a tab"
                        className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                    >
                        {tabs.map((tab) => (
                            <option key={tab.name} value={tab.name}>{tab.name}</option>
                        ))}
                    </select>
                    <ChevronDownIcon
                        aria-hidden="true"
                        className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end fill-gray-500"
                    />
                </div>
                <div className="hidden sm:block">
                    <div className="border-b border-gray-200">
                        <nav aria-label="Tabs" className="-mb-px flex space-x-8">
                            {tabs?.map((tab) => (
                                <button
                                    key={tab?.name}
                                    onClick={() => setActiveTab(tab.name)}  // ✅ Use onClick here
                                    className={classNames(
                                        tab?.name === activeTab
                                            ? 'border-indigo-500 text-indigo-600'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                                        'group inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium'
                                    )}
                                >
                                    {tab?.name}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>

            <Formik
                enableReinitialize

                initialValues={{
                    id: order?.id || '',
                    // userId: order?.userId || '',
                    guestId: order?.guestId || '',
                    tax: order?.tax || '14',
                    status: order?.status || 'PENDING',
                    orderItems: [],
                }}
                validationSchema={
                    Yup.object({
                        id: Yup.string().nullable(),
                        // userId: Yup.string().required('User ID is required'),
                        guestId: Yup.string().required('Guest ID is required'),
                        tax: Yup.string().required('Tax is required'),
                        status: Yup.string().required('Status is required'),
                        orderItems: Yup.array().of(
                            Yup.object().shape({
                                orderId: Yup.string(),
                                productId: Yup.string().required('Product ID is required'),
                                quantity: Yup.number().required('Quantity is required').min(1, 'Quantity must be at least 1'),
                            })
                        ).required('Order items are required'),
                    })
                }
                onSubmit={async (values, { setSubmitting, setStatus }) => {
                    try {
                        console.log('Submitting order with values:', values);
                        const url = 'sales/api' // Adjust the URL as needed

                        const payload = {
                            userId: values.userId,
                            guestId: values.guestId,
                            // tax: Number(values.tax),
                            status: values.status,
                            orderItems: values.orderItems,
                        };


                        const res = await fetch(url, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(payload),
                        });

                        const data = await res.json();

                        if (res.ok) {
                            setStatus({ success: true });
                            console.log('Order created successfully:', data);
                            // redirct to '/frontdesk/sales/orders' // Adjust the redirect as needed\
                            router.push('/frontdesk/orders');
                            // Optional: reset form or show a success toast
                        } else {
                            setStatus({ success: false, message: data.message });
                        }
                    } catch (err) {
                        console.error('Error submitting order:', err);
                        setStatus({ success: false, message: 'Submission failed' });
                    } finally {
                        setSubmitting(false);
                    }
                }} 

            >

                {({
                    handleSubmit, isSubmitting, errors, handleChange, setFieldValue, status, setStatus, values
                }) => {
                    const subtotal = values.orderItems.reduce((acc, item) => {
                        const product = products?.find(p => p.id === item.productId);
                        return acc + (product ? product?.price * item.quantity : 0);
                    }, 0);

                    const taxRate = 0.14; // example: 10%
                    const tax = subtotal * taxRate;
                    const total = subtotal + tax;

                    return (
                        <form onSubmit={handleSubmit} className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
                            <section aria-labelledby="cart-heading" className="lg:col-span-7">
                                <h2 id="cart-heading" className="sr-only">
                                    Items in your shopping cart
                                </h2>
                                <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 md:gap-y-0 lg:gap-x-8">
                                    {filteredProducts?.map((product, productIdx) => (
                                        <div key={product.id} className="group relative cursor-pointer" onClick={() => {
                                            const itemIndex = values?.orderItems?.findIndex(i => i.productId === product.id);
                                            let updatedItems = [...values.orderItems];
                                            if (itemIndex >= 0) {
                                                updatedItems[itemIndex] = {
                                                    ...updatedItems[itemIndex],
                                                    quantity: updatedItems[itemIndex].quantity + 1
                                                };
                                            } else {
                                                updatedItems.push({ productId: product.id, quantity: 1 });

                                            }
                                            setFieldValue('orderItems', updatedItems);
                                        }}>
                                            <img alt={product.thumb} src={product.thumb||'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLkN4VsHXmLN4YHMbn5TJyPO0_SgQWvx8aQmJyJpvaTHaONr52X-T0WmR8QR_JXZmmrww&usqp=CAU'} className="w-fit h-fit object-cover rounded-md" />
                                            <h3 className="mt-4 text-sm text-gray-700">
                                                <a href={product.href}>
                                                    <span className="absolute inset-0" />
                                                    {product.name}
                                                </a>
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-500">{product.color}</p>
                                            <p className="mt-1 text-sm font-medium text-gray-900">{product.price}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Order summary */}
                            <section
                                aria-labelledby="summary-heading"
                                className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
                            >
                                <h2 id="summary-heading" className="text-lg font-medium text-gray-900">
                                    Order summary
                                </h2>
                                {status?.message && (
                                    <div className="mt-4 text-sm text-red-600">{status.message}</div>
                                )}
                                {Object.keys(errors).length > 0 && (
                                    <pre className="text-red-600 text-xs">{JSON.stringify(errors, null, 2)}</pre>
                                )}


                                <dl className="mt-6 space-y-4">
                                    <Field>
                                        <Label>Order By</Label>
                                        {guests && (<GuestSelectCombobox
                                            name="guestId"
                                            options={guests}
                                            displayValue={(g) => g?.firstName}
                                        />) }
                                        
                                    </Field>
                                    {values?.orderItems?.map((item, idx) => {
                                        const product = products?.find(p => p?.id === item?.productId);
                                        return (
                                            <div key={item?.productId} className="col border-b border-gray-200 py-6 flex items-center gap-x-4 lg:gap-x-6">
                                                <img alt={product?.thumb} src={product.thumb} className="w-10 object-cover" />

                                                <div className='w-full flex flex-col gap-2'>

                                                    <div className="flex items-center gap-2  justify-between items-center">
                                                        <span>{product?.name} </span>
                                                        <span>BWP {product.price}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2  justify-between items-center">
                                                        <div className='flex items-center gap-2'>
                                                            <button type="button" className='px-2 border-2 rounded-sm border-gray-300'
                                                                onClick={() => {
                                                                    const newItems = [...values.orderItems];
                                                                    newItems[idx].quantity--;
                                                                    if (newItems[idx].quantity < 1) {
                                                                        newItems.splice(idx, 1);
                                                                    }
                                                                    setFieldValue('orderItems', newItems);
                                                                }}
                                                            >-</button>
                                                            <span>{item?.quantity}</span>
                                                            <button type="button" className='px-2 border-2 rounded-sm border-gray-300'
                                                                onClick={() => {
                                                                    const newItems = [...values.orderItems];
                                                                    newItems[idx].quantity++;
                                                                    setFieldValue('orderItems', newItems);
                                                                }}
                                                            >+</button>
                                                        </div>
                                                        <span>{product ? `BWP ${(product.price * item.quantity).toFixed(2)}` : ''}</span>
                                                    </div>
                                                </div>

                                            </div>
                                        );
                                    })}

                                    <section className="...">
                                        <dl className="mt-6 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <dt className="text-sm text-gray-600">Subtotal</dt>
                                                <dd className="text-sm font-medium text-gray-900">BWP {subtotal.toFixed(2)}</dd>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <dt className="text-sm text-gray-600">Tax(14%)</dt>
                                                <dd className="text-sm font-medium text-gray-900">BWP {tax.toFixed(2)}</dd>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <dt className="text-base font-medium text-gray-900">Total</dt>
                                                <dd className="text-base font-medium text-gray-900">BWP {total.toFixed(2)}</dd>
                                            </div>
                                        </dl>
                                    </section>

                                </dl>

                                <div className="mt-6">
                                    <button
                                        type="submit"
                                        className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-xs hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 focus:outline-hidden"
                                    >
                                        {isSubmitting ? 'Creating Order...' : 'Create Order'}
                                    </button>
                                </div>
                            </section>
                        </form>
                    )
                }}
            </Formik >


        </>
    );

}
