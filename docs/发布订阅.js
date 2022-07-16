/* eslint-disable @typescript-eslint/explicit-member-accessibility */
class EventEmitter {
  constructor() {
    this.events = {};
  }

  emit(event, ...args) {
    const cbs = this.events[event];
    if (!cbs) {
      console.log('没有这个事件');
      return this;
    }
    cbs.forEach((cb) => cb.apply(this, args));
    return this;
  }

  on(event, cb) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(cb);
    return this;
  }

  off(event, cb) {
    if (!cb) {
      this.events[event] = null;
    } else {
      this.events[event] = this.events[event].filter((item) => item !== cb);
    }
    return this;
  }

  once(event, cb) {
    const func = (...args) => {
      cb.apply(this, args);
      this.off(event, func);
    };
    this.on(event, func);
    return this;
  }
}
