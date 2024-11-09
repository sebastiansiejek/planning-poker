import type { Metadata } from 'next';

const BASE_META_TITLE = 'Planning Poker';

export const getPageMetaData = (params: Metadata) => {
  const { title } = params || {};

  return {
    title: title ? `${title} | ${BASE_META_TITLE}` : `${BASE_META_TITLE}`,
  };
};
