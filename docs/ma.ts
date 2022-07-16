
abstract class BaseHandler {
  // 下一个节点
  private nextHandler: BaseHandler | null = null;
  // 设置下一个节点
  public setNextHandler(handler: BaseHandler): BaseHandler {
    this.nextHandler = handler;
    return this.nextHandler;
  }

  // 调用该节点的方法处理请求，处理后，调用下一节点继续处理
  public handleRequest(businessData: any): void {
    // 当前节点的处理
    if (this.checkHandle(businessData)) {
      this.handler(businessData);
    }
    // 继续执行下一个节点
    if (this.nextHandler) {
      this.nextHandler.handleRequest(businessData);
    }
  }
  // 判断是否在这个节点处理
  abstract checkHandle(businessData: any): boolean;
  // 处理的方式
  abstract handler(config: any): void;
}




abstract class BaseCheck {
  abstract handler(businessData: any, msgDatum: any)
}

class CheckValid extends BaseCheck {
  public handler(businessData: any, msgDatum: any) {
    const { isValid } = businessData
    return {
      isNeedNext: isValid,
      msgDatum
    }
  }
}

class CheckReplace extends BaseCheck {
  public handler(businessData: any, msgDatum: any) {
    const { replace, cpnData } = businessData
    if (!replace || !cpnData) return {
      isNeedNext: true,
      msgDatum
    }
    const cardsId = replace()
    if (cardsId.length) {
      const cardData = {
        cardId: msgDatum.length,
        cpnData,
      }
      const newMsgDatum = msgDatum.filter(msg => !cardsId.includes(msg.cardId))
      newMsgDatum.unshift(cardData)
      return {
        isNeedNext: false,
        msgDatum: newMsgDatum
      }
    }
    return {
      isNeedNext: true,
      msgDatum
    }
  }

}

class CheckUnshift extends BaseCheck {
  public handler(businessData: any, msgDatum: any) {
    const { cpnData } = businessData
    if (cpnData) {
      const cardData = {
        cardId: msgDatum.length,
        cpnData,
      }
      msgDatum.unshift(cardData)
      return {
        isNeedNext: false,
        msgDatum
      }
    }
    return {
      isNeedNext: true,
      msgDatum
    }
  }
}


class HandlerChain {
  // 持有所有Handler:
  private handlers = [];

  public addHandler(handler) {
    this.handlers.push(handler);
  }

  public process(businessData, msgDatum) {
    // 依次调用每个Handler:
    let newMsgData = msgDatum
    for (const handleInstance of this.handlers) {
      const result = handleInstance.handler(businessData, msgDatum)
      newMsgData = result.msgDatum
      if (!result.isNeedNext) {
        break;
      }
    }
    return newMsgData
  }
}


const chain = new HandlerChain();
chain.addHandler(new CheckValid())
chain.addHandler(new CheckReplace())
chain.addHandler(new CheckUnshift())


const businessData = {
  cpnData: 'cpnData new',
  isValid: false,
  // replace: () => [1]
}

const msgDatum = [
  {
    cardId: 0,
    cpnData: 'cpnData0'
  },
  {
    cardId: 1,
    cpnData: 'cpnData1'
  },
  {
    cardId: 2,
    cpnData: 'cpnData2'
  },
]


// 调用
const resultData = chain.process(businessData, msgDatum)
console.log('resultData', resultData)


enum UniqueTagName {
  NoticeType = 'NoticeType',
  MeetingNo = 'MeetingNo',
}

interface Business {
  unique: {
    [key in UniqueTagName]?: string | number
  }
}

const getBusiness = (): Business => {

  return {
    unique: {
      NoticeType: '90'
    }
  }
}




interface IProps {
  msgData: { // 当前Im消息
    msgId: number;
    cardId: number;
    body: any;
    type: msgType
  };
  currentTypesMsgData: msgData[]// 同类卡片数据
  closeCard: (cardId: number) => void;
  onlyShowCurrentCard?: (cardId: number) => void
  closeCards?: (cardIds: number[]) => void
}


const RecordNoticeCard: React.FC<IProps> = ({ msgData, currentTypesMsgData, closeCard }) => {

  return deadLineList.length ?
    (<div>
      Business
      </div>):null;
}
