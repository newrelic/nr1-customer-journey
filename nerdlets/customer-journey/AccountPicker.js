import React from 'react';
import { Dropdown, DropdownItem } from 'nr1';

export default class AccountPicker extends React.PureComponent {
  render() {
    let { account, accounts, setAccount } = this.props;
    const { filter } = this.state || {};

    if (filter && filter.length > 0) {
      const re = new RegExp(filter, 'i');
      accounts = accounts.filter(a => {
        return a.title.match(re);
      });
    }

    return (
      <Dropdown
        title={account.title}
        filterable
        label="Account"
        onChangeFilter={event => this.setState({ filter: event.target.value })}
      >
        {accounts.map(a => {
          return (
            <DropdownItem key={a.id} onClick={() => setAccount(a)}>
              {a.title}
            </DropdownItem>
          );
        })}
      </Dropdown>
    );
  }
}