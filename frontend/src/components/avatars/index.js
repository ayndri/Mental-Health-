export { default as AvatarLuna } from './AvatarLuna';
export { default as AvatarHana } from './AvatarHana';
export { default as AvatarKai } from './AvatarKai';
export { default as AvatarDito } from './AvatarDito';
export { default as AvatarRiri } from './AvatarRiri';

import AvatarLuna from './AvatarLuna';
import AvatarHana from './AvatarHana';
import AvatarKai from './AvatarKai';
import AvatarDito from './AvatarDito';
import AvatarRiri from './AvatarRiri';

export const AVATARS = [
  {
    id: 'luna',
    name: 'Luna',
    description: 'Ceria & penuh semangat',
    color: '#EDE9FE',
  },
  {
    id: 'hana',
    name: 'Hana',
    description: 'Hangat & penuh kasih',
    color: '#FCE7F3',
  },
  {
    id: 'kai',
    name: 'Kai',
    description: 'Ekspresif & menyenangkan',
    color: '#D1FAE5',
  },
  {
    id: 'dito',
    name: 'Dito',
    description: 'Keren & percaya diri',
    color: '#FEF3C7',
  },
  {
    id: 'riri',
    name: 'Riri',
    description: 'Cerdas & ramah',
    color: '#ECFDF5',
  },
];

const AVATAR_MAP = {
  luna: AvatarLuna,
  hana: AvatarHana,
  kai: AvatarKai,
  dito: AvatarDito,
  riri: AvatarRiri,
};

export function getAvatarComponent(avatarId) {
  return AVATAR_MAP[avatarId] || AvatarLuna;
}
