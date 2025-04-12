import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="mood-questionnaire"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="home"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="recitation"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ocr"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="authentication-screen"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="namaz-tariqa/index"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="namaz-tariqa/[prayer]"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="chatbot"
        options={({ route }) => ({
          headerShown: false,
          title: typeof route?.params?.title === 'string' ? route.params.title : 'Chat'
        })}
      />
    </Stack>
  );
}