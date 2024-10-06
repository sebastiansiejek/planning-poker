'use server';

import crypto from 'crypto';

export const getGravatarUrl = async (
  email: string,
  size = 128,
  defaultImage = 'identicon',
  rating = 'g',
) => {
  const convertedEmail = email.trim().toLowerCase();
  const hashEmail = crypto
    .createHash('md5')
    .update(convertedEmail)
    .digest('hex');

  return `https://www.gravatar.com/avatar/${hashEmail}?s=${size}&d=${defaultImage}&r=${rating}`;
};
