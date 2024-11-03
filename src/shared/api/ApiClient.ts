export abstract class ApiClient {
  baseUrl: string;

  constructor() {
    this.baseUrl = '';
  }

  async fetcher<T>(url: string, config?: RequestInit) {
    const response = await fetch(`${this.baseUrl}/${url}`, config);

    const { ok, json } = response;

    if (!ok) {
      throw new Error('Failed to fetch data from API');
    }

    const data = (await json()) as T;

    return {
      ...response,
      data,
    };
  }
}
