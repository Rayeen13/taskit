import { useAppColors } from "@/app/hooks/useAppColors";
import { useAuth } from "@/services/authContext";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AuthScreen() {
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const { login, register } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const colors = useAppColors();

  const [isRegister, setIsRegister] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    const newErrors: typeof errors = {};

    if (isRegister && !name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!emailRegex.test(email.trim().toLowerCase())) {
      newErrors.email = "Enter a valid email";
    }

    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (isRegister && password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      if (isRegister) {
        await register(name, email, password);
        clearForm();
        router.replace("/profile?firstTime=true");
      } else {
        await login(email, password);
        clearForm();
        router.replace("/");
      }
    } catch (err: any) {
      setErrors({
        email: err.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.background }]}
      edges={["top", "left", "right", "bottom"]}
    >
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Login / Register",

          headerStyle: {
            backgroundColor: colors.background,
          },

          headerTitleStyle: {
            color: colors.text,
          },

          headerTintColor: colors.text, // 🔥 back button color
        }}
      />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              backgroundColor: colors.background,
            }}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={[styles.title, { color: colors.text }]}>Taskit</Text>

            <Text style={[styles.subtitle, { color: colors.subText }]}>
              {isRegister ? "Create your account" : "Welcome back"}
            </Text>

            {isRegister && (
              <>
                <TextInput
                  placeholder="Name"
                  value={name}
                  onChangeText={(text) => {
                    setName(text);

                    if (!text.trim()) {
                      setErrors((prev) => ({
                        ...prev,
                        name: "Name is required",
                      }));
                    } else {
                      setErrors((prev) => ({ ...prev, name: undefined }));
                    }
                  }}
                  placeholderTextColor={colors.subText}
                  style={[
                    styles.input,
                    { color: colors.text, borderColor: colors.border },
                  ]}
                />
                {errors.name && (
                  <Text style={styles.errorText}>{errors.name}</Text>
                )}
              </>
            )}

            <>
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);

                  const isValid = emailRegex.test(text.trim().toLowerCase());

                  setErrors((prev) => ({
                    ...prev,
                    email: isValid ? undefined : "Enter a valid email",
                  }));
                }}
                placeholderTextColor={colors.subText}
                style={[
                  styles.input,
                  { color: colors.text, borderColor: colors.border },
                ]}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </>

            <>
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);

                  setErrors((prev) => ({
                    ...prev,
                    password:
                      text.length >= 6
                        ? undefined
                        : "Password must be at least 6 characters",
                    confirmPassword:
                      confirmPassword && text !== confirmPassword
                        ? "Passwords do not match"
                        : undefined,
                  }));
                }}
                secureTextEntry
                placeholderTextColor={colors.subText}
                style={[
                  styles.input,
                  { color: colors.text, borderColor: colors.border },
                ]}
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </>

            {isRegister && (
              <>
                <TextInput
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);

                    setErrors((prev) => ({
                      ...prev,
                      confirmPassword:
                        text === password
                          ? undefined
                          : "Passwords do not match",
                    }));
                  }}
                  secureTextEntry
                  placeholderTextColor={colors.subText}
                  style={[
                    styles.input,
                    { color: colors.text, borderColor: colors.border },
                  ]}
                />
                {errors.confirmPassword && (
                  <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                )}
              </>
            )}

            <Pressable
              style={[styles.button, loading && { opacity: 0.6 }]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading
                  ? isRegister
                    ? "Creating account..."
                    : "Logging in..."
                  : isRegister
                    ? "Register"
                    : "Login"}
              </Text>
            </Pressable>

            <Text style={[styles.footer, { color: colors.text }]}>
              {isRegister
                ? "Already have an account? "
                : "Don't have an account? "}
              <Text
                style={styles.link}
                onPress={() => {
                  clearForm();
                  setIsRegister((p) => !p);
                }}
              >
                {isRegister ? "Login" : "Register"}
              </Text>
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: 24,
    // paddingTop: 40,
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },

  input: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
  },

  button: {
    backgroundColor: "#1da1f2",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },

  footer: {
    marginTop: 20,
    textAlign: "center",
  },

  link: {
    fontWeight: "600",
  },
  errorText: {
    color: "#ff4d4f",
    fontSize: 12,
    marginBottom: 8,
    marginTop: -6,
  },
});
