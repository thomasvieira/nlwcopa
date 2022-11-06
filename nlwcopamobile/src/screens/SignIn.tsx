import { Text, Center, Icon } from "native-base";
import { Fontisto } from "@expo/vector-icons";
import { useAuth } from "../hooks/Auth";
import Logo from "../assets/logo.svg";
import { Button } from "../components/Button";

export function SignIn() {
  const { signIn, isUserLoading } = useAuth();
  return (
    <Center flex={1} bgColor="gray.900">
      <Logo width={212} height={40} />
      <Button
        type="SECONDARY"
        mt={12}
        title="Entrar com Google"
        leftIcon={<Icon as={Fontisto} name="google" color="white" size="md" />}
        onPress={() => {
          signIn();
        }}
        isLoading={isUserLoading}
        _loading={{ _spinner: { color: "white" } }}
      />
      <Text
        m="12"
        color="white"
        textAlign="center"
        fontSize="sm"
        fontFamily="heading"
      >
        Não utilizamos nenhuma informação além do seu e-mail para criação de sua
        conta.
      </Text>
    </Center>
  );
}
