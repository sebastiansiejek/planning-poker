export abstract class ApiClient {
  baseUrl: string;

  constructor() {
    this.baseUrl = '';
  }

  async fetcher<T>(url: string, config?: RequestInit) {
    const response = await fetch(`${this.baseUrl}/${url}`, config);

    const { ok } = response;

    if (!ok) {
      throw new Error('Failed to fetch data from API');
    }

    const data = (await response.json()) as T;

    return {
      ...response,
      data,
    };
  }
}
