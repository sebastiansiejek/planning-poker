import { Heading } from '@/shared/UIKit/Heading/Heading';
import { Paragraph } from '@/shared/UIKit/Paragraph/Paragraph';
import { Separator } from '@/shared/UIKit/Separator/Separator';

type PageHeadingProps = {
  title: string;
  description?: string;
};

export const PageHeading = ({ title, description }: PageHeadingProps) => {
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
