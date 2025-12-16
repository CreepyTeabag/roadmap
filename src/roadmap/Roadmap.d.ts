export type ImportanceLevel = "high" | "medium" | "low" | "group";

export type TreeNode = {
  id: string;
  label: string;
  children?: TreeNode[];
  importanceLevel: ImportanceLevel;
  type?: "node" | "group";
};

export interface NodeInfo {
  label: string;
  importanceLevel: ImportanceLevel;
}

export type CardLevel = "essential" | "common" | "uncommon";

export type Card = {
  level: CardLevel;
  title: string;
  id: number;
  description: string;
  completed: boolean;
  cards?: Card[];
  type?: "group";
};

export type Chapter = {
  name: string;
  cards: Card[];
};

export type NewTree = {
  progress: number;
  subscribe: boolean;
  chapter: Chapter[];
  name: string;
  id: number;
  description: string;
  image: string;
};
