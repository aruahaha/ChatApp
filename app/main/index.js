import { useContext, useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  TextInput,
  Pressable,
  ScrollView,
  Image,
  ImageBackground,
  ActivityIndicator,
  Button,
  Alert,
  StatusBar,
} from "react-native";
import { io } from "socket.io-client";
import { Link, Stack, router } from "expo-router";
import { Feather } from "@expo/vector-icons";

import { AntDesign } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import {
  useFonts,
  Poppins_600SemiBold,
  Poppins_500Medium,
} from "@expo-google-fonts/poppins";
import { supabase } from "../lib/supabase-client";
import Login from "../(auth)/login";
import GlobalState, { GlobalContext } from "../context/globalContext";

const IndexPage = () => {
  const ENDPOINT = "http://192.168.29.86:3000";
  let socket;
  const [chatInput, setChatInput] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [users, setUsers] = useState([]);
  const [chat, setChat] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionUser, setSessionUser] = useState(false);
  const { user, setUser, room, setRoom, showPassWord, setShowPassWord } =
    useContext(GlobalContext);

  const handleShowPassWord = () => {
    setShowPassWord((prev) => !prev);
  };

  const scrollViewRef = useRef();

  let [fontsLoaded] = useFonts({
    Poppins: Poppins_600SemiBold,
    Poppins_md: Poppins_500Medium,
  });

  const joinRoom = () => {
    setUser({
      ...user,
      userName: sessionUser?.user_metadata?.name,
      userId: generateUUID(),
    });
  };

  const generateUUID = () => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36);
    return timestamp + "-" + randomStr;
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

      setChatInput("");
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) {
      Alert.alert(error.message);
      setLoading(false);
    } else {
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          setSessionUser(user);
        } else {
          Alert.alert("Error Accessing User");
        }
      });
      joinRoom();
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user.userName) {
      const socket = io(ENDPOINT, { query: { ...user } });

      socket.on("first-message", (data) => {
        console.log(data);
      });

      socket.on("users_connected", (data) => {
        setUsers(data);
      });
      socket.on("users_disconnected", (data) => {
        setUsers(data);
      });
      socket.on("chat-message", (data) => {
        setMessageList((list) => [...list, data]);
        scrollViewRef.current.scrollToEnd({ animated: true });
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [user]);

  if (!fontsLoaded) {
    return <ActivityIndicator />;
  } else {
    if (!user.userName) {
      return (
        <GlobalState>
          <View className="w-full h-full">
            <StatusBar />
            <Stack.Screen options={{ headerShown: false }} />
            <View className="w-full items-center justify-center h-full ">
              <View className="w-[300px] bg-[#31363F] rounded-xl px-6 py-10">
                <View>
                  <Text
                    className="text-center pb-5 text-2xl text-white"
                    style={{ fontFamily: "Poppins" }}
                  >
                    Login
                  </Text>
                  <Text
                    className="text-2xl pb-1 text-white"
                    style={{ fontFamily: "Poppins" }}
                  >
                    Email
                  </Text>
                  <TextInput
                    label="Email"
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    placeholder="email@address.com"
                    autoCapitalize={"none"}
                    className="py-2 border-2 border-black rounded-lg bg-white px-3 mb-4"
                  />
                </View>
                <View>
                  <Text
                    className="text-2xl pb-1 text-white"
                    style={{ fontFamily: "Poppins" }}
                  >
                    Password
                  </Text>
                  <View>
                    <View>
                      <TextInput
                        label="Password"
                        onChangeText={(text) => setPassword(text)}
                        value={password}
                        secureTextEntry={showPassWord}
                        placeholder="Password"
                        autoCapitalize={"none"}
                        className="py-2 border-2 border-black rounded-lg bg-white px-3 "
                      />
                    </View>
                    <View className="absolute w-full h-full items-end">
                      <Pressable
                        onPress={() => handleShowPassWord()}
                        className="bg-black px-5 rounded-r-lg  h-full justify-center"
                      >
                        {showPassWord ? (
                          <Text
                            className="text-white"
                            style={{ fontFamily: "Poppins" }}
                          >
                            Show
                          </Text>
                        ) : (
                          <Text
                            className="text-white"
                            style={{ fontFamily: "Poppins" }}
                          >
                            Hide
                          </Text>
                        )}
                      </Pressable>
                    </View>
                  </View>
                </View>
                {loading ? (
                  <ActivityIndicator
                    color="black"
                    className="pt-10"
                    size={25}
                  />
                ) : (
                  <View>
                    <View>
                      <Pressable
                        disabled={loading}
                        onPress={() => signInWithEmail()}
                        className="bg-[#76ABAE] items-center p-2 rounded-lg mt-5 mb-5"
                      >
                        <Text
                          className="text-white text-[15px]"
                          style={{ fontFamily: "Poppins" }}
                        >
                          Sign In
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                )}
                <View>
                  <Text
                    className="text-[15px] text-white"
                    style={{ fontFamily: "Poppins" }}
                  >
                    Create an account{" "}
                    <Link href="/signUp" className="text-blue-400">
                      Register
                    </Link>
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </GlobalState>
      );
    }
    if (chat && room) {
      return (
        <View className="h-full w-full justify-between bg-[#222831]">
          <Stack.Screen
            options={{
              headerTitle: room.userName,
              headerTitleAlign: "left",
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
            headerTitleAlign: "left",
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
                  onPress={() => {
                    router.push("/settings");
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
