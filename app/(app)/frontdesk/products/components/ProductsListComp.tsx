'use client'

import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import { Divider } from '@/components/divider'
import { Heading } from '@/components/heading'
import { Input, InputGroup } from '@/components/input'
import { Link } from '@/components/link'
import { Select } from '@/components/select'
import { TableCell, TableRow } from '@/components/table'
import { RootState } from '@/store'
import { MagnifyingGlassIcon } from '@heroicons/react/16/solid'
import { NoSymbolIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import LoadingComp from '../../Loading'
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/dialog'
import { Formik } from 'formik'
import * as Yup from 'yup'
import FormikInput from '@/components/app/FormikField'
import { Description, Field, Label } from '@/components/fieldset'
import { Switch, SwitchField } from '@/components/switch'
import { Textarea } from '@/components/textarea'
import { fetchPublicCategoryList, fetchPublicProductList } from '@/store/actions/productsActions'


export default function ProductsListComp() {
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchPublicCategoryList() as any);
    dispatch(fetchPublicProductList() as any).then(() => setLoading(false));
  }, [dispatch])

  const prod = useSelector((state: RootState) => state.payment.products)
  const selected_product = useSelector((state: RootState) => state.payment.selected_product)
  const category = useSelector((state: RootState) => state.payment.category)

  if (loading) return <LoadingComp />

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-sm:w-full sm:flex-1">
          <Heading>Product Menu</Heading>
          <div className="mt-4 flex max-w-xl gap-4">
            <div className="flex-1">
              <InputGroup>
                <MagnifyingGlassIcon />
                <Input name="search" placeholder="Search products&hellip;" />
              </InputGroup>
            </div>
            <div>
              <Select name="sort_by">
                <option value="all">Select Category</option>
                <option value="date">Sort by date</option>
              </Select>
            </div>
          </div>
        </div>
        <Button type="button" onClick={() => setIsOpen(true)}>
          Add new Product
        </Button>
        <Dialog open={isOpen} onClose={setIsOpen}>
          <Formik

            initialValues={{
              id: selected_product?.id || '',
              thumb: selected_product?.thumb || '',
              name: selected_product?.name || '',
              description: selected_product?.description || '',
              price: selected_product?.price?.toString() || '100',
              discount: selected_product?.discount?.toString() || '1',
              stock: selected_product?.stock?.toString() || '1',
              categoryId: selected_product?.categoryId?.toString() || '',
              isPublished: selected_product?.isPublished || false,
              section: selected_product?.section || 'BAR',

            }}

            validationSchema={
              Yup.object({
                thumb: Yup.string(),
                name: Yup.string().required("Product Name is required."),
                description: Yup.string().required("Product description is required."),
                price: Yup.number().required("Product Price is required."),
                discount: Yup.number(),
                stock: Yup.number().required("Product stock is required."),
                categoryId: Yup.string().required("Category is required."),
                isPublished: Yup.boolean(),
                section: Yup.string()
                  .oneOf(['BAR', 'RESTAURANT', 'KITCHEN'], 'Invalid section')
                  .required('Product section is required'),

              })
            }
            enableReinitialize={true}
            onSubmit={async (values, { setStatus }) => {
              setLoading(true);
              setStatus(null); // Clear any previous status message

              const method = selected_product?.id ? 'PATCH' : 'POST';

              const url = 'products/api';

              const body = {
                id: selected_product?.id,
                thumb: values.thumb,
                name: values.name,
                description: values.description,
                price: values.price,
                discount: values.discount,
                stock: parseInt(values.stock, 10),
                categoryId: parseInt(values.categoryId, 10),
                isPublished: values.isPublished,
                section: values.section,
              };
              try {
                const response = await fetch(url, {
                  method,
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(body),
                });

                const data = await response.json();

                if (!response.ok) {
                  // Handle backend validation or server error
                  const errorMessage = data?.message || 'Failed to create room.';
                  setStatus(errorMessage);
                } else {
                  dispatch(fetchPublicProductList());
                  setIsOpen(false)
                }
              } catch (error) {
                setStatus('Something went wrong while creating the room. Please try again.');
                console.error('Error:', error);
              } finally {
                setLoading(false);
              }
            }}
          >
            {({
              handleSubmit, isSubmitting, errors, handleChange, status, setFieldValue, setStatus, values
            }) => (
              <form method="post" onSubmit={handleSubmit}>
                <DialogTitle> {selected_product?.id ? `Update Product ${selected_product?.name}` : 'Add new Product'}</DialogTitle>
                <DialogDescription>
                  Fill in the form to  {selected_product?.id ? `update Product ${selected_product.name}` : 'add a new product'}
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

                  <Field>
                    <Label>Select Section</Label>
                    <Select name="section" onChange={handleChange}>
                      <option value="BAR">Bar</option>
                      <option value="RESTAURANT">Restaurant</option>
                      <option value="KITCHEN">Kitchen</option>
                    </Select>
                  </Field>
                  <Divider className='my-5' />


                  <Field>
                    <Label>Select Category</Label>
                    <Select name="categoryId" value={values.categoryId} onChange={handleChange}>
                      <option value="">Select Category</option>
                      {category?.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Divider className='my-5' />

                  <Field >

                    <div>
                      <Label>Product Image</Label>
                      <input
                        type="file"
                        accept="image/*"
                        name="thumb"
                        onChange={async (event) => {
                          const file = event.currentTarget.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setFieldValue("thumb", reader.result); // Set base64 string
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      {errors.thumb && (
                        <div className="text-sm text-red-600 mt-1">{errors.thumb}</div>
                      )}
                    </div>

                  </Field>

                  <Divider className='my-5' />
                  {values.thumb && typeof values.thumb === 'string' && values.thumb.startsWith("data:image") && (
                    <img src={values.thumb} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded" />
                  )}
                  <Divider className='my-5' />


                  <FormikInput label={'name'} name="name" placeholder="product name" />
                  <Divider className='my-5' />

                  <Field>
                    <Label htmlFor="description">Product Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={values.description}
                      onChange={handleChange}
                      onBlur={handleChange}
                      placeholder="Enter product details, materials, usage info, etc."
                    />
                    {errors.description && (
                      <div className="mt-1 text-sm text-red-600">{errors.description}</div>
                    )}
                  </Field>

                  <Divider className='my-5' />


                  <FormikInput label={'price'} name="price" placeholder="product price" />
                  <Divider className='my-5' />

                  <FormikInput label={'stock'} name="stock" placeholder="product stock" />
                  <Divider className='my-5' />

                  <FormikInput label={'discount'} name="discount" placeholder="product discount" />
                  <Divider className='my-5' />

                  <SwitchField>
                    <Label>Publish Product</Label>
                    <Description>All published products will be available for orders.</Description>
                    <Switch name="isPublished" />
                  </SwitchField>

                  <Divider className='my-5' />

                </DialogBody>
                <DialogActions>
                  <Button plain onClick={() => {
                    setIsOpen(false);
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
      <ul className="mt-10">
        {prod?.length < 1 && (
          <TableRow className="h-24 text-start" colSpan={5}>
            <TableCell className='text-lg text-pink-500 flex items-center flex-row gap-2'><span>No products found</span> <NoSymbolIcon className='size-4' /></TableCell>
          </TableRow>)
        }
        {prod?.map((product, index) => (
          <li key={product.id}>
            <Divider soft={index > 0} />
            <div className="flex items-center justify-between">
              <div key={product.id} className="flex gap-6 py-6">
                <div className="w-32 shrink-0">

                  <img className="aspect-3/2 rounded-lg shadow-sm" src={product?.thumb||'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLkN4VsHXmLN4YHMbn5TJyPO0_SgQWvx8aQmJyJpvaTHaONr52X-T0WmR8QR_JXZmmrww&usqp=CAU'} alt="" />

                </div>
                <div className="space-y-1.5">
                  <div className="text-base/6 font-semibold">
                    {product.name}
                  </div>
                  <div className="text-xs/6 text-zinc-500">
                    BWP {product?.price}
                  </div>
                  <div className="text-xs/6 text-zinc-600">
                    {product?.createdAt}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge className="max-sm:hidden" color={!product?.isPublished ? 'lime' : 'zinc'}>
                  Published
                </Badge>

                <Link href={`/frontdesk/products/${product?.id}`}>
                  View
                </Link>

              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
