"use client";
import Link from "next/link";
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

export default function ContactPage() {
  const t = useTranslations('contactPage');
  const params = useParams();
  const locale = params.locale as string;

  const contactMethods = [
    {
      icon: "📧",
      title: t('methods.email.title'),
      value: "1042808428@qq.com",
      desc: t('methods.email.desc'),
      link: "mailto:1042808428@qq.com"
    },
    {
      icon: "💬",
      title: t('methods.wechat.title'),
      value: "seedance_support",
      desc: t('methods.wechat.desc'),
      link: null
    },
    {
      icon: "📱",
      title: t('methods.phone.title'),
      value: "18340825506",
      desc: t('methods.phone.desc'),
      link: "tel:18340825506"
    },
    {
      icon: "💼",
      title: t('methods.business.title'),
      value: "1042808428@qq.com",
      desc: t('methods.business.desc'),
      link: "mailto:1042808428@qq.com"
    }
  ];

  return (
    <div className="min-h-screen pt-24 px-4" style={{ background: "#080810" }}>
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Link href={`/${locale}`} className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 group">
          <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">{t('backToHome')}</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">{t('title')}</h1>
          <p className="text-white/60 text-lg">{t('subtitle')}</p>
        </div>

        {/* Contact Methods */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {contactMethods.map((method, idx) => (
            <div
              key={idx}
              className="glass-card rounded-2xl p-8 hover:border-blue-500/30 transition-all duration-300"
            >
              <div className="text-4xl mb-4">{method.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{method.title}</h3>
              {method.link ? (
                <a
                  href={method.link}
                  className="text-blue-400 hover:text-blue-300 font-mono text-lg mb-3 block transition-colors"
                  target={method.link.startsWith('http') ? '_blank' : undefined}
                  rel={method.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {method.value}
                </a>
              ) : (
                <p className="text-blue-400 font-mono text-lg mb-3">{method.value}</p>
              )}
              <p className="text-white/60">{method.desc}</p>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="glass-card rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">{t('faq.title')}</h2>
          <div className="space-y-4">
            {t.raw('faq.items').map((faq: any, idx: number) => (
              <div key={idx} className="border-b border-white/10 last:border-0 pb-4 last:pb-0">
                <h3 className="text-lg font-semibold text-white mb-2">{faq.q}</h3>
                <p className="text-white/60">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Office Hours */}
        <div className="mt-8 text-center">
          <div className="glass-card rounded-2xl p-6 inline-block">
            <h3 className="text-lg font-semibold text-white mb-2">{t('hours.title')}</h3>
            <p className="text-white/60">{t('hours.time')}</p>
            <p className="text-white/50 text-sm mt-2">{t('hours.timezone')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

