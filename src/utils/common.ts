function stringToColor(s: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < s.length; i += 1) {
    hash = s.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.substr(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

// eslint-disable-next-line import/prefer-default-export
export function nameAvatar(name: string) {
  const fullName = name.split(' ');
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children:
      fullName.length > 1
        ? `${fullName[0][0]}${fullName[1][0]}`.toLocaleUpperCase()
        : `${fullName[0][0]}`.toLocaleUpperCase(),
  };
}
