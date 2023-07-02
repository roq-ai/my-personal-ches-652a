import * as yup from 'yup';

export const lessonValidationSchema = yup.object().shape({
  title: yup.string().required(),
  content: yup.string().required(),
  skill_level: yup.string().required(),
  provider_id: yup.string().nullable(),
});
