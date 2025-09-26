"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User, Session, AuthError } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "../utils/supabase";
import { useRouter } from "next/navigation";

type SignUpResponse = {
  error: Error | AuthError | null;
  data: { user: User | null; session: Session | null } | null;
};

type SignInResponse = {
  error: Error | AuthError | null;
  data: { session: Session | null; user: User | null };
};

type AuthContextType = {
  user: User | null;
  session: Session | null;
  signUp: (
    email: string,
    password: string,
    userData: UserData
  ) => Promise<SignUpResponse>;
  signIn: (email: string, password: string) => Promise<SignInResponse>;
  signOut: () => Promise<void>;
  loading: boolean;
  completeUserProfile: () => Promise<{ error: Error | null }>;
  handleEmailVerification: (
    code: string
  ) => Promise<{ error: Error | null; user: User | null }>;
  forgotPassword: (email: string) => Promise<{ error: Error | null }>;
  resetPassword: (password: string) => Promise<{ error: Error | null }>;
};

type UserData = {
  firstName: string;
  lastName: string;
  businessName: string;
  businessAddress?: string;
  businessType?: string;
  phone: string;
  role: "retailer" | "distributor";
  storeAddress?: string;
  storeType?: string;
  inventoryNeeds?: string;
  minOrderAmount?: number;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    const getSessionAndUser = async () => {
      console.log("🔍 AuthProvider: Getting initial session and user...");

      // First try to get the existing session
      const {
        data: { session: initialSession },
      } = await supabase.auth.getSession();

      console.log("🔍 AuthProvider: Initial session check:", {
        hasSession: !!initialSession,
        userEmail: initialSession?.user?.email,
      });

      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      setLoading(false);
    };

    getSessionAndUser();

    // Simplified auth state change handler - don't call getUser() to prevent infinite loops
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("🔄 AuthProvider: Auth state change detected:", {
        event: _event,
        hasSession: !!session,
        userEmail: session?.user?.email,
      });

      // Only update state, don't make additional auth calls
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const signUp = async (
    email: string,
    password: string,
    userData: UserData
  ): Promise<SignUpResponse> => {
    console.log("🔐 SIGNUP START - Creating account for:", email);
    setLoading(true);

    // Cache the client instance to ensure we use the same one throughout
    const authClient = supabase;
    console.log(
      "🔶 Using Supabase client instance:",
      authClient ? "Valid" : "Invalid"
    );

    const { data, error } = await authClient.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
        data: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          role: userData.role,
          business_name: userData.businessName,
          business_type: userData.businessType,
          phone: userData.phone,
        },
      },
    });

    console.log(
      "🔶 SignUp response received:",
      data ? "Success" : "Failed",
      error ? `Error: ${error.message}` : "No errors"
    );
    console.log("🔶 User data:", data?.user ? "User created" : "No user");
    console.log(
      "🔶 Session data:",
      data?.session ? "Session created" : "No session"
    );
    console.log(
      "🔗 EMAIL REDIRECT URL USED:",
      `${window.location.origin}/auth/confirm`
    );

    if (error) {
      console.error("❌ SIGNUP ERROR:", error.message);
      setLoading(false);
      return { error, data: null };
    }

    if (!data.user) {
      console.error("❌ SIGNUP ERROR: No user returned from signup");
      setLoading(false);
      return { error: new Error("No user returned from signup"), data: null };
    }

    console.log(
      "✅ Auth signup successful, user created with ID:",
      data.user.id
    );
    console.log("✅ User email:", data.user.email);
    console.log("✅ Session present:", data.session ? "Yes" : "No");
    console.log(
      "📧 Email confirmation required - user will verify email and return to signup page"
    );

    // If we have a session (email confirmation disabled), set it
    if (data.session) {
      console.log("🍪 Setting session with authClient...");
      setSession(data.session);
      setUser(data.session.user);
    }

    console.log(
      "⭐ SIGNUP COMPLETED SUCCESSFULLY - User will verify email and return ⭐"
    );
    setLoading(false);
    return { data, error: null };
  };

  const completeUserProfile = async (): Promise<{ error: Error | null }> => {
    console.log(
      "🔐 COMPLETE PROFILE START - Setting up user profile after email verification"
    );

    const authClient = supabase;
    const {
      data: { user },
    } = await authClient.auth.getUser();

    if (!user) {
      console.error("❌ No authenticated user found");
      return { error: new Error("No authenticated user found") };
    }

    console.log("✅ Authenticated user found:", user.id);
    console.log("📝 User metadata:", user.user_metadata);

    try {
      // Get user data from metadata
      const userData = user.user_metadata;

      // DATABASE OPERATIONS - USE UPSERT TO HANDLE EXISTING RECORDS
      console.log("📝 BEGINNING DATABASE OPERATIONS -----");

      console.log("📝 Upserting user with ID:", user.id);
      // Note: unique_identifier will be automatically generated by database trigger
      const { data: userData1, error: usersError } = await authClient
        .from("users")
        .upsert(
          {
            id: user.id,
            email: user.email!,
            first_name: userData.first_name || "",
            last_name: userData.last_name || "",
            phone: userData.phone || "",
            business_name: userData.business_name || "",
            business_type: userData.business_type || "",
            role: userData.role || "retailer",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            profile_picture_url: "",
          },
          {
            onConflict: "id",
          }
        )
        .select("id, email, unique_identifier");

      if (usersError) {
        console.error("❌ Users upsert error:", usersError.message);
        console.error("❌ Error details:", usersError);
        throw new Error(usersError.message);
      }
      console.log(
        "✅ User record upserted successfully:",
        userData1 ? "Data returned" : "No data returned"
      );
      if (userData1 && userData1[0]) {
        console.log(
          "✅ Generated unique identifier:",
          userData1[0].unique_identifier
        );
      }

      console.log("📝 Handling verification status for user ID:", user.id);

      // Check if verification status record already exists
      const { data: existingVerification, error: checkVerificationError } =
        await authClient
          .from("user_verification_statuses")
          .select("user_id")
          .eq("user_id", user.id)
          .single();

      if (
        checkVerificationError &&
        checkVerificationError.code !== "PGRST116"
      ) {
        // PGRST116 is "not found" error, which is expected for new users
        console.error(
          "❌ Error checking existing verification status:",
          checkVerificationError.message
        );
        throw new Error(checkVerificationError.message);
      }

      if (existingVerification) {
        console.log(
          "✅ Verification status record already exists, skipping insert"
        );
      } else {
        console.log("📝 Inserting new verification status record");
        const { data: verificationData, error: verificationError } =
          await authClient
            .from("user_verification_statuses")
            .insert({
              user_id: user.id,
              status: "pending",
              updated_at: new Date().toISOString(),
            })
            .select();

        if (verificationError) {
          console.error(
            "❌ Verification status insert error:",
            verificationError.message
          );
          console.error("❌ Error details:", verificationError);
          throw new Error(verificationError.message);
        }
        console.log(
          "✅ Verification status inserted successfully:",
          verificationData ? "Data returned" : "No data returned"
        );
      }

      if (userData.role === "retailer") {
        console.log("📝 Handling retailer record for user ID:", user.id);

        // Check if retailer record already exists
        const { data: existingRetailer, error: checkError } = await authClient
          .from("retailers")
          .select("user_id")
          .eq("user_id", user.id)
          .single();

        if (checkError && checkError.code !== "PGRST116") {
          // PGRST116 is "not found" error, which is expected for new users
          console.error(
            "❌ Error checking existing retailer:",
            checkError.message
          );
          throw new Error(checkError.message);
        }

        if (existingRetailer) {
          console.log("✅ Retailer record already exists, skipping insert");
        } else {
          console.log("📝 Inserting new retailer record");
          const { data: retailerData, error: retailerError } = await authClient
            .from("retailers")
            .insert({
              user_id: user.id,
              store_address: "",
              store_type: "",
              inventory_needs: "",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .select();

          if (retailerError) {
            console.error("❌ Retailer insert error:", retailerError.message);
            console.error("❌ Error details:", retailerError);
            throw new Error(retailerError.message);
          }
          console.log(
            "✅ Retailer record inserted successfully:",
            retailerData ? "Data returned" : "No data returned"
          );
        }
      } else if (userData.role === "distributor") {
        console.log("📝 Handling distributor record for user ID:", user.id);

        // Check if distributor record already exists
        const { data: existingDistributor, error: checkError } =
          await authClient
            .from("distributors")
            .select("user_id")
            .eq("user_id", user.id)
            .single();

        if (checkError && checkError.code !== "PGRST116") {
          // PGRST116 is "not found" error, which is expected for new users
          console.error(
            "❌ Error checking existing distributor:",
            checkError.message
          );
          throw new Error(checkError.message);
        }

        if (existingDistributor) {
          console.log("✅ Distributor record already exists, skipping insert");
        } else {
          console.log("📝 Inserting new distributor record");
          const { data: distributorData, error: distributorError } =
            await authClient
              .from("distributors")
              .insert({
                user_id: user.id,
                min_order_amount: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              })
              .select();

          if (distributorError) {
            console.error(
              "❌ Distributor insert error:",
              distributorError.message
            );
            console.error("❌ Error details:", distributorError);
            throw new Error(distributorError.message);
          }
          console.log(
            "✅ Distributor record inserted successfully:",
            distributorData ? "Data returned" : "No data returned"
          );
        }
      }

      console.log("✅ ALL DATABASE OPERATIONS COMPLETED SUCCESSFULLY -----");
      return { error: null };
    } catch (err: unknown) {
      console.error("❌ PROFILE COMPLETION ERROR:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Error completing user profile";
      console.error("❌ Error message:", errorMessage);
      return { error: new Error(errorMessage) };
    }
  };

  const handleEmailVerification = async (
    code: string
  ): Promise<{ error: Error | null; user: User | null }> => {
    console.log(
      "🔐 HANDLE EMAIL VERIFICATION START - Using PKCE code exchange"
    );
    setLoading(true);

    const authClient = supabase;

    try {
      // Exchange the code for a session using PKCE flow
      const { data, error } =
        await authClient.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("❌ Error exchanging code for session:", error.message);
        setLoading(false);
        return { error, user: null };
      }

      if (!data.session || !data.user) {
        console.error("❌ No session or user returned from code exchange");
        setLoading(false);
        return {
          error: new Error("No session created from code exchange"),
          user: null,
        };
      }

      console.log("✅ Code exchanged for session successfully:", data.user.id);

      // Update the auth state
      setSession(data.session);
      setUser(data.user);

      // Wait a moment for state to update
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Verify the session is working by making an authenticated request
      const {
        data: { user: verifiedUser },
        error: verifyError,
      } = await authClient.auth.getUser();

      if (verifyError || !verifiedUser) {
        console.error("❌ Session verification failed:", verifyError?.message);
        setLoading(false);
        return { error: new Error("Session verification failed"), user: null };
      }

      console.log(
        "✅ Email verification completed successfully with PKCE flow"
      );
      setLoading(false);
      return { error: null, user: verifiedUser };
    } catch (err) {
      console.error("❌ Email verification error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Email verification failed";
      setLoading(false);
      return { error: new Error(errorMessage), user: null };
    }
  };

  const signIn = async (
    email: string,
    password: string
  ): Promise<SignInResponse> => {
    console.log("🔐 SIGNIN START - Attempting login for:", email);
    setLoading(true);

    try {
      const authClient = supabase;

      // Attempt to sign in
      const { data, error } = await authClient.auth.signInWithPassword({
        email,
        password,
      });

      console.log(
        "🔶 SignIn response received:",
        data ? "Success" : "Failed",
        error ? `Error: ${error.message}` : "No errors"
      );

      if (error) {
        console.error("❌ SIGNIN ERROR:", error.message);
        setLoading(false);
        return { error, data: { session: null, user: null } };
      }

      if (!data.session || !data.user) {
        console.error("❌ SIGNIN ERROR: No session or user returned");
        setLoading(false);
        return {
          error: new Error("No session or user returned from signin"),
          data: { session: null, user: null },
        };
      }

      console.log("✅ Authentication successful for user:", data.user.id);
      console.log("✅ User email:", data.user.email);
      console.log("✅ Session established:", !!data.session);

      // Set the session and user
      setSession(data.session);
      setUser(data.user);

      // Check if user record exists in our custom users table
      if (data?.session?.user) {
        console.log(
          "🔍 Checking user profile existence and onboarding status..."
        );

        try {
          const { data: userData, error: userError } = await authClient
            .from("users")
            .select("onboarding_completed, role")
            .eq("id", data.session.user.id)
            .maybeSingle(); // Use maybeSingle instead of single to handle 0 rows gracefully

          if (userError) {
            console.error("❌ Error checking user profile:", userError.message);
            // Database error - redirect to complete profile to be safe
            console.log(
              "⚠️ Database error checking profile, redirecting to complete profile"
            );
            setLoading(false);
            router.push("/signup/complete-profile");
            return { data, error: null };
          }

          if (!userData) {
            // User doesn't exist in our custom users table - create them first
            console.log(
              "⚠️ User profile not found in database, redirecting to complete profile to create it"
            );
            setLoading(false);
            router.push("/signup/complete-profile");
            return { data, error: null };
          }

          if (!userData.onboarding_completed) {
            console.log(
              "⚠️ Onboarding not completed, redirecting to complete profile"
            );
            setLoading(false);
            router.push("/signup/complete-profile");
            return { data, error: null };
          }

          console.log(
            "✅ User profile exists and onboarding completed, proceeding to dashboard"
          );
        } catch (onboardingError) {
          console.error("❌ Error during user profile check:", onboardingError);
          // On error, redirect to complete profile to be safe
          setLoading(false);
          router.push("/signup/complete-profile");
          return { data, error: null };
        }
      }

      console.log("⭐ SIGNIN COMPLETED SUCCESSFULLY ⭐");
      setLoading(false);
      return { data, error: null };
    } catch (err) {
      console.error("❌ Unexpected signin error:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during signin";
      setLoading(false);
      return {
        error: new Error(errorMessage),
        data: { session: null, user: null },
      };
    }
  };

  const signOut = async () => {
    console.log("🚪 SIGNOUT - Logging out user");
    // Cache the client instance to ensure we use the same one throughout
    const authClient = supabase;

    await authClient.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const forgotPassword = async (
    email: string
  ): Promise<{ error: Error | null }> => {
    console.log("🔐 FORGOT PASSWORD START - Sending reset email to:", email);
    setLoading(true);

    try {
      const authClient = supabase;
      const { error } = await authClient.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error("❌ FORGOT PASSWORD ERROR:", error.message);
        setLoading(false);
        return { error };
      }

      console.log("✅ Password reset email sent successfully");
      setLoading(false);
      return { error: null };
    } catch (err) {
      console.error("❌ Unexpected error during forgot password:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to send reset email";
      setLoading(false);
      return { error: new Error(errorMessage) };
    }
  };

  const resetPassword = async (
    password: string
  ): Promise<{ error: Error | null }> => {
    console.log("🔐 AUTH PROVIDER - RESET PASSWORD START");
    console.log("🔍 Password length:", password.length);
    setLoading(true);

    try {
      const authClient = supabase;
      console.log("🔧 Using Supabase client for password update");

      // Check current session before attempting update
      const {
        data: { session },
        error: sessionError,
      } = await authClient.auth.getSession();
      console.log("🔍 Current session check:", {
        hasSession: !!session,
        userId: session?.user?.id,
        sessionError: sessionError?.message,
      });

      if (!session) {
        console.error("❌ No active session found for password reset");
        setLoading(false);
        return {
          error: new Error(
            "No active session. Please use a fresh password reset link."
          ),
        };
      }

      console.log(
        "✅ Active session found, proceeding with password update..."
      );

      const { error } = await authClient.auth.updateUser({
        password: password,
      });

      if (error) {
        console.error("❌ RESET PASSWORD ERROR from Supabase:", {
          message: error.message,
          status: error.status,
          details: error,
        });
        setLoading(false);
        return { error };
      }

      console.log("✅ Password reset successfully in Supabase");

      // Verify the update by getting the user again
      const {
        data: { user },
        error: userError,
      } = await authClient.auth.getUser();
      console.log("🔍 Post-update user check:", {
        hasUser: !!user,
        userId: user?.id,
        userError: userError?.message,
      });

      setLoading(false);
      return { error: null };
    } catch (err) {
      console.error(
        "❌ Unexpected error during password reset in auth provider:",
        {
          error: err,
          message: err instanceof Error ? err.message : "Unknown error",
          stack: err instanceof Error ? err.stack : undefined,
        }
      );
      const errorMessage =
        err instanceof Error ? err.message : "Failed to reset password";
      setLoading(false);
      return { error: new Error(errorMessage) };
    }
  };

  const value = {
    user,
    session,
    signUp,
    signIn,
    signOut,
    loading,
    completeUserProfile,
    handleEmailVerification,
    forgotPassword,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
