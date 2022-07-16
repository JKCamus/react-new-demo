class SingletonPattern {
  private static instance: SingletonPattern;
  private constructor() {}
  public static getInstance() {
    if (!SingletonPattern.instance) {
      SingletonPattern.instance = new SingletonPattern();
    }
    return SingletonPattern.instance;
  }
}

export default SingletonPattern;

let single1 = SingletonPattern.getInstance();
let single2 = SingletonPattern.getInstance();
console.log('is ok?', single1 === single2);
