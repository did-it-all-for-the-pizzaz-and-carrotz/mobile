import { NavigationContainer, Redirect, Stack } from "expo-router";
import WelcomeScreen from "./welcome";
import ChatroomScreen from "./chatroom";

export default function App() {
  return <Redirect href={"/welcome"} />;
}
