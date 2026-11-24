window.handNotes = [
  {
    "title": "字符、进制和科学计数法",
    "chapter": "手写笔记",
    "source": "手写笔记 · 图 7",
    "text": "在课程采用的 ASCII 环境里，字符 ’0’、’A’、’a’ 的十进制编码分别为 48、65、97。同一字母大小写相差 32。字符数字减去 ’0’ 就得到数值，如 ’7’ - ’0’ 得 7。1.25e5 表示 125000，1e-3 表示 0.001。C99 至 C17 可用 <stdbool.h> 的 bool；关系表达式结果为 int 型 0 或 1。",
    "chapterNumber": 2
  },
  {
    "title": "整数运算与结合方向",
    "chapter": "手写笔记",
    "source": "手写笔记 · 图 2、6",
    "text": "整数 / 做除法时向零截断；有浮点操作数时进行浮点除法。% 的两端都须是整数，除数须非零。a=b=3 按 a=(b=3) 分组；条件运算符和前缀一元运算符也向右结合。结合方向用于确定表达式结构，不能据此推断任意两个函数谁先调用。",
    "chapterNumber": 2
  },
  {
    "title": "输入、分支与取最大值",
    "chapter": "手写笔记",
    "source": "手写笔记 · 图 5、6、7",
    "text": "scanf 读 int 用 %d 和 &n，读 float 用 %f，读 double 用 %lf。printf 输出浮点数用 %f，%.2f 指定两位小数。闰年先处理 400 的倍数，再排除其他整百年。取最大值时先保存第一个数，再分别检查后两个数。两次比较要独立执行。",
    "chapterNumber": 3
  },
  {
    "title": "循环按什么顺序执行",
    "chapter": "手写笔记",
    "source": "手写笔记 · 图 3、4、5",
    "text": "for 先初始化一次，每轮依次检查条件、执行循环体、执行更新表达式。省略中间条件视为真，两处分号仍需保留。while 先判断，可能执行零次；do…while 先执行，至少一次，末尾有分号。break 退出最近一层循环或 switch，continue 跳过本轮剩余语句，在 for 中随后执行更新表达式。",
    "chapterNumber": 4
  },
  {
    "title": "递推、数位与嵌套循环",
    "chapter": "手写笔记",
    "source": "手写笔记 · 图 1、2、3、4",
    "text": "阶乘题每轮先乘再加：term 存当前阶乘，sum 存截至本轮的总和。数位题用 n%10 取末位，n/=10 去末位。画三角形时外层定行，内层定个数，每行重新初始化内层变量。正整数公约数可从较小的输入向下试除。",
    "chapterNumber": 4
  },
  {
    "title": "函数参数和结果",
    "chapter": "手写笔记",
    "source": "手写笔记 · 图 4",
    "text": "调用时把实参的值复制给形参。读函数题时先写下形参的起始值，再跟踪函数体。要在函数内改动调用者的变量，可以传地址，并通过 *p 写入。实验九的 statistic 利用两个指针一次带回两个计数。",
    "chapterNumber": 5
  }
];
window.handQuestions = [
  {
    "id": "hand-factorial",
    "title": "求 1!＋2!＋…＋20!",
    "prompt": "求 1! + 2! + … + 20! = ?",
    "source": "手写笔记 · 图 1",
    "image": "originals/factorial.webp",
    "answer": "#include <stdio.h>\n\nint main(void) {\n    unsigned long long term = 1, sum = 0;\n    for (int i = 1; i <= 20; ++i) {\n        term *= i;\n        sum += term;\n    }\n    printf(\"%llu\\n\", sum);\n    return 0;\n}",
    "explanation": "结果为 2561327494111820313。第 3 轮先用 2! 乘 3 得到 6，再把 6 加到已有的 3 上。照片圈出了 double，因为数值很大。要精确输出每一位，这里用 unsigned long long 存整数。",
    "chapterNumber": 4
  },
  {
    "id": "hand-three-digits",
    "title": "三位数的数位和",
    "prompt": "求所有3位数的 a、b、c 位相加，(a+b+c)%5==0。",
    "source": "手写笔记 · 图 2",
    "image": "originals/three-digits.webp",
    "answer": "#include <stdio.h>\n\nint main(void) {\n    for (int n = 100; n <= 999; ++n) {\n        int sum = n / 100 + n / 10 % 10 + n % 10;\n        if (sum % 5 == 0)\n            printf(\"%d \", n);\n    }\n    return 0;\n}",
    "explanation": "以 104 为例，百位是 1，十位是 0，个位是 4，和为 5，所以输出 104。判断与输出都要放在循环内。",
    "chapterNumber": 4
  },
  {
    "id": "hand-digit-count",
    "title": "位数与各位数字之和",
    "prompt": "求一个数的位数和每位数字的加和。",
    "source": "手写笔记 · 图 2",
    "image": "originals/digit-count.webp",
    "answer": "#include <stdio.h>\n\nint main(void) {\n    int n, count = 0, sum = 0;\n    if (scanf(\"%d\", &n) != 1) return 1;\n    do {\n        int digit = n % 10;\n        sum += digit < 0 ? -digit : digit;\n        ++count;\n        n /= 10;\n    } while (n != 0);\n    printf(\"位数=%d，各位数字之和=%d\\n\", count, sum);\n    return 0;\n}",
    "explanation": "输入 507 时依次取出 7、0、5，位数为 3，总和为 12。n /= 10 才会更新 n。do…while 让输入 0 时也能计作一位。",
    "chapterNumber": 4
  },
  {
    "id": "hand-gcd",
    "title": "两个数的公约数",
    "prompt": "求2个数的公约数。",
    "source": "手写笔记 · 图 3",
    "image": "originals/gcd.webp",
    "answer": "#include <stdio.h>\n\nint main(void) {\n    int a, b;\n    if (scanf(\"%d%d\", &a, &b) != 2 || a <= 0 || b <= 0) return 1;\n    int limit = a < b ? a : b;\n    for (int i = limit; i >= 1; --i) {\n        if (a % i == 0 && b % i == 0) {\n            printf(\"%d\\n\", i);\n            break;\n        }\n    }\n    return 0;\n}",
    "explanation": "按照片中从大到小试除、找到后 break 的写法，求的是两个正整数的最大公约数。输入 12 和 18，第一次同时整除的是 6。若需列出全部公约数，删去 break，依次得到 6、3、2、1。",
    "chapterNumber": 4
  },
  {
    "id": "hand-stars",
    "title": "画出星号三角形",
    "prompt": "求画出 * 三角形。",
    "source": "手写笔记 · 图 3",
    "image": "originals/stars.webp",
    "answer": "#include <stdio.h>\n\nint main(void) {\n    int n;\n    if (scanf(\"%d\", &n) != 1) return 1;\n    for (int i = 1; i <= n; ++i) {\n        for (int j = 1; j <= i; ++j)\n            putchar('*');\n        putchar('\\n');\n    }\n    return 0;\n}",
    "explanation": "外层控制行号，内层控制该行的星数。输入 3，三行分别输出 *、**、***。照片草稿写 j <= n，每行都会有 n 个星号，要画左对齐三角形须写 j <= i。",
    "chapterNumber": 4
  },
  {
    "id": "hand-break",
    "title": "先输出，再判断 break",
    "prompt": "例（见手写代码原图）",
    "source": "手写笔记 · 图 4",
    "image": "originals/break.webp",
    "answer": "12345678910",
    "explanation": "printf(\"%d\", i) 先执行，因此 10 也会打印。格式串中没有空格。i 达到 10 时退出循环，后面的 i++ 不再执行。",
    "chapterNumber": 4
  },
  {
    "id": "hand-maximum",
    "title": "三个数的最大值",
    "prompt": "例：求3个数最大值。",
    "source": "手写笔记 · 图 5",
    "image": "originals/maximum.webp",
    "answer": "#include <stdio.h>\n\nint main(void) {\n    int a, b, c;\n    if (scanf(\"%d%d%d\", &a, &b, &c) != 3) return 1;\n    int max = a;\n    if (b > max) max = b;\n    if (c > max) max = c;\n    printf(\"max=%d\\n\", max);\n    return 0;\n}",
    "explanation": "先让 a 当最大值，依次与 b、c 比较。输入 2、5、9，max 依次为 2、5、9。照片最后一次赋值应写 max = c。",
    "chapterNumber": 4
  },
  {
    "id": "hand-for-loop",
    "title": "读 for 循环",
    "prompt": "手写 for 循环例见原图。",
    "source": "手写笔记 · 图 5",
    "image": "originals/for-loop.webp",
    "answer": "若 sum 初值为 0，执行后 sum 仍为 0。",
    "explanation": "按照片所写 i=100、i<=100、i=i+1，循环体只在 i=100 时执行一次。100 不能同时被 3 和 7 整除，故不会执行 sum += i。",
    "chapterNumber": 4
  },
  {
    "id": "hand-leap",
    "title": "闰年问题",
    "prompt": "例：闰年问题（4年一闰，百年不闰，4百一闰）。",
    "source": "手写笔记 · 图 6",
    "image": "originals/leap.webp",
    "answer": "#include <stdio.h>\n\nint main(void) {\n    int year;\n    if (scanf(\"%d\", &year) != 1) return 1;\n    if (year % 400 == 0 || (year % 4 == 0 && year % 100 != 0))\n        printf(\"%d是闰年\\n\", year);\n    else\n        printf(\"%d不是闰年\\n\", year);\n    return 0;\n}",
    "explanation": "2000 能被 400 整除，是闰年。1900 能被 100 整除却不能被 400 整除，是平年。输入要传 &year，if 条件后直接接分支语句。",
    "chapterNumber": 4
  },
  {
    "id": "hand-octal",
    "title": "把字符编码写成八进制",
    "prompt": "如果 ‘A’ → 65，转换为八进制。",
    "source": "手写笔记 · 图 7",
    "image": "originals/octal.webp",
    "answer": "101（八进制），对应的 C 字符常量写成 '\\101'。",
    "explanation": "65 除以 8 得 8 余 1，8 除以 8 得 1 余 0，1 除以 8 得 0 余 1。余数倒过来是 101。C 源码中的八进制整数字面量写作 0101。",
    "chapterNumber": 2
  },
  {
    "id": "hand-roots",
    "title": "计算实数根",
    "prompt": "例：计算实数根。",
    "source": "手写笔记 · 图 7",
    "image": "originals/roots.webp",
    "answer": "#include <stdio.h>\n#include <math.h>\n\nint main(void) {\n    double a, b, c;\n    if (scanf(\"%lf%lf%lf\", &a, &b, &c) != 3) return 1;\n    if (a == 0) {\n        if (b != 0) printf(\"x=%.2f\\n\", -c / b);\n        else puts(c == 0 ? \"无穷多解\" : \"无解\");\n    } else {\n        double d = b * b - 4 * a * c;\n        if (d < 0) puts(\"无实数根\");\n        else if (d == 0) printf(\"重根 x=%.2f\\n\", -b / (2 * a));\n        else printf(\"x1=%.2f, x2=%.2f\\n\",\n                    (-b + sqrt(d)) / (2 * a), (-b - sqrt(d)) / (2 * a));\n    }\n    return 0;\n}",
    "explanation": "按图中系数 a、b、c 解 ax²+bx+c=0。先处理 a=0，再看判别式。输入 1 -3 2，判别式为 1，两根为 2.00 和 1.00。判别式为零也有实根。",
    "chapterNumber": 3
  },
  {
    "id": "lab9-2",
    "title": "指针遍历与最小值",
    "answer": "#include <stdio.h>\n\nint main(void) {\n    int a[10], *p = a;\n    for (int i = 0; i < 10; ++i)\n        if (scanf(\"%d\", p + i) != 1) return 1;\n    int min = *p;\n    for (int i = 1; i < 10; ++i)\n        if (*(p + i) < min) min = *(p + i);\n    for (int i = 0; i < 10; ++i) printf(\"%d \", *(p + i));\n    printf(\"\\n最小值=%d\\n\", min);\n    return 0;\n}",
    "explanation": "p+i 是第 i 个元素的地址，*(p+i) 是这个地址里的整数。用第一个输入值初始化 min，十个数全为正数时也能正确比较。",
    "prompt": "原题见下图。",
    "image": "originals/lab1.png",
    "source": "实验九 · 第 2 题",
    "chapterNumber": 9
  },
  {
    "id": "lab9-4",
    "title": "数组循环左移",
    "answer": "#include <stdio.h>\n\nvoid moveLeft(int *a, int n) {\n    if (n <= 1) return;\n    int first = *a;\n    for (int i = 1; i < n; ++i)\n        *(a + i - 1) = *(a + i);\n    *(a + n - 1) = first;\n}\n\nvoid rotateLeft(int *a, int n, int k) {\n    for (int i = 0; i < k; ++i) moveLeft(a, n);\n}\n\nint main(void) {\n    int a[] = {2, 3, 4, 5, 6, 7, 8, 9}, k;\n    int n = sizeof a / sizeof *a;\n    for (int i = 0; i < n; ++i) printf(\"%d \", *(a + i));\n    putchar('\\n');\n    if (scanf(\"%d\", &k) != 1 || k < 0) return 1;\n    rotateLeft(a, n, k);\n    for (int i = 0; i < n; ++i) printf(\"%d \", *(a + i));\n    putchar('\\n');\n    return 0;\n}",
    "explanation": "先保存 2，从左向右把后一个数填到前一个位置，再把 2 放到末尾。重复 3 次便得到 5 6 7 8 9 2 3 4。",
    "prompt": "原题见下图。",
    "image": "originals/lab2.png",
    "source": "实验九 · 第 4 题",
    "chapterNumber": 9
  },
  {
    "id": "lab9-5",
    "title": "用指针带回正数和负数的个数",
    "answer": "#include <stdio.h>\n\nvoid statistic(int *a, int n, int *posinum_ptr, int *neganum_ptr) {\n    *posinum_ptr = 0;\n    *neganum_ptr = 0;\n    for (int i = 0; i < n; ++i) {\n        if (*(a + i) > 0) ++(*posinum_ptr);\n        else if (*(a + i) < 0) ++(*neganum_ptr);\n    }\n}\n\nint main(void) {\n    int a[10], posi_num, nega_num;\n    for (int i = 0; i < 10; ++i)\n        if (scanf(\"%d\", a + i) != 1) return 1;\n    statistic(a, 10, &posi_num, &nega_num);\n    printf(\"正数个数=%d，负数个数=%d\\n\", posi_num, nega_num);\n    return 0;\n}",
    "explanation": "主函数把两个计数变量的地址交给 statistic。通过 *posinum_ptr 和 *neganum_ptr 写入的就是主函数里的结果。两个判断都不包含 0。",
    "prompt": "原题见下图。",
    "image": "originals/lab3.png",
    "source": "实验九 · 第 5 题",
    "chapterNumber": 9
  },
  {
    "id": "lab9-7",
    "title": "从字符串中提取数字",
    "answer": "#include <stdio.h>\n\nvoid getDigits(char *s1, char *s2) {\n    while (*s1 != '\\0') {\n        if (*s1 >= '0' && *s1 <= '9')\n            *s2++ = *s1;\n        ++s1;\n    }\n    *s2 = '\\0';\n}\n\nint main(void) {\n    char s1[256], s2[256];\n    if (!fgets(s1, sizeof s1, stdin)) return 1;\n    getDigits(s1, s2);\n    puts(s2);\n    return 0;\n}",
    "explanation": "读指针逐字符移动，写指针只有遇到数字才移动。fgets 能读到空格，末尾补上空字符。题中示例得到 34129。",
    "prompt": "原题见下图。",
    "image": "originals/lab4.png",
    "source": "实验九 · 第 7 题",
    "chapterNumber": 9
  }
];
