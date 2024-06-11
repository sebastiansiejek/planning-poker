import { createOrJoinToRoom } from '@/app/actions/createOrJoinToRoom';
import { Button } from '@/shared/UIKit/Button/Button';
import { TextInput } from '@/shared/UIKit/TextInput/TextInput';

export default function CreateGamePage() {
  return (
    <form
      action={createOrJoinToRoom}
      className="flex flex-col gap-6 justify-center items-center h-svh p-8"
    >
      <TextInput required placeholder="Game name" name="name" />
      <Button type="submit">Create or join</Button>
    </form>
  );
}
