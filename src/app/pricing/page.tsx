"use client";

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      features: [
        "5 video generations/month",
        "720p quality",
        "5 second videos",
        "Watermark included"
      ]
    },
    {
      name: "Pro",
      price: "$29",
      period: "per month",
      popular: true,
      features: [
        "100 video generations/month",
        "1080p quality",
        "Up to 10 second videos",
        "No watermark",
        "Priority generation",
        "Commercial license"
      ]
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "per month",
      features: [
        "Unlimited generations",
        "4K quality",
        "Up to 30 second videos",
        "No watermark",
        "Fastest generation",
        "Full commercial license",
        "API access",
        "Dedicated support"
      ]
    }
  ];

  return (
    <div className="min-h-screen pt-24 px-4" style={{ background: "#080810" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">Simple, Transparent Pricing</h1>
          <p className="text-white/60 text-lg">Choose the plan that fits your needs</p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`glass-card rounded-2xl p-8 relative ${
                plan.popular ? "border-2 border-purple-500/50" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-purple-600 text-white text-sm font-semibold rounded-full">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-white/60">/{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-white/80">
                    <svg 
                      className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                    >
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  plan.popular
                    ? "btn-primary"
                    : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
                }`}
              >
                {plan.name === "Free" ? "Get Started" : "Subscribe"}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: "Can I cancel anytime?",
                a: "Yes, you can cancel your subscription at any time. No questions asked."
              },
              {
                q: "Do you offer refunds?",
                a: "We offer a 7-day money-back guarantee for all paid plans."
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, PayPal, and cryptocurrency."
              }
            ].map((faq, idx) => (
              <div key={idx} className="glass-card rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2">{faq.q}</h3>
                <p className="text-white/60">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

