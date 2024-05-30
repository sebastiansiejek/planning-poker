import {redirect} from "next/navigation";
import {UserModel} from "@/shared/user/model/UserModel";

export default async function Page({searchParams}: LoginPageProps) {
  const room = searchParams.room

  const handleSubmit = async (formData: FormData) => {
    "use server"
    const name = formData.get('name') as string

    if (name) {
      UserModel.setUserName(name)
      redirect(`/game/${room || ''}`)
    }
  }

  return (
    <form action={handleSubmit}>
      <input name={'name'} required={true}/>
      <button type={'submit'}>Join</button>
    </form>
  )
}
