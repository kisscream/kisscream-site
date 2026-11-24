window.courseNotes = [
  {
    "chapterNumber": 1,
    "title": "先认清一个 C 程序",
    "source": "章节原题 · 程序的组成与入口",
    "text": "程序可以拆成若干函数。每个函数负责一类工作，例如输入、比较或输出。通常从 main 开始执行，运行到一次函数调用时进入被调用函数，完成后回到调用处。函数在文件里写在前面，和它在运行时先被调用，是两回事。下面的程序先进入 main，再执行 puts，最后由 return 0 结束。",
    "code": "#include <stdio.h>\n\nint main(void) {\n    puts(\"Hello, C!\");\n    return 0;\n}",
    "output": "Hello, C!",
    "steps": [
      "stdio.h 提供 puts 的声明。",
      "puts 输出引号里的字符并加一个换行。",
      "return 0 向运行环境报告程序正常结束。"
    ]
  },
  {
    "chapterNumber": 1,
    "title": "源文件、编译、链接和运行",
    "source": "章节原题 · C 语言概述",
    "text": "用 .c 文件保存源代码。构建时，预处理先处理 #include 等指令，编译器把源代码转换成目标代码，链接器把当前目标文件和所需的其他目标文件或库合起来。运行时才由程序执行诸如输入、运算和输出的步骤。一个程序可以有多个 .c 文件，各文件先分别编译，再一起链接。",
    "tip": "“找不到函数的声明”通常是编译阶段的问题。函数已声明但链接时找不到定义，检查对应的源文件或库是否参与了构建。"
  },
  {
    "chapterNumber": 1,
    "title": "注释、缩进和分号",
    "source": "章节原题 · 注释与源程序格式",
    "text": "用 /* … */ 写块注释，C99 起也可用 // 写到当前行末的注释。注释适合解释为什么要写这一步。C 按记号识别语句，允许在记号之间换行。表达式、普通声明和 return 往往以分号结束，函数体用一对花括号界定。",
    "code": "int total =\n    1 + 2 + 3;  /* 语句跨行，仍由分号结束 */",
    "tip": "在 printf、scanf、if、for 中使用英文半角括号、引号和分号。"
  },
  {
    "chapterNumber": 2,
    "title": "从“要存什么”选择类型",
    "source": "课件第 2–12 页",
    "text": "变量要有名字和类型。int 常用于计数和下标，double 用于带小数的计算，char 可存单个字符。unsigned 表示无符号整数，short 和 long 可调整整数类型。选类型时先问要不要小数，再检查范围。课件的 Visual C++ 环境里 int 通常占 4 字节。实际大小可用 sizeof 检查，整数范围可查 <limits.h>。",
    "code": "int count = 3;\ndouble price = 2.50;\nchar grade = 'A';",
    "tip": "变量名可由字母、数字、下划线构成，首字符用字母或下划线。score2 合法，2score 不合法。int、for 等关键字有固定含义。"
  },
  {
    "chapterNumber": 2,
    "title": "常量、科学计数法和进制",
    "source": "课件第 13–28 页 · 手写图 7",
    "text": "常量是程序里直接写出的值。65、0101、0x41 分别用十、八、十六进制书写，都是十进制 65。1.25e5 是 125000，1e-3 是 0.001，1e-3f 带 f 后缀，类型是 float。将十进制整数转到八进制时反复除以 8，最后反向读取余数。",
    "steps": [
      "65 ÷ 8 得 8 余 1。",
      "8 ÷ 8 得 1 余 0。",
      "1 ÷ 8 得 0 余 1，从最后一个余数倒着读，就是八进制 101。"
    ]
  },
  {
    "chapterNumber": 2,
    "title": "字符、字符串与转义符",
    "source": "课件第 15–22 页 · 手写图 7",
    "text": "单引号写一个字符，例如 'A'。双引号写字符串，例如 \"A\"，内存里有 A 和结尾的空字符。ASCII 环境里 '0'、'A'、'a' 分别编码为 48、65、97。连续数字字符可以用减去 '0' 转成数值。",
    "code": "char digit = '7';\nint number = digit - '0';        /* 7 */\nchar name[] = \"A\";               /* 'A', '\\0' */\nprintf(\"%d\\t%s\\n\", number, name);",
    "tip": "'\\0' 是字符串终止符，'\\n' 是换行符，'\\t' 是制表符。字符 '0' 表示数字符号，数值和空字符都不同。"
  },
  {
    "chapterNumber": 2,
    "title": "除法、取余和类型转换",
    "source": "课件第 29–33、55–65 页",
    "text": "整数除法向零截断。只在赋值目标写 double，无法取回整数除法已经舍掉的小数。要在除法发生前把一个操作数变成浮点。取余 % 需要两个整数，结果的符号跟被除数一致，例如 -5%2 为 -1。",
    "code": "double a = 5 / 2;\ndouble b = (double)5 / 2;\nint ones = 507 % 10;\nprintf(\"%.1f %.1f %d\\n\", a, b, ones);",
    "output": "2.0 2.5 7",
    "steps": [
      "5/2 先得到整数 2，再变成 2.0。",
      "(double)5 先变成 5.0，除法结果是 2.5。",
      "507 除 10 余 7，余数就是个位。"
    ]
  },
  {
    "chapterNumber": 2,
    "title": "比较、逻辑和短路",
    "source": "课件第 34–43、52–54 页",
    "text": "比较运算和逻辑运算产生 0 或 1。条件中的 0 为假，非零为真。要判断 x 是否在 1 到 10 之间，写 x>=1 && x<=10。&& 要求两边都成立，左边为假就跳过右边。|| 左边为真就跳过右边。! 把真假反过来。位运算 &、|、^、~ 逐位处理整数，例如二进制 110 与 011 按位与得到 010。",
    "code": "if (d != 0 && n / d > 2) {\n    puts(\"满足条件\");\n}",
    "tip": "当 d 等于 0 时，只计算左边，右侧除法不会运行。C 中 1<=x<=10 会先算 1<=x 得到 0 或 1，再拿它与 10 比。"
  },
  {
    "chapterNumber": 2,
    "title": "赋值、自增、条件和 sizeof",
    "source": "课件第 44–51 页",
    "text": "赋值使用 =，比较相等使用 ==。a=b=5 从右边分组。++i 先更新再给出新值，i++ 给出旧值后更新。条件表达式 cond ? yes : no 只求值其中一支。逗号运算符先算左边再算右边，结果为最右项。sizeof 给出类型或对象大小，返回 size_t，可用 %zu 输出。sizeof(int) 的类型名必须带括号。",
    "code": "int i = 3;\nint old = i++;        /* old=3, i=4 */\nint newer = ++i;      /* newer=5, i=5 */\nint best = old > newer ? old : newer;\nprintf(\"%d %d %d\\n\", i, old, best);",
    "output": "5 3 5",
    "tip": "画三列跟踪“表达式的值、变量改动前的值、改动后的值”。遇到 i++ + i++ 这类同一变量被无顺序修改的表达式，不能按固定顺序硬算。"
  },
  {
    "chapterNumber": 3,
    "title": "printf 的格式、宽度与小数位",
    "source": "课件第 3–7 页",
    "text": "printf 按格式串从左到右输出。%d 对应 int，%c 对应字符，%s 对应字符串，%f 默认显示六位小数，%e 为科学计数法。%8.2f 指至少占 8 格并保留两位小数。%4d 给最小宽度，超过四位会照常显示。%-4d 左对齐，%04d 用零补足四格。写 %% 输出一个百分号。",
    "code": "printf(\"|%4d| |%-4d| |%04d|\\n\", 12, 12, 12);\nprintf(\"|%8.2f|\\n\", 3.5);",
    "output": "|  12| |12  | |0012|\n|    3.50|"
  },
  {
    "chapterNumber": 3,
    "title": "scanf 的格式要与地址匹配",
    "source": "课件第 8–13 页 · 手写图 7",
    "text": "scanf 把输入写到后面的地址，因此普通变量用 & 取地址。%d 读到 int，%f 读到 float，%lf 读到 double。scanf 返回成功写入的项数。格式串中的逗号等字面字符需要在输入里出现。例如 scanf(\"%d,%d\", &a, &b) 可以匹配 3,5。",
    "code": "int count;\ndouble price;\nif (scanf(\"%d%lf\", &count, &price) == 2) {\n    printf(\"%.2f\\n\", count * price);\n}",
    "output": "输入 3 2.5，输出 7.50。",
    "tip": "printf 输出 double 常用 %f，scanf 读入 double 要用 %lf。抓住“输出读值，输入拿地址”这两点。"
  },
  {
    "chapterNumber": 3,
    "title": "getchar 与空格、换行",
    "source": "课件第 11–16 页",
    "text": "输入不是直接从一个数字跳到下一个数字，空格和回车也可以成为字符。%c 默认读取接下来的一个字符，前面写空格的 \" %c\" 会先跳过空白。getchar 也会读换行，返回值用 int 存放，才能区别普通字符和 EOF。putchar 输出一个字符。",
    "code": "char a, b;\nscanf(\"%c%c\", &a, &b);\nint c = getchar();\nint d = getchar();\nprintf(\"%c%c%c%c\\n\", a, b, c, d);",
    "output": "输入两行 12 和 34，输出为两行 12 和 3。",
    "steps": [
      "两个 %c 读到 1 和 2。",
      "第一次 getchar 读到第一行的换行。",
      "第二次 getchar 读到第二行开头的 3。"
    ]
  },
  {
    "chapterNumber": 3,
    "title": "读一个单词、读一整行",
    "source": "课件第 8–16 页 · 字符输入延伸",
    "text": "char word[20] 可用 scanf(\"%19s\", word) 读一个单词，空白会截断，最多读取 19 个字符。要保留词语之间的空格，可用 fgets。它成功时会留下终止符，如果读进了回车，也可能把换行保存在字符串里。",
    "code": "char line[80];\nif (fgets(line, sizeof line, stdin) != NULL) {\n    printf(\"%s\", line);\n}",
    "tip": "数组名在这里已提供首元素地址，所以 word 不加 &。用 fgets 后要按题意决定是否去掉换行。"
  },
  {
    "chapterNumber": 3,
    "title": "顺序结构的第一道程序",
    "source": "课件第 17–22 页",
    "text": "把题意顺着写成三步。先读入数据，再计算中间结果，最后输出。交换两个变量时先用临时变量保存旧值。读计算实数根的程序时，先读 a、b、c，再算判别式 b*b-4*a*c。平方根函数 sqrt 的声明在 math.h。",
    "code": "int a = 3, b = 8;\nint temp = a;\na = b;\nb = temp;\nprintf(\"%d %d\\n\", a, b);",
    "output": "8 3"
  },
  {
    "chapterNumber": 4,
    "title": "流程先分三种",
    "source": "课件第 3–10 页",
    "text": "顺序是按行往下做。选择是看条件决定走哪一条路。循环是按同一规则反复做。写题时可以先用中文把过程写出来，再给每步找对应的语句。花括号把多条语句作为一组，单独的分号表示空语句。"
  },
  {
    "chapterNumber": 4,
    "title": "if 和 else if 怎么选分支",
    "source": "课件第 11–22 页 · 手写图 5、6",
    "text": "单个 if 负责一项检查，条件真才执行里面的代码。if…else 二选一。连续的 else if 从上向下找，只运行第一条成立的分支。求三个数最大值时用两条独立 if，因为 b、c 都要同当前最大值比较。",
    "code": "int a = 2, b = 5, c = 9;\nint max = a;\nif (b > max) {\n    max = b;\n}\nif (c > max) {\n    max = c;\n}\nprintf(\"%d\\n\", max);",
    "output": "9",
    "steps": [
      "起点 max=2。",
      "5 大于 2，改成 max=5。",
      "9 大于 5，再改成 max=9。"
    ],
    "tip": "嵌套条件中，else 匹配前面最近且尚未配对的 if。用大括号明确每个分支的范围。"
  },
  {
    "chapterNumber": 4,
    "title": "switch 按离散的值分支",
    "source": "课件第 23–30 页",
    "text": "switch 将整数或字符值与不同的 case 标签比较。进入匹配的标签后会向下执行，通常用 break 在本组结尾退出。多个标签可以共用一组操作。没有匹配时可以通过 default 处理。",
    "code": "char grade = 'b';\nswitch (grade) {\n    case 'A':\n    case 'a':\n        puts(\"90-100\");\n        break;\n    case 'B':\n    case 'b':\n        puts(\"80-89\");\n        break;\n    default:\n        puts(\"other\");\n}",
    "output": "80-89",
    "tip": "要按连续范围判断时优先考虑 if…else if。case 标签需要整数常量表达式。"
  },
  {
    "chapterNumber": 4,
    "title": "for · 知道要做几轮时",
    "source": "课件第 34–40 页 · 手写图 5",
    "text": "for 把循环变量的初值、继续条件、每轮更新写在一起。先初始化一次。每轮先判断条件，条件真才执行循环体，执行完更新变量，再回去判断。下面用 for 求 1+2+3。",
    "code": "int sum = 0;\nfor (int i = 1; i <= 3; ++i) {\n    sum += i;\n}\nprintf(\"%d\\n\", sum);",
    "output": "6",
    "steps": [
      "进入循环前，sum=0，i 初始化为 1。",
      "i=1 时条件成立，sum 变为 1。更新后 i=2。",
      "i=2 时，sum 从 1 变为 3。更新后 i=3。",
      "i=3 时，sum 从 3 变为 6。更新后 i=4。",
      "i=4 时，i<=3 为假，退出循环，输出 6。"
    ],
    "tip": "初值和更新可以省略，两处分号仍要保留。遍历长度为 n 的数组，常用 i=0 开始、i<n 结束。"
  },
  {
    "chapterNumber": 4,
    "title": "while · 先看条件，再取一位",
    "source": "课件第 31–36、51–53 页 · 手写图 2",
    "text": "while 先检查条件，成立才执行循环体。若开头条件就为假，循环体一次也不执行。读题时找出哪条语句会改变条件，拆位题常用 n/=10。下面逐位求正整数 507 的各位和。",
    "code": "int n = 507, sum = 0;\nwhile (n > 0) {\n    sum += n % 10;\n    n /= 10;\n}\nprintf(\"%d\\n\", sum);",
    "output": "12",
    "steps": [
      "n=507，取末位 7，sum=7。除以 10 后 n=50。",
      "n=50，取末位 0，sum 仍为 7。随后 n=5。",
      "n=5，取末位 5，sum=12，随后 n=0。",
      "n>0 不成立，退出。"
    ],
    "tip": "写成 n/10 只是算一个值，n 本身没变。要缩短数字用 n/=10。"
  },
  {
    "chapterNumber": 4,
    "title": "do…while · 至少做一次",
    "source": "课件第 41–42 页 · 手写图 5",
    "text": "do…while 先执行循环体，再判断条件。适合哪怕输入 0 也要处理一次的情形。下面计算非负整数的位数。条件放在末尾的 while 括号里，后面还要有一个分号。",
    "code": "int n = 0, digits = 0;\ndo {\n    ++digits;\n    n /= 10;\n} while (n > 0);\nprintf(\"%d\\n\", digits);",
    "output": "1",
    "steps": [
      "先运行循环体，digits 从 0 变 1。",
      "n 仍为 0，第一次检查条件就退出。",
      "如果初值是 305，n 依次变成 30、3、0，共执行三次。"
    ],
    "tip": "读题时扫一眼条件的位置。for 和 while 在前检查，do…while 在后检查。"
  },
  {
    "chapterNumber": 4,
    "title": "break、continue 与执行顺序",
    "source": "课件第 43–46 页 · 手写图 4",
    "text": "break 退出最近的循环或 switch。continue 跳过当前这轮的剩余语句。对 for 来说，continue 后仍然执行更新表达式，再检查下一次条件。判断代码顺序时，已经执行过的输出不会被随后发生的 break 撤销。",
    "code": "for (int i = 1; i <= 8; ++i) {\n    if (i == 6) break;\n    if (i % 2 == 0) continue;\n    printf(\"%d \", i);\n}",
    "output": "1 3 5",
    "steps": [
      "i=2 和 4 时执行 continue，跳过打印。",
      "i=1、3、5 都执行打印。",
      "i=6 时先遇到 break，后续轮次也停止。"
    ],
    "tip": "continue 放在 while 中时，确认跳转前循环变量已更新，或者条件还能由其他途径改变。"
  },
  {
    "chapterNumber": 4,
    "title": "双重循环 · 外层控制行，内层控制列",
    "source": "课件第 49–50 页 · 手写图 3、4",
    "text": "外层走到新的一行时，内层从初值重新开始。画星号三角形时让第 i 行打印 i 个星号，换行放到内层结束以后。改成 j<=n 会让每行等长。画空心矩形时，可在内层按当前行列的位置决定打印星号还是空格。",
    "code": "for (int row = 1; row <= 3; ++row) {\n    for (int col = 1; col <= row; ++col) {\n        putchar('*');\n    }\n    putchar('\\n');\n}",
    "output": "*\n**\n***",
    "steps": [
      "row=1，内层执行一次，然后换行。",
      "row=2，col 在新一行重新从 1 开始，打印两次。",
      "row=3，打印三次再换行。"
    ]
  },
  {
    "chapterNumber": 4,
    "title": "累加和递推 · 同时记录当前项和总和",
    "source": "课件第 54–56 页 · 手写图 1",
    "text": "累加器起点通常是 0，连乘项的起点通常是 1。求阶乘和时保留上一项的阶乘，每轮乘以 i 就得到新项，再加到 sum。求斐波那契数列时保留前两项，用临时变量记住两项之和，再更新两个位置。",
    "code": "unsigned long long term = 1, sum = 0;\nfor (int i = 1; i <= 4; ++i) {\n    term *= i;\n    sum += term;\n}\nprintf(\"%llu\\n\", sum);",
    "output": "33",
    "steps": [
      "四轮 term 依次为 1、2、6、24。",
      "对应的 sum 依次为 1、3、9、33。"
    ],
    "tip": "题目如果明确要求 sum 为实型，按要求声明 double。用浮点数计算较大的阶乘时需考虑舍入。"
  },
  {
    "chapterNumber": 4,
    "title": "拆位、计数和按要求换行",
    "source": "课件第 51–54、61 页 · 手写图 2",
    "text": "对一个三位正整数 n，n/100 取百位，n/10%10 取十位，n%10 取个位。筛选时让条件成立才增加 count。若要求每打印 6 个数换一行，观察的是已输出的计数，而非候选数的循环下标。",
    "code": "int n = 507;\nint a = n / 100, b = n / 10 % 10, c = n % 10;\nprintf(\"%d %d %d\\n\", a, b, c);",
    "output": "5 0 7",
    "tip": "以水仙花数为例，153 的 1³+5³+3³ 等于 153。程序枚举 100 到 999，对每个候选数拆位再判断。"
  },
  {
    "chapterNumber": 4,
    "title": "试除法 · 最大公约数和素数",
    "source": "课件第 47–48、57–60 页 · 手写图 3",
    "text": "对于两个正整数，最大公约数不超过其中较小的数。从较小的数往下试，两数都能整除时第一个命中就是最大公约数。辗转相除可以按 (a,b)→(b,a%b) 迭代。当 b=0 时 a 就是最大公约数。判素数时先排除小于 2 的数，只需试除到平方根，发现因数时提前退出。",
    "code": "int x = 29;\nint prime = x >= 2;\nfor (int i = 2; i <= x / i; ++i) {\n    if (x % i == 0) {\n        prime = 0;\n        break;\n    }\n}\nprintf(\"%d\\n\", prime);",
    "output": "1",
    "steps": [
      "29 的平方根在 5 和 6 之间，只测试 2、3、4、5。",
      "这些数都不能整除 29，prime 保持 1。",
      "若换成 21，试到 3 时 21%3 为 0，退出循环，结果为 0。"
    ]
  },
  {
    "chapterNumber": 5,
    "title": "声明、定义、调用与返回值",
    "source": "课件第 3–15 页",
    "text": "声明让编译器知道函数的名字、返回类型和参数类型。定义写函数真正做什么。调用时，把实际值传给函数，并接收返回结果。定义在 main 后面时，可以在前面写原型。无参数写 (void)，没有返回值的函数类型写 void。",
    "code": "#include <stdio.h>\n\nint min(int x, int y);\n\nint main(void) {\n    printf(\"%d\\n\", min(7, 3));\n    return 0;\n}\n\nint min(int x, int y) {\n    return x < y ? x : y;\n}",
    "output": "3",
    "steps": [
      "调用 min(7, 3) 时，x=7、y=3。",
      "x<y 为假，返回 y。",
      "main 得到 3，再由 printf 输出。"
    ]
  },
  {
    "chapterNumber": 5,
    "title": "实参、形参与值传递",
    "source": "课件第 8–15 页 · 手写图 4",
    "text": "实参是调用处传入的值，例如 f(a) 中 a 的值。形参是函数接收这个值的变量。在 C 里，普通参数和指针参数都按值传递。把 a 赋给普通形参后，给形参重新赋值不会修改 a。若传入地址，可以通过该地址修改 a，详见第 9 章。",
    "code": "void setToZero(int x) {\n    x = 0;\n}\n\n/* 假设在 main 中执行以下三行 */\nint a = 6;\nsetToZero(a);\nprintf(\"%d\\n\", a);",
    "output": "6",
    "tip": "遇到读程序题时，分别写下主调函数的变量和被调函数的形参。相同的名字也可能属于不同作用域。"
  },
  {
    "chapterNumber": 5,
    "title": "嵌套调用与计算组合数",
    "source": "课件第 16–20 页 · 实验五",
    "text": "可以让函数调用另一个函数。组合数先拆成三个阶乘，再回到求组合数的函数做除法。main 调用组合数函数，组合数函数调用阶乘函数。把接口和分工确定以后，可以分别检查每个函数。",
    "code": "int fact(int n) {\n    int result = 1;\n    for (int i = 2; i <= n; ++i) {\n        result *= i;\n    }\n    return result;\n}\n\nint combination(int m, int r) {\n    return fact(m) / (fact(r) * fact(m - r));\n}",
    "steps": [
      "combination(6,4) 需要求 6!、4!、2!。",
      "得到 720、24、2 后再做 720/(24*2)，返回 15。"
    ],
    "tip": "教学例只适用于阶乘可存入 int 的非负输入。分母整体要加括号。"
  },
  {
    "chapterNumber": 5,
    "title": "递归先找出口，再缩小问题",
    "source": "课件第 21–28 页",
    "text": "递归时每次调用都有自己的参数与局部变量。先写到哪一步可以直接返回，再把剩余问题变小。比如 n! 等于 n 乘 (n−1)!，而 0! 和 1! 都为 1。",
    "code": "int fact(int n) {\n    if (n <= 1) return 1;\n    return n * fact(n - 1);\n}",
    "steps": [
      "fact(4) 暂时等着 4*fact(3)，fact(3) 等着 3*fact(2)。",
      "fact(2) 调用 fact(1)，后者直接返回 1。",
      "返回时依次得到 2、6、24。"
    ],
    "tip": "本例的输入范围是小的非负整数。没有递归出口，或参数一直走不向出口，都会使递归不能正常完成。"
  },
  {
    "chapterNumber": 5,
    "title": "库函数按头文件使用",
    "source": "课件第 29–30 页",
    "text": "调用标准库函数时，先引入提供声明的头文件。printf 和 getchar 在 stdio.h，sqrt 和 fabs 在 math.h，toupper 和 isalpha 在 ctype.h，strlen 和 strcmp 在 string.h。函数名、参数类型、返回值要一起看。",
    "code": "#include <ctype.h>\n#include <stdio.h>\n\nint main(void) {\n    int ch = getchar();\n    if (ch != EOF) putchar(toupper(ch));\n    return 0;\n}",
    "output": "输入 a，输出 A。"
  },
  {
    "chapterNumber": 5,
    "title": "作用域、遮蔽与 static",
    "source": "课件第 31–46 页",
    "text": "作用域说的是名字在哪里可见。块内部声明的变量从声明处开始可用，出了对应花括号便不可见。内层同名变量会遮住外层变量。存储期说的是对象存在多久。普通局部变量通常每次进入块都建立，static 局部变量只初始化一次并保留先前的值。文件作用域用 static 可限制名字的链接范围，extern 常用来声明其他地方定义的变量。",
    "code": "void counter(void) {\n    int a = 0;\n    static int b = 0;\n    printf(\"%d %d\\n\", ++a, ++b);\n}",
    "output": "调用三次，分别输出 1 1、1 2、1 3。",
    "steps": [
      "每次调用 a 都重新从 0 开始。",
      "b 从上一次留下的值继续加 1。"
    ]
  },
  {
    "chapterNumber": 6,
    "title": "预处理先完成，再编译源程序",
    "source": "课件第 2–8 页",
    "text": "以 # 开头的预处理指令用来包含文件、定义宏和条件编译等。简单宏适合给数值或短片段命名。#define LIMIT 10 后面用到 LIMIT 时，预处理阶段以记号 10 替换它。宏名出现在字符串里时不会替换，#undef 可以取消宏。",
    "code": "#define LIMIT 10\nprintf(\"LIMIT=%d\\n\", LIMIT);",
    "output": "LIMIT=10",
    "tip": "宏定义通常不带尾分号。加上的分号会成为展开内容的一部分。"
  },
  {
    "chapterNumber": 6,
    "title": "带参数的宏 · 展开完才计算",
    "source": "课件第 9–13 页",
    "text": "带参数的宏通过代换生成表达式，不能自动给实参补括号。把 X*X 中的 X 原样替换为 2+1，会得到 2+1*2+1，先乘法再加法，结果是 5。给每个参数和整体都加括号，才能得到期望的平方。",
    "code": "#define RAW_SQR(x) x*x\n#define SQR(x) ((x) * (x))\nprintf(\"%d %d\\n\", RAW_SQR(2+1), SQR(2+1));",
    "output": "5 9",
    "tip": "SQR(i++) 会展开成两次 i++，不要把会改变状态的表达式直接传给这种宏。需要只求值一次时可用普通函数。"
  },
  {
    "chapterNumber": 6,
    "title": "头文件与条件编译",
    "source": "课件第 14–19 页 · 预处理延伸",
    "text": "尖括号常用于系统头文件，双引号常用于项目头文件，实际查找路径由编译器决定。头文件可以放函数声明和供多个源文件使用的类型。用包含保护让同一翻译单元多次 #include 时只处理一次主体。",
    "code": "#ifndef MATH_UTILS_H\n#define MATH_UTILS_H\n\nint gcd(int a, int b);\n\n#endif",
    "steps": [
      "第一次包含时，还未定义 MATH_UTILS_H，所以处理主体。",
      "后续再次包含时，该宏已经定义，跳过主体。"
    ]
  },
  {
    "chapterNumber": 7,
    "title": "一维数组、初始化与下标",
    "source": "课件第 2–17 页",
    "text": "数组是连续存放的一组同类型元素。长度为 n 时，下标从 0 到 n−1。初值个数少于长度时，剩余位置填 0。在数组定义所在的作用域，可通过 sizeof a / sizeof a[0] 计算元素个数。数组作函数参数时会调整为指针，长度需要另外传入。",
    "code": "int a[5] = {4, 2, 8};\nfor (int i = 0; i < 5; ++i) {\n    printf(\"%d \", a[i]);\n}",
    "output": "4 2 8 0 0",
    "tip": "i<=5 会访问 a[5]，这个位置在数组之外。用 i<5。"
  },
  {
    "chapterNumber": 7,
    "title": "原地逆序与删除元素",
    "source": "课件第 13–17 页 · 综合练习第 13 题",
    "text": "逆序时交换第 i 项和第 n−1−i 项，只循环到 n/2。删除所有指定值时，可以用两个下标。read 逐个读取，write 指向下一个保留位置。留下的元素按原来顺序前移，write 的最终值是新长度。",
    "code": "int a[] = {9, 5, 6, 5, 7};\nint write = 0;\nfor (int read = 0; read < 5; ++read) {\n    if (a[read] != 5) a[write++] = a[read];\n}",
    "output": "新长度为 3，前三项为 9 6 7。",
    "tip": "后面的空间还在，只按新长度访问或输出有效部分。"
  },
  {
    "chapterNumber": 7,
    "title": "冒泡排序 · 每次比较相邻项",
    "source": "课件第 18–26 页",
    "text": "从左往右比较相邻元素，发现前一个比后一个大就交换。一趟后，本轮最大的元素到达末尾。下一趟的比较范围少一个位置。当只剩一个未确定位置时就结束。",
    "code": "for (int end = n - 1; end > 0; --end) {\n    for (int j = 0; j < end; ++j) {\n        if (a[j] > a[j + 1]) {\n            int temp = a[j];\n            a[j] = a[j + 1];\n            a[j + 1] = temp;\n        }\n    }\n}",
    "steps": [
      "初始数组 4 1 3。",
      "比较 4、1，交换成 1 4 3；再比较 4、3，交换成 1 3 4。",
      "最后考察前两个位置，已经有序。"
    ]
  },
  {
    "chapterNumber": 7,
    "title": "选择排序与有序插入",
    "source": "课件第 26–35 页",
    "text": "选择排序确定当前位置 i 时，先在 a[i] 到末尾中找最小项的下标，再交换到 a[i]。例如 5 4 2 3，第一趟选 2，变为 2 4 5 3。第二趟只在后面三项选，变为 2 3 5 4。有序数组插入新值前要留出空间，从末端向右搬动大于新值的项，找到位置后再放入。",
    "tip": "冒泡法做的是相邻比较和交换。选择法记住最小值下标，一趟查找完成后才交换。"
  },
  {
    "chapterNumber": 7,
    "title": "顺序查找与折半查找",
    "source": "课件第 35–45 页",
    "text": "顺序查找从第一个元素往后比，数据无需排序。折半查找要求有序，依次检查中间位置。查升序数组时，目标小于中值就把右界设为 mid−1，目标大于中值就把左界设为 mid+1。左界超过右界代表查找失败。查交集时，也可以对第一个集合的每项到第二个集合里顺序查找。",
    "steps": [
      "在 [2,4,7,9,15] 中找 9，范围初始为下标 0 到 4。",
      "中点为下标 2，a[2]=7，所以抬高左界到 3。",
      "新中点为下标 3，找到 9。若题目用从 1 开始的序号，则答案为 4。"
    ]
  },
  {
    "chapterNumber": 7,
    "title": "二维数组的行列、最值和转置",
    "source": "课件第 43–61 页",
    "text": "a[i][j] 先定行 i，再定列 j。二维数组按行排，通常两层循环遍历。求最小值时，把第一个元素作为起点。遇到更小的值，同时记下对应行列。做转置时原第 i 行第 j 列放入新第 j 行第 i 列，3×4 的结果大小为 4×3。对于参数 int a[][4]，4 决定每行跨多少个元素。",
    "code": "int a[2][3] = {{1, 2, 3}, {4, 5, 6}};\nint b[3][2];\nfor (int i = 0; i < 2; ++i) {\n    for (int j = 0; j < 3; ++j) {\n        b[j][i] = a[i][j];\n    }\n}",
    "output": "转置的三行依次为 1 4、2 5、3 6。"
  },
  {
    "chapterNumber": 7,
    "title": "字符数组、终止符与字符串函数",
    "source": "课件第 62–81 页",
    "text": "字符串在首个空字符处结束。char s[]=\"abc\" 长度为 3，占 4 个字节。strlen 数终止符前的字符。strcmp 比较字符串内容，返回负、零或正。strcpy 复制时包含终止符，strcat 从目标串的终止符位置往后拼接。使用这两种函数前都要确保目标空间足够。",
    "code": "char src[] = \"Hi\";\nchar dst[3];\nint i = 0;\nwhile (src[i] != '\\0') {\n    dst[i] = src[i];\n    ++i;\n}\ndst[i] = '\\0';\nputs(dst);",
    "output": "Hi",
    "tip": "char a[3]={'H','i','!'} 只是三个字符。要把它交给 %s，需要另外为终止符留一个位置。"
  },
  {
    "chapterNumber": 8,
    "title": "结构体把不同类型的数据放进同一条记录",
    "source": "课堂原题 · 例 8.1",
    "text": "数组里的元素类型相同，结构体的各个成员可以有不同的类型。例如学生记录同时需要学号、姓名和分数。定义结构体类型后，再用该类型定义变量。变量的成员用点号访问。",
    "code": "struct Student {\n    int id;\n    char name[20];\n    double score;\n};\n\nstruct Student s = {1001, \"Lili\", 92.5};\nprintf(\"%d %s %.1f\\n\", s.id, s.name, s.score);",
    "output": "1001 Lili 92.5"
  },
  {
    "chapterNumber": 8,
    "title": "结构体数组、嵌套和 typedef",
    "source": "章节原题 · 结构体数组与类型别名",
    "text": "每个结构体数组元素都是一整条记录，先通过 s[i] 选记录，再通过点号选成员。结构体也能嵌套。例如 s[i].birthday.year 是第 i 条记录的出生年份。typedef 为类型起一个别名，使用别名时可以省掉 struct 关键字。",
    "code": "typedef struct {\n    int year, month, day;\n} Date;\n\nstruct Student {\n    char name[20];\n    Date birthday;\n};\n\nstruct Student s[2] = {{\"Lili\", {2006, 5, 1}},\n                       {\"Ming\", {2007, 8, 9}}};\nprintf(\"%d\\n\", s[1].birthday.year);",
    "output": "2007"
  },
  {
    "chapterNumber": 8,
    "title": "赋值、参数和 sizeof 的填充",
    "source": "章节原题 · 结构体的赋值、传参与大小",
    "text": "同类型结构体可以整体赋值，结构体内的数组也会随整条记录复制。不过单独写 s1.name=s2.name 仍然不合法。结构体值作形参时函数改的是副本，结构体数组作参数时可以改原元素。结构体的成员之间或末尾可能有填充字节，因此 sizeof 的结果还受对齐要求影响。",
    "tip": "辨认代码是在改普通结构体的副本、改数组中的元素，还是通过结构体指针改原变量。"
  },
  {
    "chapterNumber": 9,
    "title": "地址与解引用 · 分清 x、&x 和 *p",
    "source": "课堂原题 · 指针例 9-2 至 9-4",
    "text": "指针变量保存某个对象的地址。&x 取地址。若 p=&x，读 *p 得到 x 的值，写 *p 就会改到 x。指针类型和它所指的对象类型要相符，并且在解引用前已经有有效目标。",
    "code": "int x = 200;\nint *p = &x;\nint old = *p;\n*p = 100;\nprintf(\"%d %d\\n\", old, x);",
    "output": "200 100",
    "steps": [
      "p 保存 x 的地址。",
      "old 只是复制了 x 当时的值 200。",
      "通过 *p 把 x 写成 100，old 仍为 200。"
    ],
    "tip": "已知 int *p = &x，读整数用 scanf(\"%d\", p)。只有 int *p; 时，p 尚未指向可写的 int 对象。"
  },
  {
    "chapterNumber": 9,
    "title": "指针也按值传递 · 怎么改调用者",
    "source": "课堂原题 · 交换形参、实验九第 5 题",
    "text": "把地址传给函数时，形参收到地址的副本。函数通过解引用可以修改那个地址里的对象。如果在函数里把形参指针改为指向一个局部变量，调用者原来的指针并不会改指向。若要一次给回两个结果，可以传两个输出变量的地址。",
    "code": "void swap(int *p, int *q) {\n    int temp = *p;\n    *p = *q;\n    *q = temp;\n}\n\n/* main 中 */\nint a = 3, b = 9;\nswap(&a, &b);",
    "output": "调用后 a=9，b=3。",
    "steps": [
      "p 指向 a，q 指向 b。",
      "temp 记住旧 a。",
      "把 b 写进 a，再把 temp 写进 b。"
    ]
  },
  {
    "chapterNumber": 9,
    "title": "数组的指针运算和边界",
    "source": "课堂原题 · 例 9-11 至 9-13、实验九第 2 题",
    "text": "对同一数组，a+i 表示第 i 个元素的地址，*(a+i) 取该元素。p+1 向后移动一个元素的距离，例如 int 指针在常见环境移动 4 字节。指针可以移动到数组尾后一位作为结束条件，但这个位置不能解引用。",
    "code": "int a[] = {2, 4, 6};\nint sum = 0;\nfor (int *p = a; p != a + 3; ++p) {\n    sum += *p;\n}\nprintf(\"%d\\n\", sum);",
    "output": "12",
    "steps": [
      "指针依次指向值为 2、4、6 的三个元素。",
      "p 增至 a+3 时条件为假，循环退出。"
    ]
  },
  {
    "chapterNumber": 9,
    "title": "*p++、(*p)++、++*p 有什么区别",
    "source": "章节原题 · 指针自增",
    "text": "后缀 ++ 优先于前缀 *，所以 *p++ 与 *(p++) 等价。它用旧指针取值，并让指针往后移。(*p)++ 和 ++*p 都增加所指对象的值，指针仍指向原位置。区别是前者表达式给旧值，后者给新值。",
    "code": "int a[] = {4, 8};\nint *p = a;\nint first = *p++;\nint second = ++*p;\nprintf(\"%d %d\\n\", first, second);",
    "output": "4 9",
    "steps": [
      "第一句用旧 p 取 4，然后 p 移到第二项。",
      "第二句把当前元素从 8 加到 9，并把新值存入 second。"
    ]
  },
  {
    "chapterNumber": 9,
    "title": "字符指针、空字符与逐字符筛选",
    "source": "课堂原题 · 实验九第 7 题",
    "text": "字符指针能逐字符访问字符串。读指针每轮前进一步，写指针只在保留字符时前进。实验九提取数字时用 '0'<=*s1 && *s1<='9' 判断。处理完一定要补空字符，目标空间要容纳全部保留字符和这一个结束符。用字符指针指向字符串字面量时，通常写 const char * 以避免修改字面量。",
    "code": "void getDigits(char *in, char *out) {\n    for (; *in != '\\0'; ++in) {\n        if (*in >= '0' && *in <= '9') {\n            *out++ = *in;\n        }\n    }\n    *out = '\\0';\n}",
    "output": "输入 a34bb 12ck9 zy，结果为 34129。"
  }
];
