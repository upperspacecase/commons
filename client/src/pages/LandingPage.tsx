import { Button } from "@/components/ui/button";
import heroImage from "@assets/generated_images/Friends_sharing_in_garage_b8efb1f5.png";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold" style={{ fontFamily: "DM Sans, sans-serif" }}>
            Commons
          </h1>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => window.location.href = '/auth'} data-testid="button-sign-in">Sign In</Button>
            <Button onClick={() => window.location.href = '/auth'} data-testid="button-get-started">Get Started</Button>
          </div>
        </div>
      </header>

      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h2 className="text-6xl md:text-7xl font-bold text-white mb-6" style={{ fontFamily: "DM Sans, sans-serif" }}>
            Share Things with Friends
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-8 font-medium">
            A private network where you can borrow what you need from people you trust.
          </p>
          <Button
            size="lg"
            className="text-lg px-10 py-6 h-auto font-bold"
            onClick={() => window.location.href = '/auth'}
            data-testid="button-hero-cta"
          >
            Join Commons
          </Button>
        </div>
      </section>

      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground font-medium">&copy; 2025 Commons. Share smarter, live better.</p>
        </div>
      </footer>
    </div>
  );
}
