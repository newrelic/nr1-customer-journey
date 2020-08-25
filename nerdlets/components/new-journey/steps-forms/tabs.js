import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'nr1';

export default class Tabs extends Component {
  render() {
    const {
      items,
      currentIndex,
      handleOnTabChange,
      handleOnAdd,
      handleOnDelete,
      errorMessage,
      errorIndexes
    } = this.props;

    return (
      <div className="tabs">
        <div className="tabs-container">
          {items.map(({ label }, index) => {
            let tabStyle = 'tab';

            if (errorIndexes?.includes(index)) {
              tabStyle = `${tabStyle} tab--error`;
            }

            if (currentIndex === index) {
              tabStyle = `${tabStyle} tab--active`;
            }

            return (
              <div className={tabStyle} key={index}>
                <p
                  className="tab__name"
                  onClick={() => handleOnTabChange(index)}
                >
                  {label}
                </p>
                <p
                  className="tab__delete"
                  onClick={() => handleOnDelete(index)}
                >
                  <span>&times;</span>
                </p>
              </div>
            );
          })}
          <p className="error-message">{errorMessage}</p>
        </div>
        <Button
          style={{ marginLeft: '25px', minWidth: '85px' }}
          onClick={handleOnAdd}
          type={Button.TYPE.PLAIN_NEUTRAL}
          iconType={Button.ICON_TYPE.DOCUMENTS__DOCUMENTS__FILE__A_ADD}
          sizeType={Button.SIZE_TYPE.SMALL}
          spacingType={[Button.SPACING_TYPE.OMIT, Button.SPACING_TYPE.SMALL]}
        >
          Add new
        </Button>
      </div>
    );
  }
}

Tabs.propTypes = {
  errorIndexes: PropTypes.array,
  items: PropTypes.array,
  currentIndex: PropTypes.number,
  handleOnTabChange: PropTypes.func,
  handleOnAdd: PropTypes.func,
  handleOnDelete: PropTypes.func,
  errorMessage: PropTypes.string
};
