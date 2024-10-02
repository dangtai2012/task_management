export class DataResponse<T> {
  status: string;
  message: string;
  data: T;

  constructor(data: T, message: string = '', status: string = 'success') {
    this.status = status;
    this.message = message;
    this.data = data;
  }
}
