import React, { Component } from 'react';
import { Button } from 'nr1';

export default class Tabs extends Component {
  render() {
    const { items, currentIndex, handleOnTabChange } = this.props;

    return (
      <div className="tabs-container">
        {items.map(({ label }, index) => (
          <div className="button" key={index}>
            <Button
              // onClick={() => this.setState({ currentIndex: index })}
              onClick={() => handleOnTabChange(index)}
              sizeType={Button.SIZE_TYPE.SMALL}
              type={
                currentIndex === index
                  ? Button.TYPE.PLAIN
                  : Button.TYPE.PLAIN_NEUTRAL
              }
              spacingType={[
                Button.SPACING_TYPE.OMIT,
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
