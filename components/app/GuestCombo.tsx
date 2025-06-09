// 'use client';
// import { Combobox, ComboboxDescription, ComboboxLabel, ComboboxOption } from '@/components/combobox';
// import { useField } from 'formik';

// interface Guest {
//   id: number | string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   [key: string]: any;
// }

// interface GuestSelectComboboxProps {
//   name: string;
//   options: Guest[];
//   displayValue?: (guest: Guest) => string;
// }

// const GuestSelectCombobox = ({ name, options, displayValue }: GuestSelectComboboxProps) => {
//   const [field, meta, helpers] = useField(name);

//   return (
//     <Combobox
//       options={options}
//       displayValue={displayValue}
//       value={options?.find((g) => g.id === field.value) || null}
//       onChange={(guest) => helpers.setValue(guest?.id || '')}
//       defaultValue={options[0]}
//     >
//       {(guests) => (
//         <ComboboxOption value={guests}>
//           <ComboboxLabel>{guests.firstName} {guests.lastName}</ComboboxLabel>
//           <ComboboxDescription>{guests.email}</ComboboxDescription>
//         </ComboboxOption>
//       )}
//     </Combobox>
//   );
// };


// export default GuestSelectCombobox


'use client';

import {
  Combobox,
  ComboboxDescription,
  ComboboxLabel,
  ComboboxOption,
} from '@/components/combobox';
import { useField } from 'formik';

 
interface GuestSelectComboboxProps {
  name: string;
  options: any[];
  displayValue: (guest: any) => string;
}

const GuestSelectCombobox = ({
  name,
  options,
  displayValue,
}: GuestSelectComboboxProps) => {
  const [field, , helpers] = useField<string | number>(name);

  return (
    <Combobox
      options={options}
      displayValue={displayValue}
      value={options.find((g:any) => g.id === field.value) || null}
      onChange={(guest: any | null) => helpers.setValue(guest?.id || '')}
      defaultValue={options[0]}
    >
      {(guest: any) => (
        <ComboboxOption value={guest}>
          <ComboboxLabel>
            {guest.firstName} {guest.lastName}
          </ComboboxLabel>
          <ComboboxDescription>{guest.email}</ComboboxDescription>
        </ComboboxOption>
      )}
    </Combobox>
  );
};

export default GuestSelectCombobox;
