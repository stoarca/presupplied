import React from 'react';

import {
  ModuleBuilder as InnerModuleBuilder, Variant
} from '@src/modules/common/READ_WORDS/ModuleBuilder';
import {KNOWLEDGE_MAP} from '@src/../../common/types';
import {buildGraph} from '@src/dependency-graph';

let r = require.context('../../', true, /^\.\/READ_WORDS_(?!REVIEW)[^/]+$/);

let knowledgeGraph = buildGraph(KNOWLEDGE_MAP);
interface ReadWordsReviewProps {
  reviewModule__dirname: string,
}
export let ModuleBuilder = (props: ReadWordsReviewProps) => {
  let url = new URL(window.location.href);
  let admin = url.searchParams.get('admin') === '1';
  let [allWords, setAllWords] = React.useState<Variant[]>([]);
  React.useEffect(() => {
    let moduleName = props.reviewModule__dirname.split('/').at(-1) as string;
    (async () => {
      let allDeps = knowledgeGraph.directDependenciesOf(moduleName);
      let wordModuleDeps: Record<string, string> = {};

      r.keys().forEach((moduleName) => {
        let cleaned = moduleName.substring(2); // remove ./ from start
        if (allDeps.includes(cleaned)) {
          wordModuleDeps[cleaned] = moduleName;
        }
      });

      let arrayOfArrays = [];
      for (let k in wordModuleDeps) {
        arrayOfArrays.push((await r(wordModuleDeps[k])).words);
      }
      setAllWords(arrayOfArrays.flat());
    })();
  }, [props.reviewModule__dirname]);
  if (allWords.length === 0) {
    return <div>loading</div>;
  }
  return <InnerModuleBuilder variants={allWords} maxScorePerVariant={1} pronounceOnSuccess={admin}/>;
};
