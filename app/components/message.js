import { View, Text, StyleSheet } from "react-native";

export default function Message(props) {
  return (
    <View
      style={{
        ...styles.message,
        ...(props.side === "left" ? styles.leftMessage : styles.rightMessage),
      }}
    >
      <Text
        style={
          props.side === "left"
            ? styles.leftMessageText
            : styles.rightMessageText
        }
      >
        {props.children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
