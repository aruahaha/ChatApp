import { View, Text, Alert, Button, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";

import { Stack } from "expo-router";
import { supabase } from "../lib/supabase-client";

const SettingsPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
        setLoading(false);
      } else {
        Alert.alert("Error Accessing User");
        setLoading(false);
      }
    });
  }, []);

  const logOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Error Signing Out", error.message);
    }
  };

  return (
    <View className="items-center ">
      <Stack.Screen options={{ headerShown: true, headerTitle: "Settings" }} />
      {loading ? (
        <ActivityIndicator size="large" color="black" />
      ) : (
        <>
          <Text className="py-5">{JSON.stringify(user)}</Text>
          <Button title="Logout" onPress={logOut} />
        </>
      )}
    </View>
  );
};

export default SettingsPage;
