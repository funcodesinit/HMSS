import { Combobox, ComboboxLabel, ComboboxOption } from '@/components/combobox'
import { ErrorMessage, Field, Label } from '@/components/fieldset'

export default function ComboboxComp({ users }) {
  return (
    <Field>
      <Label>Assigned to</Label>
      <Combobox
        invalid
        name="user"
        options={users}
        displayValue={(user) => user?.firstName + ' ' + user?.lastName}
        placeholder="Select user&hellip;"
      >
        {(user) => (
          <ComboboxOption value={user?.id} key={user.id}>
            <ComboboxLabel>{user?.firstName}</ComboboxLabel>
          </ComboboxOption>
        )}
      </Combobox>
      <ErrorMessage>A user is required.</ErrorMessage>
    </Field>
  )
}