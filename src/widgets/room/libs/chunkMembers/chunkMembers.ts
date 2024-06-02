import type { PusherMember } from '@/types/pusher/pusher';

export const chunkMembers = (
  arr: Array<PusherMember>,
): Array<Array<PusherMember>> => {
  const chunks: Array<Array<PusherMember>> = [[], [], [], []];

  for (let i = 0; i < Math.min(4, arr.length); i += 1) {
    chunks[i].push(arr[i]);
  }

  if (arr.length > 4) {
    let firstAndThirdCounter = 0;
    let secondAndFourthCounter = 0;
    let firstThirdTurn = true;

    for (let i = 4; i < arr.length; i += 1) {
      if (firstThirdTurn) {
        if (chunks[0].length <= chunks[2].length) {
          chunks[0].push(arr[i]);
        } else {
          chunks[2].push(arr[i]);
        }
        firstAndThirdCounter += 1;
      } else {
        if (chunks[1].length <= chunks[3].length) {
          chunks[1].push(arr[i]);
        } else {
          chunks[3].push(arr[i]);
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
