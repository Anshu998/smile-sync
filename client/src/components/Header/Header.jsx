import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { NavLink, Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import React from "react";
import { useSelector } from "react-redux";
import { LogoutButton } from "../index";
export default function Component() {
  const authStatus = useSelector(state => state.auth.isAuthenticated)
  // console.log(authStatus)
  const [headerBg, setHeaderBg] = React.useState("bg-transparent");

  // Scroll event to change header background
  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setHeaderBg("bg-white"); // Solid background after scroll
      } else {
        setHeaderBg("bg-transparent"); // Transparent background while in hero section
      }
    };

    // To set the b
    // handleScroll()
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const navItems = [
    {
      name: "Home",
      slug: "/",
      active: true,
    },
    {
      name: "About",
      slug: "/about",
      active: true,
    },
    {
      name: "Services",
      slug: "/Services",
      active: true,
    },
    {
      name: "Find Doctors",
      slug: "/all-doctors",
      active: !authStatus,
    },
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
    },
    {
      name: "My appointments",
      slug: "/all-posts",
      active: authStatus,
    },
    {
      name: "History",
      slug: "/add-post",
      active: authStatus,
    },
  ];

  return (
    <header
      className={`flex top-0 z-20 left-0 h-20 w-full shrink-0 items-center px-4  md:px-6   ${
        headerBg === "bg-transparent"
          ? "absolute bg-transparent"
          : "sticky bg-white shadow-md"
      }`}
    >
      <NavLink to="/" className="mr-6 lg:flex">
        <MountainIcon className="lg:h-24 lg:w-24 h-14 w-14" />
        <span className="sr-only">Smile Sync</span>
      </NavLink>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden ml-auto">
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <NavLink to="/" className="flex justify-center">
            <MountainIcon className="h-32 w-32" />
            <span className="sr-only">Smile Sync</span>
          </NavLink>
          <div className="grid gap-2 py-6">
            {navItems.map((item) =>
              item.active ? (
                <NavLink
                  key={item.name}
                  to={item.slug}
                  className="flex w-full hover:text-teal-700 justify-center py-2 text-lg font-semibold"
                >
                  {item.name}
                </NavLink>
              ) : null
            )}

            <Link to={'/register'}>
            <Button className="bg-mainCustomColor hover:bg-teal-700">

              Book Appointment
            </Button>
            </Link>
          </div>
        </SheetContent>
      </Sheet>

      <nav className="ml-auto hidden lg:flex gap-6">
        {navItems.map((item) =>
          item.active ? (
            <NavLink
              key={item.name}
              to={item.slug}
              className={`group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-base font-medium transition-colors hover:text-teal-700 focus:bg-gray-50 focus:text-teal-500 focus:outline-none disabled:pointer-events-none disabled:opacity-50 ${
                headerBg === "bg-transparent"
                  ? "text-white"
                  : "sticky bg-white hover:bg-gray-50"
              }`}
            >
              {item.name}
            </NavLink>
          ) : null
        )}
        {
          authStatus && (
        <div className="ml-10">
          <LogoutButton/>
        </div>
          )
        }
        <div className="ml-10">
        <Link to={'/register'}>
            <Button className="bg-mainCustomColor hover:bg-teal-700">

              Book Appointment
            </Button>
            </Link>
        </div>
      </nav>
    </header>
  );
}

function MenuIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function MountainIcon(props) {
  return <img src={logo} alt="Logo" {...props} />;
}
