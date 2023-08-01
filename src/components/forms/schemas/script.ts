import { FormSchema } from '../FormSchema';

export function reformat(formSchema: FormSchema) {
  const mutatedFormSchema: FormSchema = {
    id: formSchema.id,
    fields: formSchema.fields.reduce((acc, curr) => {
      const isRequiredRule = formSchema.rules.find((singleRule) => {
        return singleRule.field === curr.name && singleRule.isRequired;
      });
      const rules = formSchema.rules
        .filter((singleRule) => {
          return singleRule.field === curr.name && !singleRule.isRequired;
        })
        .map((singleRule) => {
          const { field, ...singleRuleWithoutField } = singleRule;
          return singleRuleWithoutField;
        });
      return [
        ...acc,
        {
          ...curr,
          ...(isRequiredRule ? { isRequired: isRequiredRule.isRequired } : {}),
          ...(rules ? { rules } : {}),
        },
      ];
    }, []),
    rules: [],
  };

  console.log(mutatedFormSchema);
}
