import { writable } from 'svelte/store';

export const proxy_url = writable('http://localhost:9801');
export const threads = writable([]);
export const latest_id = writable('');
export const breed = writable('(´・ω・｀)');

// for standbys
export const rooms = writable([])
