// // // import { render } from "react-dom";

// // // enum msgType {
// // //   BADGE = 'badge',
// // //   MESSAGE_CARD = 'messageCard',
// // //   POP_UP = 'popUp',
// // // }

// // // class BadgeNotice {
// // //   public show(msg) {
// // //     event.emit();
// // //   }
// // // }

// // // const { Provider: InviteProvider, Opener: InviteOpener } = createDisposableWindow(
// // //   { name: '', avatar: '', onConfirm: () => {}, onCancel: () => {} },
// // //   config,
// // // );

// // // export { InviteProvider, InviteOpener };

// // // const RenderWindow=(InviteOpener,({}))=>{

// // //   const handleClose={}
// // //   ReactDOM.render(
// // //       <InviteOpener {...props}  onClose={handleClose} onConfirm={handleConfirm} onCancel={handleCancel} />
// // //     div,
// // //   );
// // // }

// // {/* <BadgeWrapper fetch={fetchFn}>
// // {({count,show})=>
// // <Badge count={count} show={show}>
// //   <YourCpn></YourCpn>
// // </Badge>
// // }
// // </BadgeWrapper> */}

// // // <InviteProvider>
// // //   <YourCpn></YourCpn>
// // // </InviteProvider>

// // // <Badge count={} >
// // // <YourCpn></YourCpn>
// // // </Badge>

// // // class MessageCard {
// // //   public show (){
// // //     RenderWindow()
// // //   }
// // // }

// // // const strategies = {
// // //   [msgType.BADGE]:  new BadgeNotice().show,
// // //   [msgType.MESSAGE_CARD]:  new MessageCard().show,
// // //   [msgType.POP_UP]: new PopUp().show,
// // // };

// // // const inform = (msgType: msgType, msg: any) => {
// // //   return strategies[msgType](msg);
// // // };

// // // const useNotifications = (msg) => {

// // //   return inform(msgType, msg);
// // // };

// // // const Badge = ({ children }) => {
// // //   useEffect(() => {
// // //     event.on();
// // //   }, []);

// // //   return <div>{children(count)}</div>;
// // // };

// // // const asyncFetch=async(fetch)=>{
// // //   const count= await fetch()
// // // }

// // // class MessageNotice{

// // //   constructor() {
// // //     this.strategy = null
// // //   }

// // //   public setStrategy(strategy){
// // //     this.strategy=strategy
// // //   }

// // //   public inform = (msgType: msgType, msg: any) => {
// // //     return this.strategies[msgType](msg);
// // //   };
// // // }
// // // const messageNotice=new MessageNotice()

// // // messageNotice.inform()
// // interface IBadge {
// //   type: string; // 消息类型&更新数据类型
// //   id: number;
// //   count: number;
// //   pid: number;
// //   child?: IBadge[];
// // }

// // // 如果消息类型中，有对应的type，会更新对应的count。最后重新计算整棵树

// // const badgeData: IBadge[] = [
// //   {
// //     type: 'userInfo',
// //     count: 3,
// //     id: 1,
// //     pid: 0,
// //     child: [
// //       { type: 'ota', count: 0, id: 2, pid: 1 },
// //       {
// //         type: 'confirm',
// //         count: 2,
// //         id: 3,
// //         pid: 1,
// //         child: [{ type: 'confirm', count: 1, id: 3, pid: 1 }],
// //       },
// //     ],
// //   },
// // ];
// // const asyn=()=>{

// // }

// // const data=[{
// //   type:'userInfo',
// //   child:[{type:'',}]
// // }]

// // <BadgeWrapper type='' fetch={fetchFn}>
// // {({count,show})=>
// // <Badge count={count} show={show}>
// //   <YourCpn></YourCpn>
// // </Badge>
// // }
// // </BadgeWrapper>

// // // const treeMap={
// // //   [badgeData[0].id]:{badgeData[0]}
// // //   }

// // export default badgeData;

// enum NoticeType {
//   Popup,
//   MsgCard,
//   Badge,
// }

// type Strategy = [
//   {
//     msgType: '';
//     resolve: [
//       {
//         noticeType: NoticeType;
//         fn: () => void;
//       },
//     ];
//   },
// ];

// // 1. 注册计算红点关系

// interface IBadgeTree{
//   messageType;
//   child?:IBadgeTree[];
//   }
// badgeNotice.setBadgeTree(IBadgeTree)

// // 1.1 调用方传入监听消息类型，查询后台对应消息未读数量方法
// <BadgeWrapper type={messageType}  fetch={fetchFn}>
//   <YourCpn></YourCpn>
// </BadgeWrapper >

// // 2. 通过关系树生成自己的数据模型

// interface TreeData{
//   type: string; // 消息类型&更新数据类型
//   id: number; // 唯一id
//   count: number;// 消息数
//   pid: number;// 父元素id
//   child?: TreeData[];// 关联子小红点
//   }

// // 3. 后台触发更新，调用1.1消息类型对应的异步方法，获取数量后更新树，计算数量返回。

// // 4.组件决定自己显示红点还是，包括数量

// class QueueData {
//   private queue: Array<QueueItem>;
//   public constructor() {
//     this.queue = [];
//   }

//   public push(data: QueueItem) {
//     if (this.checkExistAndReplace(data)) return;
//     this.queue.push(data);
//   }
//   public pop() {
//     return this.queue.pop();
//   }
//   public unshift(data: QueueItem) {
//     if (this.checkExistAndReplace(data)) return;
//     this.queue.unshift(data);
//   }
//   public shift() {
//     return this.queue.shift();
//   }

//   public checkExist(id: string) {
//     return this.queue.find((d) => id === d.id);
//   }
//   private checkExistAndReplace(data: QueueItem) {
//     const item = this.checkExist(data.id);
//     if (!item) return false;
//     item.fn = data.fn;
//     return true;
//   }
// }
