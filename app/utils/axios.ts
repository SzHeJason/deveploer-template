import axios from "axios";

import { GIT_TOKEN } from './token'

export const gitAxios = axios.create({
  baseURL:'http://git.code.oa.com',
  headers: {
    'PRIVATE-TOKEN': GIT_TOKEN,
  },
})