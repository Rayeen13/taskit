import { AuthProvider, useAuth } from "@/services/authContext";
import { NotesProvider } from "@/services/notesContext";
import { ThemeProvider } from "@/services/themeContext";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { DrawerActions } from "@react-navigation/native";
import { usePathname, useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useEffect, useRef } from "react";
import "react-native-get-random-values";

import {
  BackHandler,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppColors } from "./hooks/useAppColors";

function CustomDrawerContent(props: any) {
  const router = useRouter();
  const { isLoggedIn, logout } = useAuth();
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  const colors = useAppColors();

  const go = (path: string) => {
    props.navigation.dispatch(DrawerActions.closeDrawer()); // 🔥 close first
    router.push(path as any); // then navigate
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={[
        styles.drawer,
        {
          backgroundColor: colors.background,
        },
      ]}
      scrollEnabled={false}
    >
      {/* 🔥 HEADER */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.appName, { color: colors.text }]}>Taskit</Text>
        <Text style={[styles.subtitle, { color: colors.subText }]}>
          Your Notes, Your Way
        </Text>
      </View>
      <DrawerItem
        label="Home"
        onPress={() => go("/")}
        labelStyle={[
          styles.label,
          { color: isActive("/") ? "#fff" : colors.text },
        ]}
        icon={({ size }) => (
          <MaterialIcons
            name="home"
            size={size}
            color={isActive("/") ? "#fff" : colors.text}
          />
        )}
        style={[
          styles.item,
          {
            backgroundColor: isActive("/") ? "#1da1f2" : colors.card,
          },
        ]}
      />
      {/* 🔥 NEW: Islamic Home */}
      <DrawerItem
        label="Islamic Home"
        onPress={() => go("/islamicishtehar/home")}
        labelStyle={[
          styles.label,
          { color: isActive("/islamicishtehar/home") ? "#fff" : colors.text },
        ]}
        icon={({ size }) => (
          <FontAwesome
            name="home"
            size={size}
            color={isActive("/islamicishtehar/home") ? "#fff" : colors.text}
          />
        )}
        style={[
          styles.item,
          {
            backgroundColor: isActive("/islamicishtehar/home")
              ? "#1da1f2"
              : colors.card,
          },
        ]}
      />
      {!isLoggedIn && (
        <DrawerItem
          label="Login / Register"
          onPress={() => router.push("/auth")}
          labelStyle={[
            styles.label,
            { color: isActive("/auth") ? "#fff" : colors.text },
          ]}
          icon={({ size }) => (
            <MaterialIcons
              name="login"
              size={size}
              color={isActive("/auth") ? "#fff" : colors.text}
            />
          )}
          style={[
            styles.item,
            {
              backgroundColor: isActive("/auth") ? "#1da1f2" : colors.card,
            },
          ]}
        />
      )}
      <DrawerItem
        label="Settings"
        onPress={() => go("/settings")}
        labelStyle={[
          styles.label,
          { color: isActive("/settings") ? "#fff" : colors.text },
        ]}
        icon={({ size }) => (
          <MaterialIcons
            name="settings"
            size={size}
            color={isActive("/settings") ? "#fff" : colors.text}
          />
        )}
        style={[
          styles.item,
          {
            backgroundColor: isActive("/settings") ? "#1da1f2" : colors.card,
          },
        ]}
      />

      <DrawerItem
        label="About"
        onPress={() => go("/about")}
        labelStyle={[
          styles.label,
          { color: isActive("/about") ? "#fff" : colors.text },
        ]}
        icon={({ size }) => (
          <MaterialIcons
            name="info"
            size={size}
            color={isActive("/about") ? "#fff" : colors.text}
          />
        )}
        style={[
          styles.item,
          {
            backgroundColor: isActive("/about") ? "#1da1f2" : colors.card,
          },
        ]}
      />
      {isLoggedIn && (
        <DrawerItem
          label="Logout"
          onPress={() => logout()}
          labelStyle={[styles.label, { color: "#ff4d4f" }]}
          icon={({ size }) => (
            <MaterialIcons name="logout" size={size} color="#ff4d4f" />
          )}
          style={[styles.item, { backgroundColor: colors.card }]}
        />
      )}
    </DrawerContentScrollView>
  );
}

function AppDrawer() {
  const insets = useSafeAreaInsets();
  const colors = useAppColors();

  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerPosition: "left",
        sceneStyle: {
          backgroundColor: colors.background,
        },
        drawerStyle: {
          backgroundColor: colors.background,
          borderTopRightRadius: 20,
          borderBottomRightRadius: 20,
          overflow: "hidden",
          marginTop: insets.top,
          height: "100%",
        },
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="(stack)" />
      <Drawer.Screen name="auth" />
    </Drawer>
  );
}

function NavigationHandler({ children }: any) {
  const pathname = usePathname();
  const router = useRouter();
  const lastBackPress = useRef(0);

  useEffect(() => {
    const onBackPress = () => {
      // 🔥 HOME SCREEN
      if (pathname === "/") {
        const now = Date.now();

        if (now - lastBackPress.current < 2000) {
          BackHandler.exitApp();
          return true;
        }

        lastBackPress.current = now;
        ToastAndroid.show("Press back again to exit", ToastAndroid.SHORT);
        return true;
      }

      // 🔥 NOT HOME → go back in stack
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/");
      }

      return true;
    };

    const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);

    return () => sub.remove();
  }, [pathname]);

  return children;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AuthProvider>
          <NotesProvider>
            <NavigationHandler>
              <AppDrawer />
            </NavigationHandler>
          </NotesProvider>
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  drawer: {
    paddingBottom: 20,
    paddingHorizontal: 0,
    flexGrow: 1,
  },

  header: {
    paddingHorizontal: 16,
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },

  appName: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 12,
  },
  item: {
    marginHorizontal: 10,
    borderRadius: 12,
    marginBottom: 6,
  },

  label: {
    fontSize: 14,
    fontWeight: "500",
  },
});
