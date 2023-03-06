import { StatusBar } from "expo-status-bar";
import {
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Asset } from "expo-asset";
import { useRouter } from "expo-router";

const background = {
  uri: Asset.fromModule(require("../assets/background.jpg")).uri,
};

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ImageBackground
        source={background}
        resizeMode="cover"
        style={styles.image}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace("/chatroom")}
        >
          <Text style={styles.buttonText}>Potrzebuje pomocy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace("/chatroom")}
        >
          <Text style={styles.buttonText}>Chętnie pomogę</Text>
        </TouchableOpacity>
        <StatusBar style="auto" />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  button: {
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: "#6e91f1",
    borderRadius: 40,
    width: "80%",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
});
