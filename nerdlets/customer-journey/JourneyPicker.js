import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownItem } from 'nr1';

export default class JourneyPicker extends React.PureComponent {
  static propTypes = {
    filter: PropTypes.string,
    journey: PropTypes.object,
    journeys: PropTypes.array,
    setJourney: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let { journey, journeys, setJourney } = this.props;
    const { filter } = this.state;

    if (filter && filter.length > 0) {
      const re = new RegExp(filter, 'i');
      journeys = journeys.filter(j => {
        return j.title.match(re);
      });
    }

    return (
      <Dropdown
        title={journey.title}
        filterable
        label="Journey"
        onChangeFilter={event => this.setState({ filter: event.target.value })}
      >
        {journeys.map((j, index) => {
          return (
            <DropdownItem key={index} onClick={() => setJourney(j)}>
              {j.title}
            </DropdownItem>
          );
        })}
      </Dropdown>
    );
  }
}
