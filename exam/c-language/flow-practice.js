window.flowPractice = {
  "chapterNumber": 4,
  "title": "易错题 · switch、while 和 do...while",
  "rulesHeading": "做题要点",
  "rules": [
    "switch 先匹配一个入口，然后顺着代码往下执行。没有匹配的 case 就从 default 开始。多个 case 标签可以共用一组代码。",
    "每组独立处理通常在末尾写 break。省略 break 会继续执行下面的代码，经过 default 也一样。switch 套在循环里时，switch 中直接写的 break 只退出该 switch。",
    "while 先判断，循环体可能一次都不进。do...while 先执行一轮，再判断；末尾的 while(...) 后面要有分号。",
    "do...while 遇到 continue 会跳过本轮剩余语句，直接检查末尾的条件。",
    "条件里的 n-- 或 n++ 用旧值判断，--n 或 ++n 用新值判断。最后一次判断即使不成立，自增或自减也已经发生。",
    "逐行看打印语句的位置。记录每轮的变量值，同时确认本轮有没有真正执行 printf。"
  ],
  "questions": [
    {
      "id": "flow-practice-switch-start",
      "title": "练习 1 · switch 从哪里开始，又在哪里退出？",
      "prompt": "把 x 分别设为 1、2、4，写出三次运行各打印哪几行。",
      "code": "#include <stdio.h>\n\nint main(void) {\n    int x = 1;  // 分别换成 1、2、4\n\n    switch (x) {\n        case 1:\n            puts(\"A\");\n        case 2:\n        case 3:\n            puts(\"B\");\n            break;\n        default:\n            puts(\"C\");\n    }\n\n    puts(\"结束\");\n    return 0;\n}",
      "answer": "x = 1：A → B → 结束\nx = 2：B → 结束\nx = 4：C → 结束\n每个箭头表示下一行。",
      "explanation": "x=1 从 case 1 开始，打印 A 后没有 break，继续到打印 B 的语句。x=2 直接从 case 2 开始，和 case 3 共用打印 B 的代码。x=4 没有匹配的 case，从 default 开始。switch 外的 puts 三次都会执行。",
      "source": "对话练习"
    },
    {
      "id": "flow-practice-switch-default",
      "title": "练习 2 · default 放在中间",
      "prompt": "把 x 分别设为 1、2、9，每次单独运行。写出每次打印的内容和顺序。",
      "code": "#include <stdio.h>\n\nint main(void) {\n    int x = 1;\n\n    switch (x) {\n        case 1:\n            puts(\"A\");\n        default:\n            puts(\"D\");\n        case 2:\n            puts(\"B\");\n            break;\n    }\n\n    return 0;\n}",
      "answer": "x = 1：A → D → B\nx = 2：B\nx = 9：D → B\n每个箭头表示下一行。",
      "explanation": "x=1 从 case 1 进入，顺着往下执行 default 和 case 2 后面的语句。x=2 直接跳到 case 2，印出 B。x=9 没有匹配项，从 default 进入，再顺着往下印出 B。",
      "source": "对话练习"
    },
    {
      "id": "flow-practice-switch-loop",
      "title": "练习 3 · switch 套在 for 循环里",
      "prompt": "按 i=1、i=2、i=3 三轮写出输出。看看 break 之后会不会打印短横线，for 是否还会继续。",
      "code": "#include <stdio.h>\n\nint main(void) {\n    for (int i = 1; i <= 3; i++) {\n        switch (i) {\n            case 1:\n                puts(\"A\");\n            case 2:\n                puts(\"B\");\n                break;\n            default:\n                puts(\"C\");\n        }\n        puts(\"-\");\n    }\n    return 0;\n}",
      "answer": "A\nB\n-\nB\n-\nC\n-",
      "explanation": "第一轮从 case 1 开始，打印 A 和 B。第二轮从 case 2 开始，只打印 B。前两轮的 break 退出离它最近的 switch，然后仍会打印短横线，for 继续。第三轮从 default 开始，打印 C，走出 switch 后再打印短横线。",
      "source": "对话练习"
    },
    {
      "id": "flow-practice-while-steps",
      "title": "练习 4 · while 循环外的 printf",
      "prompt": "循环体执行几次？屏幕上完整的一行是什么？",
      "code": "int i = 1;\n\nwhile (i < 5) {\n    printf(\"%d \", i);\n    i += 2;\n}\n\nprintf(\"| i = %d\\n\", i);",
      "answer": "循环体执行 2 次。\n1 3 | i = 5",
      "explanation": "i=1、3 时条件成立，分别打印数字后加 2。i 变成 5 时，5<5 为假，直接退出。循环里的 printf 只打印数字和空格，最后的 i=5 由循环外的 printf 打印。",
      "source": "对话练习"
    },
    {
      "id": "flow-practice-while-postdec",
      "title": "练习 5 · while 条件里的 n--",
      "prompt": "循环体执行几次？写出完整输出。",
      "code": "int n = 3;\n\nwhile (n-- > 0) {\n    printf(\"%d \", n);\n}\n\nprintf(\"| n = %d\\n\", n);",
      "answer": "循环体执行 3 次。\n2 1 0 | n = -1",
      "explanation": "拿旧值 3、2、1 判断时都成立，进入循环体打印减过的值 2、1、0。最后拿旧值 0 判断，条件为假，n-- 仍然执行，所以退出时 n=-1。",
      "source": "对话练习"
    },
    {
      "id": "flow-practice-while-predec",
      "title": "练习 6 · 把 n-- 换成 --n",
      "prompt": "循环体执行几次？写出完整输出。",
      "code": "int n = 3;\n\nwhile (--n > 0) {\n    printf(\"%d \", n);\n}\n\nprintf(\"| n = %d\\n\", n);",
      "answer": "循环体执行 2 次。\n2 1 | n = 0",
      "explanation": "--n 先减再比较。新值为 2、1 时进入循环体，新值为 0 时条件已经不成立，所以循环内不打印 0。",
      "source": "对话练习"
    },
    {
      "id": "flow-practice-do-first",
      "title": "练习 7 · 条件一开始就不成立",
      "prompt": "循环体执行几次？写出完整输出。",
      "code": "int n = 5;\n\ndo {\n    n += 2;\n    printf(\"%d \", n);\n} while (n < 5);\n\nprintf(\"| n = %d\\n\", n);",
      "answer": "循环体执行 1 次。\n7 | n = 7",
      "explanation": "do...while 先执行循环体。n 从 5 变成 7 并打印，再判断 7<5，条件为假，循环结束。",
      "source": "对话练习"
    },
    {
      "id": "flow-practice-do-continue",
      "title": "练习 8 · do...while 遇到 continue",
      "prompt": "循环体进入几次？循环里的 printf 执行几次？写出完整输出。",
      "code": "int n = 0;\n\ndo {\n    n++;\n    if (n == 2) {\n        continue;\n    }\n    printf(\"%d \", n);\n} while (n < 4);\n\nprintf(\"| n = %d\\n\", n);",
      "answer": "进入循环体 4 次，循环里的 printf 执行 3 次。\n1 3 4 | n = 4",
      "explanation": "第一轮先把 0 加到 1，再打印。第二轮 n=2 时，continue 跳过本轮打印，接着检查末尾的条件。第三、四轮打印 3 和 4，打印完 4 才检查条件并退出。",
      "source": "对话练习"
    },
    {
      "id": "flow-practice-do-postinc",
      "title": "练习 9 · do...while 条件里的 n++",
      "prompt": "循环体执行几次？写出完整输出。",
      "code": "int n = 1;\n\ndo {\n    printf(\"%d \", n);\n} while (n++ < 3);\n\nprintf(\"| n = %d\\n\", n);",
      "answer": "循环体执行 3 次。\n1 2 3 | n = 4",
      "explanation": "每轮先打印，再用 n 的旧值与 3 比较。第三轮打印 3 后，用旧值 3 判断得假，但 n++ 仍然让 n 从 3 变成 4。",
      "source": "对话练习"
    },
    {
      "id": "flow-practice-loop-compare",
      "title": "练习 10 · 对照两种循环的执行时机",
      "prompt": "分别让 start 为 3 和 1 各运行一次。写出两次的输出，以及两个循环各执行几次。",
      "code": "#include <stdio.h>\n\nint main(void) {\n    int start = 3;\n    int i = start;\n\n    while (i < 3) {\n        printf(\"%d \", i);\n        i++;\n    }\n    printf(\"| \");\n\n    i = start;\n    do {\n        printf(\"%d \", i);\n        i++;\n    } while (i < 3);\n\n    return 0;\n}",
      "answer": "start = 3：| 3（while 0 次，do...while 1 次）\nstart = 1：1 2 | 1 2（两个循环各 2 次）",
      "explanation": "while 先判断，do...while 先执行后判断。还要留意竖线之后的 i=start。第二个循环从 start 重新开始。start=1 时，两边都只打印 1 和 2；i 增至 3 后，条件不成立。",
      "source": "对话练习"
    }
  ]
};
