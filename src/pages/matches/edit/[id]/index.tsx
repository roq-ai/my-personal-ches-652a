import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getMatchById, updateMatchById } from 'apiSdk/matches';
import { Error } from 'components/error';
import { matchValidationSchema } from 'validationSchema/matches';
import { MatchInterface } from 'interfaces/match';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { ProviderInterface } from 'interfaces/provider';
import { getUsers } from 'apiSdk/users';
import { getProviders } from 'apiSdk/providers';

function MatchEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<MatchInterface>(
    () => (id ? `/matches/${id}` : null),
    () => getMatchById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: MatchInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateMatchById(id, values);
      mutate(updated);
      resetForm();
      router.push('/matches');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<MatchInterface>({
    initialValues: data,
    validationSchema: matchValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Match
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="result" mb="4" isInvalid={!!formik.errors?.result}>
              <FormLabel>Result</FormLabel>
              <Input type="text" name="result" value={formik.values?.result} onChange={formik.handleChange} />
              {formik.errors.result && <FormErrorMessage>{formik.errors?.result}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'player_one_id'}
              label={'Select User'}
              placeholder={'Select User'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.email}
                </option>
              )}
            />
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'player_two_id'}
              label={'Select User'}
              placeholder={'Select User'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.email}
                </option>
              )}
            />
            <AsyncSelect<ProviderInterface>
              formik={formik}
              name={'provider_id'}
              label={'Select Provider'}
              placeholder={'Select Provider'}
              fetcher={getProviders}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'match',
    operation: AccessOperationEnum.UPDATE,
  }),
)(MatchEditPage);
