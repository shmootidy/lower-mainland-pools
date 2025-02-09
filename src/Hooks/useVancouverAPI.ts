export default function useVancouverAPI() {
  const VANCOUVER_API_DOMAIN = 'https://vancouver.opendatasoft.com/explore/v2.1'
  fetch(VANCOUVER_API_DOMAIN)
    .then((res) => res.json())
    .then((data) => {
      console.log(data.values)
    })
    .catch((err) => console.error('nope!', err))
}
