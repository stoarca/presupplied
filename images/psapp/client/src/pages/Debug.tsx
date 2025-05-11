import React from 'react';
import { UserContext } from '../UserContext';

export let Debug = () => {
  const userContext = React.useContext(UserContext);
  return (
    <div>
      <h1>Debug Information</h1>
      <pre>
        {JSON.stringify({
          userContextExists: userContext !== undefined,
          userContextNull: userContext === null,
          userContextValue: userContext ? 'Has value' : 'No value'
        }, null, 2)}
      </pre>
    </div>
  );
};