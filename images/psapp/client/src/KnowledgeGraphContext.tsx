import React from 'react';
import { TechTree } from './dependency-graph';

export const KnowledgeGraphContext = React.createContext<TechTree | null>(null);

export const useKnowledgeGraph = () => {
  const graph = React.useContext(KnowledgeGraphContext);
  if (!graph) {
    throw new Error('Component needs to be inside a KnowledgeGraphContext.Provider');
  }
  return graph;
};