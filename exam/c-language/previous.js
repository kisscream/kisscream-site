window.previousQuestions = [
  {
    "id": "previous-1-2",
    "title": "例 9-3｜直接访问和间接访问",
    "source": "11月15日 C语言课堂原题与解析 · 1794727370611  ·  03:00",
    "prompt": "投影原题见图。",
    "answer": "输出 AA,BB,aa。",
    "explanation": "cp=&c 后，c 和 *cp 访问同一个字符。\n第一次读到 A。执行 c='B' 后，两处都读到 B。\n执行 *cp='a' 写入 c，因此最后两个字符都是 a。\n老师强调  老师画箭头标出 cp 指向 c。",
    "images": [
      "originals/class-1-2-0.webp"
    ]
  },
  {
    "id": "previous-1-4",
    "title": "例 9-4｜用指针改变变量",
    "source": "11月15日 C语言课堂原题与解析 · 1794727370611  ·  05:00",
    "prompt": "投影原题见图。",
    "answer": "依次输出 1,5.20,A / 1,5.20,A / 2,7.20,D。",
    "explanation": "先用 a、b、c 直接读，再用 *p1、*p2、*p3 间接读，前两行相同。\n三次写入分别让 a 加 1、b 加 2、c 的字符编码加 3。\n课堂 Windows 环境中，'A'+3 对应 'D'。\n老师强调  老师把指针与对应类型的变量成对标出。",
    "images": [
      "originals/class-1-4-0.webp"
    ]
  },
  {
    "id": "previous-1-6",
    "title": "例 9-8｜交换普通形参",
    "source": "11月15日 C语言课堂原题与解析 · 1794727370611  ·  17:00",
    "prompt": "投影原题见图。",
    "answer": "输出 3,9。",
    "explanation": "调用时，函数自己的 x 和 y 分别得到 3 和 9 的副本。\n交换只发生在这两个副本中，main 中的 x、y 仍是 3、9。\n老师强调  老师分别画出 main 的实参和 swap 的形参。",
    "images": [
      "originals/class-1-6-0.webp"
    ]
  },
  {
    "id": "previous-1-8",
    "title": "例 9-9｜通过指针交换",
    "source": "11月15日 C语言课堂原题与解析 · 1794727370611  ·  23:00",
    "prompt": "投影原题见图。",
    "answer": "输出 9,3。",
    "explanation": "px 和 py 分别收到 x 和 y 的地址。\nt=*px 保存旧 x，*px=*py 把 9 写到 x，*py=t 把 3 写到 y。\n地址也按值传递，函数通过地址写入 main 的变量。",
    "images": [
      "originals/class-1-8-0.webp"
    ]
  },
  {
    "id": "previous-1-10",
    "title": "例 9-11｜用指针访问数组",
    "source": "11月15日 C语言课堂原题与解析 · 1794730620701  ·  05:00",
    "prompt": "投影原题见图。",
    "answer": "输出 1 到 10，sum=55。",
    "explanation": "p=a 后，*(p+i) 逐个取出数组元素，求和这段循环不改变 p。\n打印循环每次用 *p 取值，再执行 p++。最后 p 到达尾后一位。\n老师强调  课件标出 *(p+i)、p[i] 与 a[i] 的对应关系。",
    "images": [
      "originals/class-1-10-0.webp"
    ]
  },
  {
    "id": "previous-1-12",
    "title": "例 9-12｜用指针控制循环",
    "source": "11月15日 C语言课堂原题与解析 · 1794730620701  ·  09:00",
    "prompt": "投影原题见图。",
    "answer": "输出 1 到 10，sum=55。",
    "explanation": "p 从 a 起步，p<a+10 时访问 *p。a+10 只作停止位置。\n第一次循环结束时 p 已在尾后一位。第二次循环用 p=a 重新从头开始。\n老师强调  课件提示再次循环前要给 p 重新赋初值。",
    "images": [
      "originals/class-1-12-0.webp"
    ]
  },
  {
    "id": "previous-1-14",
    "title": "例 9-13｜数组逆序",
    "source": "11月15日 C语言课堂原题与解析 · 1794730620701  ·  11:00",
    "prompt": "投影原题见图。",
    "answer": "输出 10、9、8、7、6、5、4、3、2、1。",
    "explanation": "p1 指向首元素，p2 指向最后一个实际元素。\n先交换 1 和 10，再交换 2 和 9，继续向内。\n每次交换后 p1++、p2--。p1<p2 不成立时停止。\n老师强调  老师用弧线画出了首尾和次首、次尾的配对。",
    "images": [
      "originals/class-1-14-0.webp"
    ]
  },
  {
    "id": "previous-1-16",
    "title": "指针作业第 2 题｜scanf",
    "source": "11月15日 C语言课堂原题与解析 · 1794730620701  ·  45:00",
    "prompt": "投影原题见图。",
    "answer": "选 C。",
    "explanation": "%d 需要有效的 int*。C 中 p=&k，输入值写进 k。\nA 中 &p 是 int**。B 使用未初始化的指针。\nD 中 *p=&k 试图通过未初始化的指针写入，赋值类型也不匹配。",
    "images": [
      "originals/class-1-16-0.webp"
    ]
  },
  {
    "id": "previous-1-18",
    "title": "指针作业第 3 题｜跟踪 a",
    "source": "11月15日 C语言课堂原题与解析 · 1794730620701  ·  47:00",
    "prompt": "投影原题见图。",
    "answer": "选 B，a 最终是 12。",
    "explanation": "p=&a，使 *p 可访问 a。\n*p=10，把 10 写进 a。\na=*p+b，也就是 a=10+2。",
    "images": [
      "originals/class-1-18-0.webp"
    ]
  },
  {
    "id": "previous-1-20",
    "title": "指针作业｜year 自增",
    "source": "11月15日 C语言课堂原题与解析 · 1794730620701  ·  49:00",
    "prompt": "投影原题见图。",
    "answer": "选 D。",
    "explanation": "A、B、C 都使 *p 指向的 year 加 1。\nD 的 *p++ 等价于 *(p++)，自增作用在 p 上。\n执行 D 后 year 还是 2015，p 到达尾后一位，不能用新位置解引用。",
    "images": [
      "originals/class-1-20-0.webp"
    ]
  },
  {
    "id": "previous-1-22",
    "title": "综合练习第 2 题｜Fibonacci 分数和",
    "source": "11月15日 C语言课堂原题与解析 · 1794735420651  ·  03:00",
    "prompt": "投影原题见图。",
    "answer": "前 20 项之和约为 32.042227。",
    "explanation": "令分子 a=1、分母 b=1。每轮先执行 sum += (double)a / b。\n保存 next=a+b，再令 b=a、a=next，得到 1/1 → 2/1 → 3/2 → 5/3。\n循环 20 次，使用浮点除法，最后 printf(\"%.6f\", sum)。\n老师强调  题目提示观察分子和分母的变化规律。",
    "images": [
      "originals/class-1-22-0.webp"
    ]
  },
  {
    "id": "previous-1-24",
    "title": "综合练习第 3 题｜四位逆序数",
    "source": "11月15日 C语言课堂原题与解析 · 1794735420651  ·  17:00",
    "prompt": "投影原题见图。",
    "answer": "共有 90 个，每行输出 6 个。",
    "explanation": "遍历 1000 至 9999，用 / 和 % 拆出千、百、十、个位。\n千位等于个位且百位等于十位时，输出原数。\n每命中一次让 cnt 加 1，cnt % 6 == 0 时换行。\n千位 1～9 有 9 种，百位 0～9 有 10 种，后两位随之确定。",
    "images": [
      "originals/class-1-24-0.webp"
    ]
  },
  {
    "id": "previous-1-26",
    "title": "综合练习第 4 题｜水仙花数",
    "source": "11月15日 C语言课堂原题与解析 · 1794735420651  ·  17:00",
    "prompt": "投影原题见图。",
    "answer": "153、370、371、407。",
    "explanation": "算法一：枚举 100～999，用 n/100、n/10%10、n%10 拆位。\n算法二：用三层循环分别枚举百位 a、十位 b 和个位 c。\n两种方法都判断 a*a*a+b*b*b+c*c*c 是否等于 100*a+10*b+c。",
    "images": [
      "originals/class-1-26-0.webp"
    ]
  },
  {
    "id": "previous-1-28",
    "title": "综合练习第 5 题｜偶数分解",
    "source": "11月15日 C语言课堂原题与解析 · 1794735420651  ·  27:00",
    "prompt": "投影原题见图。",
    "answer": "90=7+83，92=3+89，94=5+89，96=7+89，98=19+79，100=3+97。",
    "explanation": "题面范围是 90 到 100，外层 n 从 90 到 100，每次加 2。\n对每个 n 枚举 p=2 到 n/2，检查 isprime(p) && isprime(n-p)。\n命中后输出并 break，即可给每个偶数找出一组。",
    "images": [
      "originals/class-1-28-0.webp"
    ]
  },
  {
    "id": "previous-1-30",
    "title": "综合练习第 6 题｜输出素数",
    "source": "11月15日 C语言课堂原题与解析 · 1794735420651  ·  27:00",
    "prompt": "投影原题见图。",
    "answer": "100～200 共有 21 个素数。",
    "explanation": "isprime 先排除 x<2，再试除至平方根。发现因数立即返回 0。\n主函数从 101 到 199 只枚举奇数。每命中一次输出并累加 cnt。\n使用 printf(\"%d\\t\", n)，每 8 个换行。最后一行有 5 个，再输出总数。\n老师强调  课堂演示用 cnt % 8 == 0 控制输出行。",
    "images": [
      "originals/class-1-30-0.webp"
    ]
  },
  {
    "id": "previous-1-32",
    "title": "综合练习第 10 题｜三种最大公约数算法",
    "source": "11月15日 C语言课堂原题与解析 · 1794735420651  ·  51:00",
    "prompt": "投影原题见图。",
    "answer": "gcd(24,16)=8，gcd(21,35)=7。",
    "explanation": "gcd1：从 min(x,y) 向下试，第一个能同时整除 x 和 y 的数即为答案。\ngcd2：while(y!=0) 时计算 r=x%y，再把 x、y 换成 y、r。循环结束返回 x。\ngcd3：两数未相等时，每次用大数减小数代替大数。相等时返回该值。\n在 main 读入两个正整数，分别运行三个版本并打印结果。",
    "images": [
      "originals/class-1-32-0.webp"
    ]
  },
  {
    "id": "previous-1-34",
    "title": "综合练习第 12 题｜冒泡排序",
    "source": "11月15日 C语言课堂原题与解析 · 1794738720665  ·  09:00",
    "prompt": "投影原题见图。",
    "answer": "读取数组后，将相邻逆序元素交换。",
    "explanation": "外层 i 走 0～n-2。内层 j 从 0 到 n-2-i，比较 a[j] 和 a[j+1]。\n若左边比右边大则交换。每趟最大值移到剩余区间末尾。\n排序后依次输出 a[0] 到 a[n-1]。",
    "images": [
      "originals/class-1-34-0.webp"
    ]
  },
  {
    "id": "previous-1-36",
    "title": "综合练习第 13 题｜删除数组元素",
    "source": "11月15日 C语言课堂原题与解析 · 1794738720665  ·  09:00",
    "prompt": "投影原题见图。",
    "answer": "删去所有 5 后输出 9、6、7、8，返回 4。",
    "explanation": "i 遍历原数组，j 从 0 开始记录下一个保留位置。\n遇到 a[i]!=x，执行 a[j++]=a[i]，遇到 x 直接跳过。\n函数返回 j。主函数用 output(a, j) 输出有效前缀。\n老师强调  课堂演示中，读取下标 i 与写入下标 j 各自独立。",
    "images": [
      "originals/class-1-36-0.webp"
    ]
  },
  {
    "id": "previous-1-38",
    "title": "综合练习第 14 题｜二维数组周边求和",
    "source": "11月15日 C语言课堂原题与解析 · 1794738720665  ·  28:30",
    "prompt": "投影原题见图。",
    "answer": "原矩阵的周边元素之和为 63。",
    "explanation": "外层遍历 4 行，内层遍历 5 列。用 N、M 定义维度。\n若 i==0 或 i==N-1 或 j==0 或 j==M-1，把 a[i][j] 加入总和。\n四个角满足两项条件，同一个 if 仍只累加一次。\n顶行 20，底行 22，两条中间行的端点共 21，合计 63。",
    "images": [
      "originals/class-1-38-0.webp"
    ]
  },
  {
    "id": "previous-1-40",
    "title": "综合练习第 16 题｜手写字符串复制",
    "source": "11月15日 C语言课堂原题与解析 · 1794738720665  ·  29:00",
    "prompt": "投影原题见图。",
    "answer": "逐字符复制，最后补上字符串结束符。",
    "explanation": "按原题接口 void my_strcpy(char s1[], char s2[]) 编写。\n从 i=0 起，循环执行 s1[i]=s2[i]，另起一条语句执行 ++i。\n遇到 s2[i]=='\\0' 时结束循环，再令 s1[i]='\\0'。\nmain 读入 s2，保证 s1 容量足够，调用后用 puts(s1) 输出。",
    "images": [
      "originals/class-1-40-0.webp"
    ]
  },
  {
    "id": "previous-2-2",
    "title": "例 5-1｜简单函数调用",
    "source": "第 5 章课件 · 第 4 页",
    "prompt": "课件原页见图。",
    "answer": "星号线 → Welcome to C → 星号线。",
    "explanation": "从 main 开始。每次被调函数执行完毕，回到调用处继续。\n老师强调  按 main 的三个调用顺序读，区分主调函数与被调函数。",
    "images": [
      "originals/deck-5-4.webp"
    ],
    "searchText": "例5-1 简单函数调用 \n被调函数\n（被main( )调用）\n\n被调函数\n（被main( )调用）\n\n主调函数\n（调用函数）"
  },
  {
    "id": "previous-2-4",
    "title": "例 5-2｜两个数的最小值",
    "source": "第 5 章课件 · 第 6 页",
    "prompt": "课件原页见图。",
    "answer": "min(7, 3) 返回 3。",
    "explanation": "int min(int x, int y) {\n    return x < y ? x : y;\n}\n老师强调  分清 min 的返回类型、形参和函数体。",
    "images": [
      "originals/deck-5-6.webp"
    ],
    "searchText": "5.2.1函数定义\n/*Li0502.c*/\n#include <stdio.h> \nint min(int x, int y)\n{  int z;\n \t z=x<y?x:y;\n  \t return(z);\n}\nint main( )\n{\tint a, b, c;\n\tprintf(\"Please input two integers:\\n\");\n\tscanf(\"%d%d\",&a,&b);\n  \tc=min(a, b);         \n  \tprintf(\"the min is:%d\\n\",c);\n}\n例5-2 求两个数中的最小值。\n函数定义：求两个数中的最小值\n函数调用\n函数头\n函数体"
  },
  {
    "id": "previous-2-6",
    "title": "例 5-4｜交换形参后的输出",
    "source": "第 5 章课件 · 第 9 页",
    "prompt": "课件原页见图。",
    "answer": "先输出 x=5, y=4，随后输出 a=4, b=5。",
    "explanation": "形参 x、y 分别获得实参的值。临时变量 t 保存旧 x，交换发生在 swap 的局部变量中。\n老师强调  用临时变量保存旧值，分别记录形参和 main 中的实参。",
    "images": [
      "originals/deck-5-9.webp"
    ],
    "searchText": "例5-4 理解函数调用\n/*Li0504.c*/  \n#include <stdio.h>  \nvoid swap(int x, int y)\n{\tint t;\n\tt=x;\n\tx=y;\n\ty=t;\n\tprintf(\"x=%d, y=%d\\n\", x, y);\n}\nint main( )\n{\tint a=4, b=5;\n\tswap(a, b);\n\tprintf(\"a=%d, b=%d\\n\",a, b);\n}\n运行结果为：\nx=5,y=4\na=4,b=5\n单向值传递：形参值的改变不影响实参。"
  },
  {
    "id": "previous-2-8",
    "title": "例 5-7｜把偶数分解为素数之和",
    "source": "第 5 章课件 · 第 12、13 页",
    "prompt": "课件原页见图。",
    "answer": "从小到大找，得到 96=7+89、98=19+79、100=3+97。",
    "explanation": "int prime(int n) {\n    if (n < 2) return 0;\n    for (int i = 2; i <= n / i; ++i)\n        if (n % i == 0) return 0;\n    return 1;\n}\n// main 中\nfor (int n = 96; n <= 100; n += 2)\n    for (int p = 2; p <= n / 2; ++p)\n        if (prime(p) && prime(n-p)) {\n            printf(\"%d=%d+%d\\n\", n, p, n-p);\n            break;\n        }",
    "images": [
      "originals/deck-5-12.webp",
      "originals/deck-5-13.webp"
    ],
    "searchText": "例5.7验证哥德巴赫猜想：一个大偶数可以分解为两个素数之和。试编程序，将 96 到 100 之间的全部偶数分解成两个素数之和。 \n/*Li0507.c*/\n#include <stdio.h>\n#include <math.h>\nint prime(int a)\n{\tint  i, k;\n    k =sqrt(double(a));\n    for (i=2; i<=k; i++)\n\t\tif (a%i==0) \nreturn 0;\n\treturn 1;\n}\n"
  },
  {
    "id": "previous-2-10",
    "title": "例 5-8｜最大公约数和最小公倍数",
    "source": "第 5 章课件 · 第 19、20 页",
    "prompt": "课件原页见图。",
    "answer": "余数依次为 12、6、0。最大公约数为 6，最小公倍数为 144。",
    "explanation": "int gcd(int a, int b) {\n    while (b != 0) {\n        int r = a % b;\n        a = b; b = r;\n    }\n    return a;\n}\n// 调用处使用原始输入 a、b\nlong long lcm = (long long)(a / gcd(a, b)) * b;",
    "images": [
      "originals/deck-5-19.webp",
      "originals/deck-5-20.webp"
    ],
    "searchText": "例5-8函数嵌套调用\n#include <stdio.h> \nint gcd(int x, int y)\n{\tint r;\n\twhile (   (r=x%y)  !=  0  )\n\t{\tx=y; y=r; \t}\n\treturn(y);\n}\nint lcm(int x, int y)         \n{\tint bs, ys;              \n\tys=gcd(x, y);         \n\tbs=x*y/ys;\n\treturn bs;\n}\n  调用求最大公约数的函数\nmain()函数\nint main( )\n{\tint x, y, g, bs;\n\tprintf(\"Please input two integers:\\n\");\n\tscanf(\"%d%d\", &x, &y);\n\tg=gcd(x, y);\n\tbs=lcm(x, y);\n\tprintf(\"the greatest common divisor:%d\\n\n               the lease  common  multiple:%d\\n\", g, bs);\n}\n函数调用"
  },
  {
    "id": "previous-2-12",
    "title": "例 5-12｜递归求最大公约数",
    "source": "第 5 章课件 · 第 27 页",
    "prompt": "课件原页见图。",
    "answer": "gcd(48,18) → gcd(18,12) → gcd(12,6) → gcd(6,0) → 6。",
    "explanation": "int gcd(int a, int b) {\n    if (b == 0) return a;\n    return gcd(b, a % b);\n}\n// 余数小于正除数 b，第二个参数逐步减小。\n老师强调  留意 gcd 的终止分支和递归分支。",
    "images": [
      "originals/deck-5-27.webp"
    ],
    "searchText": "例5-12：递归法  求最大公约数\n27\n#include <stdio.h>\nint gcd(int ,int );\nint main()\n{  int a, b, g;\n   printf(\"Please input two integers :a,b\\n\");\n   scanf(\"%d%d\", &a, &b);\n   g=gcd(a,b);\n   printf(\"the greatest common divisor of\\ %d and %d is %d\\n\", a, b, g);\n}\nint gcd(int a,int b)\n{\n\tif (a%b==0)  return b;\n\treturn  gcd(b, a%b);\n}"
  },
  {
    "id": "previous-2-14",
    "title": "例 5-14｜三个字符转大写",
    "source": "第 5 章课件 · 第 30 页",
    "prompt": "课件原页见图。",
    "answer": "aBz 转为 ABZ。toupper 会保留无需转换的字符。",
    "explanation": "// 需要 <stdio.h> 和 <ctype.h>\nfor (int i = 0; i < 3; ++i) {\n    int ch = getchar();\n    if (ch == EOF) break;\n    putchar(toupper(ch));\n}\nputchar('\\n');",
    "images": [
      "originals/deck-5-30.webp"
    ],
    "searchText": "使用C系统函数例\n#include <stdio.h>\n#include <ctype.h>\n#define N 3\nint main( )\n{\tint i;\n\tchar c;\t\n    printf(\"Please input %d characters:\\n\", N);\n\tfor(i=0; i<N; i++)\n\t{\tscanf(\"%c\", &c);\n\t\tif( islower(c) )\n\t\t\tc-=32;\n\t\tprintf(\"%c\\t\", c);\n\t}\n\tprintf(\"\\n\");\n}\n使用islower()函数，要包含ctype.h头文件 \n例5-14 将输入的三个字符转换成大写字符后输出。"
  },
  {
    "id": "previous-2-16",
    "title": "例 5-16｜条件交换与块作用域",
    "source": "第 5 章课件 · 第 34 页",
    "prompt": "课件原页见图。",
    "answer": "(1) 4  5     (2) 4  5     (3) 5  4     (4) 4  5",
    "explanation": "t 只在 if 块内可见。swap 修改自己的形参，main 中的 a、b 仍为 4、5。\n老师强调  临时变量 t 声明在 if 块内，只能在该块中使用。",
    "images": [
      "originals/deck-5-34.webp"
    ],
    "searchText": "块作用域例1\n#include <stdio.h> \nvoid swap(int a, int b)\n{\tprintf(\"(2)%d\\t%d\\n\", a,b);\n\tif(a<b)\n\t{\tint t; \n\t\tt=a;\ta=b; b=t;\n\t}\n\tprintf(\"(3)%d\\t%d\\n\", a, b);\n}\nint main( )\n{\tint a, b;\t\n    printf(\"Please input two integers:\\n\");\n\tscanf(\"%d%d\", &a, &b);\n\tprintf(\"(1)%d\\t%d\\n\", a, b);\n\tswap(a, b);\n\tprintf(\"(4)%d\\t%d\\n\", a, b);\n}\n  t是局部变量，具有块作用域，退出该复合语句，则t不能使用 \n例 5-16 分析下列程序的输出结果。"
  },
  {
    "id": "previous-2-18",
    "title": "例 5-17｜同名变量遮蔽",
    "source": "第 5 章课件 · 第 35 页",
    "prompt": "课件原页见图。",
    "answer": "第一行 a=2,b=4,c=6。第二行 a=2,b=3。",
    "explanation": "内块访问新定义的 b=4，a 来自外层。离开内块后，访问自增后的外层 b=3。\n老师强调  进入内块时，先找内层声明的 b。",
    "images": [
      "originals/deck-5-35.webp"
    ],
    "searchText": "块作用域例2\n#include <stdio.h>\nint main( )\n{ \tint a=1, b=2;  \n\t++a;\n\t++b;\n\t{ \tint b=4, c;\n\t \tc=a+b;      \n\t  \tprintf(\"a=%d,b=%d,c=%d\\n\", a, b, c);\n\t}\n\tprintf(\"a=%d,b=%d\\n\", a, b);\n}\n c只能在该复合语句内使用\n例 5-17理解局部定义优先 \n   复合语句中定义的变量b屏蔽了复合语句外定义的变量b"
  },
  {
    "id": "previous-2-20",
    "title": "第 6 章练习 3｜宏展开",
    "source": "第 6 章课件 · 第 11 页",
    "prompt": "课件原页见图。",
    "answer": "输出 1。右侧为 7，最后计算整数除法 10 / 7。",
    "explanation": "a /= k+m*k+m/k+m*k+m;\n// 右侧 = 2 + 1*2 + 1/2 + 1*2 + 1 = 7\n#define SQR_SAFE(X) ((X) * (X))\n// 给参数和整体加括号，仍应避免传入 i++。",
    "images": [
      "originals/deck-6-11.webp"
    ],
    "searchText": "3. 以下程序的运行结果是____。\n#include <stdio.h>\n#define SQR(X) X*X\nint main()\n{ \nint a=10, k=2, m=1 ;\na/=SQR(k+m)/SQR(k+m) ;\nprintf (\"%d\\n\" , a) ;\nreturn 0;\t\n}"
  },
  {
    "id": "previous-2-22",
    "title": "例 7.6｜数组原地逆序",
    "source": "第 7 章课件 · 第 16、17 页",
    "prompt": "课件原页见图。",
    "answer": "结果为 {1, 6, 3, 4, 5, 2, 7}。交换下标对 (0,6)、(1,5)、(2,4)。",
    "explanation": "void inverse(int a[], int n) {\n    for (int i = 0, j = n - 1; i < j; ++i, --j) {\n        int t = a[i];\n        a[i] = a[j];\n        a[j] = t;\n    }\n}\n// 调用 inverse(a, 7);\n老师强调  逆序时检查循环结束条件 i < j。",
    "images": [
      "originals/deck-7-16.webp",
      "originals/deck-7-17.webp"
    ],
    "searchText": "例7.6"
  },
  {
    "id": "previous-4-2",
    "title": "例 7.7｜冒泡法",
    "source": "数组、结构体与指针原题与解析 · 1794122468996-1794122468996 (1).mp4  ·  10:15",
    "prompt": "投影原题见图。",
    "answer": "2 4 5 6 8 9",
    "explanation": "第 1 趟后为 4、8、6、5、2、9，最大值 9 到达末尾。\n第 2 趟后为 4、6、5、2、8、9，末尾两个位置已确定。\n继续扫描，最终得到 2、4、5、6、8、9。\n老师强调  课件圈出首对 8、4。第 i 趟（从 1 起）只需比较 n−i 对相邻元素。",
    "images": [
      "originals/class-4-2-0.webp"
    ]
  },
  {
    "id": "previous-4-4",
    "title": "例 7.8｜选择排序",
    "source": "数组、结构体与指针原题与解析 · 1794122468996-1794122468996 (1).mp4  ·  32:15",
    "prompt": "投影原题见图。",
    "answer": "2 5 6 7 8 9",
    "explanation": "从 8、7、9、6、5、2 中找到最小值 2，交换到 a[0]。\n接着在 a[1] 至 a[5] 中找最小值 5，交换到 a[1]。\n后续依次把 6、7、8 放到对应位置，最终为 2、5、6、7、8、9。\n老师强调  课件提示先记住最小值的下标 p，一趟扫描结束后再交换。",
    "images": [
      "originals/class-4-4-0.webp"
    ]
  },
  {
    "id": "previous-4-6",
    "title": "例 7.11｜顺序查找法",
    "source": "数组、结构体与指针原题与解析 · 1794122468996-1794122468996 (1).mp4  ·  33:15",
    "prompt": "投影原题见图。",
    "answer": "返回 x 首次出现的下标；找不到时返回 -1。",
    "explanation": "从下标 0 开始，把 x 和 a[i] 逐个比较。\n首次相等立即返回 i，因此存在重复值时得到首次出现的位置。\n扫描完仍未找到则返回 −1。下标 0 是有效结果。\n老师强调  老师圈出目标值 x 和长度 n。调用时要区分这两个实参。",
    "images": [
      "originals/class-4-6-0.webp"
    ]
  },
  {
    "id": "previous-4-8",
    "title": "例 7.13｜两个集合的交集",
    "source": "数组、结构体与指针原题与解析 · 1794122468996-1794122468996 (1).mp4  ·  34:15",
    "prompt": "投影原题见图。",
    "answer": "交集为 {2, 9}，元素个数为 2。",
    "explanation": "遍历 A，每次在 B 中顺序查找当前元素。\n2 与 9 命中，依次写入 C[0]、C[1]。\n交集为 {2, 9}，元素个数为 2。函数用 k 记录已写入的元素个数。\n老师强调  课件在实现中标出 a[i] 作查找函数实参。",
    "images": [
      "originals/class-4-8-0.webp"
    ]
  },
  {
    "id": "previous-4-10",
    "title": "例 7.15｜二维数组最小值",
    "source": "数组、结构体与指针原题与解析 · 1794125818998-1794125818998 (1).mp4  ·  18:15",
    "prompt": "投影原题见图。",
    "answer": "void minMatrix(int a[][4], int b[]) {\n    b[0] = a[0][0];\n    b[1] = b[2] = 0;\n    for (int i = 0; i < 3; ++i) {\n        for (int j = 0; j < 4; ++j) {\n            if (a[i][j] < b[0]) {\n                b[0] = a[i][j];\n                b[1] = i;\n                b[2] = j;\n            }\n        }\n    }\n}",
    "explanation": "以 a[0][0] 初始化最小值，行、列下标都从 0 开始。\n外层遍历 3 行，内层遍历 4 列。发现更小值时，同时更新 min、row、col。\n课件用严格小于比较，因此有并列最小值时保留首次出现的位置。\n可用结果数组 b[0..2] 带回最小值、行下标、列下标。\n老师强调  老师圈出 int a[][4]，并标出发现更小值时要同步更新三项。",
    "images": [
      "originals/class-4-10-0.webp"
    ]
  },
  {
    "id": "previous-4-12",
    "title": "例 7.16｜矩阵的转置",
    "source": "数组、结构体与指针原题与解析 · 1794125818998-1794125818998 (1).mp4  ·  24:15",
    "prompt": "投影原题见图。",
    "answer": "1 4 7\n2 5 8\n3 6 9",
    "explanation": "原第 i 行第 j 列写到新数组的第 j 行第 i 列。\n核心语句为 b[j][i] = a[i][j]。先转置，再按 b 的行列顺序输出。\n转置后第 1 行为 1 4 7，第 2 行为 2 5 8，第 3 行为 3 6 9。\n老师强调  课件强调结果写入 b。调换的是目标位置的两个下标。",
    "images": [
      "originals/class-4-12-0.webp",
      "originals/class-4-13-0.webp"
    ]
  },
  {
    "id": "previous-4-15",
    "title": "例 7.19｜输出一个字符数组",
    "source": "数组、结构体与指针原题与解析 · 1794125818998-1794125818998 (1).mp4  ·  37:15",
    "prompt": "投影原题见图。",
    "answer": "I am a student.",
    "explanation": "按 i=0 至 14 逐个用 %c 输出，最后单独输出换行。\n屏幕显示 I am a student.，句末的点也是数组元素。\n原数组 15 个位置都已填满，直接作为 %s 的参数会越界查找结束符。\n老师强调  老师划出 char c[15] 和逐字符输出的循环。",
    "images": [
      "originals/class-4-15-0.webp"
    ]
  },
  {
    "id": "previous-4-17",
    "title": "例 7.20｜输出一个三角形图形",
    "source": "数组、结构体与指针原题与解析 · 1794125818998-1794125818998 (1).mp4  ·  38:15",
    "prompt": "投影原题见图。",
    "answer": "  *\n * *\n* * *",
    "explanation": "i 从 0 到 2。每行内循环 j < i+3，分别输出 3、4、5 个字符。\n三行内容依次是两个空格加 *、一个空格加 * *、以及 * * *。\nprintf(\"%c\", star[i][j]) 保留前导空格，每行结束后换行。\n老师强调  老师划出 j<i+3 和 %c。前导空格决定图形的对齐。",
    "images": [
      "originals/class-4-17-0.webp"
    ]
  },
  {
    "id": "previous-4-19",
    "title": "例 7.24｜编写 my_strcpy",
    "source": "数组、结构体与指针原题与解析 · 1794130618996-1794130618996.mp4  ·  04:15",
    "prompt": "投影原题见图。",
    "answer": "void my_strcpy(char s1[], char s2[]) {\n    int i = 0;\n    while (s2[i] != '\\0') {\n        s1[i] = s2[i];\n        ++i;\n    }\n    s1[i] = '\\0';\n}",
    "explanation": "从 i=0 开始，将源串 s2 的字符逐个复制到目标 s1，最后写入 '\\0'。\n原图 s1[i]=s2[i++] 对 i 有未排序的读写，行为未定义。\n改为两句：s1[i] = s2[i];  ++i;  循环结束后写 s1[i] = '\\0';\n调用前保证目标空间至少有 strlen(s2)+1 字节，且两段存储不重叠。\n老师强调  老师圈出两个数组形参。s1 是目标，s2 是来源。",
    "images": [
      "originals/class-4-19-0.webp"
    ]
  },
  {
    "id": "previous-4-21",
    "title": "例 8.1｜结构体输出函数",
    "source": "数组、结构体与指针原题与解析 · 1794130618996-1794130618996.mp4  ·  39:15",
    "prompt": "投影原题见图。",
    "answer": "课件这一页展示 void print(struct student stud)。",
    "explanation": "调用时，结构体按值传递给 stud。\n用 stud.num、stud.name 取学号与姓名，用 stud.score[0] 至 [3] 取四科成绩。\n按原图顺序输出学号、姓名、数学、英语、程序设计和物理。\n老师强调  老师在函数形参及成员访问位置划线。",
    "images": [
      "originals/class-4-21-0.webp"
    ]
  },
  {
    "id": "previous-4-23",
    "title": "例 9-2｜指针取值运算",
    "source": "数组、结构体与指针原题与解析 · 1794133919004-1794133919004.mp4  ·  19:15",
    "prompt": "投影原题见图。",
    "answer": "m=100，n=200，p 指向 m。",
    "explanation": "p=&m 使 p 存放 m 的地址。\nn=*p 把当时的 m 值 200 复制给 n。\n*p=100 写入 p 指向的变量。最终 m=100、n=200，p 仍指向 m。\n老师强调  老师圈出 p=&m、n=*p、*p=100，分别对应建立指向、读取和写入。",
    "images": [
      "originals/class-4-23-0.webp"
    ]
  }
];
window.previousNotes = [
  {
    "chapter": "11月15日 C语言指针与综合编程笔记",
    "title": "先分清 p、&m 和 *p",
    "source": "11月15日 C语言指针与综合编程笔记 · 1794727370611  ·  01:00",
    "text": "把变量 m 画成一个格子，格子里写它的值。\np=&m：从 p 画箭头指向 m。读 *p，就沿箭头去读 m。\n*p=100：沿箭头写 100。p 里仍存 m 的地址。\n老师强调  录像手写圈出了 p、&m 和 *p 的关系。"
  },
  {
    "chapter": "11月15日 C语言指针与综合编程笔记",
    "title": "换指向，还是换数值",
    "source": "11月15日 C语言指针与综合编程笔记 · 1794727370611  ·  11:00",
    "text": "开始时 p1→x=10，p2→y=20。\n用 int* 临时变量交换 p1、p2，两根箭头互换。\n用 int 临时变量交换 *p1、*p2，两个格子里的值互换。\n老师强调  投影并排画出了两种操作的目标状态。"
  },
  {
    "chapter": "11月15日 C语言指针与综合编程笔记",
    "title": "指针的类型和初始化",
    "source": "11月15日 C语言指针与综合编程笔记 · 1794727370611  ·  15:00",
    "text": "int *p 需要先指向有效的 int 对象，才能通过 *p 读写。\nscanf(\"%d\", p) 中，先检查 p 的类型，再检查它指向哪里。\n空指针适合表示没有目标，通过它访问对象会造成未定义行为。\n老师强调  老师圈出了经未初始化指针写入的例子。"
  },
  {
    "chapter": "11月15日 C语言指针与综合编程笔记",
    "title": "函数怎么改到 main 的变量",
    "source": "11月15日 C语言指针与综合编程笔记 · 1794727370611  ·  25:00",
    "text": "swap(x,y) 收到数值副本，交换副本。\nswap(&x,&y) 收到地址副本，可以用 *px、*py 写入原变量。\n读程序时，先画出实参到形参的对应关系，再逐行标出被修改的格子。\n老师强调  录像用两层图示区分调用者的变量和函数的形参。"
  },
  {
    "chapter": "11月15日 C语言指针与综合编程笔记",
    "title": "数组的指针运算",
    "source": "11月15日 C语言指针与综合编程笔记 · 1794730620701  ·  07:00",
    "text": "int *p=a 时，p+1 前进一个 int 元素，*(p+i) 等于 a[i]。\n同一数组里，&a[4]-&a[1] 得到 3，单位是元素个数。\n尾后一位可作为循环边界。遍历完再回头时，先把 p 设回 a。"
  },
  {
    "chapter": "11月15日 C语言指针与综合编程笔记",
    "title": "数组形参与双指针",
    "source": "11月15日 C语言指针与综合编程笔记 · 1794730620701  ·  25:00",
    "text": "函数形参 int b[] 与 int *b 在这里等价，长度 n 另传。\nb++ 只移动函数内的指针。写 b[i] 可以改调用者的数组元素。\n逆序时左右指针各走一步，碰面或交错即停止。\n老师强调  课件标出 b[i] 与 *(b+i)，以及 a、p、&a[0] 的实参写法。"
  },
  {
    "chapter": "11月15日 C语言指针与综合编程笔记",
    "title": "字符数组、字面量与结束符",
    "source": "11月15日 C语言指针与综合编程笔记 · 1794730620701  ·  39:00",
    "text": "char s[]=\"Hello\" 建立可写数组，初始内容包括 '\\0'。\n指针可以改为指向另一个字符串。字符串字面量的内容不能写入。\n课件把 ABCD 复制到 str+2，从第 3 格覆盖并带入结束符，得到 HeABCD。\n老师强调  投影标出了结束符，并勾画了从 str+2 开始复制的例子。"
  },
  {
    "chapter": "11月15日 C语言指针与综合编程笔记",
    "title": "一趟循环同时维护当前项与总和",
    "source": "11月15日 C语言指针与综合编程笔记 · 1794735420651  ·  01:00",
    "text": "阶乘和从 t=1、sum=0 开始，每轮先 t*=i，再 sum+=t。\nFibonacci 分数和每轮用旧分子和旧分母相加，得到下一个分子。\n先保存下一项，再更新变量。分数用浮点除法。"
  },
  {
    "chapter": "11月15日 C语言指针与综合编程笔记",
    "title": "拆位、计数和按行输出",
    "source": "11月15日 C语言指针与综合编程笔记 · 1794735420651  ·  41:00",
    "text": "/10 去掉个位，%10 取个位。可据此拆位、反转或计算各位的立方。\n只在找到符合条件的数时增加计数器。\n每行输出 k 个，就在命中之后检查 cnt % k == 0。\n老师强调  课堂演示用 cnt % 8 控制素数列表换行。"
  },
  {
    "chapter": "11月15日 C语言指针与综合编程笔记",
    "title": "素数判断与最大公约数",
    "source": "11月15日 C语言指针与综合编程笔记 · 1794735420651  ·  51:00",
    "text": "素数试除到平方根即可。一般函数先处理小于 2 的输入。\n偶数分解时只枚举第一个加数，第二个加数用 n-p 算出。\n辗转相除法不断把 (x,y) 换成 (y,x%y)，到 y=0 时返回 x。"
  },
  {
    "chapter": "11月15日 C语言指针与综合编程笔记",
    "title": "原地删除的读下标与写下标",
    "source": "11月15日 C语言指针与综合编程笔记 · 1794738720665  ·  19:00",
    "text": "i 负责读，j 负责写。先让 j=0。\n符合保留条件的元素才写进 a[j] 并令 j 加 1，原来的顺序保留。\n扫完后 j 是新长度。应用到字符串时，在 s[j] 写入 '\\0'。\n老师强调  课堂将数组原地删除的写法用到了字符串删字符。"
  },
  {
    "chapter": "11月15日 C语言指针与综合编程笔记",
    "title": "二维数组的边界与手写复制",
    "source": "11月15日 C语言指针与综合编程笔记 · 1794738720665  ·  28:30",
    "text": "周边条件：在第一行、最后一行、第一列、最后一列中的任一处。\n二维数组作参数时写清列数。用一个 if 合并四个边界，角点只计一次。\n手写复制字符串时，复制字符和递增下标各写一条语句，最后补 '\\0'。"
  },
  {
    "chapter": "函数复习笔记",
    "title": "声明、定义与调用",
    "source": "函数复习笔记 · 视频回看  1793517768151-1793517768151.mp4  40:03 · 第 11 页",
    "text": "原型说明函数的返回类型和参数类型，调用之前必须有可见声明。\n定义给出函数体。若定义放在 main 后面，可先写原型。\n执行从 main 开始。每次调用结束后，回到调用处继续。\nint min(int, int);          // 原型\nint min(int x, int y) {     // 定义\n    return x < y ? x : y;\n}\n// 在 main 中调用 min(7, 3)，得到 3。\n老师强调  区分函数原型、调用和定义，原型中的形参名可省略。"
  },
  {
    "chapter": "函数复习笔记",
    "title": "返回值与参数传递",
    "source": "函数复习笔记 · 视频回看  1793517768151-1793517768151.mp4  32:03、34:03",
    "text": "return 表达式把值交给调用者。void 函数可用 return; 提前退出。\n标量参数按值传递。手算时把调用者变量和被调函数形参分开记。\n需要修改调用者的变量时，可传入地址，再通过指针写入。\n// main:       a=4, b=5\n// swap 入口:  x=4, y=5\n// swap 交换:  x=5, y=4\n// 回到 main:  a=4, b=5\n老师强调  形参交换前后要单独追踪，main 的实参值保持原样。"
  },
  {
    "chapter": "函数复习笔记",
    "title": "用函数拆分素数分解",
    "source": "函数复习笔记 · 视频回看  1793517768151-1793517768151.mp4  41:15 · 第 12 页",
    "text": "判断素数先排除 n<2，再试除到平方根，遇到因数立即返回。\n枚举 p 到 n/2 即可，每个候选配对是 p 和 n-p。\n&& 先判断左边，左边为假时右边无需执行。\nif (prime(p) && prime(n - p)) {\n    /* 找到一组分解 */\n}"
  },
  {
    "chapter": "函数复习笔记",
    "title": "辗转相除与递归",
    "source": "函数复习笔记 · 视频回看  1793521018152-1793521018152.mp4  21:15 · 第 22 页",
    "text": "循环版用 (b, a%b) 替换 (a, b)，直到 b 为 0。\n递归版先写终止条件，再写参数逐步缩小的递归调用。\n求最小公倍数要保留原始输入，先除后乘可减小中间值。\ngcd(48,18) -> gcd(18,12) -> gcd(12,6)\n           -> gcd(6,0) -> 6\nlcm(48,18) = (48 / 6) * 18 = 144\n老师强调  辗转相除先判断何时结束，递归时再把除数、余数传给下一层。"
  },
  {
    "chapter": "函数复习笔记",
    "title": "库函数与字符输入",
    "source": "函数复习笔记 · 视频回看  1793521018152-1793521018152.mp4  32:03、33:15",
    "text": "输入输出用 <stdio.h>，字符处理用 <ctype.h>。\nsqrt 用 <math.h>，整数绝对值 abs 用 <stdlib.h>。\n%c 默认会读取空白，格式串写成“ %c”会先跳过空白。\nint ch = getchar();\nif (ch != EOF) putchar(toupper(ch));"
  },
  {
    "chapter": "函数复习笔记",
    "title": "块作用域与存储期",
    "source": "函数复习笔记 · 视频回看  1793521018152-1793521018152.mp4  39:15、52:00",
    "text": "遇到同名变量，从使用位置往外找最近的可见声明。\n普通局部变量通常随块的进入与退出创建和销毁。\n块内 static 变量仍只有块作用域，但其值能跨调用保留。\nint b = 3;\n{\n    int b = 4;  // 块内访问这里的 b\n}\n// 离开内块后访问外层的 b。\n老师强调  同名 b 要分清内外层。课件把内层声明及两次输出分别圈出。"
  },
  {
    "chapter": "函数复习笔记",
    "title": "延伸｜带参数的宏",
    "source": "函数复习笔记 · 视频回看  1793525767957-1793525767957.mp4  16:03",
    "text": "先把实参代入替换文本，再按优先级计算。\n给每个参数和整个替换式分别加括号。\n宏可能多次展开同一参数，避免传入自增或自减表达式。\n#define SQR(X) ((X) * (X))\nSQR(2 + 1)   // 展开后得到 ((2 + 1) * (2 + 1))\n老师强调  宏名与形参表紧挨着写。先展开，再算优先级。"
  },
  {
    "chapter": "函数复习笔记",
    "title": "延伸｜数组作函数参数",
    "source": "函数复习笔记 · 视频回看  1793529068050-1793529068050.mp4  10:03、24:15",
    "text": "传 a[i] 给 int 形参时，函数只收到元素的值。\n传 a 给 int a[] 形参时，函数收到指向首元素的指针值。\n可通过形参修改原数组元素，数组长度通常另传。\nvoid inverse(int a[], int n);\nint a[] = {7, 2, 5, 4, 3, 6, 1};\ninverse(a, 7);\n老师强调  原地逆序盯住 i < j，两个下标相遇或交错就停止。"
  },
  {
    "chapter": "数组、结构体与指针笔记",
    "title": "数组参数与原地逆序",
    "source": "数组、结构体与指针笔记 · 1794122468996-1794122468996 (1).mp4  ·  04:15",
    "text": "数组形参用于访问原数组，长度要单独传给函数。\n左右下标从 0 和 n−1 出发，每次交换一对。\n原图里的 j 在使用前必须初始化为 n−1。\n老师强调  课件专门提示检查 i < j。下标相遇或交错后立即停止。"
  },
  {
    "chapter": "数组、结构体与指针笔记",
    "title": "冒泡排序与选择排序",
    "source": "数组、结构体与指针笔记 · 1794122468996-1794122468996 (1).mp4  ·  10:15",
    "text": "冒泡排序比较相邻元素，每趟把未排序区的最大值推到右端。\n选择排序扫描剩余区间，找到最小值下标后与左端交换。\n六个元素最多需五趟。写内循环前先确认已排好部分的边界。\n老师强调  老师在冒泡图上圈出首对 8、4，用它追踪第一次交换。"
  },
  {
    "chapter": "数组、结构体与指针笔记",
    "title": "顺序查找与集合交集",
    "source": "数组、结构体与指针笔记 · 1794122468996-1794122468996 (1).mp4  ·  33:15",
    "text": "顺序查找返回首个命中下标，查找失败返回 −1。\n求交集时用 A 的元素作为查找目标，在 B 中找是否存在。\n每命中一次写入 C[k]，再让 k 加 1。k 同时是输出个数。\n老师强调  课件圈出 search 的目标 x 和元素个数 n。"
  },
  {
    "chapter": "数组、结构体与指针笔记",
    "title": "二维数组的行、列与初始化",
    "source": "数组、结构体与指针笔记 · 1794122468996-1794122468996 (1).mp4  ·  49:15",
    "text": "int a[4][3] 有 4 行、3 列，下标范围为 [0..3][0..2]。\n初始化可按行分组，缺少的元素补 0。\n有初始化数据时可省略首维，仍需写出列数。\n老师强调  课件用成绩表圈出 a[0][0] 和 a[3][2]，按先行后列定位。"
  },
  {
    "chapter": "数组、结构体与指针笔记",
    "title": "二维数组遍历与成绩统计",
    "source": "数组、结构体与指针笔记 · 1794125818998-1794125818998 (1).mp4  ·  12:15",
    "text": "外层循环固定一行，内层循环扫描这一行的各列。\n算每行平均值时，每次进入新行都先清零累加器。\n整型成绩除以 3 会截去小数；保留小数时可用 sum / 3.0。\n老师强调  课件用批注明确标出 i 控制行数、j 控制列数。"
  },
  {
    "chapter": "数组、结构体与指针笔记",
    "title": "二维数组形参、最值与转置",
    "source": "数组、结构体与指针笔记 · 1794125818998-1794125818998 (1).mp4  ·  18:15",
    "text": "int a[][4] 的列数确定每一行的跨度，行数可另传。\n找最值用首元素初始化，更新时同时记下行、列。\n转置把 a[i][j] 写到 b[j][i]，长方形矩阵的目标维度需互换。\n老师强调  老师标出了二维形参的列数，以及最值和坐标的同步更新。"
  },
  {
    "chapter": "数组、结构体与指针笔记",
    "title": "字符数组、结束符与输入输出",
    "source": "数组、结构体与指针笔记 · 1794125818998-1794125818998 (1).mp4  ·  45:15",
    "text": "%c 处理一个字符。%s 处理以空白分隔的字符串输入。\nchar s[10] 读单词可用 scanf(\"%9s\", s)，给 '\\0' 留一格。\n读含空格的整行可用 fgets；成功读取后按需处理末尾换行。\n老师强调  老师划线区分逐字符输入输出与整串输入输出。"
  },
  {
    "chapter": "数组、结构体与指针笔记",
    "title": "字符串比较与复制",
    "source": "数组、结构体与指针笔记 · 1794130618996-1794130618996.mp4  ·  00:15",
    "text": "strcmp 逐个比较字符，按返回值小于、等于、大于 0 判断顺序。\nstrlen 统计结束符之前的字符数，复制时也要写入结束符。\n目标数组容量要覆盖全部字符及 '\\0'。\n老师强调  录像在三组 Student／student 比较旁手写了 =0、>0、<0。"
  },
  {
    "chapter": "数组、结构体与指针笔记",
    "title": "结构体类型、变量与成员",
    "source": "数组、结构体与指针笔记 · 1794130618996-1794130618996.mp4  ·  19:15",
    "text": "struct 类型定义描述成员，定义变量后才能存取成员。\n通过 stu.name、stu.score[0] 等访问成员；嵌套成员可以连续使用点号。\n成员可以是数组或另一个已定义的结构体。\n老师强调  老师圈出了 struct 关键字、成员列表和定义末尾的分号位置。"
  },
  {
    "chapter": "数组、结构体与指针笔记",
    "title": "结构体赋值、传参与数组",
    "source": "数组、结构体与指针笔记 · 1794130618996-1794130618996.mp4  ·  35:15",
    "text": "同类型结构体可以直接赋值，数组成员也随整体复制。\n单独给字符数组成员换内容时，可在容量足够时用 strcpy。\n结构体按值传参；结构体数组可用 stud[i].score 逐项访问。\n老师强调  课件把 t2=t1 圈出，并拆开对照各成员如何复制。"
  },
  {
    "chapter": "数组、结构体与指针笔记",
    "title": "typedef 与结构体别名",
    "source": "数组、结构体与指针笔记 · 1794133919004-1794133919004.mp4  ·  13:15",
    "text": "typedef 可以给结构体类型起别名，例如 DATE。\n写完 typedef 定义后，可用 DATE birthday; 声明变量。\n带结构体标签时，struct date 和 DATE 可以指同一类型。"
  },
  {
    "chapter": "数组、结构体与指针笔记",
    "title": "指针变量、地址与间接访问",
    "source": "数组、结构体与指针笔记 · 1794133919004-1794133919004.mp4  ·  23:15",
    "text": "int *p, m; 中 p 的类型是 int *，m 的类型是 int。\np=&m 后，p 持有 m 的地址，*p 访问 m。\n给 *p 赋值会改 m。给 p 赋另一个有效地址会改变指向。\n老师强调  老师圈画了 p 与 &m、*p 与 m 的对应关系。"
  }
];
