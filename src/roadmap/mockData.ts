import type { NewTree, TreeNode } from "./Roadmap.d";

// Сложный роадмап с потенциальной фичей группировки
export const mockDifficultRoadmap: TreeNode = {
  id: "root",
  label: "Роадмап",
  importanceLevel: "high",
  children: [
    {
      id: "step-1",
      label: "Обязательное 1",
      importanceLevel: "high",
      children: [
        {
          id: "step-1-a",
          label: "Общее 2",
          importanceLevel: "medium",
          children: [
            {
              id: "step-1-a-4",
              label: "Общее 2.1",
              importanceLevel: "medium",
            },
            {
              id: "step-1-a-5",
              label: "Общее 2.2",
              importanceLevel: "medium",
            },
          ],
        },
        {
          id: "step-1-b",
          label: "Обязательное 2",
          importanceLevel: "high",
          children: [
            {
              id: "step-1-a-1",
              label: "Обязательное 3",
              importanceLevel: "high",
              children: [
                {
                  id: "step-1-a-2",
                  label: "Обязательное 4",
                  importanceLevel: "high",
                  children: [
                    {
                      id: "step-1-a-2-a",
                      label: "Обязательное 5",
                      importanceLevel: "high",
                      children: [
                        {
                          id: "step-6",
                          label: "Обязательное 6",
                          importanceLevel: "high",
                          children: [
                            {
                              id: "step-7",
                              label: "Обязательное 7",
                              importanceLevel: "high",
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  id: "step-1-a-3",
                  label: "Профильное 3",
                  importanceLevel: "low",
                },
              ],
            },
          ],
        },
        {
          id: "step-1-c",
          label: "Общее 3",
          importanceLevel: "medium",
        },
      ],
    },
    {
      id: "step-2",
      label: "Общее 1",
      importanceLevel: "medium",
      children: [
        {
          id: "group-1",
          label: "Группа A",
          type: "group",
          importanceLevel: "low",
          // группировка
          children: [
            {
              id: "group-1-a",
              label: "Элемент 1",
              importanceLevel: "low",
            },
            {
              id: "group-1-b",
              label: "Элемент 2",
              importanceLevel: "low",
            },
            {
              id: "group-1-c",
              label: "Элемент 3",
              importanceLevel: "low",
            },
            {
              id: "group-1-d",
              label: "Элемент 4",
              importanceLevel: "low",
            },
          ],
        },
        {
          id: "step-2-b",
          label: "Профильное 2",
          importanceLevel: "low",
        },
      ],
    },
  ],
};

// Роадмап с тремя вертикальными ветвями
export const mockSimpleRoadmap: TreeNode = {
  id: "root",
  label: "Роадмап",
  importanceLevel: "group",
  children: [
    {
      id: "gr-1",
      label: "Группа 1",
      importanceLevel: "group",
      children: [
        {
          id: "с1",
          label: "Обязательное 2",
          importanceLevel: "high",
          children: [
            {
              id: "с2",
              label: "Обязательное 3",
              importanceLevel: "high",
              children: [
                {
                  id: "с3",
                  label: "Общее 4",
                  importanceLevel: "low",
                  children: [
                    {
                      id: "с4",
                      label: "Общее 5",
                      importanceLevel: "low",
                      children: [
                        {
                          id: "с5",
                          label: "Профильное 6",
                          importanceLevel: "medium",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "gr-2",
      label: "Группа 2",
      importanceLevel: "group",
      children: [
        {
          id: "b0",
          label: "Общее 1",
          importanceLevel: "low",
          children: [
            {
              id: "b1",
              label: "Обязательное 2",
              importanceLevel: "high",
              children: [
                {
                  id: "b2",
                  label: "Профильное 3",
                  importanceLevel: "medium",
                  children: [
                    {
                      id: "b3",
                      label: "Общее 4",
                      importanceLevel: "low",
                      children: [
                        {
                          id: "b4",
                          label: "Обязательное 5",
                          importanceLevel: "high",
                          children: [
                            {
                              id: "b5",
                              label: "Профильное 6",
                              importanceLevel: "medium",
                              children: [
                                {
                                  id: "b6",
                                  label: "Общее 7",
                                  importanceLevel: "low",
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "gr-3",
      label: "Группа 3",
      importanceLevel: "group",
      children: [
        {
          id: "a1",
          label: "Обязательное 1",
          importanceLevel: "high",
          children: [
            {
              id: "a2",
              label: "Обязательное 2",
              importanceLevel: "high",
              children: [
                {
                  id: "a3",
                  label: "Обязательное 3",
                  importanceLevel: "high",
                  children: [
                    {
                      id: "a3.5",
                      label: "Обязательное 4",
                      importanceLevel: "high",
                    },
                    // раздвоение на две ветки
                    // {
                    //   id: "a4",
                    //   label: "Обязательное 5",
                    //   importanceLevel: "high",
                    //   children: [
                    //     {
                    //       id: "s1",
                    //       label: "Что-то важное 5",
                    //       importanceLevel: "high",
                    //       // Слияние веток в одну
                    //       children: [
                    //         {
                    //           id: "special-1",
                    //           label: "Объединение, вау!",
                    //           importanceLevel: "high",
                    //         },
                    //       ],
                    //     },
                    //   ],
                    // },
                    // {
                    //   id: "a5",
                    //   label: "Обязательное 6",
                    //   importanceLevel: "high",
                    //   children: [
                    //     {
                    //       id: "s2",
                    //       label: "Что-то важное 6",
                    //       importanceLevel: "high",
                    //       // Слияние веток в одну
                    //       children: [
                    //         {
                    //           id: "special-1",
                    //           label: "Объединение, вау!",
                    //           importanceLevel: "high",
                    //         },
                    //       ],
                    //     },
                    //   ],
                    // },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    // {
    //   id: "test-1",
    //   label: "Не группа",
    //   importanceLevel: "high",
    //   children: [
    //     {
    //       id: "test-2",
    //       label: "Любая карточка",
    //       importanceLevel: "medium",
    //     },
    //   ],
    // },
  ],
};

export const mockNewData: NewTree = {
  progress: 75,
  subscribe: false,
  chapter: [
    {
      cards: [
        {
          level: "essential",
          title: "Карточка 1-1",
          id: 1,
          description: "Описание",
          completed: false,
          cards: [
            {
              id: 87693249867324,
              title: "Элемент 1",
              level: "common",
              description: "",
              completed: false,
            },
          ],
        },
        {
          level: "common",
          title: "Карточка 1-2  с несколькими подкарточками",
          id: 2,
          description: "",
          completed: true,
          cards: [
            {
              id: 66666,
              title: "Элемент 1",
              level: "essential",
              description: "",
              completed: false,
            },
            {
              id: 77777,
              title: "Элемент 2",
              level: "essential",
              description: "",
              completed: false,
            },
          ],
        },
        {
          level: "common",
          title: "Карточка 1-3 с группой",
          id: 9876,
          description: "",
          completed: false,
          cards: [
            {
              id: 6666611,
              title: "Элемент 1",
              level: "common",
              description: "",
              completed: false,
              type: "group",
              cards: [
                {
                  id: 7777711,
                  title: "Элемент 2",
                  level: "common",
                  description: "",
                  completed: false,
                },
                {
                  id: 7777722,
                  title: "Элемент 3",
                  level: "common",
                  description: "",
                  completed: false,
                },
              ],
            },
          ],
        },
        {
          level: "common",
          title: "Карточка 1-4 с группой и подкарточкой",
          id: 9657876,
          description: "",
          completed: false,
          cards: [
            {
              id: 7723244,
              title: "Карточка 8734",
              level: "uncommon",
              description: "",
              completed: false,
            },
            {
              id: 6666622,
              title: "Элемент 1",
              level: "uncommon",
              description: "",
              completed: false,
              type: "group",
              cards: [
                {
                  id: 77777223244,
                  title: "Элемент 2",
                  level: "uncommon",
                  description: "",
                  completed: false,
                },
                {
                  id: 7777722324,
                  title: "Элемент 3",
                  level: "uncommon",
                  description: "",
                  completed: false,
                },
                {
                  id: 8877722324,
                  title: "Элемент 6",
                  level: "uncommon",
                  description: "",
                  completed: false,
                },
              ],
            },
          ],
        },
      ],
      name: "Глава 1 - 2 карточки",
    },
    {
      cards: [
        {
          level: "uncommon",
          title: "Карточка 2-3",
          description: "descr",
          id: 23,
          completed: false,
        },
      ],
      name: "Глава 2 - Профильная 1 карточка",
    },
    {
      cards: [
        {
          level: "uncommon",
          title: "Карточка 3-1",
          description: "descr",
          id: 3412,
          completed: false,
        },
      ],
      name: "Глава 3",
    },
    {
      cards: [],
      name: "Глава 4 - без карточек",
    },
  ],
  name: "Роадмап 1",
  id: 77,
  description: "Описание ",
  image: "null",
};
