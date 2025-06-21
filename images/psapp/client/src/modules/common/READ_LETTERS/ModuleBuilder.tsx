import React from 'react';
import {ModuleBuilder as BaseModuleBuilder} from '@src/modules/common/READING/ModuleBuilder';
import {ModuleContext} from '@src/ModuleContext';
import {LETTERS} from '@src/modules/common/READING/util';
import whichLetterIsThis from './which_letter_is_this.wav';

const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'] as const;

export type Variant = typeof letters[number];

interface ModuleBuilderProps {
  variants: readonly Variant[],
  maxScorePerVariant: number,
}

export let ModuleBuilder = ({
  variants, maxScorePerVariant
}: ModuleBuilderProps) => {
  return (props: void) => {
    const moduleContext = React.useContext(ModuleContext);

    const onFailureAudio = React.useCallback(async (variant: Variant) => {
      await moduleContext.playAudio(LETTERS[
        variant.toLowerCase() as keyof typeof LETTERS
      ]);
    }, [moduleContext]);

    return BaseModuleBuilder({
      variants,
      maxScorePerVariant,
      instructionAudio: whichLetterIsThis,
      trainingKmid: 'READ_LETTERS',
      onFailureAudio,
    })(props);
  };
};