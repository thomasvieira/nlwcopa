interface HomeProps {
  poolCount: number;
  guessCount: number;
  userCount: number;
}

import Image from "next/image";
import appPreviewImg from "../assets/app-nlw-copa-preview.png";
import logo from "../assets/logo.svg";
import usersAvatarExampleImg from "../assets/users-avatar-example.png";
import iconCheckImg from "../assets/icon-check.svg";
import { api } from "../lib/axios";
import { FormEvent, useState } from "react";

export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTitle] = useState("");

  async function createPool(event: FormEvent) {
    event.preventDefault();

    try {
      const response = await api.post("/pools", {
        title: poolTitle,
      });

      const { code } = await response.data;

      await navigator.clipboard.writeText(code);
      console.log(code);

      const message =
        "Bolao criado com sucesso. O código do bolão foi copiado para a área de transferencia. \nCódigo do bolão: " +
        code;

      alert(message);
      setPoolTitle("");
    } catch (err) {
      console.log(err);
      alert("Falha ao criar o bolão");
    }
  }

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-20 items-center">
      <main>
        <Image src={logo} alt="Logotipo da aplicação" />
        <h1 className="mt-14 text-white text-4xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>
        <div className="mt-10 flex items-center gap-2">
          <Image src={usersAvatarExampleImg} alt="avatares de usuários" />
          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{props.userCount}</span> pessoas
            já estão usando
          </strong>
        </div>
        <form onSubmit={createPool} className="mt-10 flex">
          <input
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-gray-100"
            type="text"
            required
            onChange={(e) => setPoolTitle(e.target.value)}
            value={poolTitle}
            placeholder="Qual o nome do seu bolão"
          />
          <button
            className="bg-yellow-500 ml-2 px-6 py-4 text-sm text-gray-900 font-bold rounded uppercase hover:bg-yellow-800"
            type="submit"
          >
            Criar meu bolão
          </button>
        </form>
        <p className="mt-4 w-[400px] text-gray-300 text-sm leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>
        <div className="mt-5 pt-5 flex border-t border-gray-600 ">
          <div className="flex flex-1 pr-16  border-r-[1px] border-gray-600">
            <Image src={iconCheckImg} alt="" />
            <div className="ml-6 flex flex-col">
              <span className="text-2xl text-gray-100">+{props.poolCount}</span>
              <span className="text-base text-gray-100">Bolões Criados</span>
            </div>
          </div>
          <div className="flex flex-1 pl-16">
            <Image src={iconCheckImg} alt="" />
            <div className="ml-6 flex flex-col">
              <span className="text-2xl text-gray-100">
                +{props.guessCount}
              </span>
              <span className="text-base text-gray-100">Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>
      <Image
        src={appPreviewImg}
        alt="Dois celulares exibindo prévia do app mobile NLW Copa"
        quality={100}
      />
    </div>
  );
}

export const getServerSideProps = async () => {
  const [poolCountResponse, guessCountResponse, userCountResponse] =
    await Promise.all([
      api.get("/pools/count"),
      api.get("/guesses/count"),
      api.get("/users/count"),
    ]);

  console.log(
    poolCountResponse.data,
    guessCountResponse.data,
    userCountResponse.data
  );
  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count,
    },
  };
};
