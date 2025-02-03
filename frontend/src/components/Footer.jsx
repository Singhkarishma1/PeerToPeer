import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 py-8 text-gray-300">
      <div className="container px-6 mx-auto">
        <div className="flex flex-wrap justify-between">
          {/* Logo and Description */}
          <div className="w-full xl:w-1/4 mb-6">
            <a href="/" className="block mb-4">
              {/* You can replace this with your app's logo */}
              <svg className="w-24 h-24 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M..."></path>
              </svg>
            </a>
            <p className="text-lg">
              A platform that connects learners, mentors, and peers to exchange knowledge and enhance learning experiences.
            </p>
          </div>

          {/* Company Links */}
          <div className="w-full sm:w-1/4 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Company</h2>
            <ul>
              <li><a href="/about" className="block hover:text-blue-400">About Us</a></li>
              <li><a href="/contact" className="block hover:text-blue-400">Contact</a></li>
              <li><a href="/careers" className="block hover:text-blue-400">Careers</a></li>
            </ul>
          </div>

          {/* Useful Links */}
          <div className="w-full sm:w-1/4 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Useful Links</h2>
            <ul>
              <li><a href="/faq" className="block hover:text-blue-400">FAQ</a></li>
              <li><a href="/terms" className="block hover:text-blue-400">Terms & Conditions</a></li>
              <li><a href="/privacy" className="block hover:text-blue-400">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div className="w-full sm:w-1/4 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Follow Us</h2>
            <div className="flex space-x-4">
              <a href="https://twitter.com" className="text-blue-400 hover:text-blue-500">
                <svg className="w-6 h-6" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M23.643 4.937c-.88.392-1.833.656-2.825.774a4.93 4.93 0 002.164-2.728 9.9 9.9 0 01-3.127 1.182c-1.92-2.043-5.445-1.616-7.071.803-1.256 1.885-1.022 4.43.673 6.218a5.073 5.073 0 01-2.243-.617v.062c-.016 2.123 1.56 3.927 3.758 4.344a4.904 4.904 0 01-2.217-.612 4.99 4.99 0 004.71 3.517c-2.87 2.278-6.47 2.876-9.818 1.267a9.9 9.9 0 0011.633-9.103c-.004-.234-.02-.468-.05-.7.749-.539 1.473-.991 2.173-1.606-.358-.319-.7-.633-1.07-.946z"></path>
                </svg>
              </a>
              <a href="https://linkedin.com" className="text-blue-400 hover:text-blue-500">
                <svg className="w-6 h-6" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M0 1.146c0-.639.51-1.146 1.146-1.146h21.708c.638 0 1.146.51 1.146 1.146v21.708c0 .638-.51 1.146-1.146 1.146H1.146C.51 22.854 0 22.344 0 21.708V1.146zM10.402 19.898H7.758v-9.226h2.644v9.226zm-1.322-10.603c-.859 0-1.556-.701-1.556-1.556s.697-1.556 1.556-1.556c.858 0 1.557.701 1.557 1.556s-.699 1.556-1.557 1.556zM16.625 19.898h-2.644v-5.473c0-1.345-.748-2.083-1.95-2.083-.982 0-1.485.661-1.734 1.296-.089.217-.117.519-.117.826v5.434h-2.644v-9.226h2.644v1.305c.353-.545.929-1.305 2.078-1.305 1.582 0 2.77 1.05 2.77 3.313v5.913z"></path>
                </svg>
              </a>
              <a href="https://github.com" className="text-blue-400 hover:text-blue-500">
                <svg className="w-6 h-6" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M12 .5c-6.627 0-12 5.373-12 12 0 5.3 3.438 9.804 8.2 11.4.6.1.8-.2.8-.5v-2c0-.3-.1-.5-.3-.7-3.2-1.2-4-3-4-5.4 0-2.1 1-4.1 3-5 2.8-1.5 6-1 7.6 1.8 2.1-1.2 3-3.2 3-5.2 0-2.5-1.7-4.6-4.3-5.4-.3-.1-.6-.1-.9-.1s-.6.1-.9.1c-1.3.1-2.5.7-3.4 1.6-1.5-1.3-3.5-1.9-5.3-1.3-.2.1-.4.2-.6.3-.7.2-1.3.6-1.9 1.1-.2.3-.5.6-.8.9-.6.6-1.1 1.2-1.5 1.9-.6 1.1-1 2.2-1 3.4 0 1.3.3 2.3 1 3.3.4.6 1.3 1.3 1.7 1.3.3 0 .7-.1 1-.3.6-.4.9-.7 1.3-1.2 1-1.1 1.7-2.5 1.7-4 0-1.3-.5-2.5-1.3-3.3.3-.2.6-.4.9-.7 1.5-1.2 3.6-1.6 5.3-.9 1.5.6 2.5 2 2.5 3.6 0 2.1-1.7 3.8-3.8 3.9-.4 0-.7-.1-.9-.2-.2-.1-.4-.3-.6-.4-.2-.2-.4-.4-.5-.6-.4-.8-.7-1.6-.7-2.5s.2-1.7.7-2.5c.2-.2.4-.3.6-.4.2-.1.5-.2.9-.2 1.9 0 3.4 1.6 3.4 3.5 0 1.4-.8 2.6-2 3.2-.4.3-.9.4-1.3.4-.4 0-.7-.1-1-.3-.3-.2-.5-.5-.6-.8-.3-.6-.5-1.3-.5-1.9 0-1.3.5-2.4 1.4-3.1 2-1.4 4.5-1.3 6.5.3 1.3 1.1 2 2.8 2 4.5 0 2.5-1.6 4.6-3.8 5.3-.3.1-.6.2-.9.3-.2-.3-.4-.6-.7-.9.2-.2.4-.5.7-.7.5-.6.8-1.3.8-2.1-.1-1.7-.7-3.1-1.9-4.1-.5-.5-.9-.9-1.5-1.3z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
