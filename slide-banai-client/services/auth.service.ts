import { apiRequest } from "@/lib/queryClient";
import { User } from "@shared/schema";


// Sign in with Google popup
export async function signInWithGoogle(): Promise<User> {
  try {
    const mockGoogleUser = {
      email: "test.user@example.com",
      name: "Test User",
      photoURL: "https://ui-avatars.com/api/?name=Test+User&background=random"
    };
    
    const response = await apiRequest("POST", "/api/auth/google", {
      email: mockGoogleUser.email,
      name: mockGoogleUser.name,
      photoURL: mockGoogleUser.photoURL,
      idToken: "mock-development-token-for-testing"
    });
    
    return await response.json();
  } catch (error) {
    console.error("Error during Google sign in:", error);
    throw new Error("Google sign in failed. Please try again.");
  }
}

// Sign out
export async function signOutUser(): Promise<void> {
  try {
    await apiRequest("POST", "/api/logout");
  } catch (error) {
    console.error("Error signing out:", error);
    throw new Error("Failed to sign out. Please try again.");
  }
}

// Handle redirect result
export async function handleRedirectResult(): Promise<User | null> {
  try {
    return null;
  } catch (error) {
    console.error("Error handling redirect:", error);
    return null;
  }
}