import type { RoomMember } from '@/app/game/[...room]/types';

export const chunkMembers = (
  array: Array<RoomMember>,
): Array<Array<RoomMember>> => {
  const chunks: Array<Array<RoomMember>> = [[], [], [], []];

  for (let index = 0; index < Math.min(4, array.length); index += 1) {
    chunks[index].push(array[index]);
  }

  if (array.length > 4) {
    let firstAndThirdCounter = 0;
    let secondAndFourthCounter = 0;
    let firstThirdTurn = true;

    for (let index = 4; index < array.length; index += 1) {
      if (firstThirdTurn) {
        if (chunks[0].length <= chunks[2].length) {
          chunks[0].push(array[index]);
        } else {
          chunks[2].push(array[index]);
        }
        firstAndThirdCounter += 1;
      } else {
        if (chunks[1].length <= chunks[3].length) {
          chunks[1].push(array[index]);
        } else {
          chunks[3].push(array[index]);
        }
        secondAndFourthCounter += 1;
      }

      if (firstAndThirdCounter % 3 === 0 && firstAndThirdCounter > 0) {
        firstThirdTurn = false;
        firstAndThirdCounter = 0;
      } else if (
        secondAndFourthCounter % 1 === 0 &&
        secondAndFourthCounter > 0
      ) {
        firstThirdTurn = true;
        secondAndFourthCounter = 0;
      }
    }
  }

  return chunks;
};
