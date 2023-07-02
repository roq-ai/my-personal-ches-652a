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
import { createLesson } from 'apiSdk/lessons';
import { Error } from 'components/error';
import { lessonValidationSchema } from 'validationSchema/lessons';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ProviderInterface } from 'interfaces/provider';
import { getProviders } from 'apiSdk/providers';
import { LessonInterface } from 'interfaces/lesson';

function LessonCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: LessonInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createLesson(values);
      resetForm();
      router.push('/lessons');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<LessonInterface>({
    initialValues: {
      title: '',
      content: '',
      skill_level: '',
      provider_id: (router.query.provider_id as string) ?? null,
    },
    validationSchema: lessonValidationSchema,
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
            Create Lesson
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
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
          <FormControl id="skill_level" mb="4" isInvalid={!!formik.errors?.skill_level}>
            <FormLabel>Skill Level</FormLabel>
            <Input type="text" name="skill_level" value={formik.values?.skill_level} onChange={formik.handleChange} />
            {formik.errors.skill_level && <FormErrorMessage>{formik.errors?.skill_level}</FormErrorMessage>}
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
    entity: 'lesson',
    operation: AccessOperationEnum.CREATE,
  }),
)(LessonCreatePage);
