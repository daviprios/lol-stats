const token = import.meta.env["X-Riot-Token"];

export default function HeaderInterceptor({ headers, ...options }) {
  return {
    ...options,
    method: "GET",
    headers: {
      ...headers,
      "X-Riot-Token": token,
      "Accept-Language": "pt-BR,pt;q=0.7,en-US;q=0.6,en;q=0.5",
      "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
    },
  };
}
