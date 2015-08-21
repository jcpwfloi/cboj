# OnlineJudge

## Installation
You have to install Node.js first.

For Mac OS: 

```
brew install node
```

For Linux OS:

```
git clone https://github.com/joyent/node
./configure
make
make install
```

Then you have to Install the dependencies:
```
npm i
```

## Database & Session Configuration

### Installing Redis
    git clone https://github.com/antirez/redis
    cd redis
    make
    make install

The installation script will be released in the near future.

## Judger Configuration

Place the script file in an folder, for example `/home/OJ/cboj`. You have to create a new folder under `/home/OJ`.

```
    cd /home/OJ
    mkdir judger
    cd judger
    apt-get install -y makejail
    touch makejail.conf
```

You'll just have to write example programs under `/home/OJ/judger`

1.cpp:
```
#include <cstdio>
#include <algorithm>
#include <cstring>
#include <vector>
#include <set>
#include <map>
#include <deque>
#include <queue>
#include <string>
#include <ext/pb_ds/priority_queue.hpp>
#include <list>
#include <stack>

using namespace std;

int main() {
    return 0;
}
```

1.pas:
```
program ex;
uses math;
var a: extended;
begin
    readln(a);
    writeln(sqrt(a));
end.
```

1.c:
```
#include <stdio.h>
#include <stdlib.h>

int a, b;

int main() {
    scanf("%d%d", &a, &b);
    printf("%d\n", a + b);
}
```

1.py:
```
    import math
    a, b = raw_input().split()
    a, b = int(a), int(b)
    print a + b
    a = input()
    print math.sqrt(a)
```

Then you have to get prepared with the sandbox configuration, add this to the `makejail.conf`:

```
    testCommandsInsideJail = ['g++ -o 1 1.cpp', 'gcc -o 1 1.cpp', 'fpc 1.pas', 'python 1.py']
```

Then you can build the sandbox!

```
    makejail makejail.conf
```


