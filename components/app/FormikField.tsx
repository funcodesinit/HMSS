import { useField } from 'formik';
import { Input } from '@/components/input'
import { Text, } from '@/components/text'
import { Field,  Label } from '@/components/fieldset'

export default function FormikInput({ label, ...props }) {
  const [field, meta] = useField(props); 
  return (
    <Field>
      <Label className='capitalize bold'>{label}</Label>
      <Input {...field} {...props} />
      {meta.touched && meta.error && (
        <p className="text-red-500 text-sm">{meta.error}</p>
      )}
    </Field>
  );
}
