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
import { getPuzzleById, updatePuzzleById } from 'apiSdk/puzzles';
import { Error } from 'components/error';
import { puzzleValidationSchema } from 'validationSchema/puzzles';
import { PuzzleInterface } from 'interfaces/puzzle';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ProviderInterface } from 'interfaces/provider';
import { getProviders } from 'apiSdk/providers';

function PuzzleEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<PuzzleInterface>(
    () => (id ? `/puzzles/${id}` : null),
    () => getPuzzleById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: PuzzleInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updatePuzzleById(id, values);
      mutate(updated);
      resetForm();
      router.push('/puzzles');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<PuzzleInterface>({
    initialValues: data,
    validationSchema: puzzleValidationSchema,
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
            Edit Puzzle
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
            <FormControl id="description" mb="4" isInvalid={!!formik.errors?.description}>
              <FormLabel>Description</FormLabel>
              <Input type="text" name="description" value={formik.values?.description} onChange={formik.handleChange} />
              {formik.errors.description && <FormErrorMessage>{formik.errors?.description}</FormErrorMessage>}
            </FormControl>
            <FormControl id="solution" mb="4" isInvalid={!!formik.errors?.solution}>
              <FormLabel>Solution</FormLabel>
              <Input type="text" name="solution" value={formik.values?.solution} onChange={formik.handleChange} />
              {formik.errors.solution && <FormErrorMessage>{formik.errors?.solution}</FormErrorMessage>}
            </FormControl>
            <FormControl id="hint" mb="4" isInvalid={!!formik.errors?.hint}>
              <FormLabel>Hint</FormLabel>
              <Input type="text" name="hint" value={formik.values?.hint} onChange={formik.handleChange} />
              {formik.errors.hint && <FormErrorMessage>{formik.errors?.hint}</FormErrorMessage>}
            </FormControl>
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
    entity: 'puzzle',
    operation: AccessOperationEnum.UPDATE,
  }),
)(PuzzleEditPage);
