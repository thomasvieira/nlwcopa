import { Heading, useToast, VStack } from "native-base";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useState } from "react";
import { isLoading } from "expo-font";
import { api } from "../services/api";
import { useNavigation } from "@react-navigation/native";

export function Find() {
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState("");
  const toast = useToast();

  const { navigate } = useNavigation();

  async function handleJoinPool() {
    try {
      if (code.trim().length != 6) {
        return toast.show({
          title:
            "Informe um código de bolão válido.\nO código deve conter 6 caracteres entre letras e números.",
          placement: "top",
          bgColor: "red.500",
        });
      }
      setIsLoading(true);

      await api.post("/pools/join", { code });
      toast.show({
        title: `Você entrou com sucesso no bolão ${code}`,
        placement: "top",
        bgColor: "green.500",
      });
      setIsLoading(false);
      navigate("pools");
    } catch (error) {
      console.log(error);
      setIsLoading(false);

      if (error.response?.data?.message === "Pool not found.") {
        return toast.show({
          title: "Não foi possível encontrar o bolão",
          placement: "top",
          bgColor: "red.500",
        });
      }
      if (error.response?.data?.message === "You already joined this pool") {
        return toast.show({
          title: "Você já está nesse bolão.",
          placement: "top",
          bgColor: "red.500",
        });
      }
      toast.show({
        title: "Não foi possível encontrar o bolão",
        placement: "top",
        bgColor: "red.500",
      });
    }
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header showBackButton title="Buscar por código" />
      <VStack mt={8} mx={5} alignItems="center">
        <Heading
          fontFamily="heading"
          fontSize="xl"
          mb={8}
          textAlign="center"
          color="white"
        >
          Encontre um bolão através de seu código único
        </Heading>
        <Input
          mb={2}
          placeholder="Qual o código do bolão?"
          autoCapitalize="characters"
          onChangeText={setCode}
          value={code}
        />
        <Button
          title="BUSCAR BOLÃO"
          isLoading={isLoading}
          onPress={handleJoinPool}
        />
      </VStack>
    </VStack>
  );
}
