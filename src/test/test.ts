const data = {
  businessData: {},
  replaceData: {},
  isValid: true
}
enum msgDataKey {
  replaceData = 'replaceData',
  businessData = 'businessData',
  isValid = 'isValid'
}
enum msgOperation {
  replace = 'replace',
  isValid = 'isValid',
  unShift = 'unShift'
}

const getValidKeys = (obj) => {
  const validKeys = []
  const isInvalidKey = (value) => {
    return !!value
  }
  Object.getOwnPropertyNames(obj).forEach((key) => {
    if (isInvalidKey(obj[key])) {
      validKeys.push(key)
    }
  });
  return validKeys
}


class BaseArray<T> {
  private arr: T[]

  public constructor(arr: T[]) {
    this.arr = arr
  }

  public unShift(value: T) {
    this.arr.unshift(value)
    return this
  }
  public del(index: number) {
    this.arr.splice(index, 1)
    return this
  }
}


// const msgDatum=[{
//   cpn, //业务传回组件
//   cpnData, //组件初始化数据
//   msgId,
//   msgType,
// }]

// 根据返回数据的key组合，定义不同的执行函数
const getExecuteType = (data) => {
  const validKeys: msgDataKey[] = getValidKeys(data)
  switch (validKeys) {
    case [msgDataKey.isValid]:
      return msgOperation.isValid;
    case [msgDataKey.replaceData, msgDataKey.businessData]:
      return msgOperation.replace;
    case [msgDataKey.businessData]:
      return msgOperation.unShift;
    default:
      break;
  }
}

// 执行函数，返回对通知列表数据的操作
const executeStrategy = {
  [msgOperation.replace]: (msgDatum, msgData) => {
    const index = msgDatum.findIndx(item => {
      const keys = [...Object.keys(item), Object.keys(msgData.businessData.cpnData)]
      const targetKey = msgData?.replaceData?.targetKey
      const targetField = msgData?.replaceData?.targetKey
      const isIn = keys.includes(targetKey)
      return isIn && (item[targetKey] === targetField || item?.cpnData[targetKey] === targetField)
    })
    const cards = new BaseArray(msgDatum)
    const newMsgDatum = cards.del(index).unShift(msgData)
    return newMsgDatum
  },
  [msgOperation.isValid]: (msgDatum, msgData) => {
    return msgDatum
  },
  [msgOperation.unShift]: (msgDatum, msgData) => {
    return [msgData, ...msgDatum]
  },

}


const executeFn = (msgDatum, msgData) => {
  const newMsgDatum = executeStrategy[getExecuteType(msgData)](msgDatum, msgData)
  return newMsgDatum
}



type MyPartial<T> = {
  [P in keyof T]: T[P]
}

// type User = {
//   name: string,
//   password: string
//   phone: string
// }

// {
//   name ?: string;
//   password ?: string;
//   phone ?: string;
// }


interface BusinessData {
  cpnData: any,
  updateTag?: {
    [key: string]: string | number
  },
}






