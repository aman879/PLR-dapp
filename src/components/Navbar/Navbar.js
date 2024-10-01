import React from "react";



const Navbar = ({ onRouteChange, connect, address, connected, wallet }) => {
  
  const handleRedirect = () => {
    window.open('https://petra.app/', '_blank');
  };

  return (
    <div className="fixed z-10 backdrop-blur-sm mt-5">
      <section className="relative mx-auto">
        <nav className="flex justify-between items-center text-white w-screen px-24">
          <div className="flex items-center">
            <a className="text-3xl font-bold font-heading" onClick={() => onRouteChange("home")}>
              Ignitus Network
            </a>
          </div>

          <ul className="flex space-x-12 font-semibold font-heading">
            <li>
              <a className='no-underline text-gray-200 ' onClick={() => onRouteChange("book")}>
                Book a slot
              </a>
            </li>
            <li>
              <a className='no-underline text-gray-200' onClick={() => onRouteChange("inquiry")}>
                Inquiry
              </a>
            </li>
          </ul>

          <div className="flex items-center">
          {wallet ? (
              <button
              type="button"
              className="inline-flex items-center justify-center border-[0.5px] p-2 w-28 h-9 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              onClick={connect}
              disabled={connected}
            >
              {connected
                ? address 
                  ? `${address.slice(0, 5)}...${address.slice(-4)}`
                  : "Connecting"
                : "Connect"}
            </button>            
            ) : (
              <button
                type="button"
                className="inline-flex items-center justify-center border-[0.5px] p-2 w-22 h-9 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                onClick={handleRedirect}
              >
                Install Metamask Wallet
              </button>
            )}
          </div>
        </nav>
      </section>
    </div>
  );
};

export default Navbar;