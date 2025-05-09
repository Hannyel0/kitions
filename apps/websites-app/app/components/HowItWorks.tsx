'use client';

interface HowItWorksProps {
  title: string;
  subtitle: string;
}

export default function HowItWorks({ title, subtitle }: HowItWorksProps) {
  const steps = [
    {
      number: 1,
      title: "Choose a plan",
      description: "Select a subscription plan that fits your business needs and budget."
    },
    {
      number: 2,
      title: "Share your vision",
      description: "Tell us about your business and what you need from your website."
    },
    {
      number: 3,
      title: "Get your website",
      description: "We'll build and launch your website within days, not weeks or months."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-xl text-gray-600">
            {subtitle}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className={`relative ${index < steps.length - 1 ? 'md:after:content-[""] md:after:absolute md:after:top-1/2 md:after:left-full md:after:w-24 md:after:h-2 md:after:bg-[#dbc1d0]/30 md:after:-translate-y-1/2 md:after:z-0' : ''}`}>
              <div className="bg-white rounded-xl p-6 shadow-md relative z-10">
                <div className="w-12 h-12 bg-[#8982cf] rounded-full flex items-center justify-center text-white font-bold mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 