  'use client';
  import { Combobox, ComboboxDescription, ComboboxLabel, ComboboxOption } from '@/components/combobox';
  import { useField } from 'formik';

  const GuestSelectCombobox = ({ name, options, displayValue }) => {
    const [field, meta, helpers] = useField(name);

    return (
      <Combobox
        options={options}
        displayValue={displayValue}
        value={options.find((g) => g.id === field.value) || null}
        onChange={(guest) => helpers.setValue(guest?.id || '')}
        defaultValue={options[0]}
      >
        {(guests) => (
          <ComboboxOption value={guests}>
            <ComboboxLabel>{guests.firstName} {guests.lastName}</ComboboxLabel>
            <ComboboxDescription>{guests.email}</ComboboxDescription>
          </ComboboxOption>
        )}
      </Combobox>
    );
  };


  export default GuestSelectCombobox
    