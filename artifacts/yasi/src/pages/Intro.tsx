import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  FileText, Globe, FileOutput, ShieldCheck, 
  Zap, BarChart3, ArrowRight, CheckCircle2,
  Building, Briefcase, CreditCard, PieChart
} from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Intro() {
  return (
    <div className="min-h-[100dvh] w-full flex flex-col bg-slate-50 overflow-hidden relative font-sans text-slate-900">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[100px] -z-10 animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute top-[40%] right-[-10%] w-[40%] h-[60%] rounded-full bg-fuchsia-500/10 blur-[120px] -z-10 animate-pulse" style={{ animationDuration: '12s' }} />
      
      {/* Navigation */}
      <header className="px-6 md:px-12 h-20 flex items-center justify-between border-b border-white/20 bg-white/60 backdrop-blur-xl fixed top-0 w-full z-50">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="YASI Logo" className="w-10 h-10 object-contain" />
          <span className="text-2xl font-bold tracking-tight text-slate-900">YASI</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden md:block text-sm font-medium text-slate-500 hover:text-slate-900 cursor-pointer transition-colors">Features</span>
          <span className="hidden md:block text-sm font-medium text-slate-500 hover:text-slate-900 cursor-pointer transition-colors">Pricing</span>
          <Link href="/login">
            <Button variant="outline" className="font-medium rounded-full bg-white/80 backdrop-blur border-slate-200 hover:bg-slate-100">Sign In</Button>
          </Link>
          <Link href="/login">
            <Button className="font-medium rounded-full bg-slate-900 text-white hover:bg-slate-800 hidden sm:flex">Get Started</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col w-full pt-20">
        
        {/* HERO SECTION */}
        <section className="relative px-6 py-24 md:py-32 flex flex-col items-center justify-center text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl mx-auto space-y-8 relative z-10"
          >
            <motion.div variants={fadeIn} className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700 mb-2">
              <span className="flex h-2 w-2 rounded-full bg-indigo-600 mr-2 animate-pulse"></span>
              YASI Finance Module v3.0 is Live
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              Enterprise Invoicing. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-fuchsia-600">Beautifully Simple.</span>
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              The premium SAP-style invoice generator for modern businesses. Handle India GST, Global VAT, and multi-currency billing with flawless precision in seconds.
            </motion.p>

            <motion.div variants={fadeIn} className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login">
                <Button size="lg" className="h-14 px-8 text-lg bg-indigo-600 text-white rounded-full shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 hover:shadow-indigo-600/40 transition-all group">
                  Create Free Invoice
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-slate-300 text-slate-700 hover:bg-slate-100 bg-white shadow-sm">
                View Live Demo
              </Button>
            </motion.div>
            
            <motion.div variants={fadeIn} className="pt-8 flex items-center justify-center gap-6 text-sm text-slate-500 font-medium">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> No credit card required</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Free forever plan</span>
              <span className="hidden sm:flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Auto-calculations</span>
            </motion.div>
          </motion.div>
        </section>

        {/* PARTNER MARQUEE */}
        <section className="py-10 bg-white border-y border-slate-200 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white z-10 pointer-events-none"></div>
          <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-widest mb-6">Trusted by innovative teams worldwide</p>
          <div className="flex w-[200%] animate-[marquee_20s_linear_infinite]">
            {/* Double the list for infinite scroll effect */}
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex justify-around w-1/2 px-4 items-center">
                {["Acme Corp", "GlobalTech", "Nexus", "Quantum", "Vertex", "Horizon"].map((partner, j) => (
                  <span key={j} className="text-2xl font-bold text-slate-300 mx-8 whitespace-nowrap">{partner}</span>
                ))}
              </div>
            ))}
          </div>
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
          `}} />
        </section>

        {/* BENTO BOX FEATURES */}
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Everything you need to get paid faster</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">Stop wrestling with spreadsheets. YASI automates the entire billing workflow from generation to tax compliance.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
            {/* Feature 1 - Large */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="md:col-span-2 md:row-span-2 rounded-3xl bg-white border border-slate-200 p-8 shadow-sm overflow-hidden relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 h-full flex flex-col">
                <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-6">
                  <Globe className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Global Tax Compliance</h3>
                <p className="text-slate-600 mb-8 max-w-md">Automatically calculate India GST (CGST, SGST, IGST) based on intra or inter-state rules. Seamlessly switch to International VAT with a single click.</p>
                
                {/* Abstract UI element */}
                <div className="mt-auto bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-inner flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-2 w-24 bg-slate-200 rounded-full"></div>
                    <div className="h-4 w-32 bg-slate-300 rounded-full"></div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="text-xs text-slate-400">Total Tax</div>
                    <div className="font-bold text-indigo-600">₹1,800.00</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Feature 2 - Small */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-3xl bg-slate-900 p-8 text-white shadow-xl relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-fuchsia-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
                <p className="text-slate-300 text-sm leading-relaxed">Save your company details, logo, and signature once. Generate beautiful invoices in under 10 seconds.</p>
              </div>
            </motion.div>

            {/* Feature 3 - Small */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
                <FileOutput className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Print-Ready PDFs</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Export pixel-perfect, branded PDFs that make your business look like a Fortune 500 company.</p>
            </motion.div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">How YASI works</h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">Three simple steps to professional invoicing.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {/* Connecting line for desktop */}
              <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-indigo-500/0 via-indigo-500/50 to-indigo-500/0" />

              {[
                { step: "01", title: "Setup Profile", desc: "Add your logo, signature, and tax details in settings.", icon: Building },
                { step: "02", title: "Add Details", desc: "Enter client info, line items, and quantities.", icon: FileText },
                { step: "03", title: "Export & Send", desc: "Download the generated PDF and send it to your client.", icon: Zap }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.2 }}
                  className="relative flex flex-col items-center text-center"
                >
                  <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-slate-900 flex items-center justify-center relative z-10 shadow-2xl mb-6">
                    <item.icon className="w-10 h-10 text-indigo-400" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold shadow-lg">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-slate-400">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER CTA */}
        <section className="py-24 px-6 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto bg-gradient-to-br from-indigo-50 to-fuchsia-50 rounded-3xl p-12 border border-indigo-100 shadow-xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">Ready to upgrade your invoicing?</h2>
            <p className="text-lg text-slate-600 mb-8 max-w-xl mx-auto">Join thousands of freelancers, agencies, and enterprises who trust YASI for their billing.</p>
            <Link href="/login">
              <Button size="lg" className="h-14 px-10 text-lg bg-slate-900 text-white rounded-full hover:bg-slate-800 hover:scale-105 transition-all shadow-lg">
                Start for free today
              </Button>
            </Link>
          </motion.div>
        </section>
        
        {/* Simple Footer */}
        <footer className="py-8 border-t border-slate-200 text-center text-slate-500 text-sm bg-white">
          <div className="flex items-center justify-center gap-2 mb-2">
            <img src="/logo.png" alt="YASI Logo" className="w-6 h-6 object-contain" />
            <span className="font-bold text-slate-900">YASI Maestro</span>
          </div>
          <p>© {new Date().getFullYear()} YASI. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}
