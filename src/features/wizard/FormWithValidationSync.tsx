import { RefObject, useEffect } from 'react';
import { FormSchema } from '@/src/features/forms/FormSchema';
import {
  FormWithValidation,
  FormWithValidationRef,
} from '@/src/features/forms/FormWithValidation';
import { AnyCantFix } from '@/src/utils/Types';

interface FormWithValidationSyncProps {
  formSchema: FormSchema<AnyCantFix>;
  defaultValues?: AnyCantFix;
  onSubmit: (
    values: AnyCantFix,
    requestErrorCallback: (msg: string) => void
  ) => void;
  onWatch?: (values: AnyCantFix, info: { name?: string }) => void;
  formRef: RefObject<FormWithValidationRef | null>;
}

// FormWithValidationSync - Une étape n'est montée dans le DOM que lorsqu'elle
// devient l'étape courante (WizardRunShell remonte le contenu à chaque navigation).
// S'abonner à watch() depuis un effet du hook d'étape ne fonctionne donc pas : cet
// effet tourne dès le premier rendu du hook (appelé inconditionnellement, règles des
// hooks), bien avant que cette étape ne soit affichée et que son ref ne soit peuplé.
// Ce composant s'abonne depuis SON PROPRE montage, garanti de coïncider avec celui
// du formulaire qu'il enveloppe.
export function FormWithValidationSync({
  formSchema,
  defaultValues,
  onSubmit,
  onWatch,
  formRef,
}: FormWithValidationSyncProps) {
  useEffect(() => {
    if (!onWatch) {
      return;
    }
    const subscription = formRef.current?.watch(onWatch);
    return () => subscription?.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FormWithValidation
      formSchema={formSchema}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      noFooter
      innerRef={formRef}
    />
  );
}
