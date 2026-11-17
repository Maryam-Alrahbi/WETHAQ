import { Link } from "@tanstack/react-router";
import { useCopy } from "@/lib/i18n";
import { Logo } from "./Logo";

const copy = {
  en: {
    message: "Verify the Source. Protect the Transaction. Build Digital Trust.",
    groups: [
      {
        title: "Platform",
        links: [
          { to: "/how-it-works", label: "How It Works" },
          { to: "/verify", label: "Verify a Document" },
          { to: "/business", label: "Business Portal" },
        ],
      },
      {
        title: "Company",
        links: [
          { to: "/about", label: "About WETHAQ" },
          { to: "/contact", label: "Contact Us" },
          { to: "/privacy", label: "Privacy & Terms" },
        ],
      },
    ] as const,
    contact: "Contact",
    email: "W3thaq@gmail.com",
    location: "Muscat, Oman",
    rights: "WETHAQ. Demonstration platform — sample data only.",
  },
  ar: {
    message: "تحقق من المصدر، احمِ معاملتك، وابنِ الثقة الرقمية.",
    groups: [
      {
        title: "المنصة",
        links: [
          { to: "/how-it-works", label: "كيف يعمل" },
          { to: "/verify", label: "تحقق من مستند" },
          { to: "/business", label: "بوابة المنشآت" },
        ],
      },
      {
        title: "الشركة",
        links: [
          { to: "/about", label: "عن وِثاق" },
          { to: "/contact", label: "تواصل معنا" },
          { to: "/privacy", label: "الخصوصية والشروط" },
        ],
      },
    ] as const,
    contact: "التواصل",
    email: "البريد الرسمي — سيُعلن لاحقاً",
    location: "مسقط، عُمان — العنوان سيُعلن لاحقاً",
    rights: "وِثاق. منصة عرض توضيحي — بيانات نموذجية فقط.",
  },
};

export function Footer() {
  const t = useCopy(copy);
  return (
    <footer className="bg-navy text-navy-muted">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="space-y-4">
          <Logo inverted />
          <p className="max-w-xs text-sm leading-relaxed">{t.message}</p>
        </div>
        {t.groups.map((g) => (
          <div key={g.title}>
            <h3 className="mb-4 text-sm font-semibold text-navy-foreground">{g.title}</h3>
            <ul className="space-y-2.5 text-sm">
              {g.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="transition-colors hover:text-navy-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h3 className="mb-4 text-sm font-semibold text-navy-foreground">{t.contact}</h3>
          <ul className="space-y-2.5 text-sm">
            <li>{t.email}</li>
            <li>{t.location}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-navy-foreground/10">
        <div className="container-page py-5 text-xs">
          © {new Date().getFullYear()} {t.rights}
        </div>
      </div>
    </footer>
  );
}
