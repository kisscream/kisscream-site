window.nestedPractice = {
  "chapterNumber": 4,
  "title": "易错题 · 双重循环",
  "rulesHeading": "做题要点",
  "rules": [
    "先写出外层 i 的当前值，再检查内层 for 第一格。写 int j = 1 时每轮从 1 开始，写 int j = i 时每轮从当前的 i 开始。",
    "内层 for 第一格留空且 j 在外面初始化时，下一轮继续用上一轮留下的 j。记得内层最后一次 j++ 也会让 j 变化。",
    "遇到 break 就退出它所在的这一层循环。遇到 continue 就跳过当前这轮剩下的语句，内层 for 仍会执行 j++。",
    "看清打印的是 i 还是 j。换行在内层循环外时，每轮外层循环才换一行。"
  ],
  "questions": [
    {
      "id": "nested-practice-count",
      "source": "对话练习",
      "title": "练习 1 · 内层循环一共执行几次？",
      "prompt": "count++ 总共执行几次？最后输出什么？",
      "code": "int count = 0;\n\nfor (int i = 1; i <= 3; i++) {\n    for (int j = 1; j <= 2; j++) {\n        count++;\n    }\n}\n\nprintf(\"%d\\n\", count);",
      "answer": "执行 6 次，输出 6。",
      "explanation": "外层 i 取 1、2、3。每轮都重新执行 int j = 1，内层各执行 2 次，所以总次数是 2 + 2 + 2 = 6。"
    },
    {
      "id": "nested-practice-triangle",
      "source": "对话练习",
      "title": "练习 2 · 每一行打印几个数字？",
      "prompt": "写出完整输出。注意打印的是 j。",
      "code": "for (int i = 1; i <= 3; i++) {\n    for (int j = 1; j <= i; j++) {\n        printf(\"%d\", j);\n    }\n    printf(\"\\n\");\n}",
      "answer": "1\n12\n123",
      "explanation": "三行分别打印 1 个、2 个、3 个数字。每换一行，j 都从 1 开始。第二行 i=2，依次打印 1 和 2，然后才换行。"
    },
    {
      "id": "nested-practice-break",
      "source": "对话练习",
      "title": "练习 3 · break 会跳出哪一层？",
      "prompt": "分别写出 i=1、i=2、i=3 时打印的那一行。",
      "code": "for (int i = 1; i <= 3; i++) {\n    for (int j = 1; j <= 3; j++) {\n        if (j == i) {\n            break;\n        }\n        printf(\"%d\", j);\n    }\n    printf(\"|\\n\");\n}",
      "answer": "|\n1|\n12|",
      "explanation": "每行 j 从 1 开始。第一行一进内层就遇到 break，只打印竖线。第二行先打印 j=1，到 j=2 就退出。第三行打印 j=1、2，到 j=3 就退出。break 只退出内层，所以外层每轮都会打印竖线。"
    },
    {
      "id": "nested-practice-continue",
      "source": "对话练习",
      "title": "练习 4 · 把内层的 break 换成 continue",
      "prompt": "请写出完整的三行输出。",
      "code": "for (int i = 1; i <= 3; i++) {\n    for (int j = 1; j <= 3; j++) {\n        if (j == i) {\n            continue;\n        }\n        printf(\"%d\", j);\n    }\n    printf(\"|\\n\");\n}",
      "answer": "23|\n13|\n12|",
      "explanation": "每行仍然检查 j=1、2、3。遇到 j==i 时，continue 跳过当轮的 printf，再执行 j++。所以三行分别略过 1、2、3。"
    },
    {
      "id": "nested-practice-start-at-i",
      "source": "对话练习",
      "title": "练习 5 · 如果 j 从 i 开始呢？",
      "prompt": "请写出完整的三行输出。注意内层的 int j = i。",
      "code": "for (int i = 1; i <= 3; i++) {\n    for (int j = i; j <= 3; j++) {\n        printf(\"%d\", j);\n    }\n    printf(\"|\\n\");\n}",
      "answer": "123|\n23|\n3|",
      "explanation": "每轮都重新初始化 j，初值取当前的 i。于是三行分别从 1、2、3 开始，都打印到 3。"
    },
    {
      "id": "nested-practice-keep-j",
      "source": "对话练习",
      "title": "练习 6 · j 在双重循环外初始化",
      "prompt": "请写出完整的四行输出。先记下每轮留下的 j。",
      "code": "int j = 1;\n\nfor (int i = 1; i <= 3; i++) {\n    for (; j <= i; j++) {\n        printf(\"%d\", j);\n    }\n    printf(\"|\\n\");\n}\n\nprintf(\"j = %d\\n\", j);",
      "answer": "1|\n2|\n3|\nj = 4",
      "explanation": "int j = 1 只执行一次。第一轮打印 1 后，j 加到 2，条件 2<=1 为假。第二轮直接从 j=2 开始，打印 2 后加到 3。第三轮从 j=3 开始，打印 3 后加到 4。最后打印 j = 4。"
    }
  ]
};
