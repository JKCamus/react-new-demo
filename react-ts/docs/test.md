### 消息通知

业务方注册

```ts
interface Config{
NoticeTypes:NoticeType[] //业务监听的卡片消息类型数据
Component:React.Component // 业务卡片组件
initFn:init(msgData):business;// 异步获取数据
isValidFn:(business):boolean;// 依赖initFn 返回数据，可以为异步
replaceFn:(safeList,business):cardId[] //依赖initFn返回数据，同类数据safeList,cardId为卡片的唯一Id。
}

noticeCpnProvider.addCpnFn(Config);
```

卡片通知处理

说明逻辑，实际代码会进行优化。

```ts
const msgCardDatum = [
  {
    cpn, //业务组件
    businessData, //业务数据，
    cardId, //卡片通知唯一Id
  },
];

const businessData = await initFn(msgData);
const isValid = await isValidFn(businessData);
//如果需要渲染
if (isValid) {
  const replacedCardIds = replaceFn(businessData, safeList); // cardId 为卡片通知唯一Id，返回替换的card
  //组成新的msgCardDatum
  const newBusiness = {
    cpn: noticeCpnProvider.getCpn(),
    businessData,
  };
  //是否存在被替换的卡片
  if (replacedCardIds.length > 0) {
    msgCardDatum.remove(replacedCardIds); //删除被替换的卡片
    msgCardDatum.unshift(newBusiness); // 推入新的卡片
  } else {
    msgCardDatum.unshift(newBusiness);
  }
}
```

总结：

优点：
将卡片渲染流程转为数据驱动视图。
通过配置方式可以实现一定程度的扩展，如需添加新的数组操作，添加对应的配置函数。
增加系统对业务返回数据的控制能力，比如，可以对 initFn 返回的数据操作加工后再加入到 isValidFn 函数。

缺点：
返回的配置函数之间存在依赖，而且可能存在顺序，后期扩展需要改写处理的逻辑。

### 方案二

1. 定义业务返回属性 key 对应的操作,
2. 注册对应操作的函数

```ts
卡片列表数据;
const msgCardDatum = [
  {
    cpn, //业务组件
    cpnData, //组件初始化数据
    cardId, // 卡片消息唯一Id
  },
];
```

业务方

1. 注册系列消息对应的函数

```ts
const MeetingType = [
  CARD_NOTICE.CARD_MEETING_INVITATION,
  CARD_NOTICE.CARD_MEETING_UPDATE,
  CARD_NOTICE.CARD_MEETING_SIGN,
];

noticeCpnProvider.addCpnFn(MeetingType, Component, businessFn);
```

businessFn 需要返回以下数据

```ts
const businessData={
  cardData?:{
    cpnData,
  },
  // replaceData?:{
  //   // 用于替换用信标，targetKey可以为'msgType'，cpnData中的某字段如'meetingNo',
  //   // targetField =>对应'msgTyped' key 的值
  //   targetKey:keyof (msgData|cpnData)
  //   targetField:string|number
  // },
  replace?:replace(safeList):cardId[],//返回卡片消息唯一cardId 数组，可以单一替换，也可替换调多张卡片,safeList 为同类消息的卡片
  isValid?:boolean // 是否显示,默认为true
}




// 通过业务生成的对象key的组合来形成对卡片列表的数组操作。
// 如下有效key的组合：
['inValid'] =>无效不处理操作 =>validFn(msgCardDatum,businessData)
['cardData','replace'] =>替换操作=>replace(msgCardDatum,businessData)
['cardData']=>添加操作=>unShift(msgCardDatum,businessData)

返回 msgCardDatum

```

NoticeManager 主流程：

```ts
1. NoticeManager接收im消息
 //msgData为im消息
2. noticeCpnProvider.getCpnFn(msgData)==>businessFn===>businessData


// 处理
if(inValid){
  const cardsId=await replace(safeList)
  if(cardsId.length){
  msgCardDatum.remove(cardsId)
  msgCardDatum.unshift(businessData)
  }else{
   msgCardDatum.unshift(businessData)
  }
}


//返回最新的msgDatum，用于组件渲染
3. executeFn(msgDatum,businessData)==>msgDatum

// 调用策略处理数组
const executeFn = (msgDatum, businessData) => {
  const newMsgDatum = executeStrategy[getExecuteType(businessData)](msgDatum, businessData)
  return newMsgDatum
}

```

总结：
区别于方案一，业务注册单个函数，返回配置。具体到：消息通知可以根据返回的配置，设定对应的行为策略（针对卡片数组 msgCardDatum 操作的行为策略）。
优点：

1. 将卡片渲染流程转为数据驱动视图。
2. 消息系统列表操作对扩展开放，后期业务返回增加对应属性，定义对应的操作行为，达到扩展性，不需要再修改整个对卡片消息列表数组的操作流程。

缺点：

1. 需要业务方理解返回属性的组合意义。
2. 需要根据返回的属性，定义唯一的操作行为。

3. 注册系列消息对应的函数

```ts
const MeetingType = [
  CARD_NOTICE.CARD_MEETING_INVITATION,
  CARD_NOTICE.CARD_MEETING_UPDATE,
  CARD_NOTICE.CARD_MEETING_SIGN,
];

/**
 * @description:
 * MeetingType: NoticeType[] //业务监听的卡片消息类型
 * Component: 消息类型对应组件
 * businessFn: 消息类型对应函数
 */
noticeCpnProvider.addCpnFn(MeetingType, Component, businessFn);

interface BusinessData {
  cpnData: any;
  uniqueTag: {
    uniqueTagName: string;
    uniqueTagValue: string | number;
  };
}




const BusinessData = businessFn(msgData);

noticeCpnProvider.addCpnFn(MeetingType, Component, businessFn);

const BusinessData = businessFn(msgData, safeList);
//safeList 为消息类型相同的数据。

interface BusinessData {
  cpnData: any;
  updateCardId?: number;
}

enum UniqueTagName {
  Task = 'NoticeType',
  MeetingNo = 'MeetingNo',
}

interface BusinessData {
  cpnData: //对应消息的卡片数据
  UniqueTagValue?: string|number
  // uniqueTag: { //
  //  uniqueKeyName: string;
  //  uniqueKeyValue: string | number;
  // //  [key: string]:number
  //  };
}

interface Config {
  NoticeTypes: NoticeType[]; //Im消息类型数组
  component:React.Component
  cardKeyName:CardKeyName
  businessFn:():Promise<BusinessData>
}

noticeCpnProvider.addCpnConfig(Config);



```

```ts
// 业务方注册配置
interface Config {
  NoticeTypes: NoticeType[]; //Im消息类型数组
  component: React.Component;
}

// 业务方注册
noticeCpnProvider.addCpnConfig(NoticeTypes, component);
```

卡片通知内说明

```ts

// 不渲染
业务组件返回null

// 新增实现
业务返回组件，为新增

// 更新
1. 返回组件
2. 调用 closeCard(CardsId:number)方法。 考虑到限制业务权限问题，只能关闭同类卡片。
基于如此考虑：
1. 传入业务组件的数据为同类数据卡片数据。
2. 传入业务组件的数据为当前列表的所有卡片数据。调用closeCard函数返回的卡片Id为非当前类型卡片，那么关闭无效。也就是为新增卡片。
```

业务扩展考虑：
场景 1：
当一张卡片需要替换多张卡片。

```ts
提供 closeCards(CardsIds:number[]),考虑到限制业务权限问题，只能关闭同类卡片。
```

场景 2：
当需要整个卡片列表需要指只展示当前卡片

```ts
提供 setGlobalCard(CardId:number)
```

说明：
在业务场景考虑时，提出新增 closeCards 的原因，是因为，当前场景关闭单张卡片已经足够了。与产品讨论，出现扩展场景的可能性较低且提供 closeCards 的成本较低。所以先提供关闭单张卡片的方法。

```ts
思路：深度优先遍历，遍历函数传入每一层形成的字符串和一个指向字符的位置指针，打给你指针的位置到达字符串的结尾时，将形成的字符串加入结果数组，递归的每一层遍历这一层的数字对应的字符，然后传入新的字符，指针向后移动一次，不断递归
复杂度：时间复杂度O(3^m * 4^n)，m，n分别是三个字母和四个字母对应的数字个数。空间复杂度O(m+n)，递归栈的深度，最大为m+n

//输入：digits = "23"
//输出：["ad","ae","af","bd","be","bf","cd","ce","cf"]
var letterCombinations = (digits) => {
    if (digits.length == 0) return [];
    const res = [];
    const map = {//建立电话号码和字母的映射关系
        2: "abc",
        3: "def",
        4: "ghi",
        5: "jkl",
        6: "mno",
        7: "pqrs",
        8: "tuv",
        9: "wxyz",
    };

    const dfs = (curStr, i) => {//curStr是递归每一层的字符串，i是扫描的指针
        if (i > digits.length - 1) {//边界条件，递归的出口
            res.push(curStr); //其中一个分支的解推入res
            return; //结束递归分支，进入另一个分支
        }
        const letters = map[digits[i]]; //取出数字对应的字母
        for (const l of letters) {
            //进入不同字母的分支
            dfs(curStr + l, i + 1); //参数传入新的字符串，i右移，继续递归
        }
    };
    dfs("", 0); // 递归入口，传入空字符串，i初始为0的位置
    return res;
};

const letterCombinations = (digits) => {
  if (digits.length == 0) return [];
  const res = [];
  const map = { '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl', '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz' };
  // dfs: 当前构建的字符串为curStr，现在“翻译”到第i个数字，基于此继续“翻译”
  const dfs = (curStr, i) => {   // curStr是当前字符串，i是扫描的指针
    if (i > digits.length - 1) { // 指针越界，递归的出口
      res.push(curStr);          // 将解推入res
      return;                    // 结束当前递归分支
    }
    const letters = map[digits[i]]; // 当前数字对应的字母
    for (const letter of letters) { // 一个字母是一个选择，对应一个递归分支
      dfs(curStr + letter, i + 1);  // 选择翻译成letter，生成新字符串，i指针右移继续翻译（递归）
    }
  };
  dfs('', 0); // 递归的入口，初始字符串为''，从下标0开始翻译
  return res;
};

```
```ts
// 给定一个包含红色、白色和蓝色、共 n 个元素的数组 nums ，原地对它们进行排序，使得相同颜色的元素相邻，并按照红色、白色、蓝色顺序排列。

// 我们使用整数 0、 1 和 2 分别表示红色、白色和蓝色。

// 必须在不使用库的sort函数的情况下解决这个问题。
// 输入：nums = [2,0,2,1,1,0]
// 输出：[0,0,1,1,2,2]

// 输入：nums = [2,0,1]
// 输出：[0,1,2]
// 头尾指针分别表示0的右边界和2的左边界
// 如果当前元素等于0，和头指针元素互换
// 等于2，和尾指针元素互换
var sortColors = function(nums) {
    let len = nums.length, cur = 0, p0 = 0, p1 = len -1
    while(cur <= p1){
        function swap(a,b){
            let temp = nums[a]
            nums[a] = nums[b]
            nums[b] = temp
        }
        if(nums[cur] === 0){
            swap(cur, p0)
            cur ++
            p0 ++
        }else if(nums[cur] === 2){
            swap(cur, p1)
            p1 --
        }else{
            cur ++
        }
    }
}
```

```ts
// 输入：[7,1,5,3,6,4]
// 输出：5
// 解释：在第 2 天（股票价格 = 1）的时候买入，在第 5 天（股票价格 = 6）的时候卖出，最大利润 = 6-1 = 5 。
//      注意利润不能是 7-1 = 6, 因为卖出价格需要大于买入价格；同时，你不能在买入前卖出股票。

// 股票低值，肯定在左侧，循环比较，获取左侧的最低值。

// 输入：prices = [7,1,5,3,6,4]
// 输出：7
// 解释：在第 2 天（股票价格 = 1）的时候买入，在第 3 天（股票价格 = 5）的时候卖出, 这笔交易所能获得利润 = 5 - 1 = 4 。
//      随后，在第 4 天（股票价格 = 3）的时候买入，在第 5 天（股票价格 = 6）的时候卖出, 这笔交易所能获得利润 = 6 - 3 = 3 。
//      总利润为 4 + 3 = 7 。

// *只能用while循环，顺序执行while循环，得到波谷和波峰，取得一次利润
//   i相当于拨轮，while循环通过拨动拨轮获得最低点和最高点
//   尤其注意，越界问题
```
