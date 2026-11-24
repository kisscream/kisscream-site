window.programQuestions = [
  {
    "id": "pdf-1",
    "title": "第1题　阶乘累加",
    "source": "《C语言程序设计-编程复习题2026》 第1页 · 第1题",
    "prompt": "编写程序计算 sum= 1!+2!+3!+4!+…+n!。要求从键盘输入整型量 n，sum用实型量表示。",
    "answer": "#include <stdio.h>\n#include <float.h>\n\nint main(void) {\n    int n;\n    double term = 1.0, sum = 0.0;\n    if (scanf(\"%d\", &n) != 1 || n < 0)\n        return 1;\n    for (int i = 1; i <= n; ++i) {\n        if (term > DBL_MAX / i) {\n            puts(\"超出 double 的表示范围\");\n            return 1;\n        }\n        term *= i;\n        sum += term;\n    }\n    printf(\"sum=%.0f\\n\", sum);\n    return 0;\n}",
    "explanation": "把上一轮的阶乘留下来。若上一轮 term 是 3!，下一轮乘 4 就得到 4!，再把它加入 sum。输入 4 时依次加 1、2、6、24，输出 sum=33。按题意用实型，大数结果可能有舍入。"
  },
  {
    "id": "pdf-2",
    "title": "第2题　斐波那契分数数列",
    "source": "《C语言程序设计-编程复习题2026》 第1页 · 第2题",
    "prompt": "Fibonacci 数列为 1, 1, 2, 3, 5, 8, 13, ……。编程实现求分数序列前20项的和：\nsum = 1/1 + 2/1 + 3/2 + 5/3 + 8/5 + 13/8 + 21/13 + …\n提示：注意分子分母的变化规律。程序正确的运行结果是：result=32.042227。",
    "answer": "#include <stdio.h>\n\nint main(void) {\n    int numerator = 1, denominator = 1;\n    double sum = 0.0;\n    for (int i = 0; i < 20; ++i) {\n        sum += (double)numerator / denominator;\n        int next = numerator + denominator;\n        denominator = numerator;\n        numerator = next;\n    }\n    printf(\"result=%.6f\\n\", sum);\n    return 0;\n}",
    "explanation": "先加当前项，再换分子分母。第三项 3/2 换成下一项时，分母取旧分子 3，分子取 3+2=5。除法前转为 double，才能保留小数。20 项的和保留六位小数为 32.042227。",
    "image": "fraction-series.jpg"
  },
  {
    "id": "pdf-3",
    "title": "第3题　水仙花数的两种算法",
    "source": "《C语言程序设计-编程复习题2026》 第1页 · 第3题",
    "prompt": "求出并输出所有的“水仙花数”。所谓“水仙花数”是指一个三位数，其各位数字的立方和等于该数本身。例如：153 是一个水仙花数，因为 153=1³+5³+3³。满足条件的水仙花数有四个，它们是 153，370，371 和 407。要求两种算法都要实现。",
    "answer": "#include <stdio.h>\n\nint cube(int x) {\n    return x * x * x;\n}\n\nint main(void) {\n    puts(\"算法一\");\n    for (int n = 100; n <= 999; ++n) {\n        int a = n / 100, b = n / 10 % 10, c = n % 10;\n        if (cube(a) + cube(b) + cube(c) == n)\n            printf(\"%d \", n);\n    }\n    puts(\"\\n算法二\");\n    for (int a = 1; a <= 9; ++a) {\n        for (int b = 0; b <= 9; ++b) {\n            for (int c = 0; c <= 9; ++c) {\n                int n = 100 * a + 10 * b + c;\n                if (cube(a) + cube(b) + cube(c) == n)\n                    printf(\"%d \", n);\n            }\n        }\n    }\n    putchar('\\n');\n    return 0;\n}",
    "explanation": "第一种从三位数拆出百、十、个位。第二种让三位数字独立变化，再把它们拼成三位数。百位从 1 开始。两种方法都输出 153、370、371、407。"
  },
  {
    "id": "pdf-4",
    "title": "第4题　素数判定与分行输出",
    "source": "《C语言程序设计-编程复习题2026》 第1页 · 第4题",
    "prompt": "编写程序求出并输出 100~200 之间的所有素数并统计该范围内素数的个数。\n要求：\n（1）编写函数 int isprime(int x) 实现“判断一个数 x 是否为素数”，若是，返回“真”，否则返回“假”。\n（2）其他所有工作均在主函数中完成。要求每行输出 8 个素数，用'\\t'实现输出列对齐。最后输出素数个数。",
    "answer": "#include <stdio.h>\n\nint isprime(int x) {\n    if (x < 2) return 0;\n    for (int d = 2; d <= x / d; ++d) {\n        if (x % d == 0) return 0;\n    }\n    return 1;\n}\n\nint main(void) {\n    int count = 0;\n    for (int x = 100; x <= 200; ++x) {\n        if (isprime(x)) {\n            printf(\"%d\", x);\n            ++count;\n            putchar(count % 8 == 0 ? '\\n' : '\\t');\n        }\n    }\n    if (count % 8 != 0) putchar('\\n');\n    printf(\"素数个数=%d\\n\", count);\n    return 0;\n}",
    "explanation": "如果 x 是合数，一对子因数中较小的那个一定不超过 √x；试除到 d ≤ x/d 即可。每输出一个素数再增加计数，遇到第 8、16 个时换行。总计 21 个，最后一行是 181、191、193、197、199。"
  },
  {
    "id": "pdf-5",
    "title": "第5题　最大公约数函数",
    "source": "《C语言程序设计-编程复习题2026》 第1页 · 第5题",
    "prompt": "编写函数 int gcd(int x, int y) 求两个正整数的最大公约数。在主函数中任意输入两个正整数 m 和 n，调用 gcd 函数求出并输出最大公约数。用于验证的 m 和 n 的值可以是 24 和 16，或 21 和 35。",
    "answer": "#include <stdio.h>\n\nint gcd(int x, int y) {\n    while (y != 0) {\n        int remainder = x % y;\n        x = y;\n        y = remainder;\n    }\n    return x;\n}\n\nint main(void) {\n    int m, n;\n    if (scanf(\"%d%d\", &m, &n) != 2 || m <= 0 || n <= 0)\n        return 1;\n    printf(\"%d\\n\", gcd(m, n));\n    return 0;\n}",
    "explanation": "辗转相除利用 gcd(x,y)=gcd(y,x%y)。以 24、16 为例，24 除以 16 余 8，16 除以 8 余 0，最后一个非零除数 8 就是答案。21、35 的答案是 7。"
  },
  {
    "id": "pdf-6",
    "title": "第6题　删除数组中所有指定值",
    "source": "《C语言程序设计-编程复习题2026》 第1页 · 第6题",
    "prompt": "编写函数 void output (int a [], int n) 输出数组 a 中的 n 个元素。编写函数 int deleteElement (int a [], int n, int x) 将具有 n 个元素的一维数组 a 中出现的 x 删除，重复出现的 x 均需删除，函数的返回值为删除 x 后的数组 a 中的实际元素个数。\n例如：初始 a 数组中有 6 个元素，它们是{9,5,6,7,8,5}，删除元素 5 后，结果数组是{9,6,7,8}，其中有 4 个元素，函数返回4。",
    "answer": "#include <stdio.h>\n\nvoid output(int a[], int n) {\n    for (int i = 0; i < n; ++i)\n        printf(\"%s%d\", i == 0 ? \"\" : \" \", a[i]);\n    putchar('\\n');\n}\n\nint deleteElement(int a[], int n, int x) {\n    int kept = 0;\n    for (int i = 0; i < n; ++i) {\n        if (a[i] != x) {\n            a[kept] = a[i];\n            ++kept;\n        }\n    }\n    return kept;\n}\n\nint main(void) {\n    int a[] = {9, 5, 6, 7, 8, 5};\n    int n = sizeof a / sizeof a[0];\n    output(a, n);\n    n = deleteElement(a, n, 5);\n    output(a, n);\n    printf(\"n=%d\\n\", n);\n    return 0;\n}",
    "explanation": "用 i 读，用 kept 指向下一个空位。每次只抄要保留的值，即使连续出现多个 x 也能全部跳过。删除后只输出前 kept 项，原题示例为 9 6 7 8，函数返回 4。"
  },
  {
    "id": "pdf-7",
    "title": "第7题　数组排序",
    "source": "《C语言程序设计-编程复习题2026》 第1页 · 第7题",
    "prompt": "数组元素排序。\n要求：在主程序定义并输出原始数组，再调用排序函数实现数组元素排序，最后输出排序后的数组元素。",
    "answer": "#include <stdio.h>\n\nvoid sort(int a[], int n) {\n    for (int end = n - 1; end > 0; --end) {\n        for (int j = 0; j < end; ++j) {\n            if (a[j] > a[j + 1]) {\n                int t = a[j];\n                a[j] = a[j + 1];\n                a[j + 1] = t;\n            }\n        }\n    }\n}\n\nvoid output(int a[], int n) {\n    for (int i = 0; i < n; ++i)\n        printf(\"%s%d\", i == 0 ? \"\" : \" \", a[i]);\n    putchar('\\n');\n}\n\nint main(void) {\n    int a[] = {5, 2, 8, 2, 1};\n    int n = sizeof a / sizeof a[0];\n    output(a, n);\n    sort(a, n);\n    output(a, n);\n    return 0;\n}",
    "explanation": "原题未给数组取值、排序方向或算法，这里用示例数据演示升序冒泡排序。相邻两个数若左大右小就交换，每一轮把当前最大值送到右端。示例第二行输出 1 2 2 5 8。"
  },
  {
    "id": "pdf-8",
    "title": "第8题　二维数组的周边元素之和",
    "source": "《C语言程序设计-编程复习题2026》 第2页 · 第8题",
    "prompt": "给定二维数组如下，请编写函数 int sumBorder (int a[][M]) 求二维数组周边元素之和。\na =\n3 6 4 6 1\n8 3 1 3 2\n4 7 1 2 7\n2 9 5 3 3\n要求：在主函数中定义二维数组 a 并用上面的值初始化。用数组名做函数参数，调用函数 sumBorder () 得到求和结果；然后以二维方式输出数组，最后输出求和结果。二维数组是 N 行×M 列的，定义行数 N 和列数 M 为符号常量。",
    "answer": "#include <stdio.h>\n#define N 4\n#define M 5\n\nint sumBorder(int a[][M]) {\n    int sum = 0;\n    for (int i = 0; i < N; ++i) {\n        for (int j = 0; j < M; ++j) {\n            if (i == 0 || i == N - 1 || j == 0 || j == M - 1)\n                sum += a[i][j];\n        }\n    }\n    return sum;\n}\n\nint main(void) {\n    int a[N][M] = {\n        {3, 6, 4, 6, 1}, {8, 3, 1, 3, 2},\n        {4, 7, 1, 2, 7}, {2, 9, 5, 3, 3}\n    };\n    int sum = sumBorder(a);\n    for (int i = 0; i < N; ++i) {\n        for (int j = 0; j < M; ++j)\n            printf(\"%d%c\", a[i][j], j + 1 == M ? '\\n' : '\\t');\n    }\n    printf(\"sum=%d\\n\", sum);\n    return 0;\n}",
    "explanation": "最上行、最下行、最左列和最右列组成周边。用一个 if 把四个条件用 || 连接，四角即使符合两个条件也只加一次。上边 20，下边 22，中间两行两端为 8+2 和 4+7，答案 63。",
    "image": "border-matrix.jpg"
  },
  {
    "id": "pdf-9",
    "title": "第9题　一行字符串的五类计数",
    "source": "《C语言程序设计-编程复习题2026》 第2页 · 第9题",
    "prompt": "输入一行字符串，分别统计其中大写字母、小写字母、数字字符、空格以及其他字符出现的次数。例如，若字符串为\"A Student & 5 Teachers.\"，则其中大写字母出现 3 次，小写字母出现 13 次，数字字符出现 1 次，空格出现 4 次，其他字符出现 2 次。\n要求：用 gets() 输入字符串到字符数组中，然后统计并输出结果，所有的工作都在主函数中完成。",
    "answer": "#include <stdio.h>\n#include <ctype.h>\n#include <string.h>\n\n/* C11 起已移除库函数 gets。兼容题面调用，限制读入长度。 */\n#define gets(array) fgets((array), sizeof(array), stdin)\n\nint main(void) {\n    char s[1024];\n    int upper = 0, lower = 0, digit = 0, space = 0, other = 0;\n    /* 一行很长时分段读入，直到本行换行或文件结束。 */\n    while (gets(s) != NULL) {\n        for (int i = 0; s[i] != '\\0' && s[i] != '\\n'; ++i) {\n            unsigned char c = (unsigned char)s[i];\n            if (isupper(c)) ++upper;\n            else if (islower(c)) ++lower;\n            else if (isdigit(c)) ++digit;\n            else if (c == ' ') ++space;\n            else ++other;\n        }\n        if (strchr(s, '\\n') != NULL) break;\n    }\n    printf(\"大写=%d 小写=%d 数字=%d 空格=%d 其他=%d\\n\",\n           upper, lower, digit, space, other);\n    return 0;\n}",
    "explanation": "按互斥的五类逐个计数。空格判断用 c == ' '，输入末尾的换行只表示这一行结束。样例中大写是 A、S、T，其他字符是 & 和句点。课上旧版 gets 不限制输入长度；本答案用同名宏保留题面写法，实际由有长度限制的 fgets 读取。"
  },
  {
    "id": "pdf-10",
    "title": "第10题　字符串逆序",
    "source": "《C语言程序设计-编程复习题2026》 第2页 · 第10题",
    "prompt": "编写函数 void reverse(char s[])，实现将字符串 s 逆向存放。例如若原 s 字符串为 \"abcde\"，则结果 s 为\"edcba\"。在主函数中输入字符串 s，调用 reverse 函数得到逆向存放后的新字符串，输出新的 s。",
    "answer": "#include <stdio.h>\n#include <string.h>\n\nvoid reverse(char s[]) {\n    size_t len = strlen(s);\n    for (size_t i = 0; i < len / 2; ++i) {\n        size_t j = len - 1 - i;\n        char temp = s[i];\n        s[i] = s[j];\n        s[j] = temp;\n    }\n}\n\nint main(void) {\n    char s[1024];\n    if (fgets(s, sizeof s, stdin) == NULL) return 1;\n    s[strcspn(s, \"\\n\")] = '\\0';\n    reverse(s);\n    puts(s);\n    return 0;\n}",
    "explanation": "先去掉输入换行，再对称交换。abcde 先交换 a、e，再交换 b、d，正中间的 c 保持原位。结束符在 strlen 给出的位置，交换范围仅包含有效字符。"
  },
  {
    "id": "pdf-11",
    "title": "第11题　用指针循环左移数组",
    "source": "《C语言程序设计-编程复习题2026》 第2页 · 第11题",
    "prompt": "编程实现：将一个具有n个元素的数组循环左移k位。循环左移一位的意义是：将数组全体元素左移一位，最左边元素移到数组最右边。例如，对初始数组int a[]={ 2, 3, 4, 5, 6, 7, 8, 9 }; 循环左移3位后，数组a的元素变成 { 5, 6, 7, 8, 9, 2, 3, 4 }；\n要求：\n（1）编写函数void moveLeft(int *a, int n) 将含有n个元素的数组a循环左移1位。\n（2）编写函数void rotateLeft(int *a, int n, int k)，在该函数中调用k次moveLeft()函数，最终实现将数组循环左移k位。\n（3）主函数中定义并初始化数组a，输出数组原始数据。任意输入k，调用rotateLeft()函数实现将数组循环左移k位，最后在主函数中输出结果数组。\n（4）提示：在上述程序中，均要求用指针访问数组元素。",
    "answer": "#include <stdio.h>\n\nvoid moveLeft(int *a, int n) {\n    if (n < 2) return;\n    int first = *a;\n    for (int *p = a; p < a + n - 1; ++p)\n        *p = *(p + 1);\n    *(a + n - 1) = first;\n}\n\nvoid rotateLeft(int *a, int n, int k) {\n    for (int i = 0; i < k; ++i)\n        moveLeft(a, n);\n}\n\nvoid output(const int *a, int n) {\n    for (const int *p = a; p < a + n; ++p)\n        printf(\"%s%d\", p == a ? \"\" : \" \", *p);\n    putchar('\\n');\n}\n\nint main(void) {\n    int a[] = {2, 3, 4, 5, 6, 7, 8, 9};\n    int n = sizeof a / sizeof *a, k;\n    output(a, n);\n    if (scanf(\"%d\", &k) != 1 || k < 0) return 1;\n    rotateLeft(a, n, k);\n    output(a, n);\n    return 0;\n}",
    "explanation": "先保存第一个值，从左向右把右侧邻居搬过来，最后把保存的值填到尾部。每调用一次 moveLeft 就移动一位，按题目要求恰好调用 k 次。输入 3，输出 5 6 7 8 9 2 3 4。"
  },
  {
    "id": "pdf-12",
    "title": "第12题　用指针带回正数和负数个数",
    "source": "《C语言程序设计-编程复习题2026》 第3页 · 第12题",
    "prompt": "一维数组中有10个元素，编程统计该数组中的正数个数和负数个数。\n要求：\n（1）编写函数 void statistic (int *a, int n, int *posinum_ptr, int *neganum_ptr)；用于统计具有n个元素的a数组中正数和负数的个数，前两个参数是数组起始地址和元素个数，第三个和第四个参数分别是主函数中posi_num和nega_num两个变量的指针。本函数通过指针带回两个统计结果。\n（2）在主函数中定义数组a，输入数组初值，定义两个统计量posi_num和nega_num，分别存放正数个数和负数个数的统计结果。调用statistic()函数进行统计，并在主函数中输出结果。",
    "answer": "#include <stdio.h>\n\nvoid statistic(int *a, int n, int *posinum_ptr, int *neganum_ptr) {\n    *posinum_ptr = 0;\n    *neganum_ptr = 0;\n    for (int *p = a; p < a + n; ++p) {\n        if (*p > 0) ++(*posinum_ptr);\n        else if (*p < 0) ++(*neganum_ptr);\n    }\n}\n\nint main(void) {\n    int a[10], posi_num, nega_num;\n    for (int *p = a; p < a + 10; ++p) {\n        if (scanf(\"%d\", p) != 1) return 1;\n    }\n    statistic(a, 10, &posi_num, &nega_num);\n    printf(\"正数个数=%d 负数个数=%d\\n\", posi_num, nega_num);\n    return 0;\n}",
    "explanation": "主函数交给 statistic 两个计数变量的地址，函数通过 *posinum_ptr 和 *neganum_ptr 直接改写它们。0 两边都不计。输入 -3 0 2 -1 0 5 7 -8 1 0，结果为正数 4 个、负数 3 个。"
  }
];
