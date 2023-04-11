/**
 *
 * @param url request target url
 * @returns {Promise<string>}
 */
export function request(url: string) {
  return fetch(url, {
    mode: 'cors'
  }).then((response) => {
    if (response.ok) {
      return response.text()
    }
    throw response
  })
}
