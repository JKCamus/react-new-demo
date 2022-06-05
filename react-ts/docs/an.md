具体方案：
建立责任链处理，

```ts
abstract class BaseHandler {
  private nextHandler: BaseHandler | null = null;
  public setNextHandler(handler: BaseHandler): BaseHandler {
    this.nextHandler = handler;
    return this.nextHandler;
  }

  // 调用该节点的方法处理请求，处理后，调用下一节点继续处理
  public handleChain(msgData: any): void {
    // 当前节点的处理
    if (this.checkHandle(msgData)) {
      this.handler(msgData);
    }
    // 继续执行下一个节点
    if (this.nextHandler) {
      this.nextHandler.handleRequest(msgData);
    }
  }

  // 判断是否在这个节点处理
  abstract checkHandle(msgData): boolean;
  // 处理的方式
  abstract handler(msgData): void;
}

class JudgeBusinessValid extends BaseHandler {
  public checkHandle() {}
  public handler() {}
}

class ReplaceBusiness extends BaseHandler {
  public checkHandle() {}
  public handler() {}
}

class ReplaceBusiness extends BaseHandler {
  public checkHandle() {}
  public handler() {}
}

const judgeBusinessValid = new JudgeBusinessValid();
const replaceBusiness = new ReplaceBusiness();

noticeCpnProvider.addCpnFn(MeetingType, Component, {
  initFn, // 返回数据
  judgeBusinessValid,
  replaceBusiness,
});

const noticeCardChain = initBusiness.setNextHandler(judgeBusinessValid).setNextHandler(replaceBusiness);
noticeCardChain.handleChain();
```
