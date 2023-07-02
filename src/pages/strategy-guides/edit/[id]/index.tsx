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
import { getStrategyGuideById, updateStrategyGuideById } from 'apiSdk/strategy-guides';
import { Error } from 'components/error';
import { strategyGuideValidationSchema } from 'validationSchema/strategy-guides';
import { StrategyGuideInterface } from 'interfaces/strategy-guide';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ProviderInterface } from 'interfaces/provider';
import { getProviders } from 'apiSdk/providers';

function StrategyGuideEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<StrategyGuideInterface>(
    () => (id ? `/strategy-guides/${id}` : null),
    () => getStrategyGuideById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: StrategyGuideInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateStrategyGuideById(id, values);
      mutate(updated);
      resetForm();
      router.push('/strategy-guides');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<StrategyGuideInterface>({
    initialValues: data,
    validationSchema: strategyGuideValidationSchema,
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
            Edit Strategy Guide
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
            <FormControl id="title" mb="4" isInvalid={!!formik.errors?.title}>
              <FormLabel>Title</FormLabel>
              <Input type="text" name="title" value={formik.values?.title} onChange={formik.handleChange} />
              {formik.errors.title && <FormErrorMessage>{formik.errors?.title}</FormErrorMessage>}
            </FormControl>
            <FormControl id="content" mb="4" isInvalid={!!formik.errors?.content}>
              <FormLabel>Content</FormLabel>
              <Input type="text" name="content" value={formik.values?.content} onChange={formik.handleChange} />
              {formik.errors.content && <FormErrorMessage>{formik.errors?.content}</FormErrorMessage>}
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
    entity: 'strategy_guide',
    operation: AccessOperationEnum.UPDATE,
  }),
)(StrategyGuideEditPage);
