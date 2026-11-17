import { Link } from "@tanstack/react-router";
import { Globe, Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCopy, useLang } from "@/lib/i18n";
import { Logo } from "./Logo";

const copy = {
  en: {
    links: [
      { to: "/", label: "Home" },
      { to: "/how-it-works", label: "How It Works" },
      { to: "/verify", label: "Verify Document" },
      { to: "/business", label: "For Businesses" },
      { to: "/about", label: "About Us" },
    ] as const,
    login: "Login",
    start: "Get Started",
    switchTo: "العربية",
    switchLabel: "Switch to Arabic",
    menu: "Open menu",
  },
  ar: {
    links: [
      { to: "/", label: "الرئيسية" },
      { to: "/how-it-works", label: "كيف يعمل" },
      { to: "/verify", label: "تحقق من مستند" },
      { to: "/business", label: "للمنشآت" },
      { to: "/about", label: "من نحن" },
    ] as const,
    login: "تسجيل الدخول",
    start: "ابدأ الآن",
    switchTo: "English",
    switchLabel: "التبديل إلى الإنجليزية",
    menu: "فتح القائمة",
  },
};

export function Navbar() {
  const t = useCopy(copy);
  const { toggle, dir } = useLang();
  const [open, setOpen] = useState(false);

  const LangButton = (
    <Button variant="ghost" size="sm" onClick={toggle} aria-label={t.switchLabel} className="text-navy">
      <Globe />
      {t.switchTo}
    </Button>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-lg">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {t.links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-blue hover:text-primary"
              activeProps={{ className: "text-primary bg-surface-blue" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          {LangButton}
          <Button variant="ghost" size="sm" asChild className="text-navy">
            <Link to="/login" search={{ mode: "signin" }}>{t.login}</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/login" search={{ mode: "signup" }}>{t.start}</Link>
          </Button>
        </div>
        <div className="flex items-center gap-1 lg:hidden">
          {LangButton}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={t.menu}>
                <Menu className="size-5!" />
              </Button>
            </SheetTrigger>
            <SheetContent side={dir === "rtl" ? "left" : "right"} className="flex flex-col gap-6" dir={dir}>
              <SheetTitle className="sr-only">WETHAQ</SheetTitle>
              <Logo />
              <nav className="flex flex-col gap-1" aria-label="Mobile">
                {t.links.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    activeOptions={{ exact: l.to === "/" }}
                    className="rounded-lg px-3 py-2.5 text-base font-medium text-foreground hover:bg-surface-blue"
                    activeProps={{ className: "text-primary bg-surface-blue" }}
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-2">
                <Button variant="outline" asChild onClick={() => setOpen(false)}>
                  <Link to="/login" search={{ mode: "signin" }}>{t.login}</Link>
                </Button>
                <Button asChild onClick={() => setOpen(false)}>
                  <Link to="/login" search={{ mode: "signup" }}>{t.start}</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
