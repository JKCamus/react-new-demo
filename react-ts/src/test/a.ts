class Singleton {
  // 私有化构造函数，防止外部调用
  private static instance = new Singleton(); // 使用Singleton时就实例化一个对象
  public static getInstance() {
    return this.instance;
  }
  private constructor() { }

  /**
   * name
   */
  public sayMyName(wo: string) {
    console.log('====>', wo)
  }
}
// Singleton.sayMyName('woc')
Singleton.getInstance().sayMyName('cwo')



const a = [1, 2, 3, 4, 5]

a.splice(2, 1, 9)

console.log('a', a)
