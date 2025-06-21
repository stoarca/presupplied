import React from 'react';
import {ModuleBuilder} from '@src/modules/common/READING/ModuleBuilder';
import {ModuleContext} from '@src/ModuleContext';
import {DIGITS} from '@src/modules/common/READING/util';
import whichDigitIsThis from './which_digit_is_this.wav';

const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;

export default (() => {
  return (props: void) => {
    const moduleContext = React.useContext(ModuleContext);

    const onFailureAudio = React.useCallback(async (variant: typeof digits[number]) => {
      await moduleContext.playAudio(DIGITS[variant]);
    }, [moduleContext]);

    return ModuleBuilder({
      variants: digits,
      maxScorePerVariant: 3,
      instructionAudio: whichDigitIsThis,
      trainingKmid: 'READ_DIGITS',
      onFailureAudio,
    })(props);
  };
})();
