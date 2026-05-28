import CustomAvatar, { DEFAULT_CONFIG } from './CustomAvatar';
import { getAvatarComponent } from './index';

export default function UserAvatar({ user, size = 80 }) {
  if (user?.avatar_config) {
    let config = user.avatar_config;
    if (typeof config === 'string') {
      try { config = JSON.parse(config); } catch { config = DEFAULT_CONFIG; }
    }
    return <CustomAvatar config={config} size={size} />;
  }

  if (user?.avatar) {
    const AvatarComponent = getAvatarComponent(user.avatar);
    return <AvatarComponent size={size} />;
  }

  return <CustomAvatar config={DEFAULT_CONFIG} size={size} />;
}
