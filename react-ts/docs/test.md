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
