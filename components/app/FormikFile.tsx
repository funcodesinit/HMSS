import { useField } from 'formik';
import { Input } from '@/components/input'
import { Text, } from '@/components/text'
import { Field, Label } from '@/components/fieldset'

export default function FormikInput({ label, ...props }) {
    const [field, meta] = useField(props);
    return (
        <Field name="thumb">
            {({ form }) => (
                <div>
                    <Label>Product Image</Label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={async (event) => {
                            const file = event.currentTarget.files?.[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                    form.setFieldValue("thumb", reader.result); // Set base64 string
                                };
                                reader.readAsDataURL(file);
                            }
                        }}
                    />
                    {form.errors.thumb && (
                        <div className="text-sm text-red-600 mt-1">{form.errors.thumb}</div>
                    )}
                </div>
            )}
        </Field>

    );
}
