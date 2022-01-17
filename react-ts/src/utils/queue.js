/* eslint-disable */
import {remove} from 'lodash';
import uuid from 'uuid-js'

const createUUID=()=> {
  return uuid.create().toString();
},

const removeItemById=(item,arr)=>{
  return remove(arr,(ele)=>ele.uid===item.uid)
}



const removeItemById = function (item, arr) {
  return remove(arr, (ele) => {
    return ele.uid === item.uid;
  });
};

const getItem = function (item, arr) {
  return arr.find((ele) => {
    return ele.uid === item.uid;
  });
};

class TaskQueue {
  constructor(maxExecuteCount) {
    this.waitingQueue = [];
    this.executeQueue = [];
    this.maxExecuteCount = maxExecuteCount || 1;
    this.executeFunction = null;
    this.cancelExecuteFunction = null;
  }

  setExecuteFunction(fun) {
    this.executeFunction = fun;
  }
  setCancelExecuteFunction(fun) {
    this.cancelExecuteFunction = fun;
  }

  _isAllowExecute() {
    return this.executeQueue.length < this.maxExecuteCount;
  }

  _removeExecuteQueue(item, arr) {
    return remove(arr, (ele) => {
      return ele.uid === item.uid;
    });
  }

  _runNext() {
    if (this.waitingQueue.length) {
      const task = this.waitingQueue.shift();
      this.executeQueue.push(task);
      this._execute(task);
      if (this._isAllowExecute()) {
        this._runNext();
      }
    }
  }

  run(task) {
    if (!task.uid) {
      task.uid = createUUID();
    }
    if (this._isAllowExecute()) {
      this.executeQueue.push(task);
      return this._execute(task);
    } else {
      this.waitingQueue.push(task);
    }
  }

  finish(task) {
    if (!task) {
      return;
    }
    removeItemById(task, this.executeQueue);

    if (this._isAllowExecute()) {
      this._runNext();
    }
  }

  cancel(task) {
    const executeItem = getItem(task, this.executeQueue);
    const waitingItem = getItem(task, this.waitingQueue);

    // 执行中则执行cancelExecuteFunction
    if (executeItem) {
      this.cancelExecuteFunction && this.cancelExecuteFunction(executeItem);
      removeItemById(executeItem, this.executeQueue);
    } else if (waitingItem) {
      this.cancelExecuteFunction && this.cancelExecuteFunction(waitingItem);
      removeItemById(waitingItem, this.waitingQueue);
    }

    if (this._isAllowExecute()) {
      this._runNext();
    }
  }

  _execute(task) {
    if (this.executeFunction !== null && typeof this.executeFunction === 'function') {
      return this.executeFunction(task);
    } else {
      throw '未设置执行方法';
    }
  }
}

export default TaskQueue;
