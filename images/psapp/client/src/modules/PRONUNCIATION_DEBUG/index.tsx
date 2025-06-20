import React from 'react';

import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';
import word from '@src/modules/common/READING/words/soil';

export default () => {
  return <ModuleBuilder variants={[word]} maxScorePerVariant={50} />;
};
