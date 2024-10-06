export class DataResponse<T> {
  status: string;
  message: string;
  data?: T;

  constructor(message: string = '', data?: T, status: string = 'success') {
    this.status = status;
    this.message = message;
    this.data = data;
  }
}
