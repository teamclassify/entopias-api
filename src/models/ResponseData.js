class ResponseData {
  constructor(builder) {
    this.data = builder.data;
    this.error = builder.error;
    this.status = builder.status;
    this.timestamp = builder.timestamp;
    this.msg = builder.msg;
  }
}

export default class ResponseDataBuilder {
  constructor() {
    this.data = null;
    this.error = null;
    this.status = 200;
    this.timestamp = new Date();
    this.msg = "ok";
  }

  setData(data) {
    this.data = data;
    return this;
  }

  setError(error) {
    this.error = error;
    return this;
  }

  setStatus(status) {
    this.status = status;
    return this;
  }

  setMsg(msg) {
    this.msg = msg;
    return this;
  }

  build() {
    return new ResponseData(this);
  }
}
