import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronDown, Instagram,
  Menu, Sparkles, X,
} from "lucide-react";

const collections = [
  {
    number: "01",
    title: "The Art of Gifting",
    category: "PERSONALISED KEEPSAKES",
    image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=1100&q=85",
    className: "collection-large",
  },
  {
    number: "02",
    title: "Festive Moments",
    category: "HAMPERS & CELEBRATIONS",
    image: "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=900&q=85",
    className: "",
  },
  {
    number: "03",
    title: "Objects to Treasure",
    category: "HOME & LIVING",
    image: "https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=900&q=85",
    className: "",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const reduceMotion = useReducedMotion();

  const reveal = reduceMotion
    ? { initial: false, whileInView: undefined, viewport: undefined }
    : { initial: "hidden" as const, whileInView: "visible" as const, viewport: { once: true, amount: 0.18 } };

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="site-shell">
      <div className="announcement">
        <span>MADE WITH MEANING. GIVEN WITH LOVE.</span>
        <span className="announcement-right">THOUGHTFUL GESTURES, BEAUTIFULLY MADE <span>✳</span></span>
      </div>

      <header className="header">
        <a href="#home" className="wordmark" aria-label="Srikaram Creations home" onClick={closeMenu}>
          <span className="wordmark-main">srikaram<span>✳</span></span>
          <span className="wordmark-sub">C R E A T I O N S</span>
        </a>

        <nav className={menuOpen ? "nav nav-open" : "nav"} aria-label="Main navigation">
          <a href="#collections" onClick={closeMenu}>Collections</a>
          <a href="#story" onClick={closeMenu}>Our story</a>
          <a href="#craft" onClick={closeMenu}>The details</a>
          <a href="#contact" onClick={closeMenu}>Get in touch</a>
        </nav>

        <a className="header-cta" href="#contact">LET'S CREATE <ArrowUpRight size={15} /></a>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close menu" : "Open menu"}>
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-copy">
            <motion.p className="eyebrow" {...reveal} variants={fadeUp} transition={{ duration: 0.7 }}>
              <span className="eyebrow-line" /> A LITTLE MORE THOUGHT. A LOT MORE HEART.
            </motion.p>
            <motion.h1 {...reveal} variants={fadeUp} transition={{ duration: 0.85, delay: 0.08 }}>
              The art of<br />giving <em>beautifully.</em>
            </motion.h1>
            <motion.p className="hero-description" {...reveal} variants={fadeUp} transition={{ duration: 0.8, delay: 0.18 }}>
              Thoughtful creations for the people, places and moments that make life special.
            </motion.p>
            <motion.div className="hero-actions" {...reveal} variants={fadeUp} transition={{ duration: 0.8, delay: 0.26 }}>
              <a className="button button-dark" href="#collections">EXPLORE OUR WORLD <ArrowUpRight size={16} /></a>
              <a className="text-link" href="#story">A story worth sharing <ArrowRight size={15} /></a>
            </motion.div>
            <div className="hero-note"><span>01 / 03</span><span>THOUGHTFULLY MADE IN INDIA</span></div>
          </div>

          <motion.div className="hero-visual" initial={reduceMotion ? false : { opacity: 0, scale: 1.035 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, ease: [0.2, 0.65, 0.3, 1] }}>
            <img src="https://images.unsplash.com/photo-1608755728617-aefab37d2ede?auto=format&fit=crop&w=1500&q=90" alt="Thoughtfully wrapped gifts with elegant ribbon" />
            <div className="hero-image-shade" />
            <div className="hero-stamp"><Sparkles size={17} strokeWidth={1.3} /><span>THE JOY IS<br />IN THE DETAILS</span></div>
            <a className="hero-scroll" href="#collections"><span>SCROLL TO DISCOVER</span><ArrowDown size={15} /></a>
          </motion.div>
        </section>

        <section className="intro section-pad">
          <motion.div {...reveal} variants={fadeUp} transition={{ duration: 0.75 }}>
            <p className="eyebrow"><span className="eyebrow-line" /> NOT JUST A GIFT. A FEELING.</p>
            <h2>Some things are too<br />special to be <em>ordinary.</em></h2>
          </motion.div>
          <motion.div className="intro-aside" {...reveal} variants={fadeUp} transition={{ duration: 0.75, delay: 0.12 }}>
            <p>We believe the best gifts do more than delight. They tell someone you noticed, you remembered, and you cared enough to make it personal.</p>
            <a className="text-link" href="#story">GET TO KNOW US <ArrowUpRight size={15} /></a>
          </motion.div>
          <div className="intro-mark">S<span>✳</span>C</div>
        </section>

        <section className="collections section-pad" id="collections">
          <div className="section-heading">
            <div><p className="eyebrow"><span className="eyebrow-line" /> MADE FOR EVERY MEANINGFUL MOMENT</p><h2>Find your kind<br />of <em>wonder.</em></h2></div>
            <p className="section-heading-note">A considered collection of little things<br />that leave a lasting impression.</p>
          </div>
          <div className="collection-grid">
            {collections.map((item, index) => (
              <motion.a
                href="#contact"
                className={`collection-card ${item.className}`}
                key={item.number}
                {...reveal}
                variants={fadeUp}
                transition={{ duration: 0.75, delay: index * 0.1 }}
              >
                <div className="collection-image"><img src={item.image} alt={item.title} loading="lazy" /><span className="collection-arrow"><ArrowUpRight size={19} /></span></div>
                <div className="collection-meta"><span>{item.category}</span><span>{item.number}</span></div>
                <h3>{item.title}</h3>
              </motion.a>
            ))}
          </div>
          <div className="collection-bottom"><span>MADE TO BE REMEMBERED</span><a className="text-link" href="#contact">DISCOVER YOUR PERFECT GIFT <ArrowRight size={15} /></a></div>
        </section>

        <section className="story" id="story">
          <div className="story-image"><img src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1300&q=85" alt="A thoughtful creative process at a work table" loading="lazy" /><span className="story-image-caption">A THOUGHTFUL TOUCH, IN EVERY DETAIL.</span></div>
          <div className="story-copy">
            <p className="eyebrow"><span className="eyebrow-line" /> A NOTE FROM OUR WORLD</p>
            <h2>Made by hand.<br />Remembered <em>by heart.</em></h2>
            <p className="story-body">At Srikaram Creations, every detail begins with a simple thought: how can we make someone feel truly special? From the first idea to the final ribbon, we bring care, creativity and a personal touch to every creation.</p>
            <a className="button button-outline" href="#contact">LET'S MAKE SOMETHING MEANINGFUL <ArrowUpRight size={16} /></a>
            <span className="story-flourish">With love, always. <span>✳</span></span>
          </div>
        </section>

        <section className="craft section-pad" id="craft">
          <div className="craft-top">
            <p className="eyebrow"><span className="eyebrow-line" /> THE THINGS THAT MAKE IT SPECIAL</p>
            <h2>It's all in<br /><em>the details.</em></h2>
          </div>
          <div className="craft-grid">
            <div className="craft-item"><span>01</span><h3>Made personal</h3><p>Every detail is considered, with room for your story and your sentiment.</p></div>
            <div className="craft-item"><span>02</span><h3>Thoughtfully chosen</h3><p>Beautiful materials, considered combinations and a little unexpected magic.</p></div>
            <div className="craft-item"><span>03</span><h3>Made to remember</h3><p>Creations designed to be cherished long after the moment has passed.</p></div>
          </div>
        </section>

        <section className="quote-band">
          <span className="quote-mark">“</span>
          <p>Because the most beautiful gifts<br />are the ones that <em>mean something.</em></p>
          <span className="quote-credit">THE SRIKARAM WAY <span>✳</span></span>
        </section>

        <section className="faq section-pad">
          <div className="faq-heading"><p className="eyebrow"><span className="eyebrow-line" /> A FEW THINGS YOU MIGHT WONDER</p><h2>Good to <em>know.</em></h2></div>
          <div className="faq-list">
            {[
              ["Can I request a personalised creation?", "Absolutely. Tell us about the person, occasion and feeling you want to capture. We can explore a thoughtful creation together."],
              ["Do you create gifts for businesses and events?", "We welcome corporate gifting and special-event enquiries. Share your requirements and we can discuss a considered approach."],
              ["How do I enquire or place an order?", "Send us a message through the contact section with what you have in mind. Our team can guide you through the next steps."],
            ].map(([question, answer], index) => (
              <div className="faq-item" key={question}>
                <button onClick={() => setActiveFaq(activeFaq === index ? null : index)} aria-expanded={activeFaq === index}>
                  <span>{question}</span><ChevronDown className={activeFaq === index ? "faq-chevron active" : "faq-chevron"} size={18} />
                </button>
                <AnimatePresence initial={false}>
                  {activeFaq === index && <motion.p className="faq-answer" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28 }}>{answer}</motion.p>}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        <section className="contact" id="contact">
          <div className="contact-inner">
            <p className="eyebrow"><span className="eyebrow-line" /> HAVE A LITTLE SOMETHING IN MIND?</p>
            <h2>Let's make it<br /><em>meaningful.</em></h2>
            <p>Tell us who you're celebrating. We'll help you find a beautiful way to say it.</p>
            <a className="button button-light" href="https://www.srikaramcreations.com/" target="_blank" rel="noreferrer">START A CONVERSATION <ArrowUpRight size={16} /></a>
            <span className="contact-flower">✳</span>
          </div>
        </section>
      </main>

      <footer className="footer">
        <a href="#home" className="wordmark footer-wordmark"><span className="wordmark-main">srikaram<span>✳</span></span><span className="wordmark-sub">C R E A T I O N S</span></a>
        <span className="footer-note">THOUGHTFULLY MADE. BEAUTIFULLY GIVEN.</span>
        <div className="footer-links"><a href="#collections">COLLECTIONS</a><a href="#story">OUR STORY</a><a href="#contact">CONTACT</a><a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={17} /></a></div>
        <span className="copyright">© {new Date().getFullYear()} SRIKARAM CREATIONS. MADE WITH MEANING.</span>
      </footer>
    </div>
  );
}

export default App;