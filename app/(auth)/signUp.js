import {
  View,
  Text,
  TextInput,
  Button,
  Pressable,
  Alert,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { Stack } from "expo-router";
import { supabase } from "../lib/supabase-client";
import {
  useFonts,
  Poppins_600SemiBold,
  Poppins_500Medium,
} from "@expo-google-fonts/poppins";

const SignUp = () => {
  const [userInput, setUserInput] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassWord, setShowPassWord] = useState(true);

  let [fontsLoaded] = useFonts({
    Poppins: Poppins_600SemiBold,
    Poppins_md: Poppins_500Medium,
  });

  const handleShowPassWord = () => {
    setShowPassWord((prev) => !prev);
  };

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          name: userInput,
        },
      },
    });

    if (error) Alert.alert(error.message);
    if (!session)
      Alert.alert("Please check your inbox for email verification!");
    setLoading(false);
  }

  return (
    <View className="w-full h-full bg-[#EEEEEE]">
      <StatusBar />
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Back to login",
          headerStyle: { backgroundColor: "#EEEEEE" },
          headerShadowVisible: false,
          headerTitleStyle: { color: "black" },
        }}
      />
      <View className="w-full items-center justify-center h-full ">
        <View className="w-[300px] bg-[#31363F] rounded-xl px-6 py-10">
          <View>
            <Text
              className="text-center pb-5 text-2xl font-bold text-white"
              style={{ fontFamily: "Poppins" }}
            >
              Register
            </Text>
            <View>
              <Text
                className="text-xl pb-1 text-white"
                style={{ fontFamily: "Poppins" }}
              >
                Username
              </Text>
              <TextInput
                label="Username"
                onChangeText={(text) => setUserInput(text)}
                value={userInput}
                placeholder="Username"
                autoCapitalize={"none"}
                className="py-2 border-2 border-black rounded-lg bg-white px-3 mb-4"
              />
            </View>
            <Text
              className="text-xl pb-1 text-white"
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
              className="text-xl pb-1 text-white"
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
            <ActivityIndicator color="black" className="pt-10" size={25} />
          ) : (
            <View>
              <View>
                <Pressable
                  disabled={loading}
                  onPress={() => signUpWithEmail()}
                  className="bg-green-600 items-center p-2 rounded-lg mt-5 "
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
        </View>
      </View>
    </View>
  );
};

export default SignUp;
