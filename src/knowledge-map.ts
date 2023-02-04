import {DepGraph} from './dependency-graph';

interface GraphNode {
  id: string,
  deps?: string[],
  i: number,
  j: number,
}

interface GraphJson {
  nodes: GraphNode[],
}

export const buildGraph = (graphJson: GraphJson) => {
  let graph = new DepGraph();

  for (let i = 0; i < graphJson.nodes.length; ++i) {
    let node = graphJson.nodes[i];
    graph.addNode(node.id);
    graph.setNodeData(node.id, {
      i: node.i,
      j: node.j,
    });
  }
  for (let i = 0; i < graphJson.nodes.length; ++i) {
    let node = graphJson.nodes[i];
    if (!node.deps) {
      continue;
    }

    for (let j = 0; j < node.deps.length; ++j) {
      if (!graph.hasNode(node.deps[j])) {
        throw new Error(
          node.id + ' has dep on ' + node.deps[j] + ' which does not exist!'
        );
      }
      graph.addDependency(node.id, node.deps[j]);
    }
  }
  return graph;
};

export const KMID = {
  // You can add constants here, but exiting ones MUST NEVER BE CHANGED.
  // They are used to keep the state of the knowledge map in sync, potentially
  // across versions. So they must not change since that may break compatibility
  // when something is upgraded.
  REPEAT_VOWEL_SOUNDS: '',
  REPEAT_CONSONANT_SOUNDS: '',
  REPEAT_SOUNDS: '',
  RECOGNIZE_SIMPLE_OBJECTS: '',
  RECOGNIZE_SIMPLE_CONCEPTS: '',
  SPEAK_SIMPLE_OBJECTS: '',
  SPEAK_SIMPLE_CONCEPTS: '',
  RECOGNIZE_OPPOSITES: '',
  SPEAK_OPPOSITES: '',
  REPEAT_VOWELS: '',
  REPEAT_CONSONANTS: '',
  REPEAT_LETTERS: '',
  SING_ALPHABET: '',
  READ_LOWERCASE_VOWELS: '',
  READ_LOWERCASE_CONSONANTS: '',
  READ_LOWERCASE_LETTERS: '',
  READ_UPPERCASE_VOWELS: '',
  READ_UPPERCASE_CONSONANTS: '',
  READ_UPPERCASE_LETTERS: '',
  READ_LETTERS: '',
  FIND_LETTERS_ON_KEYBOARD: '',
};
for (let k in KMID) {
  KMID[k as keyof typeof KMID] = k;
}

let graph = new DepGraph();

graph.addNodeX(KMID.REPEAT_VOWEL_SOUNDS);

graph.addNodeX(KMID.REPEAT_CONSONANT_SOUNDS);

graph.addNodeX(KMID.REPEAT_SOUNDS, [
  KMID.REPEAT_VOWEL_SOUNDS,
  KMID.REPEAT_CONSONANT_SOUNDS,
]);

graph.addNodeX(KMID.RECOGNIZE_SIMPLE_OBJECTS);

graph.addNodeX(KMID.SPEAK_SIMPLE_OBJECTS, [
  KMID.REPEAT_SOUNDS,
  KMID.RECOGNIZE_SIMPLE_OBJECTS,
]);

graph.addNodeX(KMID.RECOGNIZE_SIMPLE_CONCEPTS, [
  KMID.RECOGNIZE_SIMPLE_OBJECTS
]);

graph.addNodeX(KMID.SPEAK_SIMPLE_CONCEPTS, [
  KMID.SPEAK_SIMPLE_OBJECTS,
  KMID.RECOGNIZE_SIMPLE_CONCEPTS,
]);

graph.addNodeX(KMID.RECOGNIZE_OPPOSITES, [
  KMID.RECOGNIZE_SIMPLE_CONCEPTS,
]);

graph.addNodeX(KMID.SPEAK_OPPOSITES, [
  KMID.RECOGNIZE_OPPOSITES,
  KMID.SPEAK_SIMPLE_CONCEPTS,
]);

graph.addNodeX(KMID.REPEAT_VOWELS, [
  KMID.REPEAT_VOWEL_SOUNDS,
]);

graph.addNodeX(KMID.REPEAT_CONSONANTS, [
  KMID.REPEAT_CONSONANT_SOUNDS,
]);

graph.addNodeX(KMID.REPEAT_LETTERS, [
  KMID.REPEAT_VOWELS, KMID.REPEAT_CONSONANTS,
]);

graph.addNodeX(KMID.SING_ALPHABET, [
  KMID.REPEAT_LETTERS,
]);

graph.addNodeX(KMID.READ_LOWERCASE_VOWELS, [
  KMID.REPEAT_VOWELS,
]);

graph.addNodeX(KMID.READ_LOWERCASE_CONSONANTS, [
  KMID.REPEAT_CONSONANTS,
]);

graph.addNodeX(KMID.READ_LOWERCASE_LETTERS, [
  KMID.READ_LOWERCASE_VOWELS, KMID.READ_LOWERCASE_CONSONANTS,
]);

graph.addNodeX(KMID.READ_UPPERCASE_VOWELS, [
  KMID.REPEAT_VOWELS,
]);

graph.addNodeX(KMID.READ_UPPERCASE_CONSONANTS, [
  KMID.REPEAT_CONSONANTS,
]);

graph.addNodeX(KMID.READ_UPPERCASE_LETTERS, [
  KMID.READ_UPPERCASE_VOWELS, KMID.READ_UPPERCASE_CONSONANTS,
]);

graph.addNodeX(KMID.READ_LETTERS, [
  KMID.READ_LOWERCASE_LETTERS, KMID.READ_UPPERCASE_LETTERS,
]);

graph.addNodeX(KMID.FIND_LETTERS_ON_KEYBOARD, [
  KMID.READ_LETTERS,
]);

export const KM = graph;
