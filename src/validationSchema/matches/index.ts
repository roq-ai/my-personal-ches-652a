import * as yup from 'yup';

export const matchValidationSchema = yup.object().shape({
  result: yup.string().required(),
  player_one_id: yup.string().nullable(),
  player_two_id: yup.string().nullable(),
  provider_id: yup.string().nullable(),
});
