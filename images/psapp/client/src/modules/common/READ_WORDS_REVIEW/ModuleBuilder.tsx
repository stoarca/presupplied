import React from 'react';

import {
  ModuleBuilder as InnerModuleBuilder, Variant
} from '@src/modules/common/READ_WORDS/ModuleBuilder';
import {KNOWLEDGE_MAP} from '@src/../../common/types';
import {buildGraph} from '@src/dependency-graph';
import {useModuleName} from '@src/hooks/useModuleName';

let knowledgeGraph = buildGraph(KNOWLEDGE_MAP);

export let ModuleBuilder = () => {
  let url = new URL(window.location.href);
  let admin = url.searchParams.get('admin') === '1';
  let [allWords, setAllWords] = React.useState<Variant[]>([]);
  let moduleName = useModuleName();

  React.useEffect(() => {
    (async () => {
      let allDeps = knowledgeGraph.directDependenciesOf(moduleName);

      // Filter to only READ_WORDS modules (excluding REVIEW modules)
      let wordModuleDeps = allDeps.filter((dep: string) =>
        dep.startsWith('READ_WORDS_') && !dep.includes('REVIEW')
      );

      let arrayOfArrays = [];
      for (let dep of wordModuleDeps) {
        try {
          // Use dynamic import instead of require.context
          const module = await import(`../../${dep}/index.tsx`);
          if (module.words) {
            arrayOfArrays.push(module.words);
          }
        } catch (error) {
          console.warn(`Failed to load module ${dep}:`, error);
        }
      }
      setAllWords(arrayOfArrays.flat());
    })();
  }, [moduleName]);

  if (allWords.length === 0) {
    return <div>loading</div>;
  }

  return <InnerModuleBuilder variants={allWords} maxScorePerVariant={1} pronounceOnSuccess={admin}/>;
};
