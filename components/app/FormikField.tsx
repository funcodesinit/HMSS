import { FieldHookConfig, useField } from 'formik';
import { Input } from '@/components/input';
import { Field, Label } from '@/components/fieldset'

interface FormikInputProps extends FieldHookConfig<string> {
  label: string;
  placeholder?: string;
  type?: string;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  value?: string | number;
  defaultValue?: string | number;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  readOnly?: boolean;
  step?: string | number;
  rows?: number;
  cols?: number;
  max?: string | number;
  min?: string | number;
  size?: number;
  spellCheck?: boolean;
  inputMode?: 'text' | 'numeric' | 'decimal' | 'email' | 'url' | 'tel' | 'search';
 
}

export default function FormikInput({ label, ...props }: FormikInputProps) {
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
