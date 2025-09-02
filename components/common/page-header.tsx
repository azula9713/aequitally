import { Badge } from "../ui/badge";

type Props = {
  badgeText: string;
  badgeIcon: React.ReactNode;
  title: {
    text: string;
    highlight: string;
  };
  description: string;
};

export default function PageHeader({
  badgeText,
  badgeIcon,
  title: { text, highlight },
  description
}: Props) {
  return (
    <section className="mx-auto px-2 pt-4 md:p-4">
      <div className="max-w-6xl mx-auto">
        <div className="space-y-6 transition-all duration-1000 opacity-100 translate-y-0">
          <Badge variant="secondary" className="px-4 py-2 text-sm">
            {badgeIcon} {badgeText}
          </Badge>

          <h1 className="text-5xl lg:text-6xl font-light">
            {text}
            <br className="block md:hidden" />
            <span className="text-primary font-medium"> {highlight}</span>
          </h1>

          <p className="text-xl text-muted-foreground">{description}</p>
        </div>
      </div>
    </section>
  );
}
