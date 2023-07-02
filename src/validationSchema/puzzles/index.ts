import * as yup from 'yup';

export const puzzleValidationSchema = yup.object().shape({
  description: yup.string().required(),
  solution: yup.string().required(),
  hint: yup.string(),
  provider_id: yup.string().nullable(),
});
