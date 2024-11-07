import Carousel from "@/components/carousel/carousel";
import LoginForm from "@/components/login/login-form";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-900 to gray-800 text-white">
      <Carousel />
      <LoginForm />
    </div>
  );
}
