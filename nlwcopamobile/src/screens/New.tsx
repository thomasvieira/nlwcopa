import { useState } from "react";
import { Heading, Text, VStack, useToast } from "native-base";
import { Header } from "../components/Header";
import Logo from "../assets/logo.svg";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { api } from "../services/api";

export function New() {
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  async function handlePoolCreate() {
    if (title.trim().length < 6) {
      return toast.show({
        title: "O nome do bolão precisa conter 6 ou mais letras ou números",
        placement: "top",
        bgColor: "red.500",
      });
    }
    setIsLoading(true);

    try {
      const resposta = await api.post("/pools", { title });
      toast.show({
        title: `Bolão criado com sucesso. \nO código do bolão é: ${resposta.data.code}`,
        placement: "top",
        bgColor: "green.500",
      });
    } catch (error) {
      console.log(error);

      toast.show({
        title: "O nome do bolão precisa conter 6 ou mais letras ou números",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }

    setTitle("");
  }
  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Criar novo bolão" />
      <VStack mt={8} mx={5} alignItems="center">
        <Logo />
        <Heading
          fontFamily="heading"
          fontSize="xl"
          my={8}
          textAlign="center"
          color="white"
        >
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </Heading>
        <Input
          mb={2}
          placeholder="Qual o apelido do seu bolão?"
          onChangeText={setTitle}
          value={title}
        />
        <Button
          title="Criar um bolão"
          onPress={handlePoolCreate}
          isLoading={isLoading}
        />
        <Text mt={4} color="gray.200" px={10} fontSize="sm" textAlign="center">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas.
        </Text>
      </VStack>
    </VStack>
  );
}
