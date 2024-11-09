export type ResponseCommon<T> = Pick<Response, 'status'> & {
  data: T;
};
