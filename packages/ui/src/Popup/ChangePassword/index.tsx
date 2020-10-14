import React, { FC, useContext } from 'react';
import { Box, Button, Flex, Header, Text, TextInput } from '@polymathnetwork/extension-ui/ui';
import { SvgFileLockOutline } from '@polymathnetwork/extension-ui/assets/images/icons';
import { FieldError, useForm } from 'react-hook-form';
import { ActionContext, PolymeshContext } from '../../components';
import { changePassword, validateAccount } from '@polymathnetwork/extension-ui/messaging';

export const ChangePassword: FC = () => {
  const { polymeshAccounts, selectedAccount } = useContext(PolymeshContext);
  const onAction = useContext(ActionContext);
  const { errors, handleSubmit, register, setError } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (data: { [x: string]: string; }) => {
    if (!selectedAccount) { return; }

    if (!polymeshAccounts) { return; }

    const isValidPassword = await validateAccount(selectedAccount, data.currentPassword);

    if (!isValidPassword) {
      setError('currentPassword', { type: 'manual' });

      return;
    }

    if (data.newPassword !== data.confirmPassword) {
      setError('confirmPassword', { type: 'manual' });

      return;
    }

    const changeOps = await Promise.all(polymeshAccounts?.map(async (account) => {
      return changePassword(account.address, data.currentPassword, data.newPassword);
    }));

    // If an account password was not changed, revert
    if (changeOps.find((item) => !item)) {
      await Promise.all(polymeshAccounts?.map(async (account) => {
        return changePassword(account.address, data.newPassword, data.currentPassword);
      }));
    }

    onAction('/');
  };

  return (
    <>
      <Header headerText='Change password'
        iconAsset={SvgFileLockOutline}>
      </Header>
      <form id='passwordForm'
        onSubmit={handleSubmit(onSubmit)}>
        <Box mt='m'>
          <Box>
            <Text color='gray.1'
              variant='b2m'>
              Current password
            </Text>
          </Box>
          <Box>
            <TextInput inputRef={register({ required: true, minLength: 8 })}
              name='currentPassword'
              placeholder='Enter 8 characters or more'
              type='password' />
            {errors.currentPassword &&
              <Box>
                <Text color='alert'
                  variant='b3'>
                  {(errors.currentPassword as FieldError).type === 'required' && 'Required field'}
                  {(errors.currentPassword as FieldError).type === 'minLength' && 'Password too short'}
                  {(errors.currentPassword as FieldError).type === 'manual' && 'Invalid password'}
                </Text>
              </Box>
            }
          </Box>
        </Box>
        <Box mt='m'>
          <Box>
            <Text color='gray.1'
              variant='b2m'>
              New password
            </Text>
          </Box>
          <Box>
            <TextInput inputRef={register({ required: true, minLength: 8 })}
              name='newPassword'
              placeholder='Enter 8 characters or more'
              type='password' />
            {errors.newPassword &&
              <Box>
                <Text color='alert'
                  variant='b3'>
                  {(errors.newPassword as FieldError).type === 'required' && 'Required field'}
                  {(errors.newPassword as FieldError).type === 'minLength' && 'Password too short'}
                  {(errors.newPassword as FieldError).type === 'manual' && 'Invalid password'}
                </Text>
              </Box>
            }
          </Box>
        </Box>
        <Box mt='m'>
          <Box>
            <Text color='gray.1'
              variant='b2m'>
              Confirm password
            </Text>
          </Box>
          <Box>
            <TextInput inputRef={register({ required: true, minLength: 8 })}
              name='confirmPassword'
              placeholder='Enter 8 characters or more'
              type='password' />
            {errors.confirmPassword &&
              <Box>
                <Text color='alert'
                  variant='b3'>
                  {(errors.confirmPassword as FieldError).type === 'required' && 'Required field'}
                  {(errors.confirmPassword as FieldError).type === 'minLength' && 'Password too short'}
                  {(errors.confirmPassword as FieldError).type === 'manual' && 'Passwords do not match'}
                </Text>
              </Box>
            }
          </Box>
        </Box>
      </form>
      <Flex flex={1}
        flexDirection='column'
        justifyContent='flex-end'
        mb='s'
        mx='xs'>
        <Button
          fluid
          form='passwordForm'
          type='submit'>
          Change password
        </Button>
      </Flex>
    </>
  );
};