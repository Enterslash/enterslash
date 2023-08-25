import { GetLogDTO } from '@enterslash/enterus/types';
import $api from './client';

export const get_all_log = (): Promise<GetLogDTO[]> => {
  return $api.get('/log');
};
