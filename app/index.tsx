import { Redirect } from "expo-router";

export default function Index() {
    // This automatically redirects the app to your splash screen when it loads
    return <Redirect href="/onboarding" />;
}


