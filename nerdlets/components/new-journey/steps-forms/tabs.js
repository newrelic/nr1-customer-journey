import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'nr1';

export default class Tabs extends Component {
  render() {
    const { items, currentIndex, handleOnTabChange, errorIndexes } = this.props;

    return (
      <div className="tabs-container">
        {items.map(({ label }, index) => (
          <div
            className={`button ${
              errorIndexes?.includes(index) ? 'button--error' : ''
            }`}
            key={index}
          >
            <Button
              onClick={() => handleOnTabChange(index)}
              sizeType={Button.SIZE_TYPE.SMALL}
              type={
                currentIndex === index
                  ? Button.TYPE.NORMAL
                  : Button.TYPE.PLAIN_NEUTRAL
              }
              spacingType={[
                Button.SPACING_TYPE.SMALL,
                Button.SPACING_TYPE.SMALL
              ]}
            >
              {label}
            </Button>
            <p
              className="button__delete"
              onClick={() => console.log('delete stats')}
            >
              <span>&times;</span>
            </p>
          </div>
        ))}
        <Button
          type={Button.TYPE.PLAIN_NEUTRAL}
          iconType={Button.ICON_TYPE.DOCUMENTS__DOCUMENTS__FILE__A_ADD}
          sizeType={Button.SIZE_TYPE.SMALL}
          spacingType={[Button.SPACING_TYPE.OMIT, Button.SPACING_TYPE.SMALL]}
        />
      </div>
    );
  }
}

Tabs.propTypes = {
  errorIndexes: PropTypes.array,
  items: PropTypes.array,
  currentIndex: PropTypes.number,
  handleOnTabChange: PropTypes.func
};
