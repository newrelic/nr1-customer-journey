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
      <div className="tabs-container">
        {items.map(({ label }, index) => {
          let buttonStyle = 'button';

          if (errorIndexes?.includes(index)) {
            buttonStyle = `${buttonStyle} button--error`;
          }

          if (currentIndex === index) {
            buttonStyle = `${buttonStyle} button--active`;
          }

          return (
            <div className={buttonStyle} key={index}>
              <p
                className="button__name"
                onClick={() => handleOnTabChange(index)}
              >
                {label}
              </p>
              <p
                className="button__delete"
                onClick={() => handleOnDelete(index)}
              >
                <span>&times;</span>
              </p>
            </div>
          );
        })}
        <Button
          onClick={handleOnAdd}
          type={Button.TYPE.PLAIN_NEUTRAL}
          iconType={Button.ICON_TYPE.DOCUMENTS__DOCUMENTS__FILE__A_ADD}
          sizeType={Button.SIZE_TYPE.SMALL}
          spacingType={[Button.SPACING_TYPE.OMIT, Button.SPACING_TYPE.SMALL]}
        />
        <p className="error-message">{errorMessage}</p>
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
