import Footer from "./footer";
import NavBar from "./navBar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col overflow-h-hidden">
            <NavBar/>
            {children}
            <Footer/>
        </div>
    );
  }