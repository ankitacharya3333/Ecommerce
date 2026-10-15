import { Truck, RotateCcw, ShieldCheck, Headphones } from 'lucide-react';
import { STORE_BENEFITS } from '@/data/sample-data';
import { Container } from '@/components/ui/Container';

export function BrandBenefits() {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'truck':
        return <Truck className="w-6 h-6 text-zinc-900" />;
      case 'refresh-cw':
        return <RotateCcw className="w-6 h-6 text-zinc-900" />;
      case 'shield-check':
        return <ShieldCheck className="w-6 h-6 text-zinc-900" />;
      case 'headphones':
        return <Headphones className="w-6 h-6 text-zinc-900" />;
      default:
        return <Truck className="w-6 h-6 text-zinc-900" />;
    }
  };

  return (
    <section className="py-16 bg-white border-y border-zinc-200">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {STORE_BENEFITS.map((benefit) => (
            <div
              key={benefit.id}
              className="flex items-start gap-4 p-4 rounded-xl transition-colors hover:bg-zinc-50"
            >
              <div className="w-12 h-12 rounded-lg bg-zinc-100 flex items-center justify-center flex-shrink-0 border border-zinc-200">
                {getIcon(benefit.icon)}
              </div>
              <div>
                <h3 className="font-semibold text-sm text-zinc-900 mb-1">
                  {benefit.title}
                </h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
