import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";

function UserMenu({mobileMenuOpen, setMobileMenuOpen, handleNavItemClick, isLoggedIn, setIsLoggedIn, navItems, error}) {
    const pathname = usePathname();
    return ( 
       <div
        className={`fixed inset-0 z-[100] flex transition-opacity duration-300 ${
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
            <div
            className={`w-[70%] bg-black/20 backdrop-blur transition-opacity duration-300`}
            onClick={() => setMobileMenuOpen(false)}
            ></div>

            <div
            className={`w-[30%] bg-gray-900 text-white h-full shadow-2xl transform transition-transform duration-300 ease-in-out relative ${
                mobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
            >
            {error && <h4 className="absolute top-[155px] text-red-500 font-medium left-5 text-lg">Please complete primary certification first.</h4>}
            <div className="flex items-center justify-end px-6 py-6 border-b border-gray-800">
                <button
                className="text-white text-2xl ml-2 cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                >
                <X />
                </button>
            </div>
            <div className="px-6 mb-3">
                <h4 className="text-xl font-medium">Email: user@email.com</h4>
                <h4 className="text-xl font-medium">UID: 5295</h4>
                <p className="text-gray-500">Credit Score: 100</p>
            </div>

            {/* Mobile Menu Items */}
            <ul className="flex flex-col px-6 pt-6 space-y-4">
                {navItems.map((item) => {
                const Icon = item.icon;
                return (
                    <li key={item.label}>
                    <button
                        onClick={() => handleNavItemClick(item)}
                        className={twMerge(
                        "text-lg font-semibold flex gap-x-3 items-center w-full text-left",
                        pathname === item.href
                            ? "text-yellow-400"
                            : "hover:text-yellow-300"
                        )}
                    >
                        {Icon && <Icon />}
                        {item.label}
                    </button>
                    </li>
                );
                })}
                {/* Conditional Logout button based on isLoggedIn */}
                {isLoggedIn && (
                <li>
                    <button
                    onClick={() => {
                        setIsLoggedIn(false);
                        setMobileMenuOpen(false);
                        router.push('/en/login');
                        toast.info("You have been logged out."); // Logout toast
                    }}
                    className="text-lg font-semibold flex gap-x-3 items-center w-full text-left text-red-500 hover:text-red-600 transition-colors"
                    >
                    <Lock />
                    Logout
                    </button>
                </li>
                )}
            </ul>
            </div>
        </div>
     );
}

export default UserMenu;