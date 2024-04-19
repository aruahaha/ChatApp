import { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  TextInput,
  Pressable,
  ScrollView,
  Image,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { io } from "socket.io-client";
import { Stack } from "expo-router";
import { Feather } from "@expo/vector-icons";
import loginImage from "../assets/images/loginbgImg.png";
import chatBg from "../assets/images/chatBg.jpg";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import {
  useFonts,
  Poppins_600SemiBold,
  Poppins_500Medium,
} from "@expo-google-fonts/poppins";

const IndexPage = () => {
  const ENDPOINT = "http://192.168.29.86:3000";
  const [userInput, setUserInput] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [user, setUser] = useState({
    userName: "",
    userId: "",
    roomId: "",
    socketId: "",
  });

  const [users, setUsers] = useState([]);
  const [room, setRoom] = useState(null);
  const [chat, setChat] = useState(false);
  const [socket, setSocket] = useState(null);
  const scrollViewRef = useRef();
  let [fontsLoaded] = useFonts({
    Poppins: Poppins_600SemiBold,
    Poppins_md: Poppins_500Medium,
  });

  const joinRoom = () => {
    setUser({
      ...user,
      userName: userInput,
      userId: generateUUID(),
    });
  };

  const selectRoom = (u) => {
    setRoom(u);
    setChat(true);
  };

  const sendMessage = () => {
    if (socket) {
      socket.emit("send_message", {
        sender: user,
        receiver: room,
        message: chatInput,
      });

      setChatInput(""); // Clear the input field after sending
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  useEffect(() => {
    if (user.userName) {
      const newSocket = io(ENDPOINT, { query: { ...user } });

      newSocket.on("first-message", (data) => {
        console.log(data);
      });

      newSocket.on("users_connected", (data) => {
        setUsers(data);
      });
      newSocket.on("users_disconnected", (data) => {
        setUsers(data);
      });
      newSocket.on("chat-message", (data) => {
        setMessageList((list) => [...list, data]);
        scrollViewRef.current.scrollToEnd({ animated: true });
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user]);

  const generateUUID = () => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36);
    return timestamp + "-" + randomStr;
  };

  if (!fontsLoaded) {
    return <ActivityIndicator />;
  } else {
    if (!user.userName) {
      return (
        <View className="w-full h-full justify-end items-center">
          <Stack.Screen
            options={{
              headerShown: false,
            }}
          />
          <ImageBackground source={loginImage} className="h-full w-full" />
          <View className=" h-full justify-end items-center absolute bottom-24">
            <View className="bg-[#31363F] p-10 rounded-[20px] justify-center w-full items-center">
              <Text
                className="text-2xl text-white"
                style={{ fontFamily: "Poppins" }}
              >
                Your Username
              </Text>
              <TextInput
                className="border-2 w-full p-2 rounded-[20px] mt-3 px-5 bg-white"
                placeholder="Username..."
                value={userInput}
                onChangeText={(value) => setUserInput(value)}
              />
              <Pressable
                className="items-center bg-green-400 py-3 w-full rounded-[20px] mt-3 border-2"
                onPress={() => joinRoom()}
              >
                <Text>Join</Text>
              </Pressable>
            </View>
          </View>
        </View>
      );
    }
    if (chat && room) {
      return (
        <View className="h-full w-full justify-between bg-[#222831]">
          <Stack.Screen
            options={{
              headerTitle: room.userName,
              headerTitleStyle: { color: "white" },
              headerStyle: { backgroundColor: "#222831" },
              headerLeft: () => (
                <AntDesign
                  name="arrowleft"
                  size={24}
                  color="white"
                  style={{
                    marginRight: 10,
                  }}
                  onPress={() => setChat(false)}
                />
              ),
              headerRight: () => {},
            }}
          />

          <ScrollView
            ref={scrollViewRef}
            className="w-full mt-2 mb-5"
            showsVerticalScrollIndicator={false}
          >
            {messageList.map((item, index) => {
              if (
                item.sender.userId == room.userId ||
                item.receiver.userId == room.userId
              ) {
                return (
                  <View
                    className={
                      item.sender.userName === user?.userName
                        ? "items-end my-1 mx-5"
                        : "items-start my-1 mx-5"
                    }
                    key={index}
                  >
                    <Text
                      className={
                        item.sender.userName === user.userName
                          ? "w-full text-right text-[12px] text-white"
                          : "w-full text-left text-[12px] text-white"
                      }
                    >
                      {item.sender.userName === user.userName
                        ? "You"
                        : item.sender.userName}
                    </Text>

                    <View
                      className={
                        item.sender.userName === user?.userName
                          ? "bg-[#76ABAE] p-3 rounded-l-lg rounded-tr-lg"
                          : "bg-[#EEEEEE] p-3 rounded-r-lg rounded-tl-lg"
                      }
                    >
                      <Text
                        className="text-[15px]"
                        style={{ fontFamily: "Poppins_md" }}
                      >
                        {item.message}
                      </Text>
                    </View>
                  </View>
                );
              }
            })}
          </ScrollView>
          <View className="flex-row w-full justify-between mb-4 px-4 h-14">
            <View className="w-3/4 ">
              <TextInput
                className=" h-full px-3 bg-white text-black rounded-l-lg "
                placeholder="Type here..."
                value={chatInput}
                onChangeText={(value) => setChatInput(value)}
              />
            </View>
            <View className="justify-center items-center w-1/4 bg-white rounded-r-lg  ">
              {chatInput.length > 0 ? (
                <Pressable onPress={() => sendMessage()}>
                  <Ionicons name="send" size={24} color="black" />
                </Pressable>
              ) : (
                <></>
              )}
            </View>
          </View>
        </View>
      );
    }
    return (
      <View className="h-full bg-[#222831]">
        <Stack.Screen
          options={{
            headerShown: true,
            headerShadowVisible: false,
            headerStyle: { backgroundColor: "#222831" },
            headerLeft: () => {},
            headerRight: () => {
              return (
                <Feather
                  name="settings"
                  size={24}
                  color="white"
                  style={{
                    marginRight: 10,
                  }}
                />
              );
            },
            headerTitle: () => (
              <>
                <Text style={{ marginLeft: 10, fontSize: 25, color: "white" }}>
                  Users
                </Text>
              </>
            ),
          }}
        />
        <ScrollView className="h-full">
          {users.map((u, index) => {
            if (u.userId !== user.userId) {
              return (
                <View key={index} className="py-3 px-5">
                  <Pressable
                    key={index}
                    onPress={() => selectRoom(u)}
                    className="h-20 items-center rounded-[20px] flex-row px-5 bg-[#76ABAE]"
                  >
                    <View style={{ marginRight: 10 }}>
                      <FontAwesome5
                        name="user-circle"
                        size={24}
                        color="black"
                      />
                    </View>

                    <Text
                      style={{
                        fontSize: 22,
                        color: "black",
                        fontFamily: "Poppins",
                      }}
                    >
                      {u?.userName}
                    </Text>
                  </Pressable>
                </View>
              );
            }
          })}
        </ScrollView>
      </View>
    );
  }
};

export default IndexPage;
