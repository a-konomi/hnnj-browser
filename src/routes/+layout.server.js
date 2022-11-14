import { PROXY_URL } from '$env/static/private';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ params }) {

  let threads = undefined
  let url = PROXY_URL + '/threads'

  try {
    await fetch(url)
        .then((response) => response.text())
        .then((data) => {
          // threads = data.split('\n')
          threads = data.split(/\r?\n/).map(thread => {
            if (thread === '') return
            const _thread = thread.split('.cgi,')
            const infos = _thread[1].split('(')
            return {
              id: _thread[0],
              title: infos[0],
              comments: infos[1].slice(0, -1)
            }
          })
          threads = threads.filter(t => t !== undefined)
        })
  } catch (error) {
    console.log('shitaraba down?')
  }

  return {
    proxy_url: PROXY_URL,
    threads: threads
  }
}