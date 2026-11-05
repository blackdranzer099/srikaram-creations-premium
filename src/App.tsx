import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronDown, ChevronLeft, ChevronRight, Instagram, Menu, Sparkles, X } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

const SITE = "https://www.srikaramcreations.com/";
const gallery = [
  { id: 1, title: "A thoughtful welcome", category: "Hampers", label: "01 · CURATED HAMPERS", image: "https://images.unsplash.com/photo-1608755728617-aefab37d2ede?auto=format&fit=crop&w=1500&q=90", description: "A considered collection, beautifully brought together." },
  { id: 2, title: "Little things, lasting joy", category: "Personalised", label: "02 · PERSONAL TOUCHES", image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=1200&q=85", description: "Details that make a gift unmistakably theirs." },
  { id: 3, title: "Celebrate in colour", category: "Festive", label: "03 · FESTIVE MOMENTS", image: "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=1400&q=85", description: "A little extra magic for the moments that matter." },
  { id: 4, title: "Objects with a story", category: "Home décor", label: "04 · HOME & LIVING", image: "https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=1200&q=85", description: "Thoughtful accents for spaces and everyday rituals." },
  { id: 5, title: "Made to be remembered", category: "Personalised", label: "05 · MEANINGFUL KEEPSAKES", image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1400&q=85", description: "A keepsake that says what words sometimes cannot." },
  { id: 6, title: "A beautiful way to say thank you", category: "Hampers", label: "06 · THE ART OF PRESENTATION", image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=85", description: "Finishing touches that turn a gesture into a memory." },
];
const collections = [
  { n: "01", title: "Personalised gifts", tag: "MADE JUST FOR THEM", image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=1300&q=85", desc: "Names, notes and little details that make it personal." },
  { n: "02", title: "Festive hampers", tag: "CELEBRATE BEAUTIFULLY", image: "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=1200&q=85", desc: "Thoughtful combinations for every season and celebration." },
  { n: "03", title: "Home décor", tag: "A TOUCH OF SOMETHING SPECIAL", image: "https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=1200&q=85", desc: "Objects and accents that bring warmth to a space." },
  { n: "04", title: "Corporate gifting", tag: "MAKE YOUR GESTURE COUNT", image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=85", desc: "Considered gifting for teams, clients and partnerships." },
];
const faqs = [
  ["Can I personalise a gift?", "Yes. Share the occasion, recipient and the personal touches you have in mind. The available options depend on the selected creation."],
  ["Do you create festive and corporate hampers?", "The website presents festive hampers and corporate gifting as key collection areas. Share your brief with the Srikaram team to discuss a suitable arrangement."],
  ["Can I enquire about a custom or bulk order?", "Absolutely. Use the enquiry link to contact Srikaram Creations directly with your occasion, quantity, preferred date and ideas."],
  ["Where can I see the latest products and availability?", "For current collections, product details and availability, please visit the official Srikaram Creations website."],
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", occasion: "Personal gifting", message: "" });
  const reduceMotion = useReducedMotion();
  const mainRef = useRef<HTMLElement>(null);
  const filteredGallery = useMemo(() => activeFilter === "All" ? gallery : gallery.filter(item => item.category === activeFilter), [activeFilter]);
  const activeImage = lightbox === null ? null : filteredGallery.findIndex(item => item.id === lightbox);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (reduceMotion) return;
    const lenis = new Lenis({ duration: 0.9, smoothWheel: true, wheelMultiplier: 0.9, touchMultiplier: 1 });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.fromTo(element, { y: 34, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: element, start: "top 88%", once: true } });
      });
      gsap.utils.toArray<HTMLElement>("[data-image-reveal]").forEach((element) => {
        gsap.fromTo(element, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 1.25, ease: "power3.inOut", scrollTrigger: { trigger: element, start: "top 82%", once: true } });
      });
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((element) => {
        gsap.fromTo(element, { yPercent: -3 }, { yPercent: 3, ease: "none", scrollTrigger: { trigger: element, start: "top bottom", end: "bottom top", scrub: 0.7 } });
      });
    }, mainRef);
    return () => { ctx.revert(); gsap.ticker.remove(tick); lenis.destroy(); };
  }, [reduceMotion]);

  useEffect(() => {
    if (lightbox !== null || enquiryOpen || menuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox, enquiryOpen, menuOpen]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setLightbox(null); setEnquiryOpen(false); }
      if (lightbox !== null && activeImage !== null) {
        if (event.key === "ArrowRight") setLightbox(filteredGallery[(activeImage + 1) % filteredGallery.length].id);
        if (event.key === "ArrowLeft") setLightbox(filteredGallery[(activeImage - 1 + filteredGallery.length) % filteredGallery.length].id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, activeImage, filteredGallery]);

  const openEnquiry = () => { setSubmitted(false); setEnquiryOpen(true); closeMenu(); };
  const submitEnquiry = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const details = `Srikaram Creations enquiry\nName: ${form.name}\nEmail: ${form.email}\nOccasion: ${form.occasion}\nMessage: ${form.message}`;
    try { await navigator.clipboard.writeText(details); } catch { /* Clipboard access may be unavailable in some browsers. */ }
    setSubmitted(true);
    window.open(SITE, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="site-shell">
      <div className="announcement"><span>THOUGHTFUL GESTURES. BEAUTIFULLY MADE.</span><span className="announcement-right">A LITTLE MORE MEANING IN EVERY MOMENT <b>✳</b></span></div>
      <header className="header">
        <a href="#home" className="wordmark" onClick={closeMenu} aria-label="Srikaram Creations home"><span className="wordmark-main">srikaram<span>✳</span></span><span className="wordmark-sub">C R E A T I O N S</span></a>
        <nav className={menuOpen ? "nav nav-open" : "nav"} aria-label="Main navigation">
          <a href="#collections" onClick={closeMenu}>Collections</a><a href="#story" onClick={closeMenu}>Our story</a><a href="#gallery" onClick={closeMenu}>The visual edit</a><a href="#approach" onClick={closeMenu}>Our approach</a>
        </nav>
        <button className="header-cta" onClick={openEnquiry}>MAKE AN ENQUIRY <ArrowUpRight size={15}/></button>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close menu" : "Open menu"}>{menuOpen ? <X/> : <Menu/>}</button>
      </header>

      <main ref={mainRef}>
        <section className="hero" id="home">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-line"/> THE ART OF THOUGHTFUL GIFTING</p>
            <h1>Give a little<br/>more <em>meaning.</em></h1>
            <p className="hero-description">For the moments that matter, the people who make them special, and the memories worth keeping.</p>
            <div className="hero-actions"><a className="button button-dark" href="#collections">DISCOVER OUR COLLECTIONS <ArrowUpRight size={16}/></a><a className="text-link" href="#story">A little about us <ArrowRight size={15}/></a></div>
            <div className="hero-note"><span>01 — THE SRIKARAM EDIT</span><span>MADE WITH THOUGHT, GIVEN WITH LOVE</span></div>
          </div>
          <div className="hero-visual">
            <img data-parallax src="https://images.unsplash.com/photo-1608755728617-aefab37d2ede?auto=format&fit=crop&w=1800&q=90" alt="Beautifully wrapped gifts and thoughtful presentation"/>
            <div className="hero-image-shade"/>
            <div className="hero-stamp"><Sparkles size={18}/><span>THE JOY IS<br/>IN THE DETAILS</span></div>
            <div className="hero-image-caption"><span>THE ART OF PRESENTATION</span><span>HYDERABAD · INDIA</span></div>
            <a className="hero-scroll" href="#collections"><span>SCROLL TO DISCOVER</span><ArrowDown size={15}/></a>
          </div>
        </section>

        <section className="intro section-pad" id="story">
          <div data-reveal><p className="eyebrow"><span className="eyebrow-line"/> A GIFT IS A WAY OF SAYING</p><h2>“I thought of you.”<br/><em>And it shows.</em></h2></div>
          <div className="intro-aside" data-reveal><p>We believe gifting is more than the exchange of something beautiful. It is a moment of connection — a way to celebrate, appreciate, remember and make someone feel seen.</p><a className="text-link" href="#approach">DISCOVER THE SRIKARAM WAY <ArrowUpRight size={15}/></a></div>
          <div className="intro-mark">S<span>✳</span>C</div>
        </section>

        <section className="collections section-pad" id="collections">
          <div className="section-heading" data-reveal><div><p className="eyebrow"><span className="eyebrow-line"/> CONSIDERED FOR EVERY OCCASION</p><h2>Find your kind<br/>of <em>wonder.</em></h2></div><p className="section-heading-note">A collection of thoughtful gestures,<br/>made for the moments worth celebrating.</p></div>
          <div className="collection-grid">
            {collections.map((item, index) => <a className={`collection-card collection-${index + 1}`} href={SITE} target="_blank" rel="noreferrer" key={item.n} data-reveal><div className="collection-image" data-image-reveal><img src={item.image} alt={item.title} loading="lazy"/><span className="collection-arrow"><ArrowUpRight size={19}/></span></div><div className="collection-meta"><span>{item.tag}</span><span>{item.n}</span></div><h3>{item.title}</h3><p className="collection-description">{item.desc}</p></a>)}
          </div>
          <div className="collection-bottom"><span>MADE TO BE REMEMBERED</span><button className="text-link text-button" onClick={openEnquiry}>TELL US WHAT YOU HAVE IN MIND <ArrowRight size={15}/></button></div>
        </section>

        <section className="story">
          <div className="story-image" data-image-reveal><img src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1500&q=90" alt="Creative hands preparing a thoughtful gift"/><span className="story-image-caption">A THOUGHTFUL TOUCH, IN EVERY DETAIL.</span></div>
          <div className="story-copy" data-reveal><p className="eyebrow"><span className="eyebrow-line"/> THE HEART BEHIND THE GESTURE</p><h2>Made with care.<br/>Remembered <em>by heart.</em></h2><p className="story-body">At Srikaram Creations, the little details are what make a gesture unforgettable. From personal touches to beautifully considered presentation, we bring creativity and care to the way you celebrate the people in your life.</p><button className="button button-outline" onClick={openEnquiry}>LET'S CREATE SOMETHING MEANINGFUL <ArrowUpRight size={16}/></button><span className="story-flourish">With love, always. <span>✳</span></span></div>
        </section>

        <section className="gallery-section section-pad" id="gallery">
          <div className="gallery-heading" data-reveal><div><p className="eyebrow"><span className="eyebrow-line"/> THE VISUAL ARCHIVE · 01—06</p><h2>The beauty of<br/><em>being thoughtful.</em></h2></div><p>Little glimpses of the details, textures and finishing touches that make a gift feel personal.</p></div>
          <div className="gallery-filters" role="group" aria-label="Filter gallery">
            {["All","Hampers","Personalised","Festive","Home décor"].map(filter => <button key={filter} className={activeFilter === filter ? "filter-pill active" : "filter-pill"} onClick={() => setActiveFilter(filter)}>{filter}</button>)}
          </div>
          <motion.div layout className="gallery-grid">
            <AnimatePresence mode="popLayout">
              {filteredGallery.map((item, index) => <motion.button layout key={item.id} className={`gallery-card gallery-card-${index % 4}`} onClick={() => setLightbox(item.id)} initial={reduceMotion ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: .97 }} transition={{ duration: .45 }}><div className="gallery-image"><img src={item.image} alt={item.title} loading="lazy"/><span className="gallery-label">{item.label}</span><span className="gallery-open"><ArrowUpRight size={18}/></span></div><span className="gallery-title">{item.title}</span><span className="gallery-category">{item.category}</span></motion.button>)}
            </AnimatePresence>
          </motion.div>
        </section>

        <section className="approach section-pad" id="approach">
          <div className="approach-header" data-reveal><p className="eyebrow"><span className="eyebrow-line"/> THE SRIKARAM APPROACH</p><h2>Every detail,<br/><em>considered.</em></h2></div>
          <div className="approach-grid">
            <article data-reveal><span>01</span><h3>Begin with a thought</h3><p>Tell us about the person, the occasion and the feeling you want your gift to carry.</p></article>
            <article data-reveal><span>02</span><h3>Make it personal</h3><p>Explore thoughtful choices and personal details that bring your idea to life.</p></article>
            <article data-reveal><span>03</span><h3>Present with care</h3><p>Bring the gesture together with considered finishing touches and beautiful presentation.</p></article>
          </div>
        </section>

        <section className="corporate">
          <div className="corporate-image"><img src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1600&q=90" alt="Premium gift box ready to be presented"/></div>
          <div className="corporate-copy" data-reveal><p className="eyebrow"><span className="eyebrow-line"/> FOR TEAMS, CLIENTS & PARTNERS</p><h2>Make your<br/>appreciation <em>personal.</em></h2><p>Thoughtful gifting can bring people closer, celebrate milestones and make business relationships feel more human. Tell us about your corporate or bulk gifting brief.</p><button className="button button-light" onClick={openEnquiry}>ENQUIRE ABOUT CORPORATE GIFTING <ArrowUpRight size={16}/></button></div>
        </section>

        <section className="quote-band"><span className="quote-mark">“</span><p>The most beautiful gifts<br/>are the ones that <em>mean something.</em></p><span className="quote-credit">THE SRIKARAM WAY <b>✳</b></span></section>

        <section className="faq section-pad">
          <div className="faq-heading" data-reveal><p className="eyebrow"><span className="eyebrow-line"/> A FEW THINGS YOU MIGHT WONDER</p><h2>Good to <em>know.</em></h2></div>
          <div className="faq-list">{faqs.map(([question, answer], index) => <div className="faq-item" key={question}><button onClick={() => setFaqOpen(faqOpen === index ? null : index)} aria-expanded={faqOpen === index}><span>{question}</span><ChevronDown className={faqOpen === index ? "faq-chevron active" : "faq-chevron"} size={18}/></button><AnimatePresence initial={false}>{faqOpen === index && <motion.p className="faq-answer" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .28 }}>{answer}</motion.p>}</AnimatePresence></div>)}</div>
        </section>

        <section className="contact" id="contact"><div className="contact-inner" data-reveal><p className="eyebrow"><span className="eyebrow-line"/> HAVE A LITTLE SOMETHING IN MIND?</p><h2>Let's make it<br/><em>meaningful.</em></h2><p>Tell us who you're celebrating. We'll help you find a beautiful way to say it.</p><button className="button button-light" onClick={openEnquiry}>START A CONVERSATION <ArrowUpRight size={16}/></button><span className="contact-flower">✳</span></div></section>
      </main>

      <footer className="footer"><a href="#home" className="wordmark footer-wordmark"><span className="wordmark-main">srikaram<span>✳</span></span><span className="wordmark-sub">C R E A T I O N S</span></a><span className="footer-note">THOUGHTFULLY MADE. BEAUTIFULLY GIVEN.</span><div className="footer-links"><a href="#collections">COLLECTIONS</a><a href="#story">OUR STORY</a><a href={SITE} target="_blank" rel="noreferrer">OFFICIAL SITE</a><a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={17}/></a></div><span className="copyright">© {new Date().getFullYear()} SRIKARAM CREATIONS. MADE WITH MEANING.</span></footer>

      <AnimatePresence>
        {lightbox !== null && activeImage !== null && <motion.div className="lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLightbox(null)}><button className="lightbox-close" onClick={() => setLightbox(null)} aria-label="Close gallery"><X/></button><button className="lightbox-prev" onClick={event => {event.stopPropagation();setLightbox(filteredGallery[(activeImage - 1 + filteredGallery.length) % filteredGallery.length].id)}} aria-label="Previous image"><ChevronLeft/></button><div className="lightbox-content" onClick={event => event.stopPropagation()}><img src={filteredGallery[activeImage].image} alt={filteredGallery[activeImage].title}/><div className="lightbox-caption"><span>{String(activeImage + 1).padStart(2,"0")} / {String(filteredGallery.length).padStart(2,"0")} · {filteredGallery[activeImage].category.toUpperCase()}</span><h3>{filteredGallery[activeImage].title}</h3><p>{filteredGallery[activeImage].description}</p></div></div><button className="lightbox-next" onClick={event => {event.stopPropagation();setLightbox(filteredGallery[(activeImage + 1) % filteredGallery.length].id)}} aria-label="Next image"><ChevronRight/></button></motion.div>}
        {enquiryOpen && <motion.div className="enquiry-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEnquiryOpen(false)}><motion.div className="enquiry-modal" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 24, opacity: 0 }} onClick={event => event.stopPropagation()}><button className="modal-close" onClick={() => setEnquiryOpen(false)} aria-label="Close enquiry"><X/></button><p className="eyebrow"><span className="eyebrow-line"/> A NOTE TO SRIKARAM</p><h2>Let's make<br/><em>it personal.</em></h2><p className="modal-intro">A few details will help you start a conversation with the team.</p><form onSubmit={submitEnquiry}><label>Your name<input required value={form.name} onChange={event => setForm({...form,name:event.target.value})} placeholder="How should we address you?"/></label><label>Email address<input required type="email" value={form.email} onChange={event => setForm({...form,email:event.target.value})} placeholder="you@example.com"/></label><label>What are you planning?<select value={form.occasion} onChange={event => setForm({...form,occasion:event.target.value})}><option>Personal gifting</option><option>Festive hampers</option><option>Wedding or celebration</option><option>Corporate gifting</option><option>Home décor</option><option>Something else</option></select></label><label>Tell us a little more<textarea rows={3} value={form.message} onChange={event => setForm({...form,message:event.target.value})} placeholder="Occasion, quantity, date, ideas..."/></label><button className="button button-dark modal-submit" type="submit">CONTINUE TO SRIKARAM <ArrowUpRight size={16}/></button></form><p className="modal-footnote">We copy your enquiry details and open the official website so you can share them with the Srikaram team. No order is placed here.</p>{submitted && <p className="modal-confirm"><Check size={15}/> Your details are copied. Paste them into the official site contact channel.</p>}</motion.div></motion.div>}
      </AnimatePresence>
    </div>
  );
}

export default App;