import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const HomePage = () => {
  return (
    <div className="flex flex-col bg-neutral-dark scrollbar-thumb-gray-500 h-screen font-poppins text-neutral-light scrollbar-thin scrollbar-track-gray-800">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default HomePage;
