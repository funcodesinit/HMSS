import { Field, FieldHookConfig, useField } from 'formik';
import { Label } from '@/components/fieldset';

interface FormikInputProps extends FieldHookConfig<any> {
  label: string;
  name: string;  // make sure name is required
}

export default function FormikFile({ label, name, ...props }: FormikInputProps) {
  return (
    <Field name={name}>
      {({ form, field, meta }: any) => (
        <div>
          <Label>{label}</Label>
          <input
            type="file"
            accept="image/*"
            onChange={async (event) => {
              const file = event.currentTarget.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  form.setFieldValue(name, reader.result); // Set base64 string
                };
                reader.readAsDataURL(file);
              }
            }}
          />
          {meta.touched && meta.error && (
            <div className="text-sm text-red-600 mt-1">{meta.error}</div>
          )}
        </div>
      )}
    </Field>
  );
}
