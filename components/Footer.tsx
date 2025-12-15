export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-white py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Skulpt Body Contouring</h2>
            <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
              Expert body sculpting in Peterborough
            </p>
            <p className="text-sm text-neutral-400 mt-2 leading-relaxed">
              Non-invasive fat reduction & skin tightening
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-base sm:text-lg mb-4">Contact</h3>
            <ul className="space-y-2 text-sm sm:text-base text-neutral-400">
              <li>
                <a href="tel:+447700173390" className="hover:text-white transition-colors">
                  07700 173390
                </a>
              </li>
              <li>
                <a href="mailto:info@skintight.uk" className="hover:text-white transition-colors">
                  info@skintight.uk
                </a>
              </li>
              <li className="mt-3 pt-3 border-t border-neutral-800 leading-relaxed">Skulpt Body Contouring</li>
              <li>Peterborough</li>
              <li>United Kingdom</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-base sm:text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm sm:text-base text-neutral-400">
              <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#treatments" className="hover:text-white transition-colors">Treatments</a></li>
              <li><a href="#results" className="hover:text-white transition-colors">Results</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="/skin-assessment" className="hover:text-white transition-colors">Skin Assessment</a></li>
              <li><a href="/suitability-check" className="hover:text-white transition-colors">Am I Suitable?</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-8 pt-8 text-center text-neutral-400">
          <p className="text-sm sm:text-base mb-2">&copy; 2025 Skulpt Body Contouring. All rights reserved.</p>
          <p className="text-xs sm:text-sm text-neutral-500 mb-3">
            <a href="/privacy-policy" className="hover:text-white underline transition-colors">Privacy Policy</a>
          </p>
          <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
            This site may use Meta tracking technologies to improve user experience and analyze site performance.
          </p>
        </div>
      </div>
    </footer>
  )
}
