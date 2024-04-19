import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { io } from "socket.io-client";

const ChatPage = () => {
  const [chatInput, setChatInput] = useState();
  const [room, setRoom] = useState();

  return (
    <View className="h-full w-full justify-between">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <ScrollView className="bg-blue-200"></ScrollView>
      <View className="flex-row w-[80%] justify-between">
        <View className="w-full">
          <TextInput className="border-2 p-5 " placeholder="Type here..." />
        </View>
        <View className="justify-center items-center w-[25%] border-2">
          <Pressable>
            <Text>Send</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default ChatPage;
