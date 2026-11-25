window.inputPractice = {
  "chapterNumber": 3,
  "title": "易错题 · scanf、getchar 和 putchar",
  "rules": [
    "scanf(\"%d\", &n) 先跳过前面的空白，再读取一个十进制整数。读完数字后，后面的空格、字母或换行留给下一次读取。",
    "scanf(\"%c\", &ch) 直接读下一个字符。空格和回车产生的 '\\n' 也能被读进去。",
    "scanf(\" %c\", &ch) 先跳过前导的空白（可以有零个或多个），再读一个字符。这个字符后面的空白仍留在输入中。",
    "getchar() 每次拿走下一个字符。putchar(ch) 只输出传给它的一个字符，输出顺序可以和读取顺序不同。",
    "做题时把输入按顺序写出来。每执行一次读取就划掉它消耗的字符，然后从剩下的第一个字符继续。"
  ],
  "questions": [
    {
      "id": "input-practice-lines",
      "title": "练习 1 · 三次 getchar() 分别读到什么？",
      "prompt": "先输入 A 按回车，再输入 B 按回车。写出 a、b、c 分别读到的字符和最终输出。",
      "code": "#include <stdio.h>\n\nint main(void) {\n    int a = getchar();\n    int b = getchar();\n    int c = getchar();\n\n    putchar(a);\n    putchar(c);\n    putchar(b);\n\n    return 0;\n}",
      "answer": "a = 'A', b = '\\n', c = 'B'\n输出 AB，然后换行。",
      "explanation": "输入顺序是 'A' → '\\n' → 'B' → '\\n'。三次 getchar() 消耗前三个字符。putchar 按 a → c → b 的顺序输出，第二次回车产生的换行还留在输入中。",
      "source": "对话练习"
    },
    {
      "id": "input-practice-integer",
      "title": "练习 2 · scanf(\"%d\") 之后还剩什么？",
      "prompt": "输入 12 A 再按回车，12 和 A 之间有一个空格。写出 n、a、b 和输出。再试一次，输入 12A 再按回车，输出会怎么变？",
      "code": "#include <stdio.h>\n\nint main(void) {\n    int n;\n    scanf(\"%d\", &n);\n\n    int a = getchar();\n    int b = getchar();\n\n    putchar('[');\n    putchar(a);\n    putchar(b);\n    putchar(']');\n    putchar('\\n');\n\n    return 0;\n}",
      "answer": "输入 12 A 时：\nn = 12, a = ' ', b = 'A'\n[ A]\n\n输入 12A 时：\nn = 12, a = 'A', b = '\\n'\n[A\n]",
      "explanation": "%d 读走 '1' 和 '2'，把它们转成整数 12。遇到空格或 A 都会停下，剩下的字符交给下一次读取。输入 12 A 时，两次 getchar() 拿到空格和 A。输入 12A 时，两次拿到 A 和 '\\n'，所以右方括号被打印到下一行。",
      "source": "对话练习"
    },
    {
      "id": "input-practice-space",
      "title": "练习 3 · \" %c\" 跳过哪个空格？",
      "prompt": "输入 27 A B，再按回车。27 和 A 之间、A 和 B 之间各有一个空格。写出 n、a、b、c 和输出。",
      "code": "#include <stdio.h>\n\nint main(void) {\n    int n;\n    char a;\n    scanf(\"%d\", &n);\n    scanf(\" %c\", &a);\n\n    int b = getchar();\n    int c = getchar();\n\n    printf(\"[%c][%c][%c]\\n\", a, b, c);\n    return 0;\n}",
      "answer": "n = 27, a = 'A', b = ' ', c = 'B'\n[A][ ][B]",
      "explanation": "%d 读完 27，剩下 空格 → A → 空格 → B → 换行。\" %c\" 先跳过 A 前面的空格，只读走 A。第一次 getchar() 读走 A 后面的空格，第二次读走 B。",
      "source": "对话练习"
    },
    {
      "id": "input-practice-mixed",
      "title": "练习 4 · \"%c\" 和 \" %c\" 混着用",
      "prompt": "先输入 8 X 按回车，再输入 Y 按回车。第一行的 8 和 X 之间有一个空格。写出 n、a、b、c 和输出。",
      "code": "#include <stdio.h>\n\nint main(void) {\n    int n;\n    char a, c;\n\n    scanf(\"%d\", &n);\n    scanf(\"%c\", &a);\n    int b = getchar();\n    scanf(\" %c\", &c);\n\n    printf(\"[%c][%c][%c]\\n\", a, b, c);\n    return 0;\n}",
      "answer": "n = 8, a = ' ', b = 'X', c = 'Y'\n[ ][X][Y]",
      "explanation": "%d 读走 8，剩下 空格 → X → 换行 → Y → 换行。\"%c\" 没有前导空格，直接拿走第一个空格。getchar() 拿走 X。\" %c\" 跳过第一行的换行，再读走 Y。",
      "source": "对话练习"
    }
  ]
};
