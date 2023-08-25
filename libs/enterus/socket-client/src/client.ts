import { io } from 'socket.io-client';
import { base_url } from '@enterslash/enterus/utils';
import { isNextJs } from '@enterslash/utils';

const URL = isNextJs ? (process.env["NEXT_PUBLIC_API_URL_HOMEZZ"] as string) : base_url

export const $socket = io(URL);