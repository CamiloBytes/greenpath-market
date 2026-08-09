import { FaEnvelope, FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa6";

export const FooterSection = () => {
  return (
    <footer className="w-full bg-[#07110C] text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          <div className="flex flex-col items-start">
            <h3 className="mb-3 text-lg font-semibold">About Us</h3>
            <p className="text-sm leading-relaxed text-gray-400">
              GreenPath Market is committed to providing fresh, local products
              directly from rural farmers to your table.
            </p>
          </div>

          <div className="flex flex-col items-start">
            <h3 className="mb-3 text-lg font-semibold">Information</h3>
            <p className="text-sm text-gray-400">Email: info@greenpath.com</p>
            <p className="text-sm text-gray-400">Phone: +57 3122900111</p>
            <p className="text-sm text-gray-400">
              Address: Calle 118 # 40 -59 GreenPath St, Countryside
            </p>
          </div>

          <div className="flex flex-col items-start">
            <h3 className="mb-3 text-lg font-semibold">Follow Us</h3>
            <div className="flex gap-5">
              <a
                href="mailto:info@greenpathmarket.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Email"
                className="text-xl text-gray-400 transition-colors duration-300 hover:text-[#1DD317]"
              >
                <FaEnvelope />
              </a>
              <a
                href="https://www.facebook.com/greenpathmarket"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-xl text-gray-400 transition-colors duration-300 hover:text-[#1DD317]"
              >
                <FaFacebook />
              </a>
              <a
                href="https://www.instagram.com/greenpathmarket"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-xl text-gray-400 transition-colors duration-300 hover:text-[#1DD317]"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.youtube.com/greenpathmarket"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="text-xl text-gray-400 transition-colors duration-300 hover:text-[#1DD317]"
              >
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center">
          <p className="text-sm text-gray-400">
            © 2024 GreenPath Market. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
