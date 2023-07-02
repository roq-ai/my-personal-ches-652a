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
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createPuzzle } from 'apiSdk/puzzles';
import { Error } from 'components/error';
import { puzzleValidationSchema } from 'validationSchema/puzzles';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ProviderInterface } from 'interfaces/provider';
import { getProviders } from 'apiSdk/providers';
import { PuzzleInterface } from 'interfaces/puzzle';

function PuzzleCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: PuzzleInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createPuzzle(values);
      resetForm();
      router.push('/puzzles');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<PuzzleInterface>({
    initialValues: {
      description: '',
      solution: '',
      hint: '',
      provider_id: (router.query.provider_id as string) ?? null,
    },
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
            Create Puzzle
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
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
    operation: AccessOperationEnum.CREATE,
  }),
)(PuzzleCreatePage);
