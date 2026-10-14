import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import {
  AccountsQuery,
  Dropdown,
  DropdownItem,
  UserStorageMutation,
  UserStorageQuery,
  TextField
} from 'nr1';

const USER_ACCOUNT_COLLECTION = 'user_account_collection_v1';
const USER_SELECTED_ACCOUNT_ID = 'user_account_id';

const getLastChosenAccountId = async () => {
  // TODO: Add error handling
  const { data } = await UserStorageQuery.query({
    collection: USER_ACCOUNT_COLLECTION,
    documentId: USER_SELECTED_ACCOUNT_ID
  });
  return data?.account;
};

const saveLastChosenAccountId = accountId =>
  UserStorageMutation.mutate({
    actionType: UserStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
    collection: USER_ACCOUNT_COLLECTION,
    document: { account: accountId },
    documentId: USER_SELECTED_ACCOUNT_ID
  });

const AccountPicker = ({ accountChangedCallback, disabled }) => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState({ name: '' });
  const [filter, setFilter] = useState('');

  const selectAccount = async account => {
    saveLastChosenAccountId(account.id);
    if (accountChangedCallback) {
      await accountChangedCallback(account.id);
    }
    setSelectedAccount(account);
  };

  useEffect(() => {
    const loadAccounts = async () => {
      const { data } = await AccountsQuery.query({});
      if (!data) return;

      setAccounts(data);
      const lastChosenAccountId = await getLastChosenAccountId();
      const account =
        data.find(({ id }) => id === lastChosenAccountId) || data[0];
      if (account) {
        selectAccount(account);
      }
    };
    loadAccounts();
    // Only runs on mount; the initial selection is made once.
  }, []);

  if (disabled) {
    return <TextField disabled label="Account" value={selectedAccount.name} />;
  }

  const filteredAccounts = filter
    ? accounts.filter(({ name }) =>
        name.toLowerCase().includes(filter.toLowerCase())
      )
    : accounts;

  return (
    <Dropdown
      title={selectedAccount.name}
      label="Account"
      items={filteredAccounts}
      search={filter}
      onSearch={event => setFilter(event.target.value)}
    >
      {({ item }) => (
        <DropdownItem
          key={item.id}
          onClick={() => {
            setFilter('');
            selectAccount(item);
          }}
        >
          {item.name}
        </DropdownItem>
      )}
    </Dropdown>
  );
};

AccountPicker.propTypes = {
  accountChangedCallback: PropTypes.func,
  disabled: PropTypes.bool
};

export default AccountPicker;
