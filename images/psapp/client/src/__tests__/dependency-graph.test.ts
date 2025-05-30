import { buildGraph } from '../dependency-graph';
import { GraphJson, UserType, ModuleType } from '../../../common/types';

interface TestModuleSpec {
  id: string;
  moduleType: ModuleType;
  deps: string[];
}

function createTestKnowledgeMap(specs: TestModuleSpec[]): GraphJson {
  return {
    nodes: specs.map((spec, index) => ({
      id: spec.id,
      title: spec.id,
      description: `${spec.id} module`,
      studentVideos: [],
      teacherVideos: [],
      moduleType: spec.moduleType,
      cell: { i: Math.floor(index / 3), j: index % 3 },
      deps: spec.deps
    }))
  };
}

const testKnowledgeMap = createTestKnowledgeMap([
  { id: 'INTRO', moduleType: ModuleType.ADULT_OWNED, deps: [] },
  { id: 'CALIBRATION', moduleType: ModuleType.CHILD_DELEGATED, deps: ['INTRO'] },
  { id: 'EYES_FACES', moduleType: ModuleType.CHILD_DELEGATED, deps: ['CALIBRATION'] },
  { id: 'CHILD_ONLY', moduleType: ModuleType.CHILD_OWNED, deps: ['CALIBRATION'] },
  { id: 'ADVANCED_CHILD', moduleType: ModuleType.CHILD_OWNED, deps: ['CHILD_ONLY', 'EYES_FACES'] }
]);

describe('dependency-graph getReachable', () => {
  const knowledgeGraph = buildGraph(testKnowledgeMap);

  test('anonymous user with no progress should see all starting modules', () => {
    const anonymousReached = new Set<string>();
    const result = knowledgeGraph.getReachables('hybrid', anonymousReached);

    // Anonymous users should see all modules with no dependencies
    expect(result.reachable).toEqual(new Set(['INTRO']));
    expect(result.childrenReachableSets.size).toBe(0);
  });

  test('anonymous user with some progress should see all reachable modules', () => {
    const anonymousReached = new Set(['INTRO', 'CALIBRATION']);
    const result = knowledgeGraph.getReachables('hybrid', anonymousReached);

    // Anonymous users should see all modules they can reach regardless of type
    expect(result.reachable).toEqual(new Set(['EYES_FACES', 'CHILD_ONLY']));
    expect(result.childrenReachableSets.size).toBe(0);
  });

  test('parent with no progress should only see INTRO', () => {
    const parentReached = new Set<string>();
    const result = knowledgeGraph.getReachables(UserType.PARENT, parentReached);

    expect(result.reachable).toEqual(new Set(['INTRO']));
    expect(result.childrenReachableSets.size).toBe(0);
  });

  test('student with no progress should see nothing', () => {
    const studentReached = new Set<string>();
    const result = knowledgeGraph.getReachables(UserType.STUDENT, studentReached);

    expect(result.reachable).toEqual(new Set([]));
    expect(result.childrenReachableSets.size).toBe(0);
  });

  test('parent with INTRO completed and no kids should see nothing', () => {
    const parentReached = new Set(['INTRO']);
    const result = knowledgeGraph.getReachables(UserType.PARENT, parentReached);

    expect(result.reachable).toEqual(new Set([]));
    expect(result.childrenReachableSets.size).toBe(0);
  });

  test('parent with INTRO and empty kids should see CALIBRATION', () => {
    const parentReached = new Set(['INTRO']);
    const childrenReachedSets = new Map([
      [1, new Set([])]
    ]);
    const result = knowledgeGraph.getReachables(
      UserType.PARENT, parentReached, childrenReachedSets
    );

    expect(result.reachable).toEqual(new Set(['CALIBRATION']));
    expect(result.childrenReachableSets.size).toBe(1);
    expect(result.childrenReachableSets.get(1)).toEqual(new Set(['CALIBRATION']));
  });

  test('parent with children should include child delegated modules', () => {
    const parentReached = new Set(['INTRO']);
    const childrenReachedSets = new Map([
      [1, new Set(['CALIBRATION'])]
    ]);
    const result = knowledgeGraph.getReachables(
      UserType.PARENT, parentReached, childrenReachedSets
    );

    expect(result.reachable).toEqual(new Set(['EYES_FACES']));
    expect(result.childrenReachableSets.size).toBe(1);
    expect(result.childrenReachableSets.get(1)).toEqual(new Set(['EYES_FACES', 'CHILD_ONLY']));
  });

  test('parent without INTRO should not see child delegated modules even if child can reach them', () => {
    const parentReached = new Set<string>();
    const childrenReachedSets = new Map([
      [1, new Set(['CALIBRATION'])]
    ]);

    const result = knowledgeGraph.getReachables(UserType.PARENT, parentReached, childrenReachedSets);

    expect(result.reachable).toEqual(new Set(['INTRO']));
    expect(result.childrenReachableSets.size).toBe(1);
    expect(result.childrenReachableSets.get(1)).toEqual(new Set(['EYES_FACES', 'CHILD_ONLY']));
  });

  test('parent with advanced child progress should see appropriate modules', () => {
    const parentReached = new Set(['INTRO']);
    const childrenReachedSets = new Map([
      [1, new Set(['CALIBRATION', 'EYES_FACES', 'CHILD_ONLY'])]
    ]);

    const result = knowledgeGraph.getReachables(
      UserType.PARENT, parentReached, childrenReachedSets
    );

    expect(result.reachable).toEqual(new Set([]));
    expect(result.childrenReachableSets.size).toBe(1);
    expect(result.childrenReachableSets.get(1)).toEqual(new Set(['ADVANCED_CHILD']));
  });

  test('empty parent with multiple children with different progress', () => {
    const parentReached = new Set([]);
    const childrenReachedSets = new Map([
      [1, new Set(['CALIBRATION'])],
      [2, new Set([])]
    ]);

    const result = knowledgeGraph.getReachables(UserType.PARENT, parentReached, childrenReachedSets);

    expect(result.reachable).toEqual(new Set(['INTRO']));
    expect(result.childrenReachableSets.size).toBe(2);
    expect(result.childrenReachableSets.get(1)).toEqual(new Set(['EYES_FACES', 'CHILD_ONLY']));
    expect(result.childrenReachableSets.get(2)).toEqual(new Set(['CALIBRATION']));
  });

  test('multiple children with different progress', () => {
    const parentReached = new Set(['INTRO']);
    const childrenReachedSets = new Map([
      [1, new Set(['CALIBRATION'])],
      [2, new Set([])]
    ]);

    const result = knowledgeGraph.getReachables(UserType.PARENT, parentReached, childrenReachedSets);

    expect(result.reachable).toEqual(new Set(['CALIBRATION', 'EYES_FACES']));
    expect(result.childrenReachableSets.size).toBe(2);
    expect(result.childrenReachableSets.get(1)).toEqual(new Set(['EYES_FACES', 'CHILD_ONLY']));
    expect(result.childrenReachableSets.get(2)).toEqual(new Set(['CALIBRATION']));
  });
});

describe('dependency-graph buildGraph validation', () => {
  test('should throw error when CHILD_OWNED depends on ADULT_OWNED', () => {
    const invalidKnowledgeMap = createTestKnowledgeMap([
      { id: 'ADULT_MODULE', moduleType: ModuleType.ADULT_OWNED, deps: [] },
      { id: 'CHILD_MODULE', moduleType: ModuleType.CHILD_OWNED, deps: ['ADULT_MODULE'] }
    ]);

    expect(() => buildGraph(invalidKnowledgeMap)).toThrow(
      'CHILD_OWNED module CHILD_MODULE cannot directly depend on ADULT_OWNED module ADULT_MODULE. ' +
      'There must be a CHILD_DELEGATED module in between to bridge adult and child content.'
    );
  });

  test('should allow CHILD_OWNED to depend on CHILD_DELEGATED that depends on ADULT_OWNED', () => {
    const validKnowledgeMap = createTestKnowledgeMap([
      { id: 'ADULT_MODULE', moduleType: ModuleType.ADULT_OWNED, deps: [] },
      { id: 'BRIDGE_MODULE', moduleType: ModuleType.CHILD_DELEGATED, deps: ['ADULT_MODULE'] },
      { id: 'CHILD_MODULE', moduleType: ModuleType.CHILD_OWNED, deps: ['BRIDGE_MODULE'] }
    ]);

    expect(() => buildGraph(validKnowledgeMap)).not.toThrow();
  });
});

describe('dependency-graph complex scenarios', () => {
  test('diamond dependency with mixed module types', () => {
    const diamondMap = createTestKnowledgeMap([
      { id: 'ADULT_ROOT', moduleType: ModuleType.ADULT_OWNED, deps: [] },
      { id: 'DELEGATE_LEFT', moduleType: ModuleType.CHILD_DELEGATED, deps: ['ADULT_ROOT'] },
      { id: 'DELEGATE_RIGHT', moduleType: ModuleType.CHILD_DELEGATED, deps: ['ADULT_ROOT'] },
      { id: 'CHILD_MERGE', moduleType: ModuleType.CHILD_OWNED, deps: ['DELEGATE_LEFT', 'DELEGATE_RIGHT'] }
    ]);

    const graph = buildGraph(diamondMap);

    const parentReached = new Set(['ADULT_ROOT']);
    const childReached = new Map([[1, new Set(['DELEGATE_LEFT'])]]);
    const result = graph.getReachables(UserType.PARENT, parentReached, childReached);

    expect(result.reachable).toEqual(new Set(['DELEGATE_RIGHT']));
    expect(result.childrenReachableSets.get(1)).toEqual(new Set(['DELEGATE_RIGHT']));
  });

  test('multiple ADULT_OWNED prerequisites for CHILD_DELEGATED', () => {
    const multiAdultDeps = createTestKnowledgeMap([
      { id: 'ADULT1', moduleType: ModuleType.ADULT_OWNED, deps: [] },
      { id: 'ADULT2', moduleType: ModuleType.ADULT_OWNED, deps: [] },
      { id: 'ADULT3', moduleType: ModuleType.ADULT_OWNED, deps: [] },
      { id: 'DELEGATE_MULTI', moduleType: ModuleType.CHILD_DELEGATED, deps: ['ADULT1', 'ADULT2', 'ADULT3'] },
      { id: 'CHILD_FINAL', moduleType: ModuleType.CHILD_OWNED, deps: ['DELEGATE_MULTI'] }
    ]);

    const graph = buildGraph(multiAdultDeps);

    // Parent has only completed 2 of 3 adult prerequisites
    let parentReached = new Set(['ADULT1', 'ADULT2']);
    let childReached = new Map<number, Set<string>>([[1, new Set<string>()]]);
    let result = graph.getReachables(UserType.PARENT, parentReached, childReached);

    // Parent should NOT see DELEGATE_MULTI because ADULT3 is missing
    expect(result.reachable).toEqual(new Set(['ADULT3']));
    expect(result.childrenReachableSets.get(1)).toEqual(new Set(['DELEGATE_MULTI']));

    parentReached = new Set(['ADULT1', 'ADULT2', 'ADULT3']);
    childReached = new Map<number, Set<string>>([[1, new Set<string>()]]);
    result = graph.getReachables(UserType.PARENT, parentReached, childReached);
    expect(result.reachable).toEqual(new Set(['DELEGATE_MULTI']));
    expect(result.childrenReachableSets.get(1)).toEqual(new Set(['DELEGATE_MULTI']));
  });

  test('transitive ADULT_OWNED dependencies through chain', () => {
    const chain = createTestKnowledgeMap([
      { id: 'ADULT1', moduleType: ModuleType.ADULT_OWNED, deps: [] },
      { id: 'ADULT2', moduleType: ModuleType.ADULT_OWNED, deps: ['ADULT1'] },
      { id: 'DELEGATE1', moduleType: ModuleType.CHILD_DELEGATED, deps: ['ADULT1'] },
      { id: 'DELEGATE2', moduleType: ModuleType.CHILD_DELEGATED, deps: ['DELEGATE1', 'ADULT2'] },
      { id: 'CHILD1', moduleType: ModuleType.CHILD_OWNED, deps: ['DELEGATE2'] }
    ]);

    const graph = buildGraph(chain);

    // Parent completed only ADULT1, not ADULT2
    const parentReached = new Set(['ADULT1']);
    const childReached = new Map([[1, new Set(['DELEGATE1'])]]);
    const result = graph.getReachables(UserType.PARENT, parentReached, childReached);

    expect(result.reachable).toEqual(new Set(['ADULT2']));
    expect(result.childrenReachableSets.get(1)).toEqual(new Set(['DELEGATE2']));
  });

  test('parallel child paths with different progress', () => {
    const parallelPaths = createTestKnowledgeMap([
      { id: 'ADULT_BASE', moduleType: ModuleType.ADULT_OWNED, deps: [] },
      { id: 'DELEGATE_PATH1_A', moduleType: ModuleType.CHILD_DELEGATED, deps: ['ADULT_BASE'] },
      { id: 'DELEGATE_PATH1_B', moduleType: ModuleType.CHILD_DELEGATED, deps: ['DELEGATE_PATH1_A'] },
      { id: 'DELEGATE_PATH2_A', moduleType: ModuleType.CHILD_DELEGATED, deps: ['ADULT_BASE'] },
      { id: 'DELEGATE_PATH2_B', moduleType: ModuleType.CHILD_DELEGATED, deps: ['DELEGATE_PATH2_A'] },
      { id: 'CHILD_PATH1', moduleType: ModuleType.CHILD_OWNED, deps: ['DELEGATE_PATH1_B'] },
      { id: 'CHILD_PATH2', moduleType: ModuleType.CHILD_OWNED, deps: ['DELEGATE_PATH2_B'] },
      { id: 'CHILD_CONVERGE', moduleType: ModuleType.CHILD_OWNED, deps: ['CHILD_PATH1', 'CHILD_PATH2'] }
    ]);

    const graph = buildGraph(parallelPaths);

    const parentReached = new Set(['ADULT_BASE']);
    const childrenReached = new Map<number, Set<string>>([
      [1, new Set(['DELEGATE_PATH1_A', 'DELEGATE_PATH1_B'])],
      [2, new Set(['DELEGATE_PATH2_A'])],
      [3, new Set<string>()]
    ]);

    const result = graph.getReachables(UserType.PARENT, parentReached, childrenReached);

    expect(result.reachable).toEqual(new Set([
      'DELEGATE_PATH2_B', 'DELEGATE_PATH1_A', 'DELEGATE_PATH2_A',
    ]));
    expect(result.childrenReachableSets.get(1)).toEqual(new Set(['CHILD_PATH1', 'DELEGATE_PATH2_A']));
    expect(result.childrenReachableSets.get(2)).toEqual(new Set(['DELEGATE_PATH2_B', 'DELEGATE_PATH1_A']));
    expect(result.childrenReachableSets.get(3)).toEqual(new Set([
      'DELEGATE_PATH1_A', 'DELEGATE_PATH2_A'
    ]));
  });

  test('CHILD_DELEGATED depending on other CHILD_DELEGATED with different adult deps', () => {
    const nestedDelegates = createTestKnowledgeMap([
      { id: 'ADULT1', moduleType: ModuleType.ADULT_OWNED, deps: [] },
      { id: 'ADULT2', moduleType: ModuleType.ADULT_OWNED, deps: ['ADULT1'] },
      { id: 'DELEGATE1', moduleType: ModuleType.CHILD_DELEGATED, deps: ['ADULT1'] },
      { id: 'DELEGATE2', moduleType: ModuleType.CHILD_DELEGATED, deps: ['DELEGATE1', 'ADULT2'] },
      { id: 'DELEGATE3', moduleType: ModuleType.CHILD_DELEGATED, deps: ['DELEGATE2'] }
    ]);

    const graph = buildGraph(nestedDelegates);

    // Parent has completed only ADULT1
    const parentReached = new Set(['ADULT1']);
    const childReached = new Map([[1, new Set(['DELEGATE1'])]]);
    const result = graph.getReachables(UserType.PARENT, parentReached, childReached);

    expect(result.reachable).toEqual(new Set(['ADULT2']));
    // Child can't reach DELEGATE2 because it requires ADULT2
    expect(result.childrenReachableSets.get(1)).toEqual(new Set(['DELEGATE2']));

    // Now parent completes ADULT2
    const parentReached2 = new Set(['ADULT1', 'ADULT2']);
    const childReached2 = new Map([[1, new Set(['DELEGATE1'])]]);
    const result2 = graph.getReachables(UserType.PARENT, parentReached2, childReached2);

    expect(result2.reachable).toEqual(new Set(['DELEGATE2']));
    expect(result2.childrenReachableSets.get(1)).toEqual(new Set(['DELEGATE2']));
  });

  test('student cannot reach CHILD_OWNED if CHILD_DELEGATED prerequisite needs ADULT_OWNED', () => {
    const blockedPath = createTestKnowledgeMap([
      { id: 'ADULT_BLOCK', moduleType: ModuleType.ADULT_OWNED, deps: [] },
      { id: 'DELEGATE_BLOCK', moduleType: ModuleType.CHILD_DELEGATED, deps: ['ADULT_BLOCK'] },
      { id: 'CHILD_BLOCKED', moduleType: ModuleType.CHILD_OWNED, deps: ['DELEGATE_BLOCK'] },
      { id: 'CHILD_FURTHER', moduleType: ModuleType.CHILD_OWNED, deps: ['CHILD_BLOCKED'] }
    ]);

    const graph = buildGraph(blockedPath);

    // Student with no progress (parent hasn't completed ADULT_BLOCK)
    const studentResult = graph.getReachables(UserType.STUDENT, new Set());
    expect(studentResult.reachable).toEqual(new Set());

    // Even if student somehow has DELEGATE_BLOCK, they still need the adult module
    const studentWithDelegate = graph.getReachables(UserType.STUDENT, new Set(['DELEGATE_BLOCK']));
    expect(studentWithDelegate.reachable).toEqual(new Set(['CHILD_BLOCKED']));
  });

  test('multiple children with overlapping CHILD_DELEGATED access', () => {
    const sharedDelegates = createTestKnowledgeMap([
      { id: 'ADULT1', moduleType: ModuleType.ADULT_OWNED, deps: [] },
      { id: 'ADULT2', moduleType: ModuleType.ADULT_OWNED, deps: [] },
      { id: 'DELEGATE_SHARED', moduleType: ModuleType.CHILD_DELEGATED, deps: ['ADULT1'] },
      { id: 'DELEGATE_CHILD1_ONLY', moduleType: ModuleType.CHILD_DELEGATED, deps: ['ADULT2'] },
      { id: 'CHILD_SHARED', moduleType: ModuleType.CHILD_OWNED, deps: ['DELEGATE_SHARED'] }
    ]);

    const graph = buildGraph(sharedDelegates);

    const parentReached = new Set(['ADULT1', 'ADULT2']);
    const childrenReached = new Map<number, Set<string>>([
      [1, new Set(['DELEGATE_SHARED'])],
      [2, new Set(['DELEGATE_SHARED'])],
      [3, new Set<string>()]
    ]);

    const result = graph.getReachables(UserType.PARENT, parentReached, childrenReached);

    // Parent should see all delegates that any child can reach
    expect(result.reachable).toEqual(new Set(['DELEGATE_SHARED', 'DELEGATE_CHILD1_ONLY']));

    // All children should be able to reach the shared content
    expect(result.childrenReachableSets.get(1)).toEqual(new Set(['DELEGATE_CHILD1_ONLY', 'CHILD_SHARED']));
    expect(result.childrenReachableSets.get(2)).toEqual(new Set(['DELEGATE_CHILD1_ONLY', 'CHILD_SHARED']));
    expect(result.childrenReachableSets.get(3)).toEqual(new Set(['DELEGATE_SHARED', 'DELEGATE_CHILD1_ONLY']));
  });
});
