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


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}



export default function SalesComp() {
    const dispatch = useDispatch();
    const { data: session, status } = useSession()

    const user = session?.user;

    //   let orders = await getRecentOrders() 
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [postxn, setPostxn] = useState(null);

    // useEffect(() => {
    //     dispatch(fetchOrders()).then(() => {
    //         dispatch(SetPosStats());
    //     }).then(() => setLoading(false));
    // }, [dispatch, setPostxn]);

    useEffect(() => {
        dispatch(fetchGuests()).then(() => {
            setCurrentUser(guests?.length > 0 ? guests[0] : null);
        })
    }, [dispatch])

    useEffect(() => {
        dispatch(fetchPublicProductList()).then(() => setLoading(false));
    }, [dispatch])

    const guests = useSelector((state: RootState) => state?.user?.guests?.data);
    const products = useSelector((state: RootState) => state.payment.products);
    const category = useSelector((state: RootState) => state.payment.category);
    const [currentUser, setCurrentUser] = useState(guests?.length > 0 ? guests[0] : null);
    const order = useSelector((state: RootState) => state.payment.selected_order);

    // const order = useSelector((state: RootState) => state.payment.selected_order);
    // const stats = useSelector((state: RootState) => state.payment.stats);

    const tabs = [
        { name: 'All', href: '#', current: true },
        { name: 'Bar', href: '#', current: false },
        { name: 'Restaurant', href: '#', current: false },
        { name: 'Kitchen', href: '#', current: false },
    ]


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
                        defaultValue={tabs.find((tab) => tab.current).name}
                        aria-label="Select a tab"
                        className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                    >
                        {tabs.map((tab) => (
                            <option key={tab.name}>{tab.name}</option>
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
                            {tabs.map((tab) => (
                                <a
                                    key={tab.name}
                                    href={tab.href}
                                    aria-current={tab.current ? 'page' : undefined}
                                    className={classNames(
                                        tab.current
                                            ? 'border-indigo-500 text-indigo-600'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                                        'group inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium',
                                    )}
                                >

                                    <span>{tab.name}</span>
                                </a>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>

            <Formik>
                initialValues={{
                    id: order?.id || '',
                    userId: order?.userId || '',
                    guestId: order?.guestId || 'STANDARD',
                    tax: order?.tax || 'AVAILABLE',
                    status: order?.status || 'PENDING',
                    orderItems: [],
                }}
                validationSchema={
                    Yup.object({
                        id: Yup.string().required('Order ID is required'),
                        userId: Yup.string().required('User ID is required'),
                        guestId: Yup.string().required('Guest ID is required'),
                        tax: Yup.string().required('Tax is required'),
                        status: Yup.string().required('Status is required'),
                        orderItems: Yup.array().of(
                            Yup.object().shape({
                                orderId: Yup.string().required('Product ID is required'),
                                productId: Yup.string().required('Product ID is required'),
                                quantity: Yup.number().required('Quantity is required').min(1, 'Quantity must be at least 1'),
                            })
                        ).required('Order items are required')
                    })
                }


                {({
                    handleSubmit, isSubmitting, errors, handleChange, status, setStatus, values
                }) => (
                    <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
                        <section aria-labelledby="cart-heading" className="lg:col-span-7">
                            <h2 id="cart-heading" className="sr-only">
                                Items in your shopping cart
                            </h2>
                            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-0 lg:gap-x-8">
                                {products.map((product, productIdx) => (
                                    <div key={product.id} className="group relative">
                                        <div className="h-56 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-full xl:h-full">
                                            <img alt={product.imageAlt} src={`https://hungrylion.co.zm/wp-content/uploads/2023/08/WEBSITE-FOMO-FOR-ONE_1080x1080px.webp`} className="size-full object-cover" />
                                        </div>
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

                            <dl className="mt-6 space-y-4">
                                <Field>
                                    <Label>Assigned to</Label>
                                    <Combobox name="user" options={guests} displayValue={(guests) => user?.name} defaultValue={currentUser}>
                                        {(guests) => (
                                            <ComboboxOption value={guests}>
                                                <ComboboxLabel>{guests.firstName}</ComboboxLabel>
                                                <ComboboxDescription>{guests.email}</ComboboxDescription>
                                            </ComboboxOption>
                                        )}
                                    </Combobox>
                                </Field>
                                {/* preview all selected items  */}
                                {/* add and reduce order item quantity */}
                                <div className="flex items-center justify-between">
                                    <dt className="text-sm text-gray-600">Item Name</dt>
                                    <dd className="text-sm font-medium text-gray-900">$99.00</dd>
                                </div>

                                <div className="flex items-center justify-between">
                                    <dt className="text-sm text-gray-600">Subtotal</dt>
                                    <dd className="text-sm font-medium text-gray-900">$99.00</dd>
                                </div>
                                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                                    <dt className="flex items-center text-sm text-gray-600">
                                        <span>Shipping estimate</span>
                                        <a href="#" className="ml-2 shrink-0 text-gray-400 hover:text-gray-500">
                                            <span className="sr-only">Learn more about how shipping is calculated</span>
                                            <QuestionMarkCircleIcon aria-hidden="true" className="size-5" />
                                        </a>
                                    </dt>
                                    <dd className="text-sm font-medium text-gray-900">$5.00</dd>
                                </div>
                                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                                    <dt className="flex text-sm text-gray-600">
                                        <span>Tax estimate</span>
                                        <a href="#" className="ml-2 shrink-0 text-gray-400 hover:text-gray-500">
                                            <span className="sr-only">Learn more about how tax is calculated</span>
                                            <QuestionMarkCircleIcon aria-hidden="true" className="size-5" />
                                        </a>
                                    </dt>
                                    <dd className="text-sm font-medium text-gray-900">$8.32</dd>
                                </div>
                                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                                    <dt className="text-base font-medium text-gray-900">Order total</dt>
                                    <dd className="text-base font-medium text-gray-900">$112.32</dd>
                                </div>
                            </dl>

                            <div className="mt-6">
                                <button
                                    type="submit"
                                    className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-xs hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 focus:outline-hidden"
                                >
                                    Checkout
                                </button>
                            </div>
                        </section>
                    </form>
                )}
            </Formik>


        </>
    );

}
