import type { PusherMember } from '@/shared/types/pusher/pusher';
import { chunkMembers } from '@/widgets/room/libs/chunkMembers/chunkMembers';

const members: Array<PusherMember> = [
  {
    id: Math.random().toString(),
    name: 'John Doe',
  },
  {
    id: Math.random().toString(),
    name: 'Jane Doe',
  },
  {
    id: Math.random().toString(),
    name: 'John Smith',
  },
  {
    id: Math.random().toString(),
    name: 'Jane Smith',
  },
  {
    id: Math.random().toString(),
    name: 'John Doe',
  },
  {
    id: Math.random().toString(),
    name: 'Jane Doe',
  },
  {
    id: Math.random().toString(),
    name: 'John Smith',
  },
  {
    id: Math.random().toString(),
    name: 'Jane Smith',
  },
  {
    id: Math.random().toString(),
    name: 'John Doe2',
  },
  {
    id: Math.random().toString(),
    name: 'Jane Doe',
  },
  {
    id: Math.random().toString(),
    name: 'John Smith',
  },
  {
    id: Math.random().toString(),
    name: 'Jane Smith',
  },
];

test('should contain 4 arrays each with one element', () => {
  const fourItems = members.slice(0, 4);
  const chunks = chunkMembers(fourItems);

  expect(chunks).toHaveLength(4);
  chunks.forEach((subArray) => {
    expect(Array.isArray(subArray)).toBe(true);
    expect(subArray).toHaveLength(1);
  });
});

test('should contains 4 arrays with 4 elements in the first and third arrays and 2 elements in the second and fourth arrays', () => {
  const chunks = chunkMembers(members);

  expect(chunks).toHaveLength(4);
  expect(chunks[0]).toHaveLength(4);
  expect(chunks[1]).toHaveLength(2);
  expect(chunks[2]).toHaveLength(4);
  expect(chunks[3]).toHaveLength(2);
});
