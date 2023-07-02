import { useState } from 'react';
import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  Text,
  Button,
  Link,
  IconButton,
  Flex,
  Center,
} from '@chakra-ui/react';
import useSWR from 'swr';
import { Spinner } from '@chakra-ui/react';
import { getMatches, deleteMatchById } from 'apiSdk/matches';
import { MatchInterface } from 'interfaces/match';
import { Error } from 'components/error';
import {
  AccessOperationEnum,
  AccessServiceEnum,
  useAuthorizationApi,
  requireNextAuth,
  withAuthorization,
} from '@roq/nextjs';
import { useRouter } from 'next/router';
import { FiTrash, FiEdit2 } from 'react-icons/fi';
import { compose } from 'lib/compose';

function MatchListPage() {
  const { hasAccess } = useAuthorizationApi();
  const { data, error, isLoading, mutate } = useSWR<MatchInterface[]>(
    () => '/matches',
    () =>
      getMatches({
        relations: ['user_match_player_one_idTouser', 'user_match_player_two_idTouser', 'provider'],
      }),
  );
  const router = useRouter();
  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteMatchById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const handleView = (id: string) => {
    if (hasAccess('match', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)) {
      router.push(`/matches/view/${id}`);
    }
  };

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Flex justifyContent="space-between" mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Match
          </Text>
          {hasAccess('match', AccessOperationEnum.CREATE, AccessServiceEnum.PROJECT) && (
            <NextLink href={`/matches/create`} passHref legacyBehavior>
              <Button onClick={(e) => e.stopPropagation()} colorScheme="blue" mr="4" as="a">
                Create
              </Button>
            </NextLink>
          )}
        </Flex>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {deleteError && (
          <Box mb={4}>
            <Error error={deleteError} />{' '}
          </Box>
        )}
        {isLoading ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>result</Th>
                  {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                    <Th>user_match_player_one_idTouser</Th>
                  )}
                  {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                    <Th>user_match_player_two_idTouser</Th>
                  )}
                  {hasAccess('provider', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>provider</Th>}

                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((record) => (
                  <Tr cursor="pointer" onClick={() => handleView(record.id)} key={record.id}>
                    <Td>{record.result}</Td>
                    {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link as={NextLink} href={`/users/view/${record.user_match_player_one_idTouser?.id}`}>
                          {record.user_match_player_one_idTouser?.email}
                        </Link>
                      </Td>
                    )}
                    {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link as={NextLink} href={`/users/view/${record.user_match_player_two_idTouser?.id}`}>
                          {record.user_match_player_two_idTouser?.email}
                        </Link>
                      </Td>
                    )}
                    {hasAccess('provider', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link as={NextLink} href={`/providers/view/${record.provider?.id}`}>
                          {record.provider?.name}
                        </Link>
                      </Td>
                    )}

                    <Td>
                      {hasAccess('match', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                        <NextLink href={`/matches/edit/${record.id}`} passHref legacyBehavior>
                          <Button
                            onClick={(e) => e.stopPropagation()}
                            mr={2}
                            as="a"
                            variant="outline"
                            colorScheme="blue"
                            leftIcon={<FiEdit2 />}
                          >
                            Edit
                          </Button>
                        </NextLink>
                      )}
                      {hasAccess('match', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(record.id);
                          }}
                          colorScheme="red"
                          variant="outline"
                          aria-label="edit"
                          icon={<FiTrash />}
                        />
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
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
    operation: AccessOperationEnum.READ,
  }),
)(MatchListPage);
