import { commonAxios as axios } from '../../axios-instances';
// import Qs from 'Qs';
import {MINOS_WEB_TALARIS_PREFIX} from 'config/hosts';
axios.defaults.baseURL = `${MINOS_WEB_TALARIS_PREFIX}/grid_weather`;
export const upload = params => axios.put('/upload/file', params);
