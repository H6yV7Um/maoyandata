import { combineReducers } from 'redux';
import weathertag from './pages/Weathertag/reducer';
import maoyan from './pages/Maoyan/reducer';

export default combineReducers({
  weathertag,
  maoyan
})