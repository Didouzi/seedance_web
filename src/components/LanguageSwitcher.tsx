"use client";
import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

const languages = [
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "en", name: "English", flag: "🇺🇸" },
];

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const currentLang = languages.find((lang) => lang.code === locale) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const switchLanguage = (langCode: string) => {
    setIsOpen(false);

    // 获取路径段
    const segments = pathname.split('/').filter(Boolean);

    // 检查第一个段是否是语言代码
    const currentLocaleInPath = languages.find(lang => lang.code === segments[0]);

    // 移除当前语言前缀（如果存在）
    let pathWithoutLocale = pathname;
    if (currentLocaleInPath) {
      segments.shift(); // 移除语言代码
      pathWithoutLocale = '/' + segments.join('/');
    }

    // 如果路径为空或只有 /，设置为根路径
    if (!pathWithoutLocale || pathWithoutLocale === '/') {
      pathWithoutLocale = '';
    }

    // 构建新路径 - 所有语言都使用前缀
    const newPath = `/${langCode}${pathWithoutLocale}`;

    console.log('[LanguageSwitcher] Switching from', locale, 'to', langCode);
    console.log('[LanguageSwitcher] Current path:', pathname);
    console.log('[LanguageSwitcher] Path without locale:', pathWithoutLocale);
    console.log('[LanguageSwitcher] New path:', newPath);

    // 使用完整页面刷新来确保所有组件都重新渲染
    window.location.href = newPath;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 transition-all duration-300"
      >
        <span className="text-lg">{currentLang.flag}</span>
        <span className="hidden sm:inline">{currentLang.name}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 rounded-xl overflow-hidden shadow-2xl z-50"
          style={{
            background: "rgba(15, 15, 25, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(59,130,246,0.2)",
          }}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => switchLanguage(lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                locale === lang.code
                  ? "bg-blue-500/20 text-white"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="text-xl">{lang.flag}</span>
              <span>{lang.name}</span>
              {locale === lang.code && (
                <svg className="w-4 h-4 ml-auto text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

