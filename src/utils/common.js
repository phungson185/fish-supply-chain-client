import { web3 } from 'contracts';
import { DateTime } from 'luxon';
import moment from 'moment';

export const isMobile = () => {
  const mobiles = [/Android/i, /webOS/i, /iPhone/i, /iPad/i, /iPod/i, /BlackBerry/i, /Windows Phone/i];
  return mobiles.some((matches) => navigator.userAgent.match(matches));
};

export const formatNumber = (number) => Number(number ?? 0).toLocaleString();

export const shorten = (address, head = 8, tail = 6) => {
  if (!address) return address;
  return address.slice(0, head) + '...' + address.slice(address.length - tail);
};

export const getBase64 = (file, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(file);
};

export const getTimeAgo = (time) => {
  const units = ['year', 'month', 'week', 'day', 'hour', 'minute', 'second'];
  const diff = DateTime.fromISO(time)
    .diffNow()
    .shiftTo(...units);
  const unit = units.find((unit) => diff.get(unit) !== 0) ?? units.reverse()[0];
  const relativeFormatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  return relativeFormatter.format(Math.trunc(diff.as(unit)), unit);
};

export const getTimeFormat = (time) => {
  return DateTime.fromISO(time).toFormat('MM/dd/yyyy, HH:mm');
};

export const randomTokenID = () => {
  const mils = Date.now() % (1e9 + 7);
  const rand = Math.floor(Math.random() * 9e3) + 1e3;
  return `${mils}${rand}`;
};

export const formatTime = (time) => {
  return moment(time).format('HH:mm DD/MM/YYYY');
};

export const formatTimeDate = (time) => {
  return moment(time).format('DD/MM/YYYY');
};

export const pinataUrl = (hash) => {
  return `https://gateway.pinata.cloud/ipfs/${hash}`;
};

export { default as merge } from './merge';
