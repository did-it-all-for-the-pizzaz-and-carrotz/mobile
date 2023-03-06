import { useRoute } from "@react-navigation/core";
import { Asset } from "expo-asset";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import useWebSocket from "react-native-use-websocket";
import Message from "./components/message";

const background = {
  uri: Asset.fromModule(require("../assets/background.jpg")).uri,
};

export default function ChatroomScreen() {
  const [chatroomUuid, setChatroomUuid] = useState("");
  const chatroomUuidRef = useRef(chatroomUuid);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isHelpGiverPresent, setIsHelpGiverPresent] = useState(false);
  const [isAssistantPresent, setIsAssistantPresent] = useState(false);
  const [socketUrl] = useState("ws://10.0.5.26:1235/");
  const { sendMessage, lastMessage } = useWebSocket(socketUrl);
  const router = useRouter();
  let timer;

  useEffect(() => {
    sendMessage(
      JSON.stringify({
        topic: "createChatroom",
        payload: {
          age: "ADULT",
        },
      })
    );
  }, []);

  useEffect(() => {
    chatroomUuidRef.current = chatroomUuid;
  }, [chatroomUuid]);

  useEffect(() => {
    if (!isHelpGiverPresent && !isAssistantPresent) {
      timer = setTimeout(() => {
        console.log("I will request assistant", chatroomUuidRef.current);

        Alert.alert(
          "Alert",
          "No one joined the chatroom :(\nWould you like to invite virtual assistant?",
          [
            {
              text: "Yes",
              onPress: () => {
                setIsAssistantPresent(true);
                sendMessage(
                  JSON.stringify({
                    topic: "requestAssistant",
                    payload: { chatroomUuid: chatroomUuidRef.current },
                  })
                );
              },
            },
          ]
        );
      }, 15000);
    }

    return () => clearTimeout(timer);
  }, [isHelpGiverPresent]);

  useEffect(() => {
    console.log("Received", lastMessage.data);

    if (!lastMessage.data) return;
    const { topic, payload } = JSON.parse(lastMessage.data);

    switch (topic) {
      case "GAIN_ACCESS":
        return onGainAccess(JSON.parse(payload));
      case "MESSAGE":
        return onMessage(payload);
      case "HELPER_ENTERED":
        return onHelpGiverEntered();
      case "HELPER_LEFT":
        return onHelpGiverLeft();
      case "ASSISTANT_ENTER":
        return onAssistantEntered(JSON.parse(payload));
    }
  }, [lastMessage]);

  const onGainAccess = (payload) => {
    setChatroomUuid(payload.chatroomUUID);
  };

  const onHelpGiverEntered = () => {
    setIsHelpGiverPresent(true);
    if (timer != null) {
      clearTimeout(timer);
    }
    if (isAssistantPresent) {
      Alert.alert(
        "Alert",
        "Someone joined your chatroom. Assistant will go offline now.",
        [
          {
            text: "Ok",
            onPress: () => setIsAssistantPresent(false),
          },
        ]
      );
    }
  };

  const onHelpGiverLeft = () => {
    setIsHelpGiverPresent(false);
  };

  const onAssistantEntered = (payload) => {
    if (payload.sender === "ASSISTANT") {
      setMessages([
        ...messages,
        { from: payload.sender, content: payload.message },
      ]);
    }
  };

  const onMessage = (payload) => {
    try {
      const json = JSON.parse(payload);
      if (json.sender === "HELP_GIVER" || json.sender === "ASSISTANT") {
        setMessages([
          ...messages,
          { from: json.sender, content: json.message },
        ]);
      }
    } catch {}
  };

  const handleOnSubmit = ({ nativeEvent: { text } }) => {
    sendMessage(
      JSON.stringify({
        topic: "MESSAGE",
        payload: {
          chatroomUuid,
          message: text,
        },
      })
    );
    setMessages([...messages, { from: "HELP_SEEKER", content: text }]);
    setMessage("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={background}
        resizeMode="cover"
        style={styles.image}
      >
        <TouchableOpacity onPress={() => router.replace("/welcome")}>
          <Text style={{ paddingLeft: 10, marginTop: 30, color: "#fff" }}>
            {"<-"}
          </Text>
        </TouchableOpacity>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
        >
          <View style={styles.messages}>
            {messages.map((message, i) => (
              <Message
                key={i}
                side={message.from === "HELP_SEEKER" ? "right" : "left"}
              >
                {message.content}
              </Message>
            ))}
          </View>
        </ScrollView>
        <View
          style={{
            borderBottomColor: "#fff",
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
        <View style={styles.textWrapper}>
          <TextInput
            style={styles.textInput}
            value={message}
            onChangeText={setMessage}
            onSubmitEditing={handleOnSubmit}
          />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    width: "100%",
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    flex: 1,
  },
  messages: {
    width: "90%",
    flex: 1,
    flexGrow: 1,
    paddingTop: 20,
    paddingBottom: 20,
    gap: 20,
  },
  message: {
    width: "80%",
    textAlign: "left",
    backgroundColor: "#fff",
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 20,
  },
  leftMessage: {
    backgroundColor: "#6e91f1",
    alignSelf: "flex-start",
  },
  rightMessage: {
    backgroundColor: "#fff",
    alignSelf: "flex-end",
  },
  leftMessageText: {
    color: "#fff",
  },
  rightMessageText: {
    color: "#000",
  },
  textInput: {
    backgroundColor: "#fff",
    width: "90%",
    height: 40,
    margin: 12,
    padding: 10,
    alignSelf: "center",
  },
  textWrapper: {
    backgroundColor: "#6e91f1",
  },
});
