import { Heading } from '@/shared/UIKit/Heading/Heading';
import { Separator } from '@/shared/UIKit/Separator/Separator';

type PageHeadingProps = {
  title: string;
};

export const PageHeading = ({ title }: PageHeadingProps) => {
  return (
    <div className="mx-auto text-center pt-3 lg:pt-10 pb-10 lg:pb-20 max-w-5xl">
      <Heading variant="h1" htmlAttributes={{ className: 'pb-5 uppercase' }}>
        {title}
      </Heading>
      <Separator />
    </div>
  );
};
