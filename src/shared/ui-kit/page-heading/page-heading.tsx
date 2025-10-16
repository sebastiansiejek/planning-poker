import { Heading } from '@/shared/ui-kit/heading/heading';
import { Paragraph } from '@/shared/ui-kit/paragraph/paragraph';
import { Separator } from '@/shared/ui-kit/separator/separator';

type PageHeadingProperties = {
  title: string;
  description?: string;
};

export const PageHeading = ({ title, description }: PageHeadingProperties) => {
  return (
    <div className="mx-auto text-center pt-3 lg:pt-10 pb-10 lg:pb-16 max-w-5xl">
      <Heading variant="h1" htmlAttributes={{ className: 'uppercase' }}>
        {title}
      </Heading>
      {description && <Paragraph>{description}</Paragraph>}
      <Separator className="mt-4" />
    </div>
  );
};
