import React, { useContext } from 'react';
import Details from './details';
import { PlatformStateContext, NerdletStateContext } from 'nr1';

const DetailsNerdlet = () => {
  const platformUrlState = useContext(PlatformStateContext);
  const nerdletUrlState = useContext(NerdletStateContext);

  return (
    <Details
      platformUrlState={platformUrlState}
      nerdletUrlState={nerdletUrlState}
    />
  );
};

export default DetailsNerdlet;
